"""Static integrity checks for the bundled demo scenario."""

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCENARIO_FILES = (
    (ROOT / "scenarios" / "demo.js", "window.DEMO_SCENARIO = "),
    (ROOT / "scenarios" / "second.js", "window.SECOND_SCENARIO = "),
    (ROOT / "scenarios" / "third.js", "window.THIRD_SCENARIO = "),
)


def glossary_names():
    """js/roles.js is the one place a role is explained; nothing may bypass it."""
    source = (ROOT / "js" / "roles.js").read_text(encoding="utf-8")
    for icon in set(re.findall(r'icon:\s*"([^"]+)"', source)):
        assert (ROOT / icon).is_file(), f"Missing glossary icon: {icon}"
    # Every entry but the team words and the Storyteller carries its own token art.
    entries = re.findall(r'name: "([^"]+)",\n\s*stem: [^\n]*\n(\s*icon:)?', source)
    for name, icon in entries:
        if name not in {"Горожанин", "Изгой", "Приспешник", "Демон", "Рассказчик"}:
            assert icon, f"Role '{name}' has no token art in js/roles.js"
    return {name for name, _ in entries}


def validate_glossary(scenario, names):
    roles = {scenario["player"]["roleName"]} | {entry["role"] for entry in scenario["reveal"]}
    roles.add(scenario["player"]["startingInformation"].get("roleName", ""))
    for role in roles:
        if role:
            assert role in names, f"Role '{role}' has no entry in js/roles.js — it would show without a tooltip"


def load_scenario(path, prefix):
    source = path.read_text(encoding="utf-8")
    assert source.startswith(prefix), f"{path.name} must assign its documented global"
    assert source.rstrip().endswith(";"), f"{path.name} must end with a semicolon"
    return json.loads(source[len(prefix) :].rstrip()[:-1])


def walk_effects(scenario):
    for dialogue in scenario["dialogues"].values():
        for node in dialogue["nodes"].values():
            for choice in node["choices"]:
                for effect in choice.get("effects", []):
                    yield effect
    for event in scenario["events"]:
        for effect in event.get("effects", []):
            yield effect


def walk_conditions(scenario):
    for dialogue in scenario["dialogues"].values():
        for rule in dialogue.get("startRules", []):
            yield from rule.get("when", [])
        for node in dialogue["nodes"].values():
            for choice in node["choices"]:
                yield from choice.get("conditions", [])
    for event in scenario["events"]:
        yield from event.get("when", [])
    for ending in scenario["endings"]:
        yield from ending.get("when", [])
    for statement in scenario["decision"].get("statements", []):
        for variant in statement.get("variants", []):
            yield from variant.get("when", [])


def validate_trust(scenario, character_ids):
    """A locked ally must be the player's fault, never an unreachable door."""
    effects = [effect for effect in walk_effects(scenario) if effect.get("type") == "trust"]
    for condition in walk_conditions(scenario):
        if condition["type"] == "trust":
            assert condition["characterId"] in character_ids, f"Unknown trust target: {condition['characterId']}"
    for effect in effects:
        assert effect.get("characterId") in character_ids, f"Unknown trust target: {effect.get('characterId')}"
        assert isinstance(effect.get("value"), int), "A trust effect needs an integer value"

    if not effects:
        return

    default_gate = scenario["decision"].get("allyTrust", 0)
    for character in scenario["characters"]:
        gate = character.get("allyTrust", default_gate)
        reachable = character.get("startingTrust", 0) + sum(
            effect["value"] for effect in effects
            if effect["characterId"] == character["id"] and effect["value"] > 0
        )
        assert reachable >= gate, (
            f"{character['id']} can never reach the ally threshold "
            f"({reachable} < {gate}) — that ally would be dead content"
        )
        assert character.get("allyHint"), f"{character['id']} needs an allyHint for the locked tooltip"


def validate_suspicion(scenario, character_ids):
    """Suspicion aims one player at another, so both ends must be real seats."""
    targets = character_ids | {"you"}
    for character in scenario["characters"]:
        for target, value in (character.get("views") or {}).items():
            assert target in character_ids, f"{character['id']} watches an unknown seat: {target}"
            assert target != character["id"], f"{character['id']} cannot suspect himself"
            assert isinstance(value, int), "a starting view needs an integer value"
    for effect in walk_effects(scenario):
        if effect.get("type") != "suspicion":
            continue
        assert effect.get("characterId") in character_ids, f"Unknown suspicion holder: {effect.get('characterId')}"
        assert effect.get("targetId") in targets, f"Unknown suspicion target: {effect.get('targetId')}"
        assert isinstance(effect.get("value"), int), "A suspicion effect needs an integer value"
    for condition in walk_conditions(scenario):
        if condition["type"] == "suspicion":
            assert condition["characterId"] in character_ids, f"Unknown suspicion holder: {condition['characterId']}"
            assert condition["targetId"] in targets, f"Unknown suspicion target: {condition['targetId']}"


def validate_vote(scenario, character_ids):
    """The day ends on a roll and a round of nominations; both need real targets."""
    decision = scenario["decision"]
    odds = decision.get("odds")
    if odds:
        thresholds = [band["minTrust"] for band in odds]
        assert thresholds == sorted(thresholds, reverse=True), "decision.odds must run from the highest trust down"
        for band in odds:
            assert 0 < band["chance"] <= 1, "an odds band needs a chance in (0, 1]"

    teams = {entry["team"] for entry in scenario["reveal"]} | {scenario["player"]["team"]}
    for condition in walk_conditions(scenario):
        if condition["type"] == "executed":
            assert condition["value"] in character_ids | {"you", "nobody"}, f"Unknown execution target: {condition['value']}"
        if condition["type"] == "executedTeam":
            assert condition["value"] in teams, f"Unknown team: {condition['value']}"
        if condition["type"] == "approach":
            assert condition["value"] in {"accepted", "refused", "betrayed", "none"}, f"Unknown approach outcome: {condition['value']}"
        if condition["type"] == "playerNomination":
            assert condition["value"] in character_ids | {"nobody"}, f"Unknown nomination target: {condition['value']}"

    vote = scenario.get("vote")
    if vote:
        living = len(scenario["characters"]) + 1 - len(scenario.get("table", {}).get("dead", []))
        assert 1 <= vote.get("majority", 3) <= living, "the majority needed cannot exceed the living table"
        assert vote.get("voteAt", 1) <= vote.get("nominateAt", 2) <= vote.get("urgentAt", 3), (
            "raising a hand must be easier than nominating, and nominating easier than cutting in "
            "before the player speaks"
        )


def validate_scenario(scenario):
    characters = scenario["characters"]
    character_ids = {character["id"] for character in characters}

    assert len(characters) == 4, "MVP scenario should contain four conversation characters"
    assert scenario["player"]["name"], "The protagonist must be represented as the fifth player"
    assert len(characters) + 1 == 5, "Every episode is played at a five-seat table"

    seats = scenario["table"]["seats"]
    assert scenario["table"]["label"], "The table needs a player-facing label"
    assert len(seats) == len(set(seats)) == 5, "The table has five distinct seats"
    assert set(seats) == character_ids | {"you"}, "Seating must cover the protagonist and every character"
    dead = scenario["table"].get("dead", [])
    assert len(dead) == len(set(dead)) and set(dead) <= character_ids, "Dead seats must be unique character ids"
    assert scenario["player"]["task"], "Each episode states the protagonist's own task"
    suspects = scenario["player"]["startingInformation"].get("suspects", [])
    assert set(suspects) <= character_ids, "Night-information suspects must be character ids, so seat numbers resolve"
    assert scenario["decision"]["title"], "Final choice needs a player-facing question"
    assert "nomination" not in scenario, "Bundled stories resolve a personal decision"
    assert scenario["endings"][-1].get("when", []) == [], "A fallback ending is required"
    assert scenario["settings"]["selectionSeconds"] == 10
    assert scenario["settings"]["conversationsPerDay"] == 3
    assert scenario["settings"]["fallback"]["characterId"] in character_ids

    for character in characters:
        dialogue = scenario["dialogues"][character["id"]]
        nodes = dialogue["nodes"]
        assert dialogue["start"] in nodes
        for rule in dialogue.get("startRules", []):
            assert rule["node"] in nodes, f"Missing start-rule node: {rule['node']}"
        for node_id, node in nodes.items():
            assert node.get("choices"), f"Dialogue node has no choices: {node_id}"
            for choice in node["choices"]:
                if choice.get("goto"):
                    assert choice["goto"] in nodes, f"Broken transition: {node_id} -> {choice['goto']}"
        for sprite in character.get("sprites", {}).values():
            if sprite and not sprite.startswith(("data:", "http://", "https://")):
                assert (ROOT / sprite).is_file(), f"Missing sprite: {sprite}"

    validate_trust(scenario, character_ids)
    validate_suspicion(scenario, character_ids)
    validate_vote(scenario, character_ids)

    visible = [event for event in scenario["events"] if event.get("visible")]
    hidden = [event for event in scenario["events"] if not event.get("visible")]
    assert visible and hidden, "Demo needs both visible and hidden NPC events"
    assert len(scenario["endings"]) >= 3, "Demo needs at least three endings"
    assert {item["characterId"] for item in scenario["reveal"]} == character_ids
    for ending in scenario["endings"]:
        for condition in ending.get("when", []):
            if condition["type"] == "decision":
                assert condition["value"] in character_ids | {"nobody"}, "Unknown decision target"
    for path in (
        scenario.get("nightVisual", {}).get("handImage"),
        scenario.get("player", {}).get("roleIconImage"),
        scenario.get("player", {}).get("startingInformation", {}).get("roleIcon"),
        *(entry.get("icon") for entry in scenario.get("reveal", [])),
    ):
        if path and not path.startswith(("data:", "http://", "https://")):
            assert (ROOT / path).is_file(), f"Missing scenario artwork: {path}"

    return {
        "characters": len(characters),
        "nodes": sum(len(item["nodes"]) for item in scenario["dialogues"].values()),
        "events": len(scenario["events"]),
        "endings": len(scenario["endings"]),
    }


def main():
    scenarios = [load_scenario(path, prefix) for path, prefix in SCENARIO_FILES]
    ids = [scenario["meta"]["id"] for scenario in scenarios]
    assert len(ids) == len(set(ids)), "Scenario meta.id values must be unique"
    assert "window.BOTC_SCENARIOS" in (ROOT / "scenarios" / "library.js").read_text(encoding="utf-8")

    names = glossary_names()
    totals = {"characters": 0, "nodes": 0, "events": 0, "endings": 0}
    for scenario in scenarios:
        validate_glossary(scenario, names)
        result = validate_scenario(scenario)
        for key, value in result.items():
            totals[key] += value

    print(
        "VALIDATION PASSED:",
        f"{len(scenarios)} scenarios,",
        f"{totals['characters']} characters,",
        f"{totals['nodes']} dialogue nodes,",
        f"{totals['events']} events,",
        f"{totals['endings']} endings",
    )


if __name__ == "__main__":
    main()
