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
- The main loop stays: reveal → three timed conversations → an approach with real odds → a day of nominations → episode outcome.
- Each episode is a FIVE-PLAYER table: the protagonist plus four conversation partners is the whole table. There are no offscreen players. The club runs these as short teaching games with the Toymaker Fabled, but the Fabled is never named in the interface — it is unnecessary complexity for an unprepared visitor. Tell the player only this: five players at the table, you are one of them, and each episode gives you your own task.
- Players carry table numbers, the way a Storyteller's number tokens work. `VNEngine.assignSeatNumbers()` numbers seats 1..N clockwise along `table.seats` and randomises only which seat is number 1, per run and per restart — so neighbours always stay consecutive. The night scene shows the role token plus a number token per suspect. `startingInformation.suspects` holds character ids, never names.
- Seating is content, not decoration. Every scenario declares `table.seats` (clockwise, starting with `"you"`), and both the role screen and the town screen render it. Character claims depend on adjacency (Chef counts, the Marionette bluff), so changing `table.seats` means re-reading `SCENARIO_NOTES.md` first.

## Important files

```text
index.html                 player entry point
editor.html                authoring entry point
js/engine.js               state, conditions, effects, events, endings
js/game.js                 all player rendering and timer behavior
js/editor.js               forms, graph, validation, import/export, preview
scenarios/demo.js          “Час до полуночи”
scenarios/second.js        “Тихий заговор”
scenarios/third.js         “Свои среди чужих”: evil protagonist, Poppy Grower
scenarios/library.js       ordered scenario registry
css/styles.css             shared player/editor visual system
tools/extract_sprites.py   reproducible sprite selection and precise sheet cropping
tests/validate.py          static scenario and asset validation
tests/simulate.py          random playthroughs: ending and ally reachability
tests/smoke.html           complete player-flow browser test
tests/editor-smoke.html    editor and preview browser test
../scenarios/md/           markdown extracts of the club's script PDFs (start at its README.md)
```

## Scenario contract

Supported conditions:

- `variable`
- `conversationCount`
- `spokenTo`
- `totalConversations`
- `decision`
- `trust` (takes `characterId`; compares that character's trust in the player)
- `suspicion` (takes `characterId` and `targetId`; how badly that character wants the target executed)
- `openAllies` (how many allies are still willing to play with the player)
- `approach` (`accepted` / `refused` / `betrayed` / `none`)
- `executed` (`you`, a character id, or `nobody`)
- `executedTeam` (the team of whoever was executed)
- `votesAgainstPlayer` (the largest count any nomination of the player reached)
- `nominatedPlayer` (the player's name was called at least once)
- `playerNomination` (whom the player nominated, or `nobody`)
- `nominations` (how many nominations the day held)
- `pactBroken` (the player nominated their own accepted ally, or raised a hand for his execution)

Supported operators: `equals`, `notEquals`, `gt`, `gte`, `lt`, `lte`, `truthy`, `falsy`, `includes`.

Supported effects: `set`, `increment`, `toggle`, `trust`, `suspicion`.

A `trust` effect is `{ "type": "trust", "characterId": …, "value": ±n, "note": "…" }`. The note is the sentence the player is shown when that person refuses to ally, so write it as a plain statement of what the player did — it is the game explaining itself, not flavour text.

A `suspicion` effect is `{ "type": "suspicion", "characterId": …, "targetId": …, "value": ±n }`: the player pointing one character at another. `targetId` may be `"you"`, but do not author that — the player's own row is computed from trust, so a line that makes someone doubt *you* should spend trust, not suspicion.

Conditions in one array use AND semantics. Start rules and endings are ordered: the first matching entry wins. Put specific entries before fallbacks. Add new conditional choices at the **end** of a node's `choices` — the UI emits the authored index as `data-choice`, so inserting one at the front silently renumbers every later choice and breaks `tests/smoke.html`. Every dialogue node should expose at least one choice, and every choice should either have a valid `goto` or `endConversation: true`.

To register a scenario, define its serializable object in `scenarios/`, load that script before `library.js` in both HTML entry points, and add it to `window.BOTC_SCENARIOS`.

### Trust

Choices have to cost something, or the final pick is just a guess. Each character keeps a trust score (`character.startingTrust`, clamped to `scenario.trust.min`/`.max`, default -4..4). An ally can only be chosen when their trust reaches `character.allyTrust ?? decision.allyTrust ?? 0` — the default is 0, so a scenario that authors no trust effects locks nobody. A locked ally is rendered disabled with the reason on hover: the last negative `note`, otherwise `character.allyHint`.

Rules for authoring it:

- Lying must be affordable only when it buys something. A bluff that gains nothing should cost trust with the person you told it to.
- Trust never hard-locks a choice except at the very bottom (`decision.refuseBelow`, default -3). Anyone else can be approached; low trust just makes it a bad bet.
- Never author an ally who cannot reach the threshold. `tests/validate.py` fails on it and `tests/simulate.py` will show the ally never being approached.

### Suspicion

Trust is the player's own axis: how each character feels about *him*. Suspicion is the other axis: how each character feels about *everyone else*. `character.views` is the starting row (`{ "<otherId>": n }`), and `suspicion` effects move it during conversations. Together they are what the day runs on — the player wins a day by aiming other people, not by arguing on his own turn.

All three episodes carry the layer now, but the good ones are tuned differently — see below.

Author it so that no NPC starts one step from a nomination. If three people already sit at suspicion 1 on the same player, a single conversation choice executes him, and the player never learns that pointing people at each other is a move.

The player's own row is never authored. `suspicionOf(character, "you")` is `-trust`, plus 3 for the man who betrayed the player and 1 for everybody else after a betrayal, minus 3 while a pact holds and plus 3 once the player breaks it.

### The end of the day

The day follows the real rules of the game, which is the point: this is what the festival visitor should recognise at a live table.

**Approach.** `decision` carries `allyTrust`, `refuseBelow`, `betrayBelow` and an `odds` table (bands of `minTrust` → `chance`, highest first). Choosing someone rolls once: `accepted`, `refused`, or `betrayed`. A betrayal costs one trust with everyone else at the table. A scenario that declares neither `trust` nor `decision.odds` always gets `accepted`, so untouched episodes behave exactly as before. This roll is the only randomness in the day.

**Nomination rounds.** After the approach the day is a loop of nominations, each one announced, voted on and counted in the open:

- everyone, the player included, may nominate **once** per day, and each player may be nominated **once** per day;
- a vote is only ever *for* the execution — there is no vote against. A character raises a hand or stays silent;
- nobody raises a hand for their own execution;
- **the player never votes hand by hand.** He decides two things all day: whom to approach, and whom to nominate (or nobody). On everybody else's nominations his hand follows his accepted ally — that is what allying with someone *means* here. With no ally, or after breaking the pact, he stays out and raises nothing;
- a nomination that reaches `majority` (default: half the living table, rounded up) **and beats the current count** puts that person on the block and takes the previous one off. An equal count clears the block and puts nobody on it;
- whoever is still on the block when the nominations run out is executed. There is exactly one execution per day, or none.

The one screen that asks the player anything is his own nomination; the others announce a nomination, count it and move on. Keep it that way — the day is the consequence of the morning, not a second set of decisions.

`vote` tunes the thresholds: `majority`, `voteAt` (suspicion needed to raise a hand, default 1), `nominateAt` (suspicion needed to stand up and nominate, default 2), `urgentAt` (suspicion at which a character speaks *before* the player's turn, default 3). `validate.py` enforces `voteAt ≤ nominateAt ≤ urgentAt`.

**Each episode asks for a different move.** In episode I the player can publish the true Washerwoman pair or use a false pair as bait, then expose the Demon; a quiet first day with a real ally can be a good outcome. Episode II begins on the final day with three living players and two dead players who each still hold one ghost vote. Only executing Ira, the Demon, wins. With no execution, Ira kills Katya that night and evil wins. Episode III asks the evil Leviathan to find his Minion. Episode I uses `voteAt: 2`; episodes II and III use `voteAt: 1`.

- a day with no execution can be good in episode I, but is defeat in episode II;
- executing the Demon wins; executing a good player is a defeat. Executing the Saint in episode II ends the game immediately for evil;
- dead players in episode II can still talk but cannot nominate or be approached as allies. With `table.ghostVotes: true` each dead player keeps one vote for the day and spends it only on a conviction: suspicion at `vote.ghostVoteAt` (default `nominateAt`) — no pact or trust buys it. The vote majority counts only living players.
- a dead evil character's `suspicion` toward his own Demon must never be raised: with a ghost vote he would hand the Demon to the block.

Who an NPC nominates: whichever seat they suspect most, once that suspicion clears `nominateAt`. Who they vote for: anyone they suspect at `voteAt` or more — plus, when the player is the nominator, an accepted ally and anyone whose trust in the player is 2 or higher. Naming your own accepted ally, or raising a hand for his execution, breaks the pact: he stops backing the player and turns on him for the rest of the day. Endings that claim the ally's support must be guarded with `pactBroken` `falsy`.

Everything after the approach roll is deterministic, and the day screen shows the block, the running log and — on the player's own turn — how many hands each nomination would draw. The player should lose because of what he said in the morning, never because of a hidden die.

Bundled schema version is 2. `vote` supplies `title`, `prompt`, `abstainLabel`, `majority`, `voteAt`, `nominateAt` and `urgentAt`. `character.views` supplies the starting suspicion row. `table` supplies `label`, `seats` (five entries: `"you"` plus every character id, clockwise), a player-facing `note`, optional `dead` (character ids) and optional `ghostVotes`. `player.task` is the one-line personal goal shown on the role screen. `startingInformation.suspects` lists character ids. `decision` supplies title, prompt, actionLabel, allowNobody, and conditional statements. A decision condition compares the chosen character ID (or nobody). Earlier dialogue flags can qualify the same choice into different endings. Tone victory/defeat/neutral describes personal progress, never automatic good/evil team victory. Show only the featured cast at the reveal.

Each episode draws its whole cast from ONE of the club's own script PDFs and uses that PDF's Russian spelling of every role name — Чёрт, not Бес; Сыщик, not Следователь; Мецефель, not Мезефель. Markdown extracts of those PDFs are in `../scenarios/md/`; read them before naming a role. Episodes I and II are Trouble Brewing. Episode III is `leviaxaan`: a genuinely evil Leviathan protagonist, Poppy Grower, Mezepheles, Shugenja, Steward, and a false Marionette claim to a neighbouring good player. Leviathan never kills at night and the whole table knows the role is in play. Poppy Grower blocks introductions; it does not change alignment. See SCENARIO_NOTES.md for rule sources.

Casts are chosen for an interesting conversation, not to satisfy the official five-player distribution — do not "fix" a cast to match the setup table.

### Role glossary

Most of our players have never played, so no role name is ever left unexplained. `js/roles.js` holds one shared glossary for every scenario: `name`, `stem`, `icon`, `kind` and `ability`, worded from the club's own script PDFs. `game.js` builds a matcher from the stems and wraps the **first** mention of each role in a piece of text with a hover/focus tooltip.

- `stem` is the part of the word that never changes; the matcher allows up to three more Cyrillic letters, so «Мецефеля» and «Мецефелем» both resolve from «Мецефел». A role whose forms change the stem needs a second entry with the same `name`.
- Author narrative text with `richText()` and text inside buttons with `richLabel()` (no `tabindex`, so the keyboard is not trapped inside a button). Attributes keep plain `escapeHTML()`.
- `icon` is the role's own token art from `assets/roles/`, shown beside the text in the tooltip. Only the team words and Рассказчик go without one — the game has no official symbol for them.
- Adding a role to any scenario means adding it to the glossary; `tests/validate.py` fails on a `player.roleName` or `reveal` role that has no entry, on a glossary entry without token art, and on an `icon` path that does not resolve to a file. Team words (Горожанин, Изгой, Приспешник, Демон) and Рассказчик are in there too — they are exactly what a newcomer does not know, and they carry `matchLower` because they also appear mid-sentence in lower case.
- Do not annotate text inside a container that clips its overflow (the one-line town tagline, the night token) — the tooltip would be cut off. Those places keep plain `escapeHTML()`.

## Validation before handoff

Run:

```powershell
python tests/validate.py
python tests/simulate.py
```

`simulate.py` replays every scenario a few thousand times at random against a Python port of the engine — conversations, approach roll and the whole nomination loop — and fails if an ending became unreachable, an ally can never be approached, or anyone was made to vote for their own execution. Run it after touching trust values, `views`, choices, or endings.

Open `tests/smoke.html` and `tests/editor-smoke.html` in a browser. Both must end with `ALL ... TESTS PASSED`. When changing layout, visually inspect at 1440×900 and at a smaller laptop viewport.

The graph validator should report no errors for bundled scenarios. Warnings are allowed only when they represent an intentional conditional entry or draft content and are explained in the handoff.

## Visual and asset rules

- Current portraits are local Danganronpa sprite selections from user-supplied sheets and archives. `tools/extract_sprites.py` records the one-source-character-per-person mapping and extracts exact archive members. Do not swap a sprite into another person's folder or reuse an actor in another episode. The source archives do not include a redistribution license; check rights before public release.
- Official role icons live in `assets/roles/` and should not be redrawn into a conflicting visual system.
- Keep all gameplay assets local. Record source, author, and license in the human README; keep asset credits out of the gameplay screens.
- Avoid generic SaaS styling, excessive gradients, long blocking animation, small text, and AI-generated dialogue or runtime imagery.
- “Night” names a game phase, not the room lighting. The reveal scene should preserve the illusion that a Storyteller is physically showing a role token on an open palm under ordinary event lighting. The palm must face the camera so the token reads flat; a hand photographed edge-on makes the token look like it is standing on its rim.

## Scope discipline

Do not add multiplayer, autonomous NPC AI, a backend, authentication, full BotC rules, or a generalized scripting language. Prefer a small authored illusion of a living town. After a requested feature is complete and verified, stop and report remaining rough edges instead of expanding scope automatically.
