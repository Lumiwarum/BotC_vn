(function () {
  "use strict";

  function clone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function compare(actual, operator, expected) {
    switch (operator || "equals") {
      case "equals": return actual === expected;
      case "notEquals": return actual !== expected;
      case "gt": return Number(actual) > Number(expected);
      case "gte": return Number(actual) >= Number(expected);
      case "lt": return Number(actual) < Number(expected);
      case "lte": return Number(actual) <= Number(expected);
      case "truthy": return Boolean(actual);
      case "falsy": return !actual;
      case "includes":
        if (Array.isArray(expected)) return expected.includes(actual);
        if (Array.isArray(actual)) return actual.includes(expected);
        return String(actual ?? "").includes(String(expected ?? ""));
      default: return false;
    }
  }

  const PLAYER = "you";

  // Approaching someone who barely trusts you is allowed; it is just a bad bet.
  const DEFAULT_ODDS = [
    { minTrust: 2, chance: 0.95 },
    { minTrust: 1, chance: 0.85 },
    { minTrust: 0, chance: 0.55 },
    { minTrust: -1, chance: 0.3 },
    { minTrust: -2, chance: 0.12 }
  ];

  class VNEngine {
    constructor(scenario) {
      this.loadScenario(scenario);
    }

    loadScenario(scenario) {
      // Accept older exported stories without changing their original data.
      const normalized = JSON.parse(JSON.stringify(scenario), (key, value) =>
        key === "type" && value === "nomination" ? "decision" : value);
      if (!normalized.decision && normalized.nomination) normalized.decision = normalized.nomination;
      delete normalized.nomination;
      this.validateScenario(normalized);
      this.scenario = clone(normalized);
      this.reset();
    }

    validateScenario(scenario) {
      if (!scenario || typeof scenario !== "object") throw new Error("Сценарий должен быть объектом.");
      if (!scenario.meta || !scenario.meta.title) throw new Error("В сценарии нет meta.title.");
      if (!Array.isArray(scenario.characters) || scenario.characters.length === 0) {
        throw new Error("В сценарии должен быть хотя бы один персонаж.");
      }
      if (!scenario.dialogues || typeof scenario.dialogues !== "object") {
        throw new Error("В сценарии нет раздела dialogues.");
      }
      const characterIds = new Set();
      scenario.characters.forEach((character) => {
        if (!character.id || !character.name) throw new Error("У каждого персонажа нужны id и name.");
        if (characterIds.has(character.id)) throw new Error(`ID персонажа «${character.id}» повторяется.`);
        characterIds.add(character.id);
        const dialogue = scenario.dialogues[character.id];
        if (!dialogue || !dialogue.nodes || !dialogue.start) {
          throw new Error(`Для персонажа ${character.name} не настроен стартовый диалог.`);
        }
        if (!dialogue.nodes[dialogue.start]) {
          throw new Error(`Стартовый узел ${dialogue.start} персонажа ${character.name} не найден.`);
        }
        (dialogue.startRules || []).forEach((rule) => {
          if (!dialogue.nodes[rule.node]) throw new Error(`У персонажа ${character.name} правило ведёт в отсутствующий узел «${rule.node}».`);
        });
        Object.entries(dialogue.nodes).forEach(([nodeId, node]) => {
          (node.choices || []).forEach((choice) => {
            if (choice.goto && !dialogue.nodes[choice.goto]) {
              throw new Error(`Переход ${nodeId} → ${choice.goto} персонажа ${character.name} сломан.`);
            }
          });
        });
      });
    }

    // Seats run clockwise starting with the protagonist.
    seatOrder() {
      const ids = this.scenario.characters.map((character) => character.id);
      const declared = Array.isArray(this.scenario.table?.seats) ? this.scenario.table.seats : [];
      const seats = declared.filter((id) => id === "you" || ids.includes(id));
      if (!seats.includes("you")) seats.unshift("you");
      ids.forEach((id) => { if (!seats.includes(id)) seats.push(id); });
      const start = seats.indexOf("you");
      return seats.slice(start).concat(seats.slice(0, start));
    }

    // At a real table players are numbered 1..N around the circle. Only the seat
    // that gets number 1 is drawn at random, so neighbours stay consecutive.
    assignSeatNumbers() {
      const order = this.seatOrder();
      const offset = Math.floor(Math.random() * order.length);
      const numbers = {};
      order.forEach((id, index) => {
        numbers[id] = ((index - offset + order.length) % order.length) + 1;
      });
      return numbers;
    }

    seatNumber(id) {
      return this.state?.seatNumbers?.[id] || null;
    }

    reset() {
      const counts = {};
      const spokenTo = {};
      const trust = {};
      // Who each player already eyes at the table, before you say anything.
      const suspicion = {};
      this.scenario.characters.forEach((character) => {
        counts[character.id] = 0;
        spokenTo[character.id] = false;
        trust[character.id] = Number(character.startingTrust || 0);
        suspicion[character.id] = {};
        Object.entries(character.views || {}).forEach(([targetId, value]) => {
          suspicion[character.id][targetId] = Number(value || 0);
        });
      });

      this.state = {
        phase: "role",
        dayNumber: Number(this.scenario.settings?.dayNumber || 1),
        conversationsRemaining: Number(this.scenario.settings?.conversationsPerDay || 3),
        totalConversations: 0,
        conversationCounts: counts,
        spokenTo,
        seatNumbers: this.assignSeatNumbers(),
        trust,
        trustLog: [],
        suspicion,
        variables: clone(this.scenario.initialState || {}),
        choiceHistory: [],
        firedEvents: [],
        eventLog: [],
        decision: null,
        approach: null,
        day: null,
        vote: null,
        endingId: null,
        currentCharacterId: null,
        currentNodeId: null
      };
      return this.state;
    }

    wakeUp() {
      this.state.phase = "town";
    }

    getCharacter(characterId) {
      return this.scenario.characters.find((character) => character.id === characterId) || null;
    }

    isAlive(characterId) {
      return !(this.scenario.table?.dead || []).includes(characterId);
    }

    livingIds() {
      return this.seatOrder().filter((id) => this.isAlive(id));
    }

    // With table.ghostVotes a dead player keeps one last vote for the rest of the game.
    hasGhostVotes() {
      return Boolean(this.scenario.table?.ghostVotes);
    }

    canVote(characterId) {
      if (this.isAlive(characterId)) return true;
      return this.hasGhostVotes() && !(this.state.day?.ghostSpent || []).includes(characterId);
    }

    getSprite(characterId, emotion) {
      const character = this.getCharacter(characterId);
      if (!character) return "";
      const sprites = character.sprites || {};
      return sprites[emotion] || sprites.neutral || Object.values(sprites)[0] || "";
    }

    evaluateCondition(condition) {
      if (!condition || typeof condition !== "object") return true;
      let actual;

      switch (condition.type) {
        case "variable":
          actual = this.state.variables[condition.key];
          break;
        case "conversationCount":
          actual = this.state.conversationCounts[condition.characterId] || 0;
          break;
        case "spokenTo":
          actual = Boolean(this.state.spokenTo[condition.characterId]);
          break;
        case "totalConversations":
          actual = this.state.totalConversations;
          break;
        case "decision":
          actual = this.state.decision;
          break;
        case "trust":
          actual = this.trustOf(condition.characterId);
          break;
        case "suspicion":
          actual = this.suspicionOf(condition.characterId, condition.targetId);
          break;
        case "openAllies":
          actual = this.getAllyOptions().filter((ally) => ally.allowed).length;
          break;
        case "approach":
          actual = this.state.approach?.outcome || "none";
          break;
        case "executed":
          actual = this.state.vote?.executed || "nobody";
          break;
        case "executedTeam":
          actual = this.executedTeam();
          break;
        case "votesAgainstPlayer":
          actual = Number(this.state.vote?.votesAgainstPlayer || 0);
          break;
        case "nominatedPlayer":
          actual = this.state.vote?.log?.some((entry) => entry.targetId === PLAYER) || false;
          break;
        case "playerNomination":
          actual = this.state.vote?.playerNomination || "nobody";
          break;
        case "nominations":
          actual = this.state.vote?.log?.length || 0;
          break;
        case "pactBroken":
          actual = Boolean(this.state.vote?.pactBroken);
          break;
        default:
          return false;
      }

      return compare(actual, condition.operator, condition.value);
    }

    conditionsMet(conditions) {
      return !conditions || conditions.length === 0 || conditions.every((condition) => this.evaluateCondition(condition));
    }

    applyEffects(effects) {
      (effects || []).forEach((effect) => {
        if (effect.type === "trust") {
          this.applyTrust(effect);
          return;
        }
        if (effect.type === "suspicion") {
          this.applySuspicion(effect);
          return;
        }
        const key = effect.key;
        if (!key) return;
        if (effect.type === "set") this.state.variables[key] = clone(effect.value);
        if (effect.type === "increment") {
          this.state.variables[key] = Number(this.state.variables[key] || 0) + Number(effect.value ?? effect.by ?? 1);
        }
        if (effect.type === "toggle") this.state.variables[key] = !Boolean(this.state.variables[key]);
      });
    }

    trustRange() {
      const scale = this.scenario.trust || {};
      return { min: Number(scale.min ?? -4), max: Number(scale.max ?? 4) };
    }

    trustOf(characterId) {
      return Number(this.state.trust?.[characterId] || 0);
    }

    // Trust is the record of how you actually treated someone, so every change
    // carries the line the player can be shown later.
    applyTrust(effect) {
      const characterId = effect.characterId;
      if (!this.getCharacter(characterId)) return;
      const { min, max } = this.trustRange();
      const before = this.trustOf(characterId);
      const after = Math.max(min, Math.min(max, before + Number(effect.value || 0)));
      this.state.trust[characterId] = after;
      this.state.trustLog.push({
        characterId,
        delta: after - before,
        requested: Number(effect.value || 0),
        note: effect.note || ""
      });
    }

    // Pointing someone at a neighbour is the other half of a day: trust says how
    // they feel about you, suspicion says whom they are ready to put on the block.
    applySuspicion(effect) {
      const { characterId, targetId } = effect;
      if (!this.getCharacter(characterId)) return;
      if (targetId !== PLAYER && !this.getCharacter(targetId)) return;
      const row = this.state.suspicion[characterId] || (this.state.suspicion[characterId] = {});
      row[targetId] = Number(row[targetId] || 0) + Number(effect.value || 0);
    }

    // How badly this character wants that person executed today.
    suspicionOf(characterId, targetId) {
      if (characterId === targetId) return -99;
      if (targetId !== PLAYER) return Number(this.state.suspicion?.[characterId]?.[targetId] || 0);

      // Your own row is not authored anywhere: it is the trust you earned today.
      const day = this.state.day || {};
      const approach = this.state.approach || {};
      let urge = -this.trustOf(characterId);
      if (approach.outcome === "betrayed") urge += approach.characterId === characterId ? 3 : 1;
      if (day.allyId === characterId) {
        urge += day.pactBroken ? 3 : -3;
        if (day.pactBroken) urge = Math.max(urge, Number(this.voteSettings().voteAt ?? 1));
      }
      return urge;
    }

    allyThreshold(characterId) {
      const character = this.getCharacter(characterId);
      // Default 0: a scenario that authors no trust effects locks nobody.
      return Number(character?.allyTrust ?? this.scenario.decision?.allyTrust ?? 0);
    }

    // Why this person will not play with you: the last thing you did to them,
    // falling back to the authored hint when nothing memorable happened.
    trustReason(characterId) {
      const character = this.getCharacter(characterId);
      if (!character) return "";
      const damage = this.state.trustLog.filter((entry) => entry.characterId === characterId && entry.delta < 0 && entry.note);
      if (damage.length) return damage[damage.length - 1].note;
      const earned = this.state.trustLog.some((entry) => entry.characterId === characterId && entry.delta > 0);
      if (!earned && !this.state.spokenTo[characterId]) {
        return character.allyHintUnmet || `Вы так и не поговорили с ${character.name}.`;
      }
      return character.allyHint || `${character.name} слушает вас, но не настолько, чтобы играть вместе.`;
    }

    allyRequirement(characterId) {
      if (characterId === "nobody") {
        return { id: "nobody", allowed: this.scenario.decision?.allowNobody !== false, trust: null, required: null, reason: "" };
      }
      const character = this.getCharacter(characterId);
      if (!character) return { id: characterId, allowed: false, trust: 0, required: 0, reason: "Этого игрока нет за столом." };
      if (!this.isAlive(characterId)) return { id: characterId, name: character.name, allowed: false, trust: this.trustOf(characterId), required: this.allyThreshold(characterId), reason: this.hasGhostVotes()
        ? "Мёртвые не заключают союзов. Свой последний голос он отдаст сам — если вы его убедите."
        : "Этот игрок уже мёртв и не может голосовать." };
      const trust = this.trustOf(characterId);
      const required = this.allyThreshold(characterId);
      const allowed = trust >= required;
      return { id: characterId, name: character.name, allowed, trust, required, reason: allowed ? "" : this.trustReason(characterId) };
    }

    getAllyOptions() {
      return this.scenario.characters.map((character) => this.allyRequirement(character.id));
    }

    getConversationStart(characterId) {
      const dialogue = this.scenario.dialogues[characterId];
      const rule = (dialogue.startRules || []).find((candidate) => this.conditionsMet(candidate.when));
      return rule ? rule.node : dialogue.start;
    }

    startConversation(characterId) {
      if (this.state.conversationsRemaining <= 0) return null;
      const character = this.getCharacter(characterId);
      if (!character || !this.scenario.dialogues[characterId]) return null;

      this.state.phase = "dialogue";
      this.state.currentCharacterId = characterId;
      this.state.currentNodeId = this.getConversationStart(characterId);
      return this.getCurrentNode();
    }

    getCurrentNode() {
      const characterId = this.state.currentCharacterId;
      const nodeId = this.state.currentNodeId;
      return this.scenario.dialogues[characterId]?.nodes?.[nodeId] || null;
    }

    getAvailableChoices() {
      const node = this.getCurrentNode();
      if (!node) return [];
      return (node.choices || [])
        .map((choice, index) => ({ choice, index }))
        .filter((entry) => this.conditionsMet(entry.choice.conditions));
    }

    chooseChoice(choiceIndex) {
      const node = this.getCurrentNode();
      const choice = node?.choices?.[choiceIndex];
      if (!choice || !this.conditionsMet(choice.conditions)) return null;

      this.state.choiceHistory.push({
        characterId: this.state.currentCharacterId,
        nodeId: this.state.currentNodeId,
        choiceIndex,
        text: choice.text
      });
      this.applyEffects(choice.effects);

      if (choice.endConversation || !choice.goto) return this.finishConversation();
      const next = this.scenario.dialogues[this.state.currentCharacterId]?.nodes?.[choice.goto];
      if (!next) throw new Error(`Узел назначения «${choice.goto}» не найден.`);
      this.state.currentNodeId = choice.goto;
      return { type: "node", node: next };
    }

    finishConversation() {
      const characterId = this.state.currentCharacterId;
      this.state.conversationCounts[characterId] = (this.state.conversationCounts[characterId] || 0) + 1;
      this.state.spokenTo[characterId] = true;
      this.state.totalConversations += 1;
      this.state.conversationsRemaining = Math.max(0, this.state.conversationsRemaining - 1);
      this.state.currentCharacterId = null;
      this.state.currentNodeId = null;

      const events = this.processEvents("afterConversation");
      this.state.phase = this.state.conversationsRemaining > 0 ? "town" : "decision";
      return { type: "conversationEnd", events, nextPhase: this.state.phase };
    }

    processEvents(trigger) {
      const visibleEvents = [];
      (this.scenario.events || []).forEach((event) => {
        if ((event.trigger || "afterConversation") !== trigger) return;
        if (event.once !== false && this.state.firedEvents.includes(event.id)) return;
        if (!this.conditionsMet(event.when)) return;

        this.applyEffects(event.effects);
        this.state.firedEvents.push(event.id);
        this.state.eventLog.push({
          id: event.id,
          visible: Boolean(event.visible),
          text: event.visible ? event.text : (event.debugText || "Скрытое событие")
        });
        if (event.visible) visibleEvents.push(clone(event));
      });
      return visibleEvents;
    }

    getDecisionStatements() {
      return (this.scenario.decision?.statements || []).map((statement) => {
        const variant = (statement.variants || []).find((candidate) => this.conditionsMet(candidate.when));
        return {
          characterId: statement.characterId,
          text: variant?.text || "…"
        };
      });
    }

    // How likely this person is to take your offer, and what a failure costs.
    approachOdds(characterId) {
      const decision = this.scenario.decision || {};
      const trust = this.trustOf(characterId);
      // A scenario that authors no trust layer keeps the old behaviour: everyone agrees.
      if (!this.scenario.trust && !Array.isArray(decision.odds)) {
        return { chance: 1, betrays: false, hopeless: false, trust };
      }
      const refuseBelow = Number(decision.refuseBelow ?? -3);
      if (trust <= refuseBelow) {
        return { chance: 0, betrays: true, hopeless: true, trust };
      }
      const table = Array.isArray(decision.odds) && decision.odds.length ? decision.odds : DEFAULT_ODDS;
      const band = table.find((entry) => trust >= Number(entry.minTrust));
      return {
        chance: band ? Number(band.chance) : 0.05,
        betrays: trust <= Number(decision.betrayBelow ?? -1),
        hopeless: false,
        trust
      };
    }

    approachAlly(characterId) {
      if (this.state.phase !== "decision") throw new Error("Сначала завершите разговоры.");
      if (characterId === "nobody") {
        if (this.scenario.decision?.allowNobody === false) throw new Error("В этом эпизоде нужно к кому-то подойти.");
        this.state.approach = { characterId: "nobody", outcome: "none", chance: null, roll: null };
      } else {
        const character = this.getCharacter(characterId);
        if (!character) throw new Error("Этого игрока нет за столом.");
        if (!this.isAlive(characterId)) throw new Error("Мёртвый игрок не может поддержать вас голосом.");
        const odds = this.approachOdds(characterId);
        const roll = Math.random();
        const accepted = roll < odds.chance;
        const outcome = accepted ? "accepted" : (odds.betrays ? "betrayed" : "refused");
        this.state.approach = { characterId, outcome, chance: odds.chance, roll };
        if (outcome === "betrayed") {
          this.scenario.characters.forEach((other) => {
            if (other.id === characterId) return;
            this.applyTrust({
              type: "trust",
              characterId: other.id,
              value: -1,
              note: `${character.name} пересказал ваш разговор всему столу.`
            });
          });
        }
      }
      this.state.decision = characterId;
      this.startDay();
      return clone(this.state.approach);
    }

    voteSettings() {
      return this.scenario.vote || {};
    }

    // A nomination passes with half the living table, rounded up — you included.
    voteMajority() {
      const alive = this.livingIds().length;
      return Number(this.voteSettings().majority ?? Math.ceil(alive / 2));
    }

    startDay() {
      const approach = this.state.approach || {};
      this.state.day = {
        allyId: approach.outcome === "accepted" ? approach.characterId : null,
        block: { targetId: null, votes: 0 },
        nominatorIds: [],
        nominatedIds: [],
        log: [],
        pending: null,
        playerNomination: "nobody",
        votesAgainstPlayer: 0,
        pactBroken: false,
        ghostSpent: [],
        over: false
      };
      this.state.phase = "vote";
      return this.dayBeat();
    }

    // Anyone still un-nominated can be called out; you cannot nominate yourself.
    nominationTargets() {
      const day = this.state.day;
      return this.scenario.characters
        .map((character) => character.id)
        .filter((id) => this.isAlive(id) && !day.nominatedIds.includes(id));
    }

    // The one character most eager to speak right now, if anyone is.
    nextNpcNomination() {
      const day = this.state.day;
      const settings = this.voteSettings();
      const nominateAt = Number(settings.nominateAt ?? 2);
      const candidates = [];
      this.scenario.characters.forEach((character) => {
        if (!this.isAlive(character.id)) return;
        if (day.nominatorIds.includes(character.id)) return;
        const targets = [PLAYER].concat(this.scenario.characters.map((other) => other.id))
          .filter((id) => this.isAlive(id) && id !== character.id && !day.nominatedIds.includes(id));
        let best = null;
        targets.forEach((id) => {
          const urge = this.suspicionOf(character.id, id);
          if (!best || urge > best.urge) best = { nominatorId: character.id, targetId: id, urge };
        });
        if (best && best.urge >= nominateAt) candidates.push(best);
      });
      // Stable sort over the authored character order keeps the day reproducible.
      candidates.sort((a, b) => b.urge - a.urge);
      return candidates[0] || null;
    }

    // Hands go up only for an execution — there is no vote against a nomination.
    // A dead player spends his one vote only on a conviction (ghostVoteAt, default
    // nominateAt): no pact and no favour to the player buys it.
    wouldVote(voterId, targetId, nominatorId) {
      if (!this.canVote(voterId)) return false;
      if (voterId === targetId) return false;
      const settings = this.voteSettings();
      if (!this.isAlive(voterId)) {
        return this.suspicionOf(voterId, targetId) >= Number(settings.ghostVoteAt ?? settings.nominateAt ?? 2);
      }
      const day = this.state.day || {};
      const allied = day.allyId === voterId && !day.pactBroken;
      const voteAt = Number(settings.voteAt ?? 1);
      if (targetId === PLAYER) return !allied && this.suspicionOf(voterId, PLAYER) >= voteAt;
      // A pact, or plain trust, is worth a raised hand when you are the one asking.
      if (nominatorId === PLAYER && (allied || this.trustOf(voterId) >= 2)) return true;
      return this.suspicionOf(voterId, targetId) >= voteAt;
    }

    // The player never votes hand by hand: he votes with the person he agreed to
    // play with. No ally means he keeps out of other people's nominations.
    playerAutoHand(targetId) {
      const day = this.state.day;
      if (!day || !day.allyId || day.pactBroken) return false;
      if (targetId === PLAYER || targetId === day.allyId) return false;
      return this.wouldVote(day.allyId, targetId, day.allyId);
    }

    // What the day is waiting for. Fills in the next NPC nomination on demand.
    dayBeat() {
      const day = this.state.day;
      if (!day) return { type: "none" };
      if (day.over) return { type: "dayOver" };
      if (day.pending) return { type: "nomination", ...day.pending, playerVotes: this.playerAutoHand(day.pending.targetId) };
      const npc = this.nextNpcNomination();
      const playerCanNominate = !day.nominatorIds.includes(PLAYER);
      const urgentAt = Number(this.voteSettings().urgentAt ?? 3);
      // Someone angry enough does not wait for your turn.
      if (npc && (!playerCanNominate || npc.urge >= urgentAt)) {
        day.pending = { nominatorId: npc.nominatorId, targetId: npc.targetId };
        return { type: "nomination", ...day.pending, playerVotes: this.playerAutoHand(npc.targetId) };
      }
      if (playerCanNominate) return { type: "playerTurn", targets: this.nominationTargets() };
      day.over = true;
      return { type: "dayOver" };
    }

    resolveNomination(nominatorId, targetId, playerVotes) {
      const day = this.state.day;
      // Turning on the person who agreed to back you ends the pact before the count.
      if (day.allyId && targetId === day.allyId && (nominatorId === PLAYER || playerVotes)) day.pactBroken = true;

      const voters = this.scenario.characters
        .filter((character) => this.wouldVote(character.id, targetId, nominatorId))
        .map((character) => character.id);
      if (playerVotes && targetId !== PLAYER) voters.push(PLAYER);
      voters.filter((id) => id !== PLAYER && !this.isAlive(id)).forEach((id) => day.ghostSpent.push(id));
      const votes = voters.length;
      const majority = this.voteMajority();
      const previousBlock = day.block.targetId;

      let onBlock = false;
      let tied = false;
      if (votes >= majority && votes > day.block.votes) {
        day.block = { targetId, votes };
        onBlock = true;
      } else if (votes >= majority && votes === day.block.votes && previousBlock) {
        // A tie takes the previous nominee off the block and puts nobody on it.
        day.block = { targetId: null, votes };
        tied = true;
      }

      day.nominatorIds.push(nominatorId);
      day.nominatedIds.push(targetId);
      if (targetId === PLAYER) day.votesAgainstPlayer = Math.max(day.votesAgainstPlayer, votes);
      if (nominatorId === PLAYER) day.playerNomination = targetId;
      day.pending = null;

      const entry = { nominatorId, targetId, voters, votes, majority, onBlock, tied, previousBlock, blockTargetId: day.block.targetId };
      day.log.push(entry);
      return clone(entry);
    }

    // Your turn: name someone, or say nothing and keep your nomination unused.
    playerNominate(targetId) {
      const day = this.state.day;
      if (!day || day.over || day.pending) throw new Error("Сейчас не ваш ход.");
      if (day.nominatorIds.includes(PLAYER)) throw new Error("Вы уже номинировали сегодня.");
      if (!targetId || targetId === "nobody") {
        day.nominatorIds.push(PLAYER);
        day.playerNomination = "nobody";
        return null;
      }
      if (!this.nominationTargets().includes(targetId)) throw new Error("Этого игрока сегодня уже номинировали.");
      // The nominator always votes for their own nomination.
      return this.resolveNomination(PLAYER, targetId, true);
    }

    // Someone else's nomination: it counts itself, the player only watches.
    resolvePending() {
      const day = this.state.day;
      if (!day || !day.pending) throw new Error("Сейчас никто не выставлен на голосование.");
      const { nominatorId, targetId } = day.pending;
      return this.resolveNomination(nominatorId, targetId, this.playerAutoHand(targetId));
    }

    endDay() {
      const day = this.state.day;
      if (!day) throw new Error("День ещё не начался.");
      day.over = true;
      this.state.vote = {
        executed: day.block.targetId || "nobody",
        nightDeath: !day.block.targetId ? (this.scenario.finalNight?.victim || null) : null,
        block: clone(day.block),
        log: clone(day.log),
        allyId: day.allyId,
        pactBroken: day.pactBroken,
        votesAgainstPlayer: day.votesAgainstPlayer,
        playerNomination: day.playerNomination,
        majority: this.voteMajority()
      };
      this.state.phase = "ending";
      const ending = (this.scenario.endings || []).find((candidate) => this.conditionsMet(candidate.when));
      if (!ending) throw new Error("Для этого исхода не настроена концовка.");
      this.state.endingId = ending.id;
      return clone(ending);
    }

    executedTeam() {
      const executed = this.state.vote?.executed;
      if (!executed || executed === "nobody") return "";
      if (executed === "you") return this.scenario.player?.team || "";
      const entry = (this.scenario.reveal || []).find((item) => item.characterId === executed);
      return entry?.team || "";
    }

    getConditionReport() {
      const events = (this.scenario.events || []).map((event) => ({
        id: event.id,
        fired: this.state.firedEvents.includes(event.id),
        currentlyMatches: this.conditionsMet(event.when)
      }));
      const choices = this.getCurrentNode()
        ? (this.getCurrentNode().choices || []).map((choice, index) => ({
            index,
            text: choice.text,
            available: this.conditionsMet(choice.conditions)
          }))
        : [];
      return { events, choices };
    }

    getDebugSnapshot() {
      return {
        phase: this.state.phase,
        currentCharacterId: this.state.currentCharacterId,
        currentNodeId: this.state.currentNodeId,
        conversationsRemaining: this.state.conversationsRemaining,
        totalConversations: this.state.totalConversations,
        conversationCounts: clone(this.state.conversationCounts),
        spokenTo: clone(this.state.spokenTo),
        variables: clone(this.state.variables),
        trust: clone(this.state.trust),
        trustLog: clone(this.state.trustLog),
        suspicion: clone(this.state.suspicion),
        day: clone(this.state.day),
        allies: this.getAllyOptions(),
        firedEvents: clone(this.state.firedEvents),
        eventLog: clone(this.state.eventLog),
        decision: this.state.decision,
        approach: clone(this.state.approach),
        vote: clone(this.state.vote),
        endingId: this.state.endingId,
        activeConditions: this.getConditionReport()
      };
    }
  }

  window.VNEngine = VNEngine;
})();
