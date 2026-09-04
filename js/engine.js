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

  class VNEngine {
    constructor(scenario) {
      this.loadScenario(scenario);
    }

    loadScenario(scenario) {
      this.validateScenario(scenario);
      this.scenario = clone(scenario);
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

    reset() {
      const counts = {};
      const spokenTo = {};
      this.scenario.characters.forEach((character) => {
        counts[character.id] = 0;
        spokenTo[character.id] = false;
      });

      this.state = {
        phase: "role",
        day: 1,
        conversationsRemaining: Number(this.scenario.settings?.conversationsPerDay || 3),
        totalConversations: 0,
        conversationCounts: counts,
        spokenTo,
        variables: clone(this.scenario.initialState || {}),
        choiceHistory: [],
        firedEvents: [],
        eventLog: [],
        nomination: null,
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
        case "nomination":
          actual = this.state.nomination;
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
        const key = effect.key;
        if (!key) return;
        if (effect.type === "set") this.state.variables[key] = clone(effect.value);
        if (effect.type === "increment") {
          this.state.variables[key] = Number(this.state.variables[key] || 0) + Number(effect.value ?? effect.by ?? 1);
        }
        if (effect.type === "toggle") this.state.variables[key] = !Boolean(this.state.variables[key]);
      });
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
      this.state.phase = this.state.conversationsRemaining > 0 ? "town" : "nomination";
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

    getNominationStatements() {
      return (this.scenario.nomination?.statements || []).map((statement) => {
        const variant = (statement.variants || []).find((candidate) => this.conditionsMet(candidate.when));
        return {
          characterId: statement.characterId,
          text: variant?.text || "…"
        };
      });
    }

    nominate(characterId) {
      this.state.nomination = characterId;
      this.state.phase = "ending";
      const ending = (this.scenario.endings || []).find((candidate) => this.conditionsMet(candidate.when));
      if (!ending) throw new Error("Для этого решения не настроена концовка.");
      this.state.endingId = ending.id;
      return clone(ending);
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
        firedEvents: clone(this.state.firedEvents),
        eventLog: clone(this.state.eventLog),
        nomination: this.state.nomination,
        endingId: this.state.endingId,
        activeConditions: this.getConditionReport()
      };
    }
  }

  window.VNEngine = VNEngine;
})();
