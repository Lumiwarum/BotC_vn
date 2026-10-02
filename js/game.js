(function () {
  "use strict";

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Role names carry the whole game for someone who has never played, so every
  // mention becomes a hover explanation. Built once from the shared glossary.
  const roleMatcher = (function () {
    const glossary = Array.isArray(window.BOTC_ROLES) ? window.BOTC_ROLES : [];
    if (!glossary.length) return null;
    const byStem = new Map(glossary.map((role) => [role.stem, role]));
    // Team words also turn up mid-sentence in lower case; role names never do.
    const sources = glossary.slice()
      .sort((a, b) => b.stem.length - a.stem.length)
      .map((role) => role.matchLower
        ? `[${role.stem[0]}${role.stem[0].toLowerCase()}]${role.stem.slice(1)}`
        : role.stem);
    const pattern = new RegExp(`(?<![А-Яа-яЁё])(${sources.join("|")})([а-яё]{0,3})(?![А-Яа-яЁё])`, "g");
    const lookup = (stem) => byStem.get(stem) || byStem.get(stem[0].toUpperCase() + stem.slice(1));
    return { pattern, lookup };
  })();

  // Wrap the first mention of each role in a piece of text; later repeats stay plain
  // so a paragraph does not turn into a wall of dotted underlines.
  function annotateRoles(escaped, focusable) {
    if (!roleMatcher) return escaped;
    const seen = new Set();
    return escaped.replace(roleMatcher.pattern, (match, stem) => {
      const role = roleMatcher.lookup(stem);
      if (!role || seen.has(role.name)) return match;
      seen.add(role.name);
      const icon = role.icon
        ? `<img class="role-tip__icon" src="${escapeHTML(role.icon)}" alt="" data-portrait-image>`
        : "";
      return `<span class="role-term"${focusable ? ' tabindex="0"' : ""}>${match}<span class="role-tip" role="tooltip">` +
        `${icon}<span class="role-tip__body"><b>${escapeHTML(role.name)}</b><i>${escapeHTML(role.kind)}</i>` +
        `<em>${escapeHTML(role.ability)}</em></span></span></span>`;
    });
  }

  // Use for narrative text the player reads; escapeHTML alone stays for attributes.
  function richText(value) {
    return annotateRoles(escapeHTML(value), true);
  }

  // Same, but inside a button or link, where a second focusable element would trap
  // the keyboard: the tooltip stays available on hover.
  function richLabel(value) {
    return annotateRoles(escapeHTML(value), false);
  }

  function portraitMarkup(character, source, modifier) {
    const initials = (character?.name || "?").split(/\s+/).map((part) => part[0]).join("").slice(0, 2);
    const image = source
      ? `<img src="${escapeHTML(source)}" alt="Портрет: ${escapeHTML(character?.name)}" data-portrait-image>`
      : "";
    return `
      <span class="portrait-frame ${modifier || ""}" aria-hidden="true">
        <span class="portrait-fallback">${escapeHTML(initials)}</span>
        ${image}
      </span>`;
  }

  function seatPositions(count) {
    return Array.from({ length: count }, (_, index) => {
      const angle = ((90 + (index * 360) / count) * Math.PI) / 180;
      return { x: 50 + 38 * Math.cos(angle), y: 50 + 34 * Math.sin(angle) };
    });
  }

  function seatMapMarkup(engine, modifier) {
    const scenario = engine.scenario;
    const order = engine.seatOrder();
    if (order.length < 2) return "";
    const positions = seatPositions(order.length);
    const player = scenario.player || {};
    const table = scenario.table || {};
    const seats = order.map((id, index) => {
      const isPlayer = id === "you";
      const character = (scenario.characters || []).find((item) => item.id === id);
      const name = isPlayer ? (player.name || "Вы") : (character?.name || id);
      const isNeighbour = !isPlayer && (index === 1 || index === order.length - 1);
      const caption = isPlayer ? (player.roleName || "") : (!engine.isAlive(id) ? "мёртв" : (isNeighbour ? "сосед" : ""));
      const number = engine.seatNumber(id);
      return `<li class="seat ${isPlayer ? "is-player" : ""} ${isNeighbour ? "is-neighbour" : ""} ${!engine.isAlive(id) ? "is-dead" : ""}" style="left:${positions[index].x.toFixed(1)}%;top:${positions[index].y.toFixed(1)}%">
        ${number ? `<i class="seat__number" aria-hidden="true">${number}</i>` : ""}
        <span class="seat__name">${escapeHTML(name)}</span>
        ${caption ? `<small>${escapeHTML(caption)}</small>` : ""}
      </li>`;
    }).join("");
    return `<figure class="seat-map ${modifier || ""}">
      <div class="seat-map__board">
        <div class="seat-map__surface" aria-hidden="true"><span>${escapeHTML(table.label || `Стол на ${order.length}`)}</span></div>
        <ul class="seat-map__seats" aria-label="${escapeHTML(table.label || "Рассадка за столом")}">${seats}</ul>
      </div>
      ${table.note ? `<figcaption>${richText(table.note)}</figcaption>` : ""}
    </figure>`;
  }

  // The landing clock: a clocktower face stopped a few minutes before midnight.
  function clockMarkup() {
    const point = (angle, radius) => {
      const rad = ((angle - 90) * Math.PI) / 180;
      return [(100 + radius * Math.cos(rad)).toFixed(2), (100 + radius * Math.sin(rad)).toFixed(2)];
    };
    const ticks = Array.from({ length: 60 }, (_, index) => {
      const hour = index % 5 === 0;
      const [x1, y1] = point(index * 6, hour ? 75 : 79);
      const [x2, y2] = point(index * 6, 84);
      return `<line class="${hour ? "clock-face__hour-tick" : "clock-face__tick"}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }).join("");
    const numerals = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"].map((numeral, index) => {
      const [x, y] = point(index * 30, 63);
      return `<text x="${x}" y="${y}" transform="rotate(${index * 30} ${x} ${y})">${numeral}</text>`;
    }).join("");
    return `<div class="clock-sigil" aria-hidden="true">
      <svg viewBox="0 0 200 200" focusable="false">
        <circle class="clock-face__bezel" cx="100" cy="100" r="97"/>
        <circle class="clock-face__dial" cx="100" cy="100" r="89"/>
        <circle class="clock-face__ring" cx="100" cy="100" r="85"/>
        <circle class="clock-face__ring" cx="100" cy="100" r="74"/>
        ${ticks}
        <g class="clock-face__numerals">${numerals}</g>
        <circle class="clock-face__inner" cx="100" cy="100" r="46"/>
        <path class="clock-face__rose" d="M100 62 L106 94 L138 100 L106 106 L100 138 L94 106 L62 100 L94 94 Z"/>
        <g class="clock-face__hand" transform="rotate(-3 100 100)">
          <path d="M98.4 112 L98.4 78 Q92 70 100 58 Q108 70 101.6 78 L101.6 112 Z"/>
          <circle class="clock-face__cut" cx="100" cy="70" r="3.2"/>
        </g>
        <g class="clock-face__hand" transform="rotate(-25 100 100)">
          <path d="M99 116 L99 44 Q95 38 100 26 Q105 38 101 44 L101 116 Z"/>
          <circle class="clock-face__cut" cx="100" cy="42" r="2.4"/>
        </g>
        <g class="clock-face__second"><line x1="100" y1="120" x2="100" y2="24"/><circle cx="100" cy="116" r="3"/></g>
        <circle class="clock-face__boss" cx="100" cy="100" r="5"/>
        <circle class="clock-face__pin" cx="100" cy="100" r="1.8"/>
      </svg>
    </div>`;
  }

  // Number tokens the Storyteller lays beside the role token, in palm coordinates.
  // Measured on assets/night/storyteller-palm-close.jpg (840×560): every spot sits inside the palm.
  const NUMBER_TOKEN_SPOTS = [
    { left: 50.6, top: 58.9, rotate: -6 },
    { left: 61.9, top: 56.3, rotate: 5 },
    { left: 39.6, top: 27.1, rotate: -3 }
  ];

  function trustWord(trust, required) {
    if (trust >= required + 2) return "доверяет";
    if (trust >= required) return "готов играть вместе";
    if (trust >= required - 1) return "почти доверяет";
    if (trust <= -2) return "не доверяет";
    return "насторожен";
  }

  function trustMeterMarkup(trust, range) {
    const span = Math.max(1, range.max - range.min);
    const filled = Math.max(0, Math.min(1, (trust - range.min) / span));
    return `<span class="trust-meter ${trust < 0 ? "is-low" : ""}" aria-hidden="true"><i style="width:${(filled * 100).toFixed(0)}%"></i></span>`;
  }

  function oddsWord(odds) {
    if (odds.hopeless) return "откажет и не станет молчать";
    if (odds.chance >= 0.85) return "почти наверняка согласится";
    if (odds.chance >= 0.5) return "скорее согласится";
    if (odds.chance >= 0.25) return "может отказать";
    return "почти наверняка откажет";
  }

  function plural(count, one, few, many) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }

  // What the table would do if you named this person right now.
  function handsWord(hands, majority, blockVotes) {
    if (hands >= majority && hands > blockVotes) return `рук хватит: ${hands}`;
    if (hands >= majority) return `${hands} — не перебить плаху`;
    if (hands === majority - 1) return "не хватит одной руки";
    return "стол не поддержит";
  }

  // Suspects are character ids; older drafts stored plain names, which still render
  // (without a number, because there is no seat to look up).
  function resolveSuspects(engine, entries) {
    return (entries || []).map((entry) => {
      const character = engine.getCharacter(entry);
      return {
        name: character ? character.name : String(entry),
        number: character ? engine.seatNumber(character.id) : null
      };
    });
  }

  class GameApp {
    constructor(root, scenario, options) {
      this.root = root;
      this.options = Object.assign({ autoStart: false, debug: false, preview: false, onExit: null }, options || {});
      this.debug = Boolean(this.options.debug);
      this.landingDebug = false;
      this.timerId = null;
      this.deadline = null;
      this.approachNote = "";
      this.scenarioLibrary = Array.isArray(scenario) ? scenario : [scenario];
      this.selectedScenarioIndex = 0;
      this.randomSelectionIndex = null;
      this.rollTimers = [];
      this.currentScreen = null;
      this.onKeydown = (event) => this.handleChoiceKey(event);
      document.addEventListener("keydown", this.onKeydown);
      this.engine = new window.VNEngine(this.scenarioLibrary[0]);
      if (this.options.autoStart) this.renderRole();
      else this.renderLanding();
    }

    destroy() {
      this.clearTimer();
      this.stopRoll();
      document.removeEventListener("keydown", this.onKeydown);
      this.root.innerHTML = "";
    }

    frame(content, screenClass) {
      this.stopRoll();
      // A new screen starts at its top; re-rendering the same screen keeps the scroll.
      if (screenClass !== this.currentScreen) window.scrollTo(0, 0);
      this.currentScreen = screenClass;
      this.root.innerHTML = `
        <div class="game-frame ${screenClass || ""}">
          <div class="night-backdrop" aria-hidden="true"></div>
          <div class="ambient-grain" aria-hidden="true"></div>
          ${this.options.preview ? '<div class="preview-ribbon">Предпросмотр черновика</div>' : ""}
          ${content}
          ${this.options.preview ? '<button class="button button--quiet preview-exit" data-action="exit-preview">← В редактор</button>' : ""}
        </div>`;
      this.bindSharedControls();
      this.bindImageFallbacks();
      this.appendDebugPanel();
    }

    renderLanding() {
      this.clearTimer();
      const selectedScenario = this.scenarioLibrary[this.selectedScenarioIndex];
      const meta = selectedScenario.meta;
      const hasLibrary = this.scenarioLibrary.length > 1;
      const scenarioCards = hasLibrary ? `
        <div class="scenario-selector" aria-label="Выбор сценария">
          ${this.scenarioLibrary.map((scenario, index) => `
            <button class="scenario-option ${index === this.selectedScenarioIndex ? "is-selected" : ""} ${index === this.randomSelectionIndex ? "is-random" : ""}" data-select-scenario="${index}" aria-pressed="${index === this.selectedScenarioIndex}">
              <span>${escapeHTML(scenario.meta?.menuLabel || `Сценарий ${index + 1}`)}</span>
              <strong>${escapeHTML(scenario.meta?.title || "Без названия")}</strong>
              <p>${richLabel(scenario.meta?.synopsis || scenario.meta?.subtitle || "")}</p>
              <small>${escapeHTML(scenario.meta?.duration || "5–7 минут")}</small>
            </button>`).join("")}
        </div>
        <button class="random-scenario-button" data-action="random-scenario">
          <span aria-hidden="true">⚄</span> Выбрать случайный сценарий
        </button>` : "";
      this.frame(`
        <section class="screen start-screen">
          <div class="curtain curtain--left" aria-hidden="true"></div>
          <div class="curtain curtain--right" aria-hidden="true"></div>
          <div class="start-card">
            <p class="eyebrow">Интерактивная история клуба</p>
            ${clockMarkup()}
            <h1>${escapeHTML(hasLibrary ? "Город шепчет" : meta.title)}</h1>
            <p class="start-subtitle">${escapeHTML(hasLibrary ? "Короткие истории о доверии, лжи и нехватке времени." : (meta.subtitle || ""))}</p>
            ${scenarioCards}
            <p class="start-premise">За столом пять игроков: вы и четверо собеседников. Три разговора, чтобы решить, кому довериться.</p>
            <div class="start-actions">
              <button class="button button--primary button--large" data-action="start">Играть: ${escapeHTML(meta.title)}</button>
              <a class="button button--secondary" href="editor.html">Редактор сценария</a>
            </div>
            <label class="debug-toggle">
              <input type="checkbox" id="debug-mode" ${this.landingDebug ? "checked" : ""}>
              <span>Режим отладки</span>
            </label>
          </div>
        </section>`, "screen-start");

      this.root.querySelector('[data-action="start"]')?.addEventListener("click", () => {
        this.debug = Boolean(this.root.querySelector("#debug-mode")?.checked);
        this.engine.loadScenario(selectedScenario);
        this.renderRole();
      });
      this.root.querySelectorAll("[data-select-scenario]").forEach((button) => {
        button.addEventListener("click", () => {
          this.landingDebug = Boolean(this.root.querySelector("#debug-mode")?.checked);
          this.selectedScenarioIndex = Number(button.dataset.selectScenario);
          this.randomSelectionIndex = null;
          this.renderLanding();
        });
      });
      this.root.querySelector('[data-action="random-scenario"]')?.addEventListener("click", () => {
        this.landingDebug = Boolean(this.root.querySelector("#debug-mode")?.checked);
        // Any story can come up, the current one included; the roll shows the button worked.
        const previous = this.selectedScenarioIndex;
        this.selectedScenarioIndex = Math.floor(Math.random() * this.scenarioLibrary.length);
        this.randomSelectionIndex = this.selectedScenarioIndex;
        this.renderLanding();
        this.playRoll(previous, this.selectedScenarioIndex);
      });
    }

    // Light the cards one after another and stop on the drawn one. State is already
    // final, so clicking «Играть» mid-roll starts the drawn story.
    playRoll(from, to) {
      const cards = Array.from(this.root.querySelectorAll("[data-select-scenario]"));
      const selector = this.root.querySelector(".scenario-selector");
      const dice = this.root.querySelector('[data-action="random-scenario"]');
      if (!cards.length || !selector) return;
      const count = cards.length;
      const steps = count * 2 + ((to - from + count) % count || count);
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const land = () => {
        selector.classList.remove("is-rolling");
        cards.forEach((card) => card.classList.remove("is-roll-hit"));
        cards[to].classList.add("is-landed");
        dice?.classList.remove("is-rolling");
        this.root.querySelector('[data-action="start"]')?.focus({ preventScroll: true });
      };
      if (reduced) return land();
      selector.classList.add("is-rolling");
      dice?.classList.add("is-rolling");
      let delay = 0;
      for (let step = 1; step <= steps; step += 1) {
        delay += 45 + step * step * 2.2;
        const index = (from + step) % count;
        this.rollTimers.push(window.setTimeout(() => {
          cards.forEach((card, cardIndex) => card.classList.toggle("is-roll-hit", cardIndex === index));
          if (step === steps) land();
        }, delay));
      }
    }

    stopRoll() {
      this.rollTimers.forEach((id) => window.clearTimeout(id));
      this.rollTimers = [];
    }

    renderRole() {
      this.clearTimer();
      const player = this.engine.scenario.player || {};
      const information = player.startingInformation || {};
      const suspects = resolveSuspects(this.engine, information.suspects);
      const suspectPair = suspects
        .map((item) => `<span>${item.number ? `<i>${item.number}</i>` : ""}${escapeHTML(item.name)}</span>`)
        .join('<b aria-hidden="true">или</b>');
      const playerNumber = this.engine.seatNumber("you");
      const nightVisual = this.engine.scenario.nightVisual || {};
      const hasNightVision = Boolean(nightVisual.handImage && information.roleIcon);
      const roleIcon = player.roleIconImage
        ? `<img src="${escapeHTML(player.roleIconImage)}" alt="" data-portrait-image>`
        : escapeHTML(player.roleIcon || "✦");
      const vision = hasNightVision ? `
        <div class="night-vision" aria-label="Ведущий показывает жетон роли ${escapeHTML(information.roleName || "")}${suspects.length ? ` и номера игроков: ${suspects.map((item) => `${item.number || "?"} ${item.name}`).join(", ")}` : ""}">
          <p>${richText(nightVisual.caption || "Рассказчик показывает жетон роли и номера игроков, которых он касается.")}</p>
          <div class="night-photo">
            <img class="night-hand" src="${escapeHTML(nightVisual.handImage)}" alt="Открытая ладонь ведущего с жетоном роли" data-portrait-image>
            <div class="shown-token">
              <img src="${escapeHTML(information.roleIcon)}" alt="${escapeHTML(information.roleName || "Жетон роли")}" data-portrait-image>
              <span>${escapeHTML(information.roleName || "")}</span>
            </div>
            ${suspects.map((item, index) => {
              const spot = NUMBER_TOKEN_SPOTS[index] || NUMBER_TOKEN_SPOTS[NUMBER_TOKEN_SPOTS.length - 1];
              if (!item.number) return "";
              return `<div class="number-token" style="left:${spot.left}%;top:${spot.top}%;--token-rotate:${spot.rotate}deg" aria-hidden="true">${item.number}</div>`;
            }).join("")}
          </div>
          ${suspects.length ? `<div class="night-name-tags">
            ${suspects.map((item) => `<span>${item.number ? `<i>${item.number}</i>` : ""}${escapeHTML(item.name)}</span>`).join('<i aria-hidden="true">?</i>')}
          </div>` : ""}
        </div>` : "";
      this.frame(`
        <section class="screen role-screen">
          <div class="role-card ${hasNightVision ? "role-card--visual" : ""}">
            <div class="role-card__layout">
              ${vision}
              <div class="role-card__copy">
                <p class="eyebrow">${escapeHTML(player.phaseLabel || "Первая ночь")}</p>
                <div class="role-icon" aria-hidden="true">${roleIcon}</div>
                <p class="role-prefix">Ваша роль${playerNumber ? ` · вы игрок №${playerNumber}` : ""}</p>
                <h1>${richText(player.roleName || "Неизвестная роль")}</h1>
                <p class="team-badge ${player.team === "Зло" ? "team-badge--evil" : ""}">${escapeHTML(player.team || "")}</p>
                <p class="role-description">${richText(player.description || "")}</p>
                ${player.task ? `<p class="role-task"><b>Ваша задача</b>${richText(player.task.replace(/^Ваша задача:\s*/, ""))}</p>` : ""}
                <div class="night-information">
                  <p class="eyebrow">${escapeHTML(information.label || "Информация")}</p>
                  <p>${richText(information.text || "")}</p>
                  ${suspectPair ? `<div class="suspect-pair">${suspectPair}</div>` : ""}
                  ${information.hint ? `<small>${richText(information.hint)}</small>` : ""}
                </div>
                ${seatMapMarkup(this.engine, "seat-map--role")}
${player.setupNote ? `<details class="setup-note"><summary>Почему так устроена эта партия?</summary><p>${richText(player.setupNote)}</p></details>` : ""}
                <button class="button button--primary button--large" data-action="wake">Проснуться</button>
              </div>
            </div>
            
          </div>
        </section>`, "screen-role");
      this.root.querySelector('[data-action="wake"]')?.addEventListener("click", () => {
        this.engine.wakeUp();
        this.renderTown();
      });
    }

    renderTown() {
      this.clearTimer();
      const scenario = this.engine.scenario;
      const state = this.engine.state;
      const player = scenario.player || {};
      const featuredPlayers = scenario.characters.length + 1;
      const playerRoleIcon = player.roleIconImage
        ? `<img src="${escapeHTML(player.roleIconImage)}" alt="" data-portrait-image>`
        : `<span aria-hidden="true">${escapeHTML(player.roleIcon || "✦")}</span>`;
      const seated = this.engine.seatOrder().slice(1);
      const characterButtons = seated.map((id, index) => {
        const character = this.engine.getCharacter(id);
        if (!character) return "";
        const count = state.conversationCounts[character.id] || 0;
        const status = count > 0 ? `Разговоров: ${count}` : (this.engine.isAlive(character.id) ? "Ещё не говорили" : (this.engine.hasGhostVotes() ? "Мёртв · последний голос" : "Мёртв · голос потрачен"));
        const sprite = this.engine.getSprite(character.id, "neutral");
        const isNeighbour = index === 0 || index === seated.length - 1;
        return `
          <button class="town-character town-character--${index} ${isNeighbour ? "is-neighbour" : ""} ${this.engine.isAlive(character.id) ? "" : "is-dead"}" data-character="${escapeHTML(character.id)}" aria-label="Поговорить: ${escapeHTML(character.name)}${this.engine.isAlive(character.id) ? "" : ", мёртвый игрок"}${isNeighbour ? ", ваш сосед за столом" : ""}">
            ${portraitMarkup(character, sprite, "portrait-frame--town")}
            <span class="town-character__copy">
              <strong>${this.engine.seatNumber(character.id) ? `<i class="seat-number">${this.engine.seatNumber(character.id)}</i>` : ""}${escapeHTML(character.name)}${this.engine.isAlive(character.id) ? (isNeighbour ? '<i class="seat-tag">сосед</i>' : "") : '<i class="seat-tag">мёртв</i>'}</strong>
              <small>${escapeHTML(character.tagline || status)}</small>
              <em class="spoken-status ${count ? "is-spoken" : ""}">${escapeHTML(status)}</em>
              ${(() => {
                const trust = this.engine.trustOf(character.id);
                const start = Number(character.startingTrust || 0);
                if (trust === start) return "";
                return `<em class="trust-drift ${trust > start ? "is-up" : "is-down"}">${trust > start ? "↑" : "↓"} доверие</em>`;
              })()}
            </span>
          </button>`;
      }).join("");

      this.frame(`
        <section class="screen town-screen">
          <header class="town-header">
            <div>
              <p class="eyebrow">День ${state.dayNumber} · за столом ${featuredPlayers} игроков, живых ${this.engine.livingIds().length}</p>
              <h1>С кем говорить?</h1>
            </div>
            <div class="conversation-counter"><strong>${state.conversationsRemaining}</strong><span>разговора<br>осталось</span></div>
          </header>
          <div class="town-stage character-count-${scenario.characters.length}">
            <div class="town-table" aria-label="Стол на ${featuredPlayers} игроков, включая вас">
              <span>${escapeHTML(scenario.table?.label || "Стол на пять игроков")}</span>
              <div class="town-player-seat">
                <span class="town-player-seat__icon">${playerRoleIcon}</span>
                <span><strong>${this.engine.seatNumber("you") ? `<i class="seat-number">${this.engine.seatNumber("you")}</i>` : ""}${escapeHTML(player.name || "Вы")}</strong><small>${escapeHTML(player.roleName || "Игрок")}</small></span>
              </div>
            </div>
            ${characterButtons}
            <div class="choice-timer" aria-label="Осталось времени на выбор">
              <div class="choice-timer__top"><span>До выбора</span><strong id="timer-number">${Number(scenario.settings?.selectionSeconds || 10)}</strong></div>
              <div class="choice-timer__track"><i id="timer-fill"></i></div>
            </div>
          </div>
          <p class="town-hint">${escapeHTML(scenario.table?.note || "")} Пока вы говорите с одним человеком, остальные не стоят на месте.</p>
        </section>`, "screen-town");

      this.root.querySelectorAll("[data-character]").forEach((button) => {
        button.addEventListener("click", () => this.selectCharacter(button.dataset.character, false));
      });
      this.startTimer();
    }

    startTimer() {
      const seconds = Math.max(1, Number(this.engine.scenario.settings?.selectionSeconds || 10));
      this.deadline = Date.now() + seconds * 1000;
      const tick = () => {
        const remainingMs = Math.max(0, this.deadline - Date.now());
        const remaining = Math.ceil(remainingMs / 1000);
        const number = this.root.querySelector("#timer-number");
        const fill = this.root.querySelector("#timer-fill");
        const timer = this.root.querySelector(".choice-timer");
        if (number) number.textContent = String(remaining);
        if (fill) fill.style.width = `${(remainingMs / (seconds * 1000)) * 100}%`;
        if (timer) timer.classList.toggle("is-urgent", remaining <= 3);
        if (remainingMs <= 0) {
          this.clearTimer();
          const fallback = this.engine.scenario.settings?.fallback || {};
          const fallbackId = this.engine.getCharacter(fallback.characterId)
            ? fallback.characterId
            : this.engine.scenario.characters[0].id;
          this.approachNote = fallback.text || `${this.engine.getCharacter(fallbackId).name} сам начинает разговор.`;
          this.selectCharacter(fallbackId, true);
        }
      };
      tick();
      this.timerId = window.setInterval(tick, 100);
    }

    clearTimer() {
      if (this.timerId) window.clearInterval(this.timerId);
      this.timerId = null;
      this.deadline = null;
    }

    selectCharacter(characterId, forced) {
      this.clearTimer();
      if (!forced) this.approachNote = "";
      const node = this.engine.startConversation(characterId);
      if (node) this.renderDialogue();
    }

    renderDialogue() {
      this.clearTimer();
      const state = this.engine.state;
      const node = this.engine.getCurrentNode();
      const conversationCharacter = this.engine.getCharacter(state.currentCharacterId);
      const speakerCharacter = this.engine.getCharacter(node?.speaker) || conversationCharacter;
      const speakerName = node?.speaker === "player" ? "Вы" : (speakerCharacter?.name || "Рассказчик");
      const sprite = this.engine.getSprite(speakerCharacter?.id || conversationCharacter.id, node?.emotion || "neutral");
      const choices = this.engine.getAvailableChoices().map(({ choice, index }, visibleIndex) => `
        <button class="dialogue-choice" data-choice="${index}">
          <span>${String(visibleIndex + 1).padStart(2, "0")}</span>
          <strong>${richLabel(choice.text)}</strong>
        </button>`).join("");

      this.frame(`
        <section class="screen dialogue-screen">
          <header class="scene-header">
            <p class="eyebrow">Личный разговор · ${this.engine.state.conversationsRemaining} осталось</p>
            <span class="scene-location">В стороне от площади</span>
          </header>
          <div class="dialogue-layout">
            <div class="dialogue-character">
              ${portraitMarkup(speakerCharacter, sprite, "portrait-frame--dialogue")}
              <p>${richText(speakerCharacter?.tagline || "")}</p>
            </div>
            <div class="dialogue-panel">
              ${this.approachNote ? `<div class="approach-note">${richText(this.approachNote)}</div>` : ""}
              <div class="speaker-line">
                <strong>${escapeHTML(speakerName)}</strong>
                ${this.debug ? `<span>${escapeHTML(node?.emotion || "neutral")}</span>` : ""}
              </div>
              <blockquote>${richText(node?.text || "…")}</blockquote>
              <div class="dialogue-choices">${choices}</div>
            </div>
          </div>
        </section>`, "screen-dialogue");
      this.approachNote = "";

      this.root.querySelectorAll("[data-choice]").forEach((button) => {
        button.addEventListener("click", () => {
          const result = this.engine.chooseChoice(Number(button.dataset.choice));
          if (!result) return;
          if (result.type === "node") this.renderDialogue();
          if (result.type === "conversationEnd") {
            if (result.events.length) this.renderInterstitial(result.events);
            else this.renderCurrentPhase();
          }
        });
      });
    }

    renderInterstitial(events) {
      this.clearTimer();
      const cards = events.map((event) => {
        const faces = (event.characterIds || []).map((characterId) => {
          const character = this.engine.getCharacter(characterId);
          return portraitMarkup(character, this.engine.getSprite(characterId, "neutral"), "portrait-frame--event");
        }).join("");
        return `
          <article class="event-card">
            ${faces ? `<div class="event-faces">${faces}</div>` : '<div class="event-mark" aria-hidden="true">✦</div>'}
            <div>
              <p class="eyebrow">${richText(event.title || "Тем временем")}</p>
              <p>${richText(event.text || "")}</p>
            </div>
          </article>`;
      }).join("");
      const nextLabel = this.engine.state.phase === "decision" ? "Выйти на площадь" : "Продолжить день";

      this.frame(`
        <section class="screen event-screen">
          <div class="event-wrap">
            <p class="event-kicker">Тем временем…</p>
            <h1>Город жил без вас</h1>
            <div class="event-list">${cards}</div>
            <button class="button button--primary" data-action="continue">${nextLabel}</button>
          </div>
        </section>`, "screen-event");
      this.root.querySelector('[data-action="continue"]')?.addEventListener("click", () => this.renderCurrentPhase());
    }

    renderCurrentPhase() {
      if (this.engine.state.phase === "town") this.renderTown();
      if (this.engine.state.phase === "decision") this.renderDecision();
      if (this.engine.state.phase === "vote") this.renderDay();
      if (this.engine.state.phase === "dialogue") this.renderDialogue();
    }

    renderDecision() {
      this.clearTimer();
      const decision = this.engine.scenario.decision || {};
      const statements = this.engine.getDecisionStatements().map((statement) => {
        const character = this.engine.getCharacter(statement.characterId);
        return `
          <article class="statement-card">
            ${portraitMarkup(character, this.engine.getSprite(character.id, "neutral"), "portrait-frame--statement")}
            <div><strong>${escapeHTML(character.name)}</strong><p>${richText(statement.text)}</p></div>
          </article>`;
      }).join("");
      const range = this.engine.trustRange();
      const nomineeButtons = this.engine.getAllyOptions().map((ally) => {
        const odds = this.engine.approachOdds(ally.id);
        const risky = !odds.hopeless && odds.chance < 0.5;
        return `
        <button class="nominee-button ${odds.hopeless ? "is-locked" : ""} ${risky ? "is-risky" : ""}" data-decision="${escapeHTML(ally.id)}" aria-disabled="${odds.hopeless ? "true" : "false"}">
          <span>${escapeHTML(decision.actionLabel || "Играть вместе")}</span>
          <strong>${escapeHTML(ally.name)}</strong>
          ${trustMeterMarkup(ally.trust, range)}
          <em class="nominee-trust">${escapeHTML(oddsWord(odds))}</em>
          <span class="nominee-lock" role="note">${escapeHTML(odds.hopeless ? ally.reason : (odds.betrays ? "Если откажет — перескажет разговор всему столу." : (ally.reason || "Согласится и будет голосовать вместе с вами.")))}</span>
        </button>`;
      }).join("");

      this.frame(`
        <section class="screen nomination-screen">
          <header class="nomination-header">
            <p class="eyebrow">Ваш следующий шаг</p>
            <h1>${escapeHTML(decision.title || "С кем вы будете играть?")}</h1>
            <p>${richText(decision.prompt || "Кого вы выбираете?")}</p>
          </header>
          <div class="statement-grid">${statements}</div>
          <div class="nomination-actions">
            ${nomineeButtons}
            ${decision.allowNobody !== false ? '<button class="nominee-button nominee-button--nobody" data-decision="nobody"><span>Сохранить дистанцию</span><strong>Пока один</strong></button>' : ""}
          </div>
        </section>`, "screen-nomination");
      this.root.querySelectorAll("[data-decision]").forEach((button) => {
        button.addEventListener("click", () => {
          if (button.getAttribute("aria-disabled") === "true") return;
          this.engine.approachAlly(button.dataset.decision);
          this.renderDay();
        });
      });
    }

    approachLine() {
      const approach = this.engine.state.approach || { characterId: "nobody", outcome: "none" };
      const approached = this.engine.getCharacter(approach.characterId);
      return {
        accepted: `${approached?.name} согласился держаться вашей версии и голосовать вместе с вами.`,
        refused: `${approached?.name} отказался, но обещал не пересказывать разговор.`,
        betrayed: `${approached?.name} отказался — и уже пересказал ваш разговор остальным.`,
        none: "Вы никому не предложили союз и вышли к столу в одиночку."
      }[approach.outcome] || "";
    }

    // The day is a sequence of nominations: each one is announced, voted on, counted.
    dayShell(inner, extraClass) {
      const day = this.engine.state.day;
      const settings = this.engine.scenario.vote || {};
      const blockName = day.block.targetId ? this.displayName(day.block.targetId) : null;
      const log = day.log.map((entry) => `
        <li class="${entry.targetId === day.block.targetId && entry.onBlock ? "is-block" : ""}">
          <span>${escapeHTML(this.displayName(entry.nominatorId))} → ${escapeHTML(this.displayName(entry.targetId))}</span>
          <strong>${entry.votes}</strong>
          <small>${escapeHTML(entry.onBlock ? "на плахе" : entry.tied ? "поровну, плаха пуста" : "голосов не хватило")}</small>
        </li>`).join("");

      this.frame(`
        <section class="screen nomination-screen day-screen ${extraClass || ""}">
          <header class="nomination-header">
            <p class="eyebrow">День · номинации</p>
            <h1>${escapeHTML(settings.title || "Стол ищет казнь")}</h1>
            <p>${richText(this.approachLine())}</p>
          </header>
          <div class="day-block ${blockName ? "is-set" : ""}">
            <p class="eyebrow">На плахе</p>
            <strong>${escapeHTML(blockName || "пока никто")}</strong>
            <small>${escapeHTML(blockName
              ? `${day.block.votes} ${plural(day.block.votes, "голос", "голоса", "голосов")}. Перебить можно только большим числом рук.`
              : `Нужно минимум ${this.engine.voteMajority()} ${plural(this.engine.voteMajority(), "голос", "голоса", "голосов")}.`)}</small>
          </div>
          ${log ? `<ul class="day-log">${log}</ul>` : ""}
          ${inner}
        </section>`, "screen-nomination");
    }

    displayName(id) {
      if (id === "you") return this.engine.scenario.player?.name || "Вы";
      return this.engine.getCharacter(id)?.name || id;
    }

    renderDay() {
      this.clearTimer();
      const beat = this.engine.dayBeat();
      if (beat.type === "playerTurn") return this.renderPlayerNomination(beat);
      if (beat.type === "nomination") return this.renderNominationResult(this.engine.resolvePending());
      return this.renderDayEnd();
    }

    // The one line that explains why your hand went up, or did not.
    handRule() {
      const allyId = this.engine.state.day.allyId;
      if (!allyId) return "Союзника у вас нет: на чужих номинациях вы держитесь в стороне и не поднимаете руку.";
      if (this.engine.state.day.pactBroken) {
        return `Договорённость с ${this.displayName(allyId)} разорвана — дальше вы за столом сами по себе.`;
      }
      return `На чужих номинациях вы голосуете вместе с ${this.displayName(allyId)}: ваша рука идёт следом за его.`;
    }

    renderPlayerNomination(beat) {
      const settings = this.engine.scenario.vote || {};
      const day = this.engine.state.day;
      const majority = this.engine.voteMajority();
      const buttons = beat.targets.map((id) => {
        const hands = this.engine.scenario.characters.filter((character) =>
          this.engine.wouldVote(character.id, id, "you")).length + 1;
        const isAlly = id === day.allyId;
        const enough = hands >= majority && hands > day.block.votes;
        return `
        <button class="nominee-button ${isAlly ? "is-risky" : ""} ${enough ? "is-ready" : ""}" data-nominate="${escapeHTML(id)}">
          <span>Назвать</span><strong>${escapeHTML(this.displayName(id))}</strong>
          <em class="nominee-trust">${escapeHTML(handsWord(hands, majority, day.block.votes))}</em>
          ${isAlly ? '<span class="nominee-lock" role="note">Это ваш союзник. Он сочтёт это предательством и с этой минуты будет голосовать против вас.</span>' : ""}
        </button>`;
      }).join("");

      this.dayShell(`
        <p class="vote-prompt">${richText(settings.prompt || "Ваша номинация. Назвать можно только того, кого сегодня ещё не называли.")}</p>
        <p class="vote-prompt vote-prompt--rule">${escapeHTML(this.handRule())}</p>
        <div class="nomination-actions">
          ${buttons}
          <button class="nominee-button nominee-button--nobody" data-nominate="nobody">
            <span>${escapeHTML(settings.abstainLabel || "Промолчать")}</span><strong>Не называть никого</strong>
          </button>
        </div>`);

      this.root.querySelectorAll("[data-nominate]").forEach((button) => {
        button.addEventListener("click", () => {
          const entry = this.engine.playerNominate(button.dataset.nominate);
          if (entry) this.renderNominationResult(entry);
          else this.renderDay();
        });
      });
    }

    renderNominationResult(entry) {
      const nominator = this.displayName(entry.nominatorId);
      const target = this.displayName(entry.targetId);
      const self = entry.targetId === "you";
      const yours = entry.nominatorId === "you";
      const hands = entry.voters.length
        ? entry.voters.map((id) => `${this.displayName(id)}${id !== "you" && !this.engine.isAlive(id) ? " (последний голос мертвеца)" : ""}`).join(", ")
        : "никто";
      const call = self
        ? `${nominator} называет вас: «Объясни, почему всё сходится на тебе».`
        : yours
          ? `Вы называете ${target}.`
          : `${nominator} называет ${target}.`;
      const yourHand = entry.voters.includes("you")
        ? "Вы подняли руку."
        : self
          ? "За свою казнь руку не поднимают."
          : "Вы промолчали.";
      const verdict = entry.onBlock
        ? `${target} на плахе.`
        : entry.tied
          ? "Поровну с прежним счётом — плаха опустела."
          : entry.votes >= entry.majority
            ? "Рук хватило бы, но на плахе уже стоит счёт выше."
            : `Нужно было ${entry.majority}. Номинация не прошла.`;

      this.dayShell(`
        <div class="day-call ${self ? "is-accused" : ""}">
          <p class="eyebrow">Номинация</p>
          <p>${escapeHTML(call)}</p>
        </div>
        <div class="day-tally">
          <p class="eyebrow">Голосов за казнь</p>
          <strong>${entry.votes}</strong>
          <p>Руки подняли: ${escapeHTML(hands)}.</p>
          <p>${escapeHTML(yourHand)}</p>
          <p class="day-tally__verdict">${escapeHTML(verdict)}</p>
        </div>
        <div class="nomination-actions">
          <button class="button button--primary" data-action="next">Дальше</button>
        </div>`, "day-screen--tally");

      this.root.querySelector('[data-action="next"]')?.addEventListener("click", () => this.renderDay());
    }

    renderDayEnd() {
      const day = this.engine.state.day;
      const blockName = day.block.targetId ? this.displayName(day.block.targetId) : null;

      this.dayShell(`
        <div class="day-call">
          <p class="eyebrow">Больше номинаций не будет</p>
          <p>${escapeHTML(blockName
            ? `Стол закрывает день. Казнят того, кто остался на плахе: ${blockName}.`
            : "Стол закрывает день. На плахе никого — сегодня казни не будет.")}</p>
        </div>
        <div class="nomination-actions">
          <button class="button button--primary" data-action="close">Закрыть день</button>
        </div>`, "day-screen--end");

      this.root.querySelector('[data-action="close"]')?.addEventListener("click", () => {
        const ending = this.engine.endDay();
        if (this.engine.state.vote.nightDeath) this.renderFinalNight(ending);
        else this.renderEnding(ending);
      });
    }

    renderFinalNight(ending) {
      const victim = this.displayName(this.engine.state.vote.nightDeath);
      this.frame(`
        <section class="screen event-screen final-night-screen">
          <div class="event-wrap">
            <p class="event-kicker">Последняя ночь</p>
            <h1>Утром не все вернулись</h1>
            <div class="event-card"><div class="event-mark" aria-hidden="true">✦</div><div>
              <p class="eyebrow">Рассказчик объявляет</p>
              <p>Ночью погибла ${escapeHTML(victim)}. В живых остались двое. Партия окончена.</p>
            </div></div>
            <button class="button button--primary" data-action="night-result">Узнать исход</button>
          </div>
        </section>`, "screen-event");
      this.root.querySelector('[data-action="night-result"]')?.addEventListener("click", () => this.renderEnding(ending));
    }

    renderEnding(ending) {
      this.clearTimer();
      const player = this.engine.scenario.player || {};
      const playerReveal = `<li class="role-reveal__player ${player.team === "Зло" ? "is-evil" : ""}">${player.roleIconImage ? `<img class="role-reveal-icon" src="${escapeHTML(player.roleIconImage)}" alt="" data-portrait-image>` : ""}<span>${escapeHTML(player.name || "Вы")}</span><strong>${richText(player.roleName || "Игрок")}</strong><small>${escapeHTML(player.team || "")}</small></li>`;
      const characterReveals = (this.engine.scenario.reveal || []).map((entry) => {
        const character = this.engine.getCharacter(entry.characterId);
        if (!character) return "";
        return `<li class="${entry.team === "Зло" ? "is-evil" : ""}">${entry.icon ? `<img class="role-reveal-icon" src="${escapeHTML(entry.icon)}" alt="" data-portrait-image>` : ""}<span>${escapeHTML(character.name)}</span><strong>${richText(entry.role)}</strong><small>${escapeHTML(entry.team)}</small></li>`;
      }).join("");
      const reveals = playerReveal + characterReveals;
      const route = this.engine.scenario.characters
        .filter((character) => this.engine.state.conversationCounts[character.id] > 0)
        .map((character) => `${character.name} ×${this.engine.state.conversationCounts[character.id]}`)
        .join(" · ");
      const range = this.engine.trustRange();
      const allies = this.engine.getAllyOptions();
      const openDoors = allies.filter((ally) => ally.allowed);
      const ledgerNote = openDoors.length
        ? `Готовы были играть с вами: ${openDoors.map((ally) => ally.name).join(", ")}.`
        : "К концу дня ни один из четверых не был готов играть с вами. Выбирать было не из кого.";
      const vote = this.engine.state.vote || { log: [], executed: "nobody" };
      const nameOf = (id) => this.displayName(id);
      const executedLine = vote.executed === "nobody"
        ? "На плахе никто не удержался. Сегодня казни не было."
        : `Казнён: ${nameOf(vote.executed)}.`;
      const voteResult = `
        <div class="vote-result">
          <p class="eyebrow">Протокол дня</p>
          <ul>
            ${(vote.log || []).map((entry) => `
              <li class="${entry.targetId === vote.executed ? "is-executed" : ""}">
                <span>${escapeHTML(`${nameOf(entry.nominatorId)} → ${nameOf(entry.targetId)}`)}</span>
                <strong>${entry.votes}</strong>
                <small>${escapeHTML(entry.voters.map(nameOf).join(", ") || "рук не было")}</small>
              </li>`).join("") || "<li><span>Номинаций не было</span><strong>0</strong><small>день прошёл молча</small></li>"}
          </ul>
          <p class="vote-result__note">${escapeHTML(executedLine)}</p>
        </div>`;
      const trustLedger = `
        <div class="trust-ledger">
          <p class="eyebrow">Чем вы закончили день</p>
          <ul>
            ${allies.map((ally) => `
              <li class="${ally.allowed ? "is-open" : "is-shut"}">
                <span>${escapeHTML(ally.name)}</span>
                ${trustMeterMarkup(ally.trust, range)}
                <strong>${ally.trust > 0 ? "+" : ""}${ally.trust}</strong>
                <small>${escapeHTML(ally.allowed ? "открыт для союза" : (ally.reason || "не доверяет вам"))}</small>
              </li>`).join("")}
          </ul>
          <p class="trust-ledger__note">${escapeHTML(ledgerNote)}</p>
        </div>`;

      this.frame(`
        <section class="screen ending-screen ending-screen--${escapeHTML(ending.tone || "neutral")}">
          <div class="ending-card">
            <p class="eyebrow">${escapeHTML(ending.label || "Итог вашего решения")}</p>
            <div class="ending-symbol" aria-hidden="true">${ending.tone === "victory" ? "☀" : "☾"}</div>
            <h1>${richText(ending.title)}</h1>
            <p class="ending-copy">${richText(ending.text)}</p>
            ${Array.isArray(ending.debrief) && ending.debrief.length ? `<div class="ending-debrief"><p class="eyebrow">Как это произошло</p><ol>${ending.debrief.map((line) => `<li>${richText(line)}</li>`).join("")}</ol></div>` : ""}
            ${voteResult}
            ${trustLedger}
            <p class="ending-epilogue">${richText(ending.epilogue || "")}</p>
            ${route ? `<p class="route-summary"><span>Ваш маршрут</span>${escapeHTML(route)}</p>` : ""}
            ${reveals ? `<div class="role-reveal"><p class="eyebrow">Роли героев эпизода</p><ul>${reveals}</ul></div>` : ""}
            <div class="ending-actions">
              <button class="button button--primary" data-action="restart">Сыграть ещё раз</button>
              ${!this.options.preview ? '<button class="button button--secondary" data-action="home">На заставку</button>' : ""}
            </div>
          </div>
        </section>`, "screen-ending");
      this.root.querySelector('[data-action="restart"]')?.addEventListener("click", () => {
        this.engine.reset();
        this.renderRole();
      });
      this.root.querySelector('[data-action="home"]')?.addEventListener("click", () => {
        this.engine.reset();
        this.debug = false;
        this.renderLanding();
      });
    }

    // Number keys pick dialogue lines, matching the 01, 02… shown on the buttons.
    handleChoiceKey(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName || "")) return;
      const number = Number(event.key);
      if (!Number.isInteger(number) || number < 1) return;
      const button = this.root.querySelectorAll(".dialogue-choice")[number - 1];
      if (!button) return;
      event.preventDefault();
      button.click();
    }

    appendDebugPanel() {
      if (!this.debug) return;
      const details = document.createElement("details");
      details.className = "debug-panel";
      details.innerHTML = `<summary>Отладка</summary><pre>${escapeHTML(JSON.stringify(this.engine.getDebugSnapshot(), null, 2))}</pre>`;
      this.root.querySelector(".game-frame")?.append(details);
    }

    bindSharedControls() {
      this.root.querySelector('[data-action="exit-preview"]')?.addEventListener("click", () => {
        this.clearTimer();
        if (typeof this.options.onExit === "function") this.options.onExit();
      });
    }

    bindImageFallbacks() {
      this.root.querySelectorAll("[data-portrait-image]").forEach((image) => {
        image.addEventListener("error", () => {
          image.classList.add("is-broken");
          image.hidden = true;
        }, { once: true });
      });
    }

    showError(error) {
      this.clearTimer();
      this.frame(`
        <section class="screen error-screen">
          <div class="error-card"><p class="eyebrow">Ошибка сценария</p><h1>История прервалась</h1><p>${escapeHTML(error?.message || error)}</p></div>
        </section>`, "screen-error");
    }

    static mount(root, scenario, options) {
      try {
        return new GameApp(root, scenario, options);
      } catch (error) {
        root.innerHTML = `<div class="fatal-error"><h1>Не удалось открыть сценарий</h1><p>${escapeHTML(error.message)}</p></div>`;
        return null;
      }
    }
  }

  window.GameApp = GameApp;

  if (document.body?.dataset.page === "game") {
    GameApp.mount(document.querySelector("#app"), window.BOTC_SCENARIOS || window.DEMO_SCENARIO);
  }
})();
