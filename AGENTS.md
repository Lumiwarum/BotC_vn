# Agent README — Club Fest Visual Novel

This file is for coding agents. Human-facing launch and authoring instructions are in `README.md`.

## Product goal

Build a short, reliable, offline browser experience that introduces visitors to Blood on the Clocktower through incomplete information, private conversations, gossip, bluffing, and a time-limited final choice. This is not a full BotC simulation and not a universal visual-novel engine.

Before substantial product or content changes, also read the repository-level files:

- `../AGENT.md`
- `../LORE.md`
- `../Project_ Blood on the Clocktower — Club Fest Interactive Game.md`

The club prioritizes a welcoming human community, newcomer clarity, concrete stories, and authentic visuals. Do not invent events from real club games.

## Non-negotiable constraints

- Vanilla HTML/CSS/JavaScript; no framework, backend, account, API, build step, or runtime network request.
- `index.html` must work when opened directly with `file://`.
- Keep engine logic in `js/engine.js` and authored content in `scenarios/*.js`.
- Scenario objects must remain JSON-serializable. Do not put functions in scenario data.
- Editor preview must use the same `GameApp` renderer as normal play.
- Hidden roles, flags, and hidden events must never appear outside debug mode.
- Restart must construct clean state with no flags or event history carried over.
- Missing emotion images must fall back to `neutral`.
- The main loop stays: reveal → three timed conversations → nomination → ending.
- Every bundled scenario has five players total: the protagonist in `player` plus exactly four conversation characters. Show the protagonist in town and ending composition UI.

## Important files

```text
index.html                 player entry point
editor.html                authoring entry point
js/engine.js               state, conditions, effects, events, endings
js/game.js                 all player rendering and timer behavior
js/editor.js               forms, graph, validation, import/export, preview
scenarios/demo.js          “Час до полуночи”
scenarios/second.js        “Тихий заговор”
scenarios/library.js       ordered scenario registry
css/styles.css             shared player/editor visual system
tests/validate.py          static scenario and asset validation
tests/smoke.html           complete player-flow browser test
tests/editor-smoke.html    editor and preview browser test
```

## Scenario contract

Supported conditions:

- `variable`
- `conversationCount`
- `spokenTo`
- `totalConversations`
- `nomination`

Supported operators: `equals`, `notEquals`, `gt`, `gte`, `lt`, `lte`, `truthy`, `falsy`, `includes`.

Supported effects: `set`, `increment`, `toggle`.

Conditions in one array use AND semantics. Start rules and endings are ordered: the first matching entry wins. Put specific entries before fallbacks. Every dialogue node should expose at least one choice, and every choice should either have a valid `goto` or `endConversation: true`.

To register a scenario, define its serializable object in `scenarios/`, load that script before `library.js` in both HTML entry points, and add it to `window.BOTC_SCENARIOS`.

## Validation before handoff

Run:

```powershell
python tests/validate.py
```

Open `tests/smoke.html` and `tests/editor-smoke.html` in a browser. Both must end with `ALL ... TESTS PASSED`. When changing layout, visually inspect at 1440×900 and at a smaller laptop viewport.

The graph validator should report no errors for bundled scenarios. Warnings are allowed only when they represent an intentional conditional entry or draft content and are explained in the handoff.

## Visual and asset rules

- Prefer real club photography once available; current portraits are explicit SVG placeholders.
- Official role icons live in `assets/roles/` and should not be redrawn into a conflicting visual system.
- Keep all gameplay assets local. Record source, author, and license in the human README.
- Avoid generic SaaS styling, excessive gradients, long blocking animation, small text, and AI-generated dialogue or runtime imagery.
- “Night” names a game phase, not the room lighting. The reveal scene should preserve the illusion that a Storyteller is physically showing a role token on an open palm under ordinary event lighting.

## Scope discipline

Do not add multiplayer, autonomous NPC AI, a backend, authentication, full BotC rules, or a generalized scripting language. Prefer a small authored illusion of a living town. After a requested feature is complete and verified, stop and report remaining rough edges instead of expanding scope automatically.
