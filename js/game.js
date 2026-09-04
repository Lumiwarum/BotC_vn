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
      this.engine = new window.VNEngine(this.scenarioLibrary[0]);
      if (this.options.autoStart) this.renderRole();
      else this.renderLanding();
    }

    destroy() {
      this.clearTimer();
      this.root.innerHTML = "";
    }

    frame(content, screenClass) {
      this.root.innerHTML = `
        <div class="game-frame ${screenClass || ""}">
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
              <p>${escapeHTML(scenario.meta?.synopsis || scenario.meta?.subtitle || "")}</p>
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
            <div class="clock-sigil" aria-hidden="true"><span>XII</span><i></i></div>
            <h1>${escapeHTML(hasLibrary ? "Город шепчет" : meta.title)}</h1>
            <p class="start-subtitle">${escapeHTML(hasLibrary ? "Короткие истории о доверии, лжи и нехватке времени." : (meta.subtitle || ""))}</p>
            ${scenarioCards}
            <p class="start-premise">В городе пять игроков: вы и четверо собеседников. У вас будет всего три разговора, прежде чем город потребует решения.</p>
            <div class="start-actions">
              <button class="button button--primary button--large" data-action="start">Играть: ${escapeHTML(meta.title)}</button>
              <a class="button button--secondary" href="editor.html">Редактор сценария</a>
            </div>
            <label class="debug-toggle">
              <input type="checkbox" id="debug-mode" ${this.landingDebug ? "checked" : ""}>
              <span>Режим отладки</span>
            </label>
          </div>
          <p class="booth-note">5–7 минут · наушники не нужны · можно играть впервые</p>
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
        const alternatives = this.scenarioLibrary
          .map((_, index) => index)
          .filter((index) => index !== this.selectedScenarioIndex);
        this.selectedScenarioIndex = alternatives[Math.floor(Math.random() * alternatives.length)];
        this.randomSelectionIndex = this.selectedScenarioIndex;
        this.renderLanding();
        this.root.querySelector('[data-action="start"]')?.focus();
      });
    }

    renderRole() {
      this.clearTimer();
      const player = this.engine.scenario.player || {};
      const information = player.startingInformation || {};
      const suspects = (information.suspects || []).map((name) => `<span>${escapeHTML(name)}</span>`).join('<b aria-hidden="true">или</b>');
      const nightVisual = this.engine.scenario.nightVisual || {};
      const hasNightVision = Boolean(nightVisual.handImage && information.roleIcon);
      const roleIcon = player.roleIconImage
        ? `<img src="${escapeHTML(player.roleIconImage)}" alt="" data-portrait-image>`
        : escapeHTML(player.roleIcon || "✦");
      const vision = hasNightVision ? `
        <div class="night-vision" aria-label="Ведущий показывает жетон роли ${escapeHTML(information.roleName || "")}">
          <img class="night-hand" src="${escapeHTML(nightVisual.handImage)}" alt="Открытая ладонь ведущего с жетоном роли" data-portrait-image>
          <div class="shown-token">
            <img src="${escapeHTML(information.roleIcon)}" alt="${escapeHTML(information.roleName || "Жетон роли")}" data-portrait-image>
            <span>${escapeHTML(information.roleName || "")}</span>
          </div>
          <div class="night-name-tags">
            <span>${escapeHTML(information.suspects?.[0] || "?")}</span>
            <i aria-hidden="true">?</i>
            <span>${escapeHTML(information.suspects?.[1] || "?")}</span>
          </div>
          <p>Ведущий показывает жетон. Затем указывает на двоих.</p>
        </div>` : "";
      this.frame(`
        <section class="screen role-screen">
          <div class="role-card ${hasNightVision ? "role-card--visual" : ""}">
            <div class="role-card__layout">
              ${vision}
              <div class="role-card__copy">
                <p class="eyebrow">Первая ночь</p>
                <div class="role-icon" aria-hidden="true">${roleIcon}</div>
                <p class="role-prefix">Ваша роль</p>
                <h1>${escapeHTML(player.roleName || "Неизвестная роль")}</h1>
                <p class="team-badge">${escapeHTML(player.team || "")}</p>
                <p class="role-description">${escapeHTML(player.description || "")}</p>
                <div class="night-information">
                  <p class="eyebrow">${escapeHTML(information.label || "Информация")}</p>
                  <p>${escapeHTML(information.text || "")}</p>
                  <div class="suspect-pair">${suspects}</div>
                  ${information.hint ? `<small>${escapeHTML(information.hint)}</small>` : ""}
                </div>
                <button class="button button--primary button--large" data-action="wake">Проснуться</button>
              </div>
            </div>
            ${nightVisual.credit ? `<small class="asset-credit">${escapeHTML(nightVisual.credit)}</small>` : ""}
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
      const totalPlayers = scenario.characters.length + 1;
      const playerRoleIcon = player.roleIconImage
        ? `<img src="${escapeHTML(player.roleIconImage)}" alt="" data-portrait-image>`
        : `<span aria-hidden="true">${escapeHTML(player.roleIcon || "✦")}</span>`;
      const characterButtons = scenario.characters.map((character, index) => {
        const count = state.conversationCounts[character.id] || 0;
        const status = count > 0 ? `Разговоров: ${count}` : "Ещё не говорили";
        const sprite = this.engine.getSprite(character.id, "neutral");
        return `
          <button class="town-character town-character--${index}" data-character="${escapeHTML(character.id)}" aria-label="Поговорить: ${escapeHTML(character.name)}">
            ${portraitMarkup(character, sprite, "portrait-frame--town")}
            <span class="town-character__copy">
              <strong>${escapeHTML(character.name)}</strong>
              <small>${escapeHTML(character.tagline || status)}</small>
              <em class="spoken-status ${count ? "is-spoken" : ""}">${escapeHTML(status)}</em>
            </span>
          </button>`;
      }).join("");

      this.frame(`
        <section class="screen town-screen">
          <header class="town-header">
            <div>
              <p class="eyebrow">День ${state.day} · ${totalPlayers} игроков: вы и ${scenario.characters.length} собеседника</p>
              <h1>С кем говорить?</h1>
            </div>
            <div class="conversation-counter"><strong>${state.conversationsRemaining}</strong><span>разговора<br>осталось</span></div>
          </header>
          <div class="town-stage character-count-${scenario.characters.length}">
            <div class="town-table" aria-label="В городе ${totalPlayers} игроков, включая вас">
              <span>Город слушает</span>
              <div class="town-player-seat">
                <span class="town-player-seat__icon">${playerRoleIcon}</span>
                <span><strong>${escapeHTML(player.name || "Вы")}</strong><small>${escapeHTML(player.roleName || "Игрок")}</small></span>
              </div>
            </div>
            ${characterButtons}
            <div class="choice-timer" aria-label="Осталось времени на выбор">
              <div class="choice-timer__top"><span>До выбора</span><strong id="timer-number">${Number(scenario.settings?.selectionSeconds || 10)}</strong></div>
              <div class="choice-timer__track"><i id="timer-fill"></i></div>
            </div>
          </div>
          <p class="town-hint">Пока вы говорите с одним человеком, остальные не стоят на месте.</p>
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
          <strong>${escapeHTML(choice.text)}</strong>
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
              <p>${escapeHTML(speakerCharacter?.tagline || "")}</p>
            </div>
            <div class="dialogue-panel">
              ${this.approachNote ? `<div class="approach-note">${escapeHTML(this.approachNote)}</div>` : ""}
              <div class="speaker-line">
                <strong>${escapeHTML(speakerName)}</strong>
                <span>${escapeHTML(node?.emotion || "neutral")}</span>
              </div>
              <blockquote>${escapeHTML(node?.text || "…")}</blockquote>
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
              <p class="eyebrow">${escapeHTML(event.title || "Тем временем")}</p>
              <p>${escapeHTML(event.text || "")}</p>
            </div>
          </article>`;
      }).join("");
      const nextLabel = this.engine.state.phase === "nomination" ? "Выйти на площадь" : "Продолжить день";

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
      if (this.engine.state.phase === "nomination") this.renderNomination();
      if (this.engine.state.phase === "dialogue") this.renderDialogue();
    }

    renderNomination() {
      this.clearTimer();
      const nomination = this.engine.scenario.nomination || {};
      const statements = this.engine.getNominationStatements().map((statement) => {
        const character = this.engine.getCharacter(statement.characterId);
        return `
          <article class="statement-card">
            ${portraitMarkup(character, this.engine.getSprite(character.id, "neutral"), "portrait-frame--statement")}
            <div><strong>${escapeHTML(character.name)}</strong><p>${escapeHTML(statement.text)}</p></div>
          </article>`;
      }).join("");
      const nomineeButtons = this.engine.scenario.characters.map((character) => `
        <button class="nominee-button" data-nominee="${escapeHTML(character.id)}">
          <span>Номинировать</span><strong>${escapeHTML(character.name)}</strong>
        </button>`).join("");

      this.frame(`
        <section class="screen nomination-screen">
          <header class="nomination-header">
            <p class="eyebrow">Последнее решение дня</p>
            <h1>${escapeHTML(nomination.title || "Номинации")}</h1>
            <p>${escapeHTML(nomination.prompt || "Кого вы выбираете?")}</p>
          </header>
          <div class="statement-grid">${statements}</div>
          <div class="nomination-actions">
            ${nomineeButtons}
            ${nomination.allowNobody !== false ? '<button class="nominee-button nominee-button--nobody" data-nominee="nobody"><span>Не рисковать</span><strong>Никого</strong></button>' : ""}
          </div>
        </section>`, "screen-nomination");
      this.root.querySelectorAll("[data-nominee]").forEach((button) => {
        button.addEventListener("click", () => this.renderEnding(this.engine.nominate(button.dataset.nominee)));
      });
    }

    renderEnding(ending) {
      this.clearTimer();
      const player = this.engine.scenario.player || {};
      const playerReveal = `<li class="role-reveal__player ${player.team === "Зло" ? "is-evil" : ""}">${player.roleIconImage ? `<img class="role-reveal-icon" src="${escapeHTML(player.roleIconImage)}" alt="" data-portrait-image>` : ""}<span>${escapeHTML(player.name || "Вы")} · это вы</span><strong>${escapeHTML(player.roleName || "Игрок")}</strong><small>${escapeHTML(player.team || "")}</small></li>`;
      const characterReveals = (this.engine.scenario.reveal || []).map((entry) => {
        const character = this.engine.getCharacter(entry.characterId);
        if (!character) return "";
        return `<li class="${entry.team === "Зло" ? "is-evil" : ""}">${entry.icon ? `<img class="role-reveal-icon" src="${escapeHTML(entry.icon)}" alt="" data-portrait-image>` : ""}<span>${escapeHTML(character.name)}</span><strong>${escapeHTML(entry.role)}</strong><small>${escapeHTML(entry.team)}</small></li>`;
      }).join("");
      const reveals = playerReveal + characterReveals;
      const route = this.engine.scenario.characters
        .filter((character) => this.engine.state.conversationCounts[character.id] > 0)
        .map((character) => `${character.name} ×${this.engine.state.conversationCounts[character.id]}`)
        .join(" · ");

      this.frame(`
        <section class="screen ending-screen ending-screen--${escapeHTML(ending.tone || "neutral")}">
          <div class="ending-card">
            <p class="eyebrow">${ending.tone === "victory" ? "Добро побеждает" : "Зло побеждает"}</p>
            <div class="ending-symbol" aria-hidden="true">${ending.tone === "victory" ? "☀" : "☾"}</div>
            <h1>${escapeHTML(ending.title)}</h1>
            <p class="ending-copy">${escapeHTML(ending.text)}</p>
            <p class="ending-epilogue">${escapeHTML(ending.epilogue || "")}</p>
            ${route ? `<p class="route-summary"><span>Ваш маршрут</span>${escapeHTML(route)}</p>` : ""}
            ${reveals ? `<div class="role-reveal"><p class="eyebrow">Все пять игроков</p><ul>${reveals}</ul></div>` : ""}
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
