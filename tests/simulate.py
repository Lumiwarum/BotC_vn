"""Play every bundled scenario many times at random and report what the day can end as.

This mirrors the semantics of js/engine.js. It exists because the trust layer decides
which allies stay reachable, and that is easy to break by editing a single choice:
an ally nobody can ever open, or an ending nobody can ever reach, is dead content.
"""

import json
import random
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCENARIO_FILES = (
    (ROOT / "scenarios" / "demo.js", "window.DEMO_SCENARIO = "),
    (ROOT / "scenarios" / "second.js", "window.SECOND_SCENARIO = "),
    (ROOT / "scenarios" / "third.js", "window.THIRD_SCENARIO = "),
)
RUNS = 4000
DEFAULT_ODDS = [
    {"minTrust": 2, "chance": 0.95},
    {"minTrust": 1, "chance": 0.85},
    {"minTrust": 0, "chance": 0.55},
    {"minTrust": -1, "chance": 0.3},
    {"minTrust": -2, "chance": 0.12},
]


def load(path, prefix):
    source = path.read_text(encoding="utf-8")
    return json.loads(source[len(prefix):].rstrip()[:-1])


def compare(actual, operator, expected):
    operator = operator or "equals"
    if operator == "equals":
        return actual == expected
    if operator == "notEquals":
        return actual != expected
    if operator == "gt":
        return float(actual or 0) > float(expected or 0)
    if operator == "gte":
        return float(actual or 0) >= float(expected or 0)
    if operator == "lt":
        return float(actual or 0) < float(expected or 0)
    if operator == "lte":
        return float(actual or 0) <= float(expected or 0)
    if operator == "truthy":
        return bool(actual)
    if operator == "falsy":
        return not actual
    if operator == "includes":
        if isinstance(expected, list):
            return actual in expected
        if isinstance(actual, list):
            return expected in actual
        return str(expected or "") in str(actual or "")
    return False


class Sim:
    def __init__(self, scenario):
        self.s = scenario
        self.characters = {c["id"]: c for c in scenario["characters"]}
        self.gate_default = scenario.get("decision", {}).get("allyTrust", 0)
        scale = scenario.get("trust", {})
        self.tmin, self.tmax = scale.get("min", -4), scale.get("max", 4)
        self.reset()

    def reset(self):
        self.vars = json.loads(json.dumps(self.s.get("initialState", {})))
        self.trust = {cid: c.get("startingTrust", 0) for cid, c in self.characters.items()}
        self.counts = {cid: 0 for cid in self.characters}
        self.spoken = {cid: False for cid in self.characters}
        self.total = 0
        self.remaining = self.s["settings"]["conversationsPerDay"]
        self.fired = []
        self.decision = None
        self.approach = {"characterId": "nobody", "outcome": "none"}
        self.susp = {cid: dict(c.get("views", {})) for cid, c in self.characters.items()}
        self.day = None
        self.vote = None

    def cond(self, c):
        kind = c["type"]
        if kind == "variable":
            actual = self.vars.get(c["key"])
        elif kind == "conversationCount":
            actual = self.counts.get(c["characterId"], 0)
        elif kind == "spokenTo":
            actual = bool(self.spoken.get(c["characterId"]))
        elif kind == "totalConversations":
            actual = self.total
        elif kind == "decision":
            actual = self.decision
        elif kind == "trust":
            actual = self.trust.get(c["characterId"], 0)
        elif kind == "suspicion":
            actual = self.suspicion_of(c["characterId"], c["targetId"])
        elif kind == "openAllies":
            actual = len(self.open_allies())
        elif kind == "approach":
            actual = self.approach["outcome"]
        elif kind == "executed":
            actual = (self.vote or {}).get("executed", "nobody")
        elif kind == "executedTeam":
            actual = self.executed_team()
        elif kind == "votesAgainstPlayer":
            actual = (self.vote or {}).get("votesAgainstPlayer", 0)
        elif kind == "nominatedPlayer":
            actual = any(e["targetId"] == "you" for e in (self.vote or {}).get("log", []))
        elif kind == "playerNomination":
            actual = (self.vote or {}).get("playerNomination", "nobody")
        elif kind == "nominations":
            actual = len((self.vote or {}).get("log", []))
        elif kind == "pactBroken":
            actual = bool((self.vote or {}).get("pactBroken"))
        else:
            return False
        return compare(actual, c.get("operator"), c.get("value"))

    def met(self, conditions):
        return all(self.cond(c) for c in (conditions or []))

    def apply(self, effects):
        for e in effects or []:
            if e["type"] == "trust":
                cid = e["characterId"]
                if cid in self.trust:
                    self.trust[cid] = max(self.tmin, min(self.tmax, self.trust[cid] + e["value"]))
                continue
            if e["type"] == "suspicion":
                cid, target = e["characterId"], e["targetId"]
                if cid in self.susp and (target == "you" or target in self.characters):
                    self.susp[cid][target] = self.susp[cid].get(target, 0) + e["value"]
                continue
            key = e.get("key")
            if not key:
                continue
            if e["type"] == "set":
                self.vars[key] = e["value"]
            elif e["type"] == "increment":
                self.vars[key] = float(self.vars.get(key) or 0) + float(e.get("value", e.get("by", 1)))
            elif e["type"] == "toggle":
                self.vars[key] = not bool(self.vars.get(key))

    def open_allies(self):
        out = []
        for cid, c in self.characters.items():
            if self.alive(cid) and self.trust[cid] >= c.get("allyTrust", self.gate_default):
                out.append(cid)
        return out

    def alive(self, cid):
        return cid not in self.s.get("table", {}).get("dead", [])

    def can_vote(self, cid):
        if self.alive(cid):
            return True
        return bool(self.s.get("table", {}).get("ghostVotes")) and cid not in (self.day or {}).get("ghostSpent", [])

    def converse(self, cid, rng):
        dialogue = self.s["dialogues"][cid]
        node_id = dialogue["start"]
        for rule in dialogue.get("startRules", []):
            if self.met(rule.get("when")):
                node_id = rule["node"]
                break
        for _ in range(24):
            node = dialogue["nodes"][node_id]
            options = [c for c in node["choices"] if self.met(c.get("conditions"))]
            if not options:
                break
            choice = rng.choice(options)
            self.apply(choice.get("effects"))
            if choice.get("endConversation") or not choice.get("goto"):
                break
            node_id = choice["goto"]
        self.counts[cid] += 1
        self.spoken[cid] = True
        self.total += 1
        self.remaining -= 1
        self.events()

    def events(self):
        for event in self.s.get("events", []):
            if (event.get("trigger") or "afterConversation") != "afterConversation":
                continue
            if event.get("once", True) and event["id"] in self.fired:
                continue
            if not self.met(event.get("when")):
                continue
            self.apply(event.get("effects"))
            self.fired.append(event["id"])

    def executed_team(self):
        executed = (self.vote or {}).get("executed")
        if not executed or executed == "nobody":
            return ""
        if executed == "you":
            return self.s.get("player", {}).get("team", "")
        for entry in self.s.get("reveal", []):
            if entry["characterId"] == executed:
                return entry.get("team", "")
        return ""

    def approach_odds(self, cid):
        decision = self.s.get("decision", {})
        trust = self.trust.get(cid, 0)
        if "trust" not in self.s and "odds" not in decision:
            return 1.0, False, False
        if trust <= decision.get("refuseBelow", -3):
            return 0.0, True, True
        table = decision.get("odds") or DEFAULT_ODDS
        chance = next((band["chance"] for band in table if trust >= band["minTrust"]), 0.05)
        return chance, trust <= decision.get("betrayBelow", -1), False

    def do_approach(self, cid, rng):
        if cid == "nobody":
            self.approach = {"characterId": "nobody", "outcome": "none"}
        else:
            chance, betrays, _ = self.approach_odds(cid)
            accepted = rng.random() < chance
            outcome = "accepted" if accepted else ("betrayed" if betrays else "refused")
            self.approach = {"characterId": cid, "outcome": outcome}
            if outcome == "betrayed":
                for other in self.characters:
                    if other != cid:
                        self.trust[other] = max(self.tmin, self.trust[other] - 1)
        self.decision = cid

    def suspicion_of(self, cid, target):
        if cid == target:
            return -99
        if target != "you":
            return self.susp.get(cid, {}).get(target, 0)
        day = self.day or {}
        urge = -self.trust.get(cid, 0)
        if self.approach["outcome"] == "betrayed":
            urge += 3 if self.approach["characterId"] == cid else 1
        if day.get("allyId") == cid:
            urge += 3 if day.get("pactBroken") else -3
        return urge

    def majority(self):
        living = 1 + sum(self.alive(cid) for cid in self.characters)
        return self.s.get("vote", {}).get("majority", -(-living // 2))

    def start_day(self):
        self.day = {
            "allyId": self.approach["characterId"] if self.approach["outcome"] == "accepted" else None,
            "block": {"targetId": None, "votes": 0},
            "nominatorIds": [], "nominatedIds": [], "log": [], "pending": None,
            "playerNomination": "nobody", "votesAgainstPlayer": 0,
            "pactBroken": False, "ghostSpent": [], "over": False,
        }

    def nomination_targets(self):
        return [cid for cid in self.characters if self.alive(cid) and cid not in self.day["nominatedIds"]]

    def next_npc_nomination(self):
        nominate_at = self.s.get("vote", {}).get("nominateAt", 2)
        best = None
        for cid in self.characters:
            if not self.alive(cid):
                continue
            if cid in self.day["nominatorIds"]:
                continue
            targets = [t for t in ["you"] + list(self.characters)
                       if self.alive(t) and t != cid and t not in self.day["nominatedIds"]]
            pick = max(targets, key=lambda t: self.suspicion_of(cid, t), default=None)
            if pick is None:
                continue
            urge = self.suspicion_of(cid, pick)
            if urge >= nominate_at and (best is None or urge > best[2]):
                best = (cid, pick, urge)
        return best

    def would_vote(self, voter, target, nominator):
        if not self.can_vote(voter):
            return False
        if voter == target:
            return False
        settings = self.s.get("vote", {})
        if not self.alive(voter):
            return self.suspicion_of(voter, target) >= settings.get("ghostVoteAt", settings.get("nominateAt", 2))
        day = self.day
        allied = day["allyId"] == voter and not day["pactBroken"]
        vote_at = self.s.get("vote", {}).get("voteAt", 1)
        if target == "you":
            return not allied and self.suspicion_of(voter, "you") >= vote_at
        if nominator == "you" and (allied or self.trust.get(voter, 0) >= 2):
            return True
        return self.suspicion_of(voter, target) >= vote_at

    def day_beat(self):
        day = self.day
        if day["over"]:
            return ("dayOver", None, None)
        if day["pending"]:
            return ("vote",) + day["pending"]
        npc = self.next_npc_nomination()
        player_can = "you" not in day["nominatorIds"]
        urgent_at = self.s.get("vote", {}).get("urgentAt", 3)
        if npc and (not player_can or npc[2] >= urgent_at):
            day["pending"] = (npc[0], npc[1])
            return ("vote", npc[0], npc[1])
        if player_can:
            return ("playerTurn", None, None)
        day["over"] = True
        return ("dayOver", None, None)

    def resolve(self, nominator, target, player_votes):
        day = self.day
        if day["allyId"] and target == day["allyId"] and (nominator == "you" or player_votes):
            day["pactBroken"] = True
        voters = [cid for cid in self.characters if self.would_vote(cid, target, nominator)]
        if player_votes and target != "you":
            voters.append("you")
        assert target not in voters, "a player was made to vote for their own execution"
        day["ghostSpent"] += [cid for cid in voters if cid != "you" and not self.alive(cid)]
        votes = len(voters)
        majority = self.majority()
        on_block = tied = False
        if votes >= majority and votes > day["block"]["votes"]:
            day["block"] = {"targetId": target, "votes": votes}
            on_block = True
        elif votes >= majority and votes == day["block"]["votes"] and day["block"]["targetId"]:
            day["block"] = {"targetId": None, "votes": votes}
            tied = True
        day["nominatorIds"].append(nominator)
        day["nominatedIds"].append(target)
        if target == "you":
            day["votesAgainstPlayer"] = max(day["votesAgainstPlayer"], votes)
        if nominator == "you":
            day["playerNomination"] = target
        day["pending"] = None
        entry = {"nominatorId": nominator, "targetId": target, "voters": voters,
                 "votes": votes, "onBlock": on_block, "tied": tied}
        day["log"].append(entry)
        return entry

    def player_auto_hand(self, target):
        day = self.day
        if not day["allyId"] or day["pactBroken"]:
            return False
        if target == "you" or target == day["allyId"]:
            return False
        return self.would_vote(day["allyId"], target, day["allyId"])

    def player_nominate(self, target):
        if not target or target == "nobody":
            self.day["nominatorIds"].append("you")
            self.day["playerNomination"] = "nobody"
            return None
        return self.resolve("you", target, True)

    def resolve_pending(self):
        nominator, target = self.day["pending"]
        return self.resolve(nominator, target, self.player_auto_hand(target))

    def end_day(self):
        day = self.day
        day["over"] = True
        self.vote = {
            "executed": day["block"]["targetId"] or "nobody",
            "log": day["log"], "allyId": day["allyId"], "pactBroken": day["pactBroken"],
            "votesAgainstPlayer": day["votesAgainstPlayer"],
            "playerNomination": day["playerNomination"],
        }

    def run_day(self, rng):
        self.start_day()
        for _ in range(16):
            beat, nominator, target = self.day_beat()
            if beat == "dayOver":
                break
            if beat == "playerTurn":
                options = self.nomination_targets() + ["nobody"]
                self.player_nominate(rng.choice(options))
            else:
                self.resolve_pending()
        self.end_day()

    def play(self, rng):
        self.reset()
        while self.remaining > 0:
            self.converse(rng.choice(list(self.characters)), rng)
        open_before_vote = len(self.open_allies())
        options = [cid for cid in self.characters if self.alive(cid)]
        if self.s["decision"].get("allowNobody", True):
            options.append("nobody")
        self.do_approach(rng.choice(options), rng)
        self.run_day(rng)
        for ending in self.s["endings"]:
            if self.met(ending.get("when")):
                return ending["id"], self.decision, open_before_vote, self.vote["executed"]
        raise AssertionError("no ending matched")


def check_self_vote(scenario, failures):
    """Naming your own ally must turn him against you, never against himself."""
    title = scenario["meta"]["title"]
    for cid in (c["id"] for c in scenario["characters"]):
        sim = Sim(scenario)
        if not sim.alive(cid):
            continue
        sim.reset()
        sim.trust[cid] = max(sim.trust[cid], 3)
        sim.remaining = 0
        sim.do_approach(cid, random.Random(0))
        if sim.approach["outcome"] != "accepted":
            failures.append(f"{title}: a trusted approach to '{cid}' should be accepted")
            continue
        sim.start_day()
        before = sim.suspicion_of(cid, "you")
        entry = sim.player_nominate(cid)
        after = sim.suspicion_of(cid, "you")
        if cid in entry["voters"]:
            failures.append(f"{title}: '{cid}' voted for his own execution")
        if not sim.day["pactBroken"]:
            failures.append(f"{title}: naming your own ally did not break the pact")
        if after <= before:
            failures.append(f"{title}: '{cid}' was named by the player and did not turn on him")


def main():
    failures = []
    for path, prefix in SCENARIO_FILES:
        scenario = load(path, prefix)
        check_self_vote(scenario, failures)
        sim = Sim(scenario)
        rng = random.Random(20260909)
        endings, decisions, executions, locked_out = Counter(), Counter(), Counter(), 0
        for _ in range(RUNS):
            ending_id, decision, open_count, executed = sim.play(rng)
            endings[ending_id] += 1
            decisions[decision] += 1
            executions[executed] += 1
            if open_count == 0:
                locked_out += 1

        title = scenario["meta"]["title"]
        print(f"\n{title}  ({RUNS} random playthroughs)")
        print(f"  дней, где никто не был готов к союзу: {locked_out} ({locked_out / RUNS:.0%})")
        print("  казнён: " + ", ".join(f"{k} {v}" for k, v in executions.most_common()))
        for ending in scenario["endings"]:
            hits = endings[ending["id"]]
            is_safety_net = not ending.get("when")
            mark = "  " if (hits or is_safety_net) else "!!"
            print(f"  {mark} {ending['id']:<26} {hits:>5}{'  (safety net)' if is_safety_net else ''}")
            if not hits and not is_safety_net:
                failures.append(f"{title}: ending '{ending['id']}' is unreachable")
        for cid in sim.characters:
            if sim.alive(cid) and not decisions[cid]:
                failures.append(f"{title}: nobody ever approached '{cid}'")

    if failures:
        print("\nFAILURES:")
        for line in failures:
            print("  -", line)
        sys.exit(1)
    print("\nSIMULATION PASSED: every ending reachable, every ally openable")


if __name__ == "__main__":
    main()
