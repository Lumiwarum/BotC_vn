// Shared glossary for every scenario: any role or team word mentioned in the text
// gets a hover explanation, because most of our festival visitors have never played.
//
// `stem` is the part of the word that never changes; the renderer allows up to three
// more Cyrillic letters after it, so «Мецефеля» и «Мецефелем» match «Мецефел».
// `matchLower` also accepts the lower-case form — team words appear mid-sentence.
// `icon` is the role's own token art, shown in the tooltip. Team words and the
// Storyteller have no official symbol, so they stay text-only.
// Ability wording follows the club's own script PDFs (../scenarios/md/).
window.BOTC_ROLES = [
  {
    name: "Прачка",
    stem: "Прачк",
    icon: "assets/roles/washerwoman.png",
    kind: "Горожанин · Trouble Brewing",
    ability: "Вступление: вы узнаете, что один из двух игроков является определённым Горожанином."
  },
  {
    name: "Библиотекарь",
    stem: "Библиотекар",
    icon: "assets/roles/librarian.png",
    kind: "Горожанин · Trouble Brewing",
    ability: "Вступление: вы узнаете, что один из двух игроков является определённым Изгоем — или что Изгоев в игре нет."
  },
  {
    name: "Сыщик",
    stem: "Сыщик",
    icon: "assets/roles/investigator.png",
    kind: "Горожанин · Trouble Brewing",
    ability: "Вступление: вы узнаете, что один из двух игроков является определённым Приспешником."
  },
  {
    name: "Повар",
    stem: "Повар",
    icon: "assets/roles/chef.png",
    kind: "Горожанин · Trouble Brewing",
    ability: "Вступление: вы узнаете, сколько пар сидящих рядом злых игроков присутствует в игре."
  },
  {
    name: "Эмпат",
    stem: "Эмпат",
    icon: "assets/roles/empath.png",
    kind: "Горожанин · Trouble Brewing",
    ability: "Каждую ночь: вы узнаёте число злых игроков среди двух ваших живых соседей."
  },
  {
    name: "Монах",
    stem: "Монах",
    icon: "assets/roles/monk.png",
    kind: "Горожанин · Trouble Brewing",
    ability: "Каждую ночь (кроме первой): выберите игрока, кроме себя. Этот игрок защищён от Демона этой ночью."
  },
  {
    name: "Мэр",
    stem: "Мэр",
    icon: "assets/roles/mayor.png",
    kind: "Горожанин · Trouble Brewing",
    ability: "Если в живых осталось 3 игрока и не происходит казни, ваша команда побеждает. Если вы умираете ночью, вместо вас может умереть другой игрок."
  },
  {
    name: "Затворник",
    stem: "Затворник",
    icon: "assets/roles/recluse.png",
    kind: "Изгой · Trouble Brewing",
    ability: "Вы добрый, но можете определяться злым — и как Приспешник или Демон, даже будучи мёртвым. Проверки на вас ошибаются."
  },
  {
    name: "Святой",
    stem: "Свят",
    icon: "assets/roles/saint.png",
    kind: "Изгой · Trouble Brewing",
    ability: "Вы добрый, но если вы умираете в результате казни, ваша команда проигрывает."
  },
  {
    name: "Отравитель",
    stem: "Отравител",
    icon: "assets/roles/poisoner.png",
    kind: "Приспешник · Trouble Brewing",
    ability: "Каждую ночь: выберите игрока. Этот игрок отравлен текущей ночью и следующим днём — его способность врёт, а он этого не знает."
  },
  {
    name: "Блудница",
    stem: "Блудниц",
    icon: "assets/roles/scarletwoman.png",
    kind: "Приспешник · Trouble Brewing",
    ability: "Если живы хотя бы 5 игроков и Демон умирает, вы становитесь Демоном."
  },
  {
    name: "Чёрт",
    stem: "Чёрт",
    icon: "assets/roles/imp.png",
    kind: "Демон · Trouble Brewing",
    ability: "Каждую ночь (кроме первой): выберите игрока. Он умирает. Если вы убиваете так себя, один из Приспешников становится Чёртом."
  },
  {
    name: "Чёрт",
    stem: "Черт",
    icon: "assets/roles/imp.png",
    kind: "Демон · Trouble Brewing",
    ability: "Каждую ночь (кроме первой): выберите игрока. Он умирает. Если вы убиваете так себя, один из Приспешников становится Чёртом."
  },
  {
    name: "Завхоз",
    stem: "Завхоз",
    icon: "assets/roles/steward.png",
    kind: "Горожанин · Leviaxaan",
    ability: "Вступление: вы узнаете одного точно доброго игрока."
  },
  {
    name: "Шугенжа",
    stem: "Шугенж",
    icon: "assets/roles/shugenja.png",
    kind: "Горожанин · Leviaxaan",
    ability: "Вступление: вы узнаете, находится ли ближайшее к вам Зло по часовой стрелке или против неё. При равном удалении направление произвольно."
  },
  {
    name: "Маковка",
    stem: "Маковк",
    icon: "assets/roles/poppygrower.png",
    kind: "Горожанин · Leviaxaan",
    ability: "Пока вы живы, Приспешники и Демон не знакомятся друг с другом. Если вы умираете, они знакомятся ближайшей ночью."
  },
  {
    name: "Савант",
    stem: "Савант",
    icon: "assets/roles/savant.png",
    kind: "Горожанин · Leviaxaan",
    ability: "Каждый день вы можете приватно навестить Рассказчика и узнать два факта. Один из них правда, другой — ложь."
  },
  {
    name: "Швея",
    stem: "Шве",
    icon: "assets/roles/seamstress.png",
    kind: "Горожанин · Leviaxaan",
    ability: "Один раз за игру, ночью: выберите двух игроков, кроме себя. Вы узнаете, на одной ли они стороне."
  },
  {
    name: "Рыбак",
    stem: "Рыбак",
    icon: "assets/roles/fisherman.png",
    kind: "Горожанин · Leviaxaan",
    ability: "Один раз за игру, днём: приватно навестите Рассказчика за советом, который поможет победить вашей команде."
  },
  {
    name: "Мецефель",
    stem: "Мецефел",
    icon: "assets/roles/mezepheles.png",
    kind: "Приспешник · Leviaxaan",
    ability: "Вступление: вы узнаете тайное слово. Первый добрый игрок, произнёсший его, становится злым ближайшей ночью."
  },
  {
    name: "Марионетка",
    stem: "Марионетк",
    icon: "assets/roles/marionette.png",
    kind: "Приспешник · Leviaxaan",
    ability: "Вы считаете, что у вас добрая роль, и не знаете правды. Демон знает, кто вы, и вы сидите рядом с ним."
  },
  {
    name: "Левиафан",
    stem: "Левиафан",
    icon: "assets/roles/leviathan.png",
    kind: "Демон · Leviaxaan",
    ability: "Ночью не убивает, и всем игрокам известно, что эта роль в игре. Если казнено больше одного доброго игрока — побеждает Зло. После пятого дня Зло побеждает."
  },
  {
    name: "Горожанин",
    stem: "Горожан",
    matchLower: true,
    kind: "Тип роли",
    ability: "Добрый игрок с полезной способностью. Горожан большинство, и выигрывают они, казнив Демона."
  },
  {
    name: "Изгой",
    stem: "Изго",
    matchLower: true,
    kind: "Тип роли",
    ability: "Добрый игрок, чья способность мешает своей же команде. Изгои играют за добро, но верить их сведениям опасно."
  },
  {
    name: "Приспешник",
    stem: "Приспешник",
    matchLower: true,
    kind: "Тип роли",
    ability: "Злой игрок, помогающий Демону. Обычно знает, кто Демон, и притворяется добрым."
  },
  {
    name: "Демон",
    stem: "Демон",
    matchLower: true,
    kind: "Тип роли",
    ability: "Главный злой игрок. Добро побеждает, казнив Демона; зло побеждает, если Демон дожил до конца."
  },
  {
    name: "Рассказчик",
    stem: "Рассказчик",
    kind: "Ведущий",
    ability: "Ведущий партии. Знает все роли, будит игроков ночью и выдаёт сведения — иногда намеренно ложные, если игрок отравлен или пьян."
  }
];
