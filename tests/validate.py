"""Static integrity checks for the bundled demo scenario."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCENARIO_FILES = (
    (ROOT / "scenarios" / "demo.js", "window.DEMO_SCENARIO = "),
    (ROOT / "scenarios" / "second.js", "window.SECOND_SCENARIO = "),
)


def load_scenario(path, prefix):
    source = path.read_text(encoding="utf-8")
    assert source.startswith(prefix), f"{path.name} must assign its documented global"
    assert source.rstrip().endswith(";"), f"{path.name} must end with a semicolon"
    return json.loads(source[len(prefix) :].rstrip()[:-1])


def validate_scenario(scenario):
    characters = scenario["characters"]
    character_ids = {character["id"] for character in characters}

    assert len(characters) == 4, "MVP scenario should contain four conversation characters"
    assert scenario["player"]["name"], "The protagonist must be represented as the fifth player"
    assert len(characters) + 1 == 5, "Every bundled scenario must contain five players total"
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

    visible = [event for event in scenario["events"] if event.get("visible")]
    hidden = [event for event in scenario["events"] if not event.get("visible")]
    assert visible and hidden, "Demo needs both visible and hidden NPC events"
    assert len(scenario["endings"]) >= 3, "Demo needs at least three endings"
    assert {item["characterId"] for item in scenario["reveal"]} == character_ids
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

    totals = {"characters": 0, "nodes": 0, "events": 0, "endings": 0}
    for scenario in scenarios:
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
