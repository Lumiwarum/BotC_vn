(function () {
  "use strict";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function input(label, path, value, options) {
    const config = options || {};
    const type = config.type || "text";
    const help = config.help ? `<small>${escapeHTML(config.help)}</small>` : "";
    if (type === "textarea") {
      return `<label class="field ${config.wide ? "field--wide" : ""}"><span>${escapeHTML(label)}</span><textarea data-bind="${escapeHTML(path)}" rows="${config.rows || 3}">${escapeHTML(value)}</textarea>${help}</label>`;
    }
    return `<label class="field ${config.wide ? "field--wide" : ""}"><span>${escapeHTML(label)}</span><input data-bind="${escapeHTML(path)}" data-value-type="${escapeHTML(type)}" type="${type === "number" ? "number" : "text"}" value="${escapeHTML(value)}" ${config.min !== undefined ? `min="${config.min}"` : ""}>${help}</label>`;
  }

  function jsonValue(value) {
    return JSON.stringify(value ?? [], null, 2);
  }

  class ScenarioEditor {
    constructor(root) {
      this.root = root;
      this.library = (window.BOTC_SCENARIOS || [window.DEMO_SCENARIO]).map((scenario) => clone(scenario));
      this.libraryIndex = 0;
      this.draft = clone(this.library[0]);
      const requestedTab = new URLSearchParams(window.location.search).get("tab");
      this.activeTab = ["overview", "characters", "dialogues", "graph", "events", "endings", "json"].includes(requestedTab) ? requestedTab : "overview";
      this.selectedCharacterId = this.draft.characters[0]?.id;
      this.selectedNodeId = this.draft.dialogues[this.selectedCharacterId]?.start;
      this.previewApp = null;
      this.render();
    }

    render() {
      const tabs = [
        ["overview", "Основа"],
        ["characters", "Персонажи"],
        ["dialogues", "Диалоги"],
        ["graph", "Граф и проверка"],
        ["events", "События"],
        ["endings", "Концовки"],
        ["json", "Полный JSON"]
      ];
      const validation = this.validateDraft();
      const errorCount = validation.filter((issue) => issue.severity === "error").length;
      const warningCount = validation.filter((issue) => issue.severity === "warning").length;
      const libraryOptions = this.library.map((scenario, index) => `<option value="${index}" ${this.libraryIndex === index ? "selected" : ""}>${escapeHTML(scenario.meta?.title || `Сценарий ${index + 1}`)}</option>`).join("");
      this.root.innerHTML = `
        <div class="editor-shell">
          <header class="editor-toolbar">
            <div>
              <p class="eyebrow">Сценарная мастерская</p>
              <h1>${escapeHTML(this.draft.meta?.title || "Без названия")}</h1>
            </div>
            <div class="editor-toolbar__actions">
              <label class="editor-library-picker"><span>Сценарий</span><select id="editor-library-select">${this.libraryIndex === -1 ? '<option value="-1" selected>Импортированный черновик</option>' : ""}${libraryOptions}</select></label>
              <span class="validation-badge ${errorCount ? "has-errors" : ""}">${errorCount ? `${errorCount} ошибок` : "Ветки целы"}${warningCount ? ` · ${warningCount} замеч.` : ""}</span>
              <a class="button button--quiet" href="index.html">← В игру</a>
              <button class="button button--secondary" data-action="import">Импорт JSON</button>
              <button class="button button--secondary" data-action="export">Экспорт JSON</button>
              <button class="button button--primary" data-action="preview">▶ Предпросмотр</button>
              <input class="is-hidden" type="file" accept="application/json,.json" id="scenario-file">
            </div>
          </header>
          <div class="editor-workspace">
            <nav class="editor-tabs" aria-label="Разделы редактора">
              ${tabs.map(([id, label], index) => `<button class="${this.activeTab === id ? "is-active" : ""}" data-tab="${id}"><span>0${index + 1}</span>${label}</button>`).join("")}
              <div class="editor-tip"><strong>Черновик живёт в памяти вкладки.</strong><p>Экспортируйте JSON, прежде чем закрывать страницу.</p></div>
            </nav>
            <section class="editor-content">${this.renderActiveTab()}</section>
          </div>
          <div class="editor-toast" id="editor-toast" role="status"></div>
        </div>`;
      this.bindShell();
      this.bindActiveTab();
    }

    renderActiveTab() {
      if (this.activeTab === "overview") return this.renderOverview();
      if (this.activeTab === "characters") return this.renderCharacters();
      if (this.activeTab === "dialogues") return this.renderDialogues();
      if (this.activeTab === "graph") return this.renderGraph();
      if (this.activeTab === "events") return this.renderEvents();
      if (this.activeTab === "endings") return this.renderEndings();
      return this.renderJSON();
    }

    sectionHeader(kicker, title, description, action) {
      return `<header class="editor-section-header"><div><p class="eyebrow">${escapeHTML(kicker)}</p><h2>${escapeHTML(title)}</h2><p>${escapeHTML(description)}</p></div>${action || ""}</header>`;
    }

    renderOverview() {
      const scenario = this.draft;
      const fallbackOptions = scenario.characters.map((character) => `<option value="${escapeHTML(character.id)}" ${scenario.settings?.fallback?.characterId === character.id ? "selected" : ""}>${escapeHTML(character.name)}</option>`).join("");
      return `
        ${this.sectionHeader("01 · Основа", "Темп и завязка", "То, что игрок увидит до первого разговора.")}
        <div class="editor-card">
          <h3>Карточка сценария</h3>
          <div class="form-grid">
            ${input("Название", "meta.title", scenario.meta?.title, { wide: true })}
            ${input("Подзаголовок", "meta.subtitle", scenario.meta?.subtitle, { wide: true })}
            ${input("Метка в меню", "meta.menuLabel", scenario.meta?.menuLabel)}
            ${input("Длительность", "meta.duration", scenario.meta?.duration)}
            ${input("Описание для выбора сценария", "meta.synopsis", scenario.meta?.synopsis, { wide: true, type: "textarea" })}
            ${input("Автор", "meta.author", scenario.meta?.author)}
            ${input("Версия", "meta.version", scenario.meta?.version)}
          </div>
        </div>
        <div class="editor-card">
          <h3>Ритм дня</h3>
          <div class="form-grid">
            ${input("Секунд на выбор", "settings.selectionSeconds", scenario.settings?.selectionSeconds, { type: "number", min: 1 })}
            ${input("Разговоров за день", "settings.conversationsPerDay", scenario.settings?.conversationsPerDay, { type: "number", min: 1 })}
            <label class="field"><span>Кто подходит при нуле</span><select data-bind="settings.fallback.characterId">${fallbackOptions}</select></label>
            ${input("Реплика при нуле", "settings.fallback.text", scenario.settings?.fallback?.text, { wide: true })}
          </div>
        </div>
        <div class="editor-card">
          <h3>Главный герой</h3>
          <div class="form-grid">
            ${input("Имя / подпись", "player.name", scenario.player?.name || "Вы")}
            ${input("Название роли", "player.roleName", scenario.player?.roleName)}
            ${input("Знак / эмодзи", "player.roleIcon", scenario.player?.roleIcon)}
            ${input("Иконка роли игрока", "player.roleIconImage", scenario.player?.roleIconImage, { wide: true, help: "Относительный путь, URL или data URL." })}
            ${input("Команда", "player.team", scenario.player?.team)}
            ${input("Короткое описание", "player.description", scenario.player?.description, { wide: true, type: "textarea" })}
            ${input("Заголовок информации", "player.startingInformation.label", scenario.player?.startingInformation?.label)}
            ${input("Полученная информация", "player.startingInformation.text", scenario.player?.startingInformation?.text, { wide: true, type: "textarea" })}
            ${input("Иконка показанного жетона", "player.startingInformation.roleIcon", scenario.player?.startingInformation?.roleIcon)}
            ${input("Название показанной роли", "player.startingInformation.roleName", scenario.player?.startingInformation?.roleName)}
            <label class="field field--wide"><span>Имена в ночной проверке</span><input id="suspects-input" value="${escapeHTML((scenario.player?.startingInformation?.suspects || []).join(", "))}"><small>Через запятую.</small></label>
            ${input("Пояснение для новичка", "player.startingInformation.hint", scenario.player?.startingInformation?.hint, { wide: true, type: "textarea" })}
            ${input("Фото руки ведущего", "nightVisual.handImage", scenario.nightVisual?.handImage, { wide: true })}
            ${input("Подпись источников", "nightVisual.credit", scenario.nightVisual?.credit, { wide: true })}
          </div>
        </div>`;
    }

    renderCharacters() {
      const cards = this.draft.characters.map((character, characterIndex) => {
        const emotions = Object.keys(character.sprites || {});
        const spriteRows = emotions.map((emotion) => `
          <div class="sprite-row">
            <strong>${escapeHTML(emotion)}</strong>
            <input data-bind="characters.${characterIndex}.sprites.${escapeHTML(emotion)}" value="${escapeHTML(character.sprites[emotion])}" aria-label="Путь к эмоции ${escapeHTML(emotion)}">
            <label class="file-button">Загрузить<input type="file" accept="image/*" data-sprite-upload="${characterIndex}|${escapeHTML(emotion)}"></label>
          </div>`).join("");
        return `
          <article class="editor-card character-editor-card">
            <div class="card-title-row"><div><span class="id-chip">${escapeHTML(character.id)}</span><h3>${escapeHTML(character.name)}</h3></div><button class="icon-button danger" data-remove-character="${characterIndex}" title="Удалить персонажа">×</button></div>
            <div class="form-grid">
              ${input("Имя", `characters.${characterIndex}.name`, character.name)}
              ${input("Короткая характеристика", `characters.${characterIndex}.tagline`, character.tagline, { wide: true })}
            </div>
            <div class="subsection-title"><h4>Эмоции и изображения</h4><button class="text-button" data-add-emotion="${characterIndex}">+ Эмоция</button></div>
            <div class="sprite-list">${spriteRows || "<p class=empty-note>Изображений пока нет.</p>"}</div>
          </article>`;
      }).join("");
      return `
        ${this.sectionHeader("02 · Персонажи", "Жители города", "Путь может быть относительным, внешним URL или встроенным data URL.", '<button class="button button--primary" data-action="add-character">+ Персонаж</button>')}
        <div class="editor-stack">${cards}</div>`;
    }

    renderDialogues() {
      const character = this.draft.characters.find((entry) => entry.id === this.selectedCharacterId) || this.draft.characters[0];
      this.selectedCharacterId = character.id;
      const dialogue = this.draft.dialogues[character.id];
      const nodeIds = Object.keys(dialogue.nodes || {});
      if (!dialogue.nodes[this.selectedNodeId]) this.selectedNodeId = dialogue.start || nodeIds[0];
      const node = dialogue.nodes[this.selectedNodeId];
      const characterOptions = this.draft.characters.map((entry) => `<option value="${escapeHTML(entry.id)}" ${entry.id === character.id ? "selected" : ""}>${escapeHTML(entry.name)}</option>`).join("");
      const nodeOptions = nodeIds.map((id) => `<option value="${escapeHTML(id)}" ${id === this.selectedNodeId ? "selected" : ""}>${escapeHTML(id)}</option>`).join("");
      const speakerOptions = [`<option value="player" ${node.speaker === "player" ? "selected" : ""}>Игрок</option>`, ...this.draft.characters.map((entry) => `<option value="${escapeHTML(entry.id)}" ${node.speaker === entry.id ? "selected" : ""}>${escapeHTML(entry.name)}</option>`)].join("");
      const choices = (node.choices || []).map((choice, choiceIndex) => {
        const effects = (choice.effects || []).map((effect, effectIndex) => this.renderEffectRow(choiceIndex, effectIndex, effect)).join("");
        const destinations = [`<option value="">— нет перехода —</option>`, ...nodeIds.map((id) => `<option value="${escapeHTML(id)}" ${choice.goto === id ? "selected" : ""}>${escapeHTML(id)}</option>`)].join("");
        return `
          <article class="choice-editor" data-choice-card="${choiceIndex}">
            <div class="card-title-row"><h4>Ответ ${choiceIndex + 1}</h4><button class="icon-button danger" data-remove-choice="${choiceIndex}" title="Удалить ответ">×</button></div>
            <label class="field field--wide"><span>Текст ответа</span><textarea rows="2" data-choice-field="text" data-choice-index="${choiceIndex}">${escapeHTML(choice.text || "")}</textarea></label>
            <div class="form-grid">
              <label class="field"><span>Следующий узел</span><select data-choice-field="goto" data-choice-index="${choiceIndex}">${destinations}</select></label>
              <label class="check-field"><input type="checkbox" data-choice-field="endConversation" data-choice-index="${choiceIndex}" ${choice.endConversation ? "checked" : ""}><span>Завершить разговор</span></label>
              <label class="field field--wide"><span>Условия ответа, JSON</span><textarea rows="2" data-choice-json="conditions" data-choice-index="${choiceIndex}">${escapeHTML(jsonValue(choice.conditions || []))}</textarea></label>
            </div>
            <div class="subsection-title"><h4>Изменения состояния</h4><button class="text-button" data-add-effect="${choiceIndex}">+ Эффект</button></div>
            <div class="effect-list">${effects || '<p class="empty-note">Этот ответ пока не меняет состояние.</p>'}</div>
          </article>`;
      }).join("");
      return `
        ${this.sectionHeader("03 · Диалоги", "Узлы и ответы", "Первое совпавшее правило старта выбирает узел. Правила доступны в полном JSON.", '<button class="button button--primary" data-action="add-node">+ Узел</button>')}
        <div class="dialogue-editor-nav">
          <label class="field"><span>Персонаж</span><select id="dialogue-character">${characterOptions}</select></label>
          <label class="field"><span>Текущий узел</span><select id="dialogue-node">${nodeOptions}</select></label>
          <label class="field"><span>Стартовый узел</span><select id="dialogue-start">${nodeIds.map((id) => `<option value="${escapeHTML(id)}" ${dialogue.start === id ? "selected" : ""}>${escapeHTML(id)}</option>`).join("")}</select></label>
          <button class="button button--quiet danger-text" data-action="remove-node">Удалить узел</button>
        </div>
        <article class="editor-card node-editor">
          <div class="card-title-row"><div><span class="id-chip">${escapeHTML(this.selectedNodeId)}</span><h3>Реплика</h3></div></div>
          <div class="form-grid">
            <label class="field"><span>Говорящий</span><select id="node-speaker">${speakerOptions}</select></label>
            ${input("Эмоция", "__nodeEmotion", node.emotion || "neutral")}
            <label class="field field--wide"><span>Текст</span><textarea id="node-text" rows="4">${escapeHTML(node.text || "")}</textarea></label>
          </div>
          <div class="subsection-title"><h3>Ответы игрока</h3><button class="text-button" data-action="add-choice">+ Ответ</button></div>
          <div class="choice-list">${choices || '<p class="empty-note">Добавьте хотя бы один ответ.</p>'}</div>
        </article>`;
    }

    renderEffectRow(choiceIndex, effectIndex, effect) {
      return `<div class="effect-row">
        <select data-effect-field="type" data-choice-index="${choiceIndex}" data-effect-index="${effectIndex}">
          ${["set", "increment", "toggle"].map((type) => `<option value="${type}" ${effect.type === type ? "selected" : ""}>${type}</option>`).join("")}
        </select>
        <input value="${escapeHTML(effect.key || "")}" placeholder="имя переменной" data-effect-field="key" data-choice-index="${choiceIndex}" data-effect-index="${effectIndex}">
        <input value="${escapeHTML(JSON.stringify(effect.value ?? effect.by ?? true))}" placeholder='значение, напр. true' data-effect-field="value" data-choice-index="${choiceIndex}" data-effect-index="${effectIndex}">
        <button class="icon-button" data-remove-effect="${choiceIndex}|${effectIndex}" title="Удалить эффект">×</button>
      </div>`;
    }

    renderGraph() {
      const character = this.draft.characters.find((entry) => entry.id === this.selectedCharacterId) || this.draft.characters[0];
      this.selectedCharacterId = character?.id;
      const dialogue = this.draft.dialogues?.[this.selectedCharacterId];
      const allIssues = this.validateDraft();
      const errors = allIssues.filter((issue) => issue.severity === "error");
      const warnings = allIssues.filter((issue) => issue.severity === "warning");
      const characterOptions = this.draft.characters.map((entry) => `<option value="${escapeHTML(entry.id)}" ${entry.id === this.selectedCharacterId ? "selected" : ""}>${escapeHTML(entry.name)}</option>`).join("");
      const issueList = allIssues.length
        ? allIssues.map((issue) => `<li class="is-${issue.severity}"><strong>${issue.severity === "error" ? "Ошибка" : "Замечание"}</strong><span>${escapeHTML(issue.message)}</span>${issue.characterId && issue.nodeId ? `<button data-open-issue="${escapeHTML(issue.characterId)}|${escapeHTML(issue.nodeId)}">Открыть узел</button>` : ""}</li>`).join("")
        : '<li class="is-clean"><strong>Готово</strong><span>Сломанных переходов и недостижимых узлов не найдено.</span></li>';

      if (!dialogue?.nodes) {
        return `
          ${this.sectionHeader("04 · Граф", "Карта диалогов", "Связи между узлами и диагностика сценария.")}
          <div class="graph-toolbar"><label class="field"><span>Персонаж</span><select id="graph-character">${characterOptions}</select></label></div>
          <div class="validation-summary has-errors"><strong>${errors.length} ошибок</strong><span>У персонажа нет раздела диалогов.</span></div>
          <ul class="validation-list">${issueList}</ul>`;
      }

      const nodeIds = Object.keys(dialogue.nodes);
      const depth = {};
      const queue = [];
      const entryNodes = new Set([dialogue.start, ...(dialogue.startRules || []).map((rule) => rule.node)].filter((nodeId) => dialogue.nodes[nodeId]));
      entryNodes.forEach((nodeId) => { depth[nodeId] = 0; queue.push(nodeId); });
      while (queue.length) {
        const current = queue.shift();
        (dialogue.nodes[current].choices || []).forEach((choice) => {
          if (choice.goto && dialogue.nodes[choice.goto] && depth[choice.goto] === undefined) {
            depth[choice.goto] = depth[current] + 1;
            queue.push(choice.goto);
          }
        });
      }
      const reachableDepths = Object.values(depth);
      const orphanDepth = (reachableDepths.length ? Math.max(...reachableDepths) : -1) + 1;
      const columns = {};
      nodeIds.forEach((nodeId) => {
        const level = depth[nodeId] === undefined ? orphanDepth : depth[nodeId];
        columns[level] = columns[level] || [];
        columns[level].push(nodeId);
      });

      const graphColumns = Object.keys(columns).sort((a, b) => Number(a) - Number(b)).map((level) => `
        <div class="graph-column">
          <p>${Number(level) === orphanDepth && columns[level].some((id) => depth[id] === undefined) ? "Вне маршрута" : `Шаг ${Number(level) + 1}`}</p>
          ${columns[level].map((nodeId) => {
            const node = dialogue.nodes[nodeId];
            const unreachable = depth[nodeId] === undefined;
            const broken = (node.choices || []).some((choice) => choice.goto && !dialogue.nodes[choice.goto]);
            const isEntry = entryNodes.has(nodeId);
            const choiceRows = (node.choices || []).map((choice) => {
              const isBroken = choice.goto && !dialogue.nodes[choice.goto];
              const destination = choice.endConversation ? "конец разговора" : (choice.goto || "нет действия");
              return `<li class="${isBroken ? "is-broken" : ""}"><span>${escapeHTML(choice.text || "Без текста")}</span><b>→ ${escapeHTML(destination)}</b></li>`;
            }).join("");
            return `
              <button class="graph-node ${isEntry ? "is-start" : ""} ${unreachable ? "is-unreachable" : ""} ${broken ? "is-broken" : ""}" data-graph-node="${escapeHTML(nodeId)}" data-open-node="${escapeHTML(nodeId)}">
                <span class="graph-node__flags">${nodeId === dialogue.start ? "СТАРТ" : (isEntry ? "УСЛОВНЫЙ ВХОД" : "")}${unreachable ? " НЕДОСТИЖИМ" : ""}${broken ? " ОШИБКА" : ""}</span>
                <strong>${escapeHTML(nodeId)}</strong>
                <p>${escapeHTML(node.text || "Пустая реплика")}</p>
                <ul>${choiceRows || "<li><span>Нет ответов</span></li>"}</ul>
              </button>`;
          }).join("")}
        </div>`).join("");

      return `
        ${this.sectionHeader("04 · Граф", "Карта диалогов", "Стрелки показывают переходы. Красным отмечены сломанные ссылки, пунктиром — недостижимые узлы.")}
        <div class="graph-toolbar">
          <label class="field"><span>Персонаж</span><select id="graph-character">${characterOptions}</select></label>
          <div class="graph-legend"><span class="legend-start">Старт</span><span class="legend-broken">Ошибка</span><span class="legend-orphan">Недостижим</span></div>
        </div>
        <div class="validation-summary ${errors.length ? "has-errors" : ""}">
          <strong>${errors.length ? `${errors.length} ошибок` : "Переходы целы"}</strong>
          <span>${warnings.length ? `${warnings.length} замечаний требуют внимания.` : "Сценарий не содержит структурных замечаний."}</span>
        </div>
        <div class="graph-scroll">
          <div class="graph-surface">
            <svg class="graph-links" aria-hidden="true"><defs><marker id="graph-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8z"></path></marker></defs></svg>
            <div class="graph-columns">${graphColumns}</div>
          </div>
        </div>
        <details class="validation-details" ${errors.length ? "open" : ""}>
          <summary>Полная проверка · ${errors.length} ошибок · ${warnings.length} замечаний</summary>
          <ul class="validation-list">${issueList}</ul>
        </details>`;
    }

    validateDraft() {
      const issues = [];
      const add = (severity, message, characterId, nodeId) => issues.push({ severity, message, characterId, nodeId });
      const scenario = this.draft || {};
      const characters = Array.isArray(scenario.characters) ? scenario.characters : [];
      const ids = new Set();

      if (!scenario.meta?.title) add("error", "У сценария нет названия.");
      if (!scenario.player?.name) add("error", "У главного игрока нет имени или подписи.");
      if (!Number.isFinite(Number(scenario.settings?.selectionSeconds)) || Number(scenario.settings?.selectionSeconds) < 1) add("error", "Таймер должен быть не меньше одной секунды.");
      if (!Number.isFinite(Number(scenario.settings?.conversationsPerDay)) || Number(scenario.settings?.conversationsPerDay) < 1) add("error", "Количество разговоров должно быть положительным.");
      if (!characters.length) add("error", "Добавьте хотя бы одного персонажа.");
      if (characters.length !== 4) add("warning", "За столом ожидаются пять игроков: главный герой и четверо собеседников.");

      const allEffects = [];
      Object.values(scenario.dialogues || {}).forEach((dialogue) => {
        Object.values(dialogue?.nodes || {}).forEach((node) => {
          (node.choices || []).forEach((choice) => { (choice.effects || []).forEach((effect) => allEffects.push(effect)); });
        });
      });
      (scenario.events || []).forEach((event) => {
        (event.effects || []).forEach((effect) => allEffects.push(effect));
      });
      const knows = (id) => characters.some((character) => character.id === id);
      const trustEffects = allEffects.filter((effect) => effect?.type === "trust");
      const suspicionEffects = allEffects.filter((effect) => effect?.type === "suspicion");
      trustEffects.forEach((effect) => {
        if (!knows(effect.characterId)) {
          add("error", `Эффект доверия ссылается на неизвестного персонажа «${effect.characterId}».`);
        }
      });
      suspicionEffects.forEach((effect) => {
        if (!knows(effect.characterId)) add("error", `Эффект подозрения ссылается на неизвестного персонажа «${effect.characterId}».`);
        if (effect.targetId !== "you" && !knows(effect.targetId)) add("error", `Подозрение направлено на неизвестного игрока «${effect.targetId}».`);
        if (effect.characterId === effect.targetId) add("error", `${effect.characterId} не может подозревать сам себя.`);
      });
      characters.forEach((character) => {
        Object.keys(character.views || {}).forEach((targetId) => {
          if (!knows(targetId)) add("error", `У ${character.name || character.id} в views неизвестный игрок «${targetId}».`, character.id);
          if (targetId === character.id) add("error", `${character.name || character.id} не может подозревать сам себя.`, character.id);
        });
      });
      if (trustEffects.length && !scenario.vote) {
        add("warning", "Есть эффекты доверия, но нет блока vote: день пройдёт по значениям по умолчанию.");
      }
      const anyViews = characters.some((character) => Object.values(character.views || {}).some((value) => Number(value) > 0));
      if (scenario.vote && !anyViews && !suspicionEffects.length) {
        add("warning", "Ни у кого нет подозрений друг к другу (views/suspicion): персонажи будут номинировать только вас.");
      }
      if (trustEffects.length) {
        const gate = Number(scenario.decision?.allyTrust ?? 0);
        characters.forEach((character) => {
          const reachable = Number(character.startingTrust || 0) + trustEffects
            .filter((effect) => effect.characterId === character.id && Number(effect.value) > 0)
            .reduce((sum, effect) => sum + Number(effect.value), 0);
          const required = Number(character.allyTrust ?? gate);
          if (reachable < required) {
            add("warning", `${character.name || character.id} никогда не наберёт доверия для союза (${reachable} < ${required}).`, character.id);
          }
          if (!character.allyHint) {
            add("warning", `У ${character.name || character.id} нет allyHint — подсказка под кнопкой подхода будет пустой.`, character.id);
          }
        });
      }

      const seats = Array.isArray(scenario.table?.seats) ? scenario.table.seats : [];
      if (!seats.length) {
        add("warning", "Не задана рассадка (table.seats). Порядок мест возьмётся из списка персонажей.");
      } else {
        if (!seats.includes("you")) add("error", "В table.seats нет места «you» — игроку негде сидеть.");
        if (new Set(seats).size !== seats.length) add("error", "В table.seats место повторяется.");
        characters.forEach((character) => {
          if (character.id && !seats.includes(character.id)) add("error", `Персонажа «${character.id}» нет в рассадке table.seats.`, character.id);
        });
        seats.forEach((seat) => {
          if (seat !== "you" && !characters.some((character) => character.id === seat)) add("error", `В table.seats указано неизвестное место «${seat}».`);
        });
      }

      characters.forEach((character) => {
        if (!character.id) add("error", "У персонажа отсутствует ID.");
        if (ids.has(character.id)) add("error", `ID персонажа «${character.id}» повторяется.`, character.id);
        ids.add(character.id);
        const dialogue = scenario.dialogues?.[character.id];
        if (!dialogue?.nodes) {
          add("error", `Для персонажа ${character.name || character.id} нет диалогов.`, character.id);
          return;
        }
        const nodes = dialogue.nodes;
        if (!nodes[dialogue.start]) add("error", `Стартовый узел «${dialogue.start || "не задан"}» не найден у ${character.name}.`, character.id, dialogue.start);
        (dialogue.startRules || []).forEach((rule) => {
          if (!nodes[rule.node]) add("error", `Правило старта ведёт в отсутствующий узел «${rule.node}».`, character.id, rule.node);
        });

        const reachable = new Set();
        const queue = [dialogue.start, ...(dialogue.startRules || []).map((rule) => rule.node)].filter((nodeId) => nodes[nodeId]);
        while (queue.length) {
          const nodeId = queue.shift();
          if (reachable.has(nodeId)) continue;
          reachable.add(nodeId);
          (nodes[nodeId]?.choices || []).forEach((choice) => {
            if (choice.goto && nodes[choice.goto] && !reachable.has(choice.goto)) queue.push(choice.goto);
          });
        }

        Object.entries(nodes).forEach(([nodeId, node]) => {
          if (!reachable.has(nodeId)) add("warning", `Узел «${nodeId}» персонажа ${character.name} недостижим от старта.`, character.id, nodeId);
          if (!Array.isArray(node.choices) || !node.choices.length) add("warning", `В узле «${nodeId}» нет вариантов ответа.`, character.id, nodeId);
          (node.choices || []).forEach((choice, index) => {
            if (choice.goto && !nodes[choice.goto]) add("error", `Переход из «${nodeId}», ответ ${index + 1}, ведёт в отсутствующий узел «${choice.goto}».`, character.id, nodeId);
            if (!choice.goto && !choice.endConversation) add("warning", `Ответ ${index + 1} в узле «${nodeId}» не задаёт переход и будет воспринят как конец разговора.`, character.id, nodeId);
          });
        });
      });

      if (!Array.isArray(scenario.endings) || !scenario.endings.length) add("error", "Добавьте хотя бы одну концовку.");
      else if (!scenario.endings.some((ending) => !ending.when || ending.when.length === 0)) add("warning", "Нет запасной концовки без условий.");
      return issues;
    }

    renderEvents() {
      const cards = (this.draft.events || []).map((event, index) => `
        <article class="editor-card">
          <div class="card-title-row"><div><span class="id-chip">${escapeHTML(event.id)}</span><h3>${escapeHTML(event.title || "Скрытое событие")}</h3></div><button class="icon-button danger" data-remove-event="${index}">×</button></div>
          <div class="form-grid">
            <label class="check-field"><input type="checkbox" data-event-field="visible" data-event-index="${index}" ${event.visible ? "checked" : ""}><span>Показывать игроку</span></label>
            <label class="check-field"><input type="checkbox" data-event-field="once" data-event-index="${index}" ${event.once !== false ? "checked" : ""}><span>Только один раз</span></label>
            <label class="field"><span>Заголовок</span><input data-event-field="title" data-event-index="${index}" value="${escapeHTML(event.title || "")}"></label>
            <label class="field field--wide"><span>Видимый текст</span><textarea rows="3" data-event-field="text" data-event-index="${index}">${escapeHTML(event.text || "")}</textarea></label>
            <label class="field field--wide"><span>Текст в отладке для скрытого события</span><textarea rows="2" data-event-field="debugText" data-event-index="${index}">${escapeHTML(event.debugText || "")}</textarea></label>
            <label class="field field--wide"><span>Условия, JSON-массив</span><textarea rows="5" data-event-json="when" data-event-index="${index}">${escapeHTML(jsonValue(event.when || []))}</textarea></label>
            <label class="field field--wide"><span>Эффекты, JSON-массив</span><textarea rows="5" data-event-json="effects" data-event-index="${index}">${escapeHTML(jsonValue(event.effects || []))}</textarea></label>
          </div>
        </article>`).join("");
      return `
        ${this.sectionHeader("05 · События", "Город без игрока", "Видимые события становятся интерлюдиями. Скрытые меняют состояние и видны только в отладке.", '<button class="button button--primary" data-action="add-event">+ Событие</button>')}
        <div class="editor-stack">${cards || '<p class="empty-note">Событий пока нет.</p>'}</div>`;
    }

    renderEndings() {
      const cards = (this.draft.endings || []).map((ending, index) => `
        <article class="editor-card">
          <div class="card-title-row"><div><span class="id-chip">${escapeHTML(ending.id)}</span><h3>${escapeHTML(ending.title || "Без названия")}</h3></div><button class="icon-button danger" data-remove-ending="${index}">×</button></div>
          <div class="form-grid">
            <label class="field"><span>Тон</span><select data-ending-field="tone" data-ending-index="${index}"><option value="victory" ${ending.tone === "victory" ? "selected" : ""}>victory</option><option value="defeat" ${ending.tone === "defeat" ? "selected" : ""}>defeat</option><option value="neutral" ${ending.tone === "neutral" ? "selected" : ""}>neutral</option></select></label>
            <label class="field"><span>Заголовок</span><input data-ending-field="title" data-ending-index="${index}" value="${escapeHTML(ending.title || "")}"></label>
            <label class="field field--wide"><span>Итог</span><textarea rows="3" data-ending-field="text" data-ending-index="${index}">${escapeHTML(ending.text || "")}</textarea></label>
            <label class="field field--wide"><span>Последняя строка</span><input data-ending-field="epilogue" data-ending-index="${index}" value="${escapeHTML(ending.epilogue || "")}"></label>
            <label class="field field--wide"><span>Условия, JSON-массив</span><textarea rows="5" data-ending-json="when" data-ending-index="${index}">${escapeHTML(jsonValue(ending.when || []))}</textarea><small>Первая подходящая концовка срабатывает. Оставьте последнюю без условий как запасную.</small></label>
          </div>
        </article>`).join("");
      return `
        ${this.sectionHeader("06 · Концовки", "Последствия решения", "Личный итог эпизода. Тон victory/defeat — успех или ошибка героя, а не победа команды.", '<button class="button button--primary" data-action="add-ending">+ Концовка</button>')}
        <div class="editor-card"><h3>Последний выбор героя</h3><div class="form-grid">
          ${input("Вопрос", "decision.title", this.draft.decision?.title || "")}
          ${input("Текст кнопок", "decision.actionLabel", this.draft.decision?.actionLabel || "Довериться")}
          ${input("Пояснение", "decision.prompt", this.draft.decision?.prompt || "", { wide: true, type: "textarea" })}
        </div><p class="empty-note">Заявления собеседников и allowNobody доступны на вкладке полного JSON. Условие концовки: {"type":"decision","operator":"equals","value":"max"}.</p></div>
        <div class="editor-stack">${cards || '<p class="empty-note">Концовок пока нет.</p>'}</div>`;
    }

    renderJSON() {
      return `
        ${this.sectionHeader("07 · Полный JSON", "Точный контроль", "Здесь доступны правила старта, публичные заявления и любые поддерживаемые условия.", '<button class="button button--primary" data-action="apply-json">Применить JSON</button>')}
        <div class="json-help"><code>variable</code><code>conversationCount</code><code>spokenTo</code><code>totalConversations</code><code>decision</code></div>
        <textarea class="json-editor" id="full-json" spellcheck="false">${escapeHTML(JSON.stringify(this.draft, null, 2))}</textarea>`;
    }

    bindShell() {
      this.root.querySelector("#editor-library-select")?.addEventListener("change", (event) => {
        const nextIndex = Number(event.target.value);
        if (nextIndex < 0 || nextIndex === this.libraryIndex) return;
        if (!window.confirm("Переключить сценарий? Несохранённые изменения текущего черновика будут потеряны.")) {
          event.target.value = String(this.libraryIndex);
          return;
        }
        this.libraryIndex = nextIndex;
        this.draft = clone(this.library[nextIndex]);
        this.activeTab = "overview";
        this.selectedCharacterId = this.draft.characters[0]?.id;
        this.selectedNodeId = this.draft.dialogues[this.selectedCharacterId]?.start;
        this.render();
      });
      this.root.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => {
        this.activeTab = button.dataset.tab;
        this.render();
      }));
      this.root.querySelector('[data-action="export"]')?.addEventListener("click", () => this.exportJSON());
      this.root.querySelector('[data-action="import"]')?.addEventListener("click", () => this.root.querySelector("#scenario-file")?.click());
      this.root.querySelector("#scenario-file")?.addEventListener("change", (event) => this.importJSON(event.target.files?.[0]));
      this.root.querySelector('[data-action="preview"]')?.addEventListener("click", () => this.preview());

      this.root.querySelectorAll("[data-bind]").forEach((control) => {
        const eventName = control.tagName === "SELECT" ? "change" : "input";
        control.addEventListener(eventName, () => {
          let value = control.value;
          if (control.dataset.valueType === "number") value = Number(value);
          this.setPath(control.dataset.bind, value);
        });
      });
    }

    bindActiveTab() {
      if (this.activeTab === "overview") this.bindOverview();
      if (this.activeTab === "characters") this.bindCharacters();
      if (this.activeTab === "dialogues") this.bindDialogues();
      if (this.activeTab === "graph") this.bindGraph();
      if (this.activeTab === "events") this.bindEvents();
      if (this.activeTab === "endings") this.bindEndings();
      if (this.activeTab === "json") this.bindJSON();
    }

    bindOverview() {
      this.root.querySelector("#suspects-input")?.addEventListener("input", (event) => {
        this.draft.player.startingInformation.suspects = event.target.value.split(",").map((item) => item.trim()).filter(Boolean);
      });
    }

    bindCharacters() {
      this.root.querySelector('[data-action="add-character"]')?.addEventListener("click", () => this.addCharacter());
      this.root.querySelectorAll("[data-remove-character]").forEach((button) => button.addEventListener("click", () => this.removeCharacter(Number(button.dataset.removeCharacter))));
      this.root.querySelectorAll("[data-add-emotion]").forEach((button) => button.addEventListener("click", () => this.addEmotion(Number(button.dataset.addEmotion))));
      this.root.querySelectorAll("[data-sprite-upload]").forEach((inputElement) => inputElement.addEventListener("change", (event) => {
        const [characterIndex, emotion] = inputElement.dataset.spriteUpload.split("|");
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          this.draft.characters[Number(characterIndex)].sprites[emotion] = reader.result;
          this.render();
          this.toast("Изображение встроено в черновик.");
        });
        reader.readAsDataURL(file);
      }));
    }

    bindDialogues() {
      this.root.querySelector("#dialogue-character")?.addEventListener("change", (event) => {
        this.selectedCharacterId = event.target.value;
        this.selectedNodeId = this.draft.dialogues[this.selectedCharacterId].start;
        this.render();
      });
      this.root.querySelector("#dialogue-node")?.addEventListener("change", (event) => {
        this.selectedNodeId = event.target.value;
        this.render();
      });
      this.root.querySelector("#dialogue-start")?.addEventListener("change", (event) => {
        this.currentDialogue().start = event.target.value;
        this.toast("Стартовый узел изменён.");
      });
      this.root.querySelector("#node-speaker")?.addEventListener("change", (event) => this.currentNode().speaker = event.target.value);
      this.root.querySelector('[data-bind="__nodeEmotion"]')?.addEventListener("input", (event) => this.currentNode().emotion = event.target.value);
      this.root.querySelector("#node-text")?.addEventListener("input", (event) => this.currentNode().text = event.target.value);
      this.root.querySelector('[data-action="add-node"]')?.addEventListener("click", () => this.addNode());
      this.root.querySelector('[data-action="remove-node"]')?.addEventListener("click", () => this.removeNode());
      this.root.querySelector('[data-action="add-choice"]')?.addEventListener("click", () => {
        const node = this.currentNode();
        node.choices = node.choices || [];
        node.choices.push({ text: "Новый ответ", endConversation: true, effects: [] });
        this.render();
      });
      this.root.querySelectorAll("[data-choice-field]").forEach((control) => control.addEventListener(control.type === "checkbox" || control.tagName === "SELECT" ? "change" : "input", () => {
        const choice = this.currentNode().choices[Number(control.dataset.choiceIndex)];
        const field = control.dataset.choiceField;
        if (field === "endConversation") choice[field] = control.checked;
        else if (field === "goto") {
          if (control.value) choice.goto = control.value;
          else delete choice.goto;
        } else choice[field] = control.value;
      }));
      this.root.querySelectorAll("[data-choice-json]").forEach((control) => control.addEventListener("change", () => {
        this.updateJSONField(control, (value) => {
          this.currentNode().choices[Number(control.dataset.choiceIndex)][control.dataset.choiceJson] = value;
        });
      }));
      this.root.querySelectorAll("[data-remove-choice]").forEach((button) => button.addEventListener("click", () => {
        this.currentNode().choices.splice(Number(button.dataset.removeChoice), 1);
        this.render();
      }));
      this.root.querySelectorAll("[data-add-effect]").forEach((button) => button.addEventListener("click", () => {
        const choice = this.currentNode().choices[Number(button.dataset.addEffect)];
        choice.effects = choice.effects || [];
        choice.effects.push({ type: "set", key: "newFlag", value: true });
        this.render();
      }));
      this.root.querySelectorAll("[data-effect-field]").forEach((control) => control.addEventListener("change", () => {
        const effect = this.currentNode().choices[Number(control.dataset.choiceIndex)].effects[Number(control.dataset.effectIndex)];
        if (control.dataset.effectField === "value") {
          try { effect.value = JSON.parse(control.value); }
          catch { effect.value = control.value; }
        } else effect[control.dataset.effectField] = control.value;
      }));
      this.root.querySelectorAll("[data-remove-effect]").forEach((button) => button.addEventListener("click", () => {
        const [choiceIndex, effectIndex] = button.dataset.removeEffect.split("|").map(Number);
        this.currentNode().choices[choiceIndex].effects.splice(effectIndex, 1);
        this.render();
      }));
    }

    bindGraph() {
      this.root.querySelector("#graph-character")?.addEventListener("change", (event) => {
        this.selectedCharacterId = event.target.value;
        this.selectedNodeId = this.draft.dialogues?.[this.selectedCharacterId]?.start;
        this.render();
      });
      this.root.querySelectorAll("[data-open-node]").forEach((button) => button.addEventListener("click", () => {
        this.selectedNodeId = button.dataset.openNode;
        this.activeTab = "dialogues";
        this.render();
      }));
      this.root.querySelectorAll("[data-open-issue]").forEach((button) => button.addEventListener("click", () => {
        const [characterId, nodeId] = button.dataset.openIssue.split("|");
        if (!this.draft.dialogues?.[characterId]?.nodes?.[nodeId]) {
          this.toast("Узел отсутствует — исправьте ссылку в полном JSON.", true);
          return;
        }
        this.selectedCharacterId = characterId;
        this.selectedNodeId = nodeId;
        this.activeTab = "dialogues";
        this.render();
      }));
      window.requestAnimationFrame(() => this.drawGraphLinks());
    }

    drawGraphLinks() {
      const surface = this.root.querySelector(".graph-surface");
      const svg = this.root.querySelector(".graph-links");
      const dialogue = this.draft.dialogues?.[this.selectedCharacterId];
      if (!surface || !svg || !dialogue?.nodes) return;
      svg.querySelectorAll(".graph-link").forEach((path) => path.remove());
      const surfaceRect = surface.getBoundingClientRect();
      const width = Math.max(surface.scrollWidth, surface.clientWidth);
      const height = Math.max(surface.scrollHeight, surface.clientHeight);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      const nodeElements = new Map();
      surface.querySelectorAll("[data-graph-node]").forEach((element) => nodeElements.set(element.dataset.graphNode, element));

      Object.entries(dialogue.nodes).forEach(([nodeId, node]) => {
        const source = nodeElements.get(nodeId);
        if (!source) return;
        (node.choices || []).forEach((choice) => {
          if (!choice.goto || !nodeElements.has(choice.goto)) return;
          const target = nodeElements.get(choice.goto);
          const sourceRect = source.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          const x1 = sourceRect.right - surfaceRect.left;
          const y1 = sourceRect.top - surfaceRect.top + sourceRect.height / 2;
          const x2 = targetRect.left - surfaceRect.left;
          const y2 = targetRect.top - surfaceRect.top + targetRect.height / 2;
          let pathData;
          if (x2 > x1 + 20) {
            const bend = Math.max(45, (x2 - x1) * 0.45);
            pathData = `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
          } else {
            const sourceCenter = sourceRect.left - surfaceRect.left + sourceRect.width / 2;
            const targetCenter = targetRect.left - surfaceRect.left + targetRect.width / 2;
            const routeY = Math.max(sourceRect.bottom, targetRect.bottom) - surfaceRect.top + 24;
            pathData = `M ${sourceCenter} ${sourceRect.bottom - surfaceRect.top} C ${sourceCenter} ${routeY}, ${targetCenter} ${routeY}, ${targetCenter} ${targetRect.bottom - surfaceRect.top}`;
          }
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", pathData);
          path.setAttribute("class", "graph-link");
          path.setAttribute("marker-end", "url(#graph-arrow)");
          svg.append(path);
        });
      });
    }

    bindEvents() {
      this.root.querySelector('[data-action="add-event"]')?.addEventListener("click", () => {
        const id = this.uniqueId("event", (this.draft.events || []).map((event) => event.id));
        this.draft.events = this.draft.events || [];
        this.draft.events.push({ id, trigger: "afterConversation", once: true, visible: true, title: "Тем временем", text: "Новое событие.", when: [], effects: [] });
        this.render();
      });
      this.root.querySelectorAll("[data-remove-event]").forEach((button) => button.addEventListener("click", () => {
        this.draft.events.splice(Number(button.dataset.removeEvent), 1);
        this.render();
      }));
      this.root.querySelectorAll("[data-event-field]").forEach((control) => control.addEventListener(control.type === "checkbox" ? "change" : "input", () => {
        const event = this.draft.events[Number(control.dataset.eventIndex)];
        event[control.dataset.eventField] = control.type === "checkbox" ? control.checked : control.value;
      }));
      this.root.querySelectorAll("[data-event-json]").forEach((control) => control.addEventListener("change", () => {
        this.updateJSONField(control, (value) => this.draft.events[Number(control.dataset.eventIndex)][control.dataset.eventJson] = value);
      }));
    }

    bindEndings() {
      this.root.querySelector('[data-action="add-ending"]')?.addEventListener("click", () => {
        const id = this.uniqueId("ending", (this.draft.endings || []).map((ending) => ending.id));
        this.draft.endings = this.draft.endings || [];
        this.draft.endings.push({ id, tone: "neutral", title: "Новая концовка", text: "Что произошло?", epilogue: "", when: [] });
        this.render();
      });
      this.root.querySelectorAll("[data-remove-ending]").forEach((button) => button.addEventListener("click", () => {
        this.draft.endings.splice(Number(button.dataset.removeEnding), 1);
        this.render();
      }));
      this.root.querySelectorAll("[data-ending-field]").forEach((control) => control.addEventListener(control.tagName === "SELECT" ? "change" : "input", () => {
        this.draft.endings[Number(control.dataset.endingIndex)][control.dataset.endingField] = control.value;
      }));
      this.root.querySelectorAll("[data-ending-json]").forEach((control) => control.addEventListener("change", () => {
        this.updateJSONField(control, (value) => this.draft.endings[Number(control.dataset.endingIndex)][control.dataset.endingJson] = value);
      }));
    }

    bindJSON() {
      this.root.querySelector('[data-action="apply-json"]')?.addEventListener("click", () => {
        try {
          const next = JSON.parse(this.root.querySelector("#full-json").value);
          new window.VNEngine(next);
          this.draft = next;
          this.libraryIndex = -1;
          this.selectedCharacterId = next.characters[0].id;
          this.selectedNodeId = next.dialogues[this.selectedCharacterId].start;
          this.render();
          this.toast("JSON применён.");
        } catch (error) {
          this.toast(`Не удалось применить: ${error.message}`, true);
        }
      });
    }

    currentDialogue() {
      return this.draft.dialogues[this.selectedCharacterId];
    }

    currentNode() {
      return this.currentDialogue().nodes[this.selectedNodeId];
    }

    setPath(path, value) {
      if (path === "__nodeEmotion") return;
      const keys = path.split(".");
      let cursor = this.draft;
      keys.slice(0, -1).forEach((key) => {
        if (cursor[key] === undefined) cursor[key] = {};
        cursor = cursor[key];
      });
      cursor[keys.at(-1)] = value;
    }

    addCharacter() {
      const ids = this.draft.characters.map((character) => character.id);
      const id = this.uniqueId("character", ids);
      this.draft.characters.push({ id, name: "Новый житель", tagline: "Короткая характеристика", sprites: { neutral: "" } });
      this.draft.dialogues[id] = {
        start: `${id}_start`,
        startRules: [],
        nodes: {
          [`${id}_start`]: {
            speaker: id,
            emotion: "neutral",
            text: "Первая реплика нового персонажа.",
            choices: [{ text: "Закончить разговор", endConversation: true, effects: [] }]
          }
        }
      };
      this.selectedCharacterId = id;
      this.selectedNodeId = `${id}_start`;
      this.render();
    }

    removeCharacter(index) {
      if (this.draft.characters.length <= 1) return this.toast("В сценарии должен остаться хотя бы один персонаж.", true);
      const character = this.draft.characters[index];
      if (!window.confirm(`Удалить персонажа «${character.name}» и его диалоги?`)) return;
      this.draft.characters.splice(index, 1);
      delete this.draft.dialogues[character.id];
      if (this.draft.decision?.statements) this.draft.decision.statements = this.draft.decision.statements.filter((item) => item.characterId !== character.id);
      if (this.draft.reveal) this.draft.reveal = this.draft.reveal.filter((item) => item.characterId !== character.id);
      this.selectedCharacterId = this.draft.characters[0].id;
      this.selectedNodeId = this.draft.dialogues[this.selectedCharacterId].start;
      this.render();
    }

    addEmotion(characterIndex) {
      const emotion = window.prompt("ID эмоции (например, surprised):", "surprised")?.trim();
      if (!emotion) return;
      const character = this.draft.characters[characterIndex];
      if (character.sprites[emotion] !== undefined) return this.toast("Такая эмоция уже существует.", true);
      character.sprites[emotion] = character.sprites.neutral || "";
      this.render();
    }

    addNode() {
      const dialogue = this.currentDialogue();
      const suggested = this.uniqueId(`${this.selectedCharacterId}_node`, Object.keys(dialogue.nodes));
      const id = window.prompt("Уникальный ID узла:", suggested)?.trim();
      if (!id) return;
      if (dialogue.nodes[id]) return this.toast("Узел с таким ID уже существует.", true);
      dialogue.nodes[id] = { speaker: this.selectedCharacterId, emotion: "neutral", text: "Новая реплика.", choices: [{ text: "Закончить разговор", endConversation: true, effects: [] }] };
      this.selectedNodeId = id;
      this.render();
    }

    removeNode() {
      const dialogue = this.currentDialogue();
      const ids = Object.keys(dialogue.nodes);
      if (ids.length <= 1) return this.toast("Нельзя удалить единственный узел.", true);
      if (!window.confirm(`Удалить узел «${this.selectedNodeId}»?`)) return;
      const removed = this.selectedNodeId;
      const fallback = ids.find((id) => id !== removed);
      delete dialogue.nodes[removed];
      if (dialogue.start === removed) dialogue.start = fallback;
      (dialogue.startRules || []).forEach((rule) => { if (rule.node === removed) rule.node = fallback; });
      Object.values(dialogue.nodes).forEach((node) => (node.choices || []).forEach((choice) => { if (choice.goto === removed) choice.goto = fallback; }));
      this.selectedNodeId = fallback;
      this.render();
    }

    uniqueId(prefix, used) {
      let index = 1;
      let result = `${prefix}-${index}`;
      while (used.includes(result)) result = `${prefix}-${++index}`;
      return result;
    }

    updateJSONField(control, apply) {
      try {
        const value = JSON.parse(control.value || "[]");
        if (!Array.isArray(value)) throw new Error("Ожидается массив");
        apply(value);
        control.classList.remove("is-invalid");
        this.toast("JSON-поле обновлено.");
      } catch (error) {
        control.classList.add("is-invalid");
        this.toast(`Ошибка JSON: ${error.message}`, true);
      }
    }

    exportJSON() {
      try {
        new window.VNEngine(this.draft);
        const blob = new Blob([JSON.stringify(this.draft, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${this.draft.meta?.id || "scenario"}.json`;
        document.body.append(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        this.toast("Сценарий экспортирован.");
      } catch (error) {
        this.toast(`Экспорт остановлен: ${error.message}`, true);
      }
    }

    importJSON(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        try {
          const parsed = JSON.parse(reader.result);
          new window.VNEngine(parsed);
          this.draft = parsed;
          this.libraryIndex = -1;
          this.activeTab = "overview";
          this.selectedCharacterId = parsed.characters[0].id;
          this.selectedNodeId = parsed.dialogues[this.selectedCharacterId].start;
          this.render();
          this.toast("Сценарий импортирован.");
        } catch (error) {
          this.toast(`Импорт не удался: ${error.message}`, true);
        }
      });
      reader.readAsText(file);
    }

    preview() {
      try {
        new window.VNEngine(this.draft);
        const previewRoot = document.querySelector("#preview-app");
        this.root.classList.add("is-hidden");
        previewRoot.classList.remove("is-hidden");
        this.previewApp = window.GameApp.mount(previewRoot, clone(this.draft), {
          autoStart: true,
          debug: true,
          preview: true,
          onExit: () => {
            this.previewApp?.destroy();
            previewRoot.classList.add("is-hidden");
            this.root.classList.remove("is-hidden");
          }
        });
      } catch (error) {
        this.toast(`Предпросмотр недоступен: ${error.message}`, true);
      }
    }

    toast(message, isError) {
      const toast = this.root.querySelector("#editor-toast");
      if (!toast) return;
      toast.textContent = message;
      toast.classList.toggle("is-error", Boolean(isError));
      toast.classList.add("is-visible");
      window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
    }
  }

  window.ScenarioEditor = ScenarioEditor;

  if (document.body?.dataset.page === "editor") {
    window.scenarioEditor = new ScenarioEditor(document.querySelector("#editor-app"));
  }
})();
