window.SECOND_SCENARIO = {
  "schemaVersion": 1,
  "meta": {
    "id": "quiet-conspiracy",
    "title": "Тихий заговор",
    "subtitle": "Правдивая ложь опаснее обычной.",
    "menuLabel": "Сценарий II",
    "synopsis": "Вы нашли вероятного приспешника. Но Демон может вообще не быть в вашей проверке.",
    "duration": "5–7 минут",
    "author": "Клуб Blood on the Clocktower",
    "version": "0.2.0"
  },
  "settings": {
    "selectionSeconds": 10,
    "conversationsPerDay": 3,
    "fallback": {
      "characterId": "sasha",
      "text": "Саша стучит по своим записям: «Если ты никого не выберешь, версии выберут тебя»."
    }
  },
  "nightVisual": {
    "handImage": "assets/night/storyteller-open-palm.jpg",
    "credit": "Фото: Mohammad Hassaan / Pexels · жетоны: Blood on the Clocktower Wiki"
  },
  "player": {
    "name": "Вы",
    "roleName": "Следователь",
    "roleIcon": "✦",
    "roleIconImage": "assets/roles/investigator.png",
    "team": "Добро",
    "description": "В первую ночь вы узнаёте двух игроков. Один из них — конкретный приспешник Демона.",
    "startingInformation": {
      "label": "Ночная информация",
      "text": "Один из этих двоих — Отравитель:",
      "roleIcon": "assets/roles/poisoner.png",
      "roleName": "Отравитель",
      "suspects": ["Макс", "Катя"],
      "hint": "Отравитель помогает Демону и делает сведения добрых ролей ненадёжными. Сам Демон может быть кем-то другим."
    }
  },
  "characters": [
    {
      "id": "ira",
      "name": "Ира",
      "tagline": "Её версия слишком хорошо сходится",
      "sprites": {
        "neutral": "assets/characters/ira-neutral.svg",
        "warm": "assets/characters/ira-warm.svg",
        "suspicious": "assets/characters/ira-suspicious.svg"
      }
    },
    {
      "id": "max",
      "name": "Макс",
      "tagline": "Готов назвать виновного сразу",
      "sprites": {
        "neutral": "assets/characters/max-neutral.svg",
        "confident": "assets/characters/max-confident.svg",
        "nervous": "assets/characters/max-nervous.svg"
      }
    },
    {
      "id": "sasha",
      "name": "Саша",
      "tagline": "Следит не за словами, а за парами",
      "sprites": {
        "neutral": "assets/characters/sasha-neutral.svg",
        "amused": "assets/characters/sasha-amused.svg",
        "concerned": "assets/characters/sasha-concerned.svg"
      }
    },
    {
      "id": "katya",
      "name": "Катя",
      "tagline": "Её защита звучит как угроза",
      "sprites": {
        "neutral": "assets/characters/katya-neutral.svg",
        "angry": "assets/characters/katya-angry.svg",
        "nervous": "assets/characters/katya-nervous.svg"
      }
    }
  ],
  "initialState": {
    "playerClaim": "none",
    "toldMaxRole": false,
    "toldKatyaRole": false,
    "iraKnowsPlayerRole": false,
    "evilCoordinated": false,
    "believedKatya": false,
    "suspectedIra": false,
    "suspectedMax": false,
    "sashaSawPair": false,
    "sashaKnowsPlayerRole": false,
    "iraPreparedFrame": false
  },
  "dialogues": {
    "ira": {
      "start": "ira_start",
      "startRules": [
        {
          "when": [{ "type": "conversationCount", "characterId": "ira", "operator": "gte", "value": 1 }],
          "node": "ira_repeat"
        },
        {
          "when": [{ "type": "variable", "key": "iraKnowsPlayerRole", "operator": "equals", "value": true }],
          "node": "ira_knows"
        }
      ],
      "nodes": {
        "ira_start": {
          "speaker": "ira",
          "emotion": "warm",
          "text": "Я Библиотекарь. Узнала, что либо Саша, либо Катя — Святой. Катя уже подтвердила мне роль.",
          "choices": [
            { "text": "«Почему Катя доверилась именно тебе?»", "goto": "ira_explains" },
            { "text": "«Что думаешь о Максе?»", "goto": "ira_sacrifices" },
            { "text": "«Моя информация касается Макса и Кати.»", "goto": "ira_fishes", "effects": [{ "type": "set", "key": "hintedInvestigation", "value": true }] }
          ]
        },
        "ira_knows": {
          "speaker": "ira",
          "emotion": "warm",
          "text": "Следователь, значит. Отравитель между Максом и Катей — я правильно поняла? В таком случае нам стоит казнить Макса.",
          "choices": [
            { "text": "«Откуда ты знаешь мою роль?»", "goto": "ira_caught" },
            { "text": "«Почему не Катю?»", "goto": "ira_sacrifices" },
            { "text": "«Слишком быстро ты всё решила.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedIra", "value": true }] }
          ]
        },
        "ira_explains": {
          "speaker": "ira",
          "emotion": "neutral",
          "text": "Она боялась, что её казнят из-за странной защиты. Я предложила проверить её историю своей информацией.",
          "choices": [
            { "text": "«Звучит разумно.»", "endConversation": true, "effects": [{ "type": "set", "key": "trustedIra", "value": true }] },
            { "text": "«Звучит так, будто ты заранее знала ответ.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedIra", "value": true }] }
          ]
        },
        "ira_sacrifices": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Макс слишком охотно обвиняет Катю. Если он в твоей проверке, я готова голосовать против него.",
          "choices": [
            { "text": "«Ты готова казнить его почти без вопросов?»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedIra", "value": true }] },
            { "text": "«Тогда на площади поддержи меня.»", "endConversation": true, "effects": [{ "type": "set", "key": "iraPromisedMaxVote", "value": true }] }
          ]
        },
        "ira_fishes": {
          "speaker": "ira",
          "emotion": "neutral",
          "text": "Тогда не раскрывай больше. Я поговорю с Максом сама и посмотрю, станет ли он нервничать.",
          "choices": [
            { "text": "«Хорошо. Но мою роль не угадывай.»", "endConversation": true },
            { "text": "«Нет. Сначала я проверю твою историю.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedIra", "value": true }] }
          ]
        },
        "ira_caught": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Макс проговорился. В городе секрет живёт ровно до первого полезного собеседника.",
          "choices": [
            { "text": "«И ты сразу предлагаешь казнить источник?»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedIra", "value": true }] },
            { "text": "«Ладно. Возможно, он и есть Отравитель.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedMax", "value": true }] }
          ]
        },
        "ira_repeat": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Ты вернулась. Значит, либо поверила мне, либо решила, что я опаснее твоей первоначальной пары.",
          "choices": [
            { "text": "«Опаснее. Ты знаешь слишком много.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedIra", "value": true }] },
            { "text": "«Подтверди: ты голосуешь против Макса?»", "goto": "ira_sacrifices" }
          ]
        }
      }
    },
    "max": {
      "start": "max_start",
      "startRules": [
        {
          "when": [{ "type": "conversationCount", "characterId": "max", "operator": "gte", "value": 1 }],
          "node": "max_repeat"
        }
      ],
      "nodes": {
        "max_start": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Я Эмпат. Получил ноль: рядом со мной нет зла. Катя в твоей проверке? Тогда всё просто.",
          "choices": [
            { "text": "«Я Следователь. Между тобой и Катей — Отравитель.»", "goto": "max_hears_role", "effects": [{ "type": "set", "key": "toldMaxRole", "value": true }, { "type": "set", "key": "playerClaim", "value": "investigator" }] },
            { "text": "«Откуда ты знаешь, что Катя в моей проверке?»", "goto": "max_guesses" },
            { "text": "«Ноль делает чистой Катю, а не тебя.»", "goto": "max_cornered", "effects": [{ "type": "set", "key": "suspectedMax", "value": true }] }
          ]
        },
        "max_hears_role": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Отлично. Я знаю свою роль, значит Отравитель — Катя. Номинируй её, и закончим до полуночи.",
          "choices": [
            { "text": "«Слишком простой ответ.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedMax", "value": true }] },
            { "text": "«Сначала услышу Катю.»", "endConversation": true },
            { "text": "«Согласна. Пока.»", "endConversation": true, "effects": [{ "type": "set", "key": "leanedTowardMax", "value": true }] }
          ]
        },
        "max_guesses": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Не знаю. Просто она с утра защищается так, будто уже увидела собственное имя на плахе.",
          "choices": [
            { "text": "«Ты сказал “в моей проверке”. Это не догадка.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedMax", "value": true }] },
            { "text": "«Возможно. Проверю её.»", "endConversation": true }
          ]
        },
        "max_cornered": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Если моя информация верна — да. Если я отравлен, она не значит ничего. Но твоя проверка всё равно указывает на Катю.",
          "choices": [
            { "text": "«Или на тебя.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedMax", "value": true }] },
            { "text": "«Кто подтвердит твою роль?»", "endConversation": true }
          ]
        },
        "max_repeat": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Мы теряем время. Катя — единственная разумная номинация. Даже Ира готова голосовать со мной.",
          "choices": [
            { "text": "«Ира сказала, что готова голосовать против тебя.»", "endConversation": true, "effects": [{ "type": "set", "key": "caughtEvilMismatch", "value": true }, { "type": "set", "key": "suspectedIra", "value": true }] },
            { "text": "«На площади разберёмся.»", "endConversation": true }
          ]
        }
      }
    },
    "sasha": {
      "start": "sasha_start",
      "startRules": [
        {
          "when": [{ "type": "variable", "key": "sashaKnowsPlayerRole", "operator": "equals", "value": true }],
          "node": "sasha_knows"
        },
        {
          "when": [{ "type": "conversationCount", "characterId": "sasha", "operator": "gte", "value": 1 }],
          "node": "sasha_repeat"
        }
      ],
      "nodes": {
        "sasha_start": {
          "speaker": "sasha",
          "emotion": "concerned",
          "text": "Я Повар. Получил единицу. Утром Ира и Макс ушли говорить первыми — и вернулись с противоположными версиями.",
          "choices": [
            { "text": "«Думаешь, они и есть пара зла?»", "goto": "sasha_pair", "effects": [{ "type": "set", "key": "sashaSawPair", "value": true }] },
            { "text": "«Что сказала Катя?»", "goto": "sasha_katya" },
            { "text": "«Ира готова казнить Макса.»", "goto": "sasha_sacrifice" }
          ]
        },
        "sasha_knows": {
          "speaker": "sasha",
          "emotion": "neutral",
          "text": "Катя сказала, что ты Следователь и не поверила Максу. Она рискует ролью, но её история пока последовательна.",
          "choices": [
            { "text": "«Кого тогда номинировать?»", "goto": "sasha_pair" },
            { "text": "«Почему она рассказала тебе?»", "goto": "sasha_katya" }
          ]
        },
        "sasha_pair": {
          "speaker": "sasha",
          "emotion": "concerned",
          "text": "Возможно. И если Макс — приспешник, Ира может легко предложить его казнить. Демон иногда продаёт союзника ради доверия.",
          "choices": [
            { "text": "«Значит, цель — Ира.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedIra", "value": true }] },
            { "text": "«Сначала проверю их отдельно.»", "endConversation": true }
          ]
        },
        "sasha_katya": {
          "speaker": "sasha",
          "emotion": "neutral",
          "text": "Назвалась Святым. Казним её — и добро может проиграть сразу. Либо это правда, либо лучший щит в городе.",
          "choices": [
            { "text": "«Она в моей проверке, но я не стану спешить.»", "endConversation": true, "effects": [{ "type": "set", "key": "believedKatya", "value": true }] },
            { "text": "«Удобный щит не делает её доброй.»", "endConversation": true }
          ]
        },
        "sasha_sacrifice": {
          "speaker": "sasha",
          "emotion": "amused",
          "text": "Вот именно. Если Макс злой, готовность Иры отдать его не доказывает её добро. Она доказывает, что Ира умеет считать.",
          "choices": [
            { "text": "«Запомню это.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedIra", "value": true }] },
            { "text": "«Или Ира просто добрая.»", "endConversation": true }
          ]
        },
        "sasha_repeat": {
          "speaker": "sasha",
          "emotion": "amused",
          "text": "Ещё один разговор со мной — и город решит, что мы пара. Надеюсь, хотя бы добрая.",
          "choices": [
            { "text": "«Коротко: Ира или Макс?»", "goto": "sasha_pair" },
            { "text": "«На площади узнаем.»", "endConversation": true }
          ]
        }
      }
    },
    "katya": {
      "start": "katya_start",
      "startRules": [
        {
          "when": [{ "type": "conversationCount", "characterId": "katya", "operator": "gte", "value": 1 }],
          "node": "katya_repeat"
        }
      ],
      "nodes": {
        "katya_start": {
          "speaker": "katya",
          "emotion": "nervous",
          "text": "Я Святой. Если город казнит меня, добро проиграет сразу. Да, я понимаю, насколько удобно это звучит.",
          "choices": [
            { "text": "«Ты в моей проверке на Отравителя.»", "goto": "katya_hears_info", "effects": [{ "type": "set", "key": "toldKatyaRole", "value": true }, { "type": "set", "key": "playerClaim", "value": "investigator" }] },
            { "text": "«Кто знал твою роль?»", "goto": "katya_ira" },
            { "text": "«Святой — идеальный блеф для зла.»", "goto": "katya_angry" }
          ]
        },
        "katya_hears_info": {
          "speaker": "katya",
          "emotion": "angry",
          "text": "Тогда проверяй Макса. Он назвал меня виновной раньше, чем ты успела рассказать кому-либо свою информацию.",
          "choices": [
            { "text": "«Это важно. Кому ещё ты рассказала?»", "goto": "katya_ira" },
            { "text": "«Я пока тебе не верю.»", "endConversation": true },
            { "text": "«Хорошо. Тебя не номинирую.»", "endConversation": true, "effects": [{ "type": "set", "key": "believedKatya", "value": true }] }
          ]
        },
        "katya_ira": {
          "speaker": "katya",
          "emotion": "neutral",
          "text": "Ира спросила первой. Через минуту уже назвалась Библиотекарем и “нашла” Святого между мной и Сашей.",
          "choices": [
            { "text": "«Она построила проверку вокруг твоей роли.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedIra", "value": true }] },
            { "text": "«Или действительно получила тебя ночью.»", "endConversation": true, "effects": [{ "type": "set", "key": "trustedIra", "value": true }] }
          ]
        },
        "katya_angry": {
          "speaker": "katya",
          "emotion": "angry",
          "text": "И поэтому настоящий Святой почти всегда звучит как плохой актёр. Только ошибка с моей казнью будет настоящей.",
          "choices": [
            { "text": "«Ладно. Не буду спешить.»", "endConversation": true, "effects": [{ "type": "set", "key": "believedKatya", "value": true }] },
            { "text": "«Это решит город.»", "endConversation": true }
          ]
        },
        "katya_repeat": {
          "speaker": "katya",
          "emotion": "nervous",
          "text": "Если ты вернулась, значит, моя защита не сработала. Спроси себя: кто первым сделал меня удобной целью?",
          "choices": [
            { "text": "«Макс.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedMax", "value": true }] },
            { "text": "«Ира — своей слишком точной информацией.»", "endConversation": true, "effects": [{ "type": "set", "key": "suspectedIra", "value": true }] }
          ]
        }
      }
    }
  },
  "events": [
    {
      "id": "public-disagreement",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [{ "type": "totalConversations", "operator": "gte", "value": 1 }],
      "title": "Слишком громкий спор",
      "text": "Ира обвиняет Макса в спешке. Макс отвечает, что Ира защищает Катю. Спор звучит убедительно с обеих сторон.",
      "characterIds": ["ira", "max"],
      "effects": [{ "type": "set", "key": "publicFight", "value": true }]
    },
    {
      "id": "evil-coordinates",
      "trigger": "afterConversation",
      "once": true,
      "visible": false,
      "when": [{ "type": "spokenTo", "characterId": "max", "operator": "equals", "value": true }],
      "debugText": "Макс передал Ире роль игрока; зло согласовало противоположные публичные версии.",
      "effects": [
        { "type": "set", "key": "iraKnowsPlayerRole", "value": true },
        { "type": "set", "key": "evilCoordinated", "value": true }
      ]
    },
    {
      "id": "katya-trusts-sasha",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [
        { "type": "totalConversations", "operator": "gte", "value": 2 },
        { "type": "variable", "key": "toldKatyaRole", "operator": "equals", "value": true }
      ],
      "title": "Катя выбирает своего собеседника",
      "text": "Катя отводит Сашу к двери и что-то быстро объясняет. Саша перестаёт смотреть на неё и переводит взгляд на Иру.",
      "characterIds": ["katya", "sasha"],
      "effects": [{ "type": "set", "key": "sashaKnowsPlayerRole", "value": true }]
    },
    {
      "id": "ira-prepares-frame",
      "trigger": "afterConversation",
      "once": true,
      "visible": false,
      "when": [{ "type": "totalConversations", "operator": "gte", "value": 2 }],
      "debugText": "Ира решила публично пожертвовать Максом, если это снимет подозрения с неё.",
      "effects": [{ "type": "set", "key": "iraPreparedFrame", "value": true }]
    },
    {
      "id": "second-bell",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [{ "type": "totalConversations", "operator": "gte", "value": 3 }],
      "title": "До полуночи одна минута",
      "text": "Город собирается у часов. Вы нашли вероятного Отравителя — но голосовать нужно против Демона.",
      "effects": []
    }
  ],
  "nomination": {
    "title": "Кого вы считаете Демоном?",
    "prompt": "Приспешник может быть в вашей проверке. Демон — не обязан.",
    "statements": [
      {
        "characterId": "ira",
        "variants": [
          {
            "when": [{ "type": "variable", "key": "iraPreparedFrame", "operator": "equals", "value": true }],
            "text": "«Макс, вероятно, Отравитель. Я поддержу его казнь.»"
          },
          { "text": "«Моя информация подтверждает роль Кати.»" }
        ]
      },
      {
        "characterId": "max",
        "variants": [
          {
            "when": [{ "type": "variable", "key": "evilCoordinated", "operator": "equals", "value": true }],
            "text": "«Катя — Отравитель. Даже Ира считает мою проверку честной.»"
          },
          { "text": "«Мой ноль оставляет только Катю.»" }
        ]
      },
      {
        "characterId": "sasha",
        "variants": [
          {
            "when": [{ "type": "variable", "key": "suspectedIra", "operator": "equals", "value": true }],
            "text": "«Макс похож на приспешника. Но слишком точную историю построила Ира.»"
          },
          { "text": "«Моя единица может быть парой Ира—Макс.»" }
        ]
      },
      {
        "characterId": "katya",
        "variants": [
          { "text": "«Макс выбрал меня целью. Ира первой узнала, какую роль ей нужно назвать.»" }
        ]
      }
    ],
    "allowNobody": true
  },
  "endings": [
    {
      "id": "demon-caught",
      "tone": "victory",
      "title": "Вы увидели второй слой",
      "when": [{ "type": "nomination", "operator": "equals", "value": "ira" }],
      "text": "Иру казнят — и город находит Демона. Макс действительно был Отравителем, но его готовность выглядеть виноватым прикрывала более важную роль.",
      "epilogue": "Верная информация указала не на цель, а на дорогу к ней."
    },
    {
      "id": "minion-only",
      "tone": "defeat",
      "title": "Отравитель найден. Демон — нет.",
      "when": [{ "type": "nomination", "operator": "equals", "value": "max" }],
      "text": "Макс действительно оказывается Отравителем. Пока город празднует точную проверку, Ира — настоящий Демон — спокойно встречает полночь.",
      "epilogue": "Правильный подозреваемый оказался неправильной целью."
    },
    {
      "id": "saint-executed",
      "tone": "defeat",
      "title": "Святого казнили",
      "when": [{ "type": "nomination", "operator": "equals", "value": "katya" }],
      "text": "Катя говорила правду. Казнь Святого немедленно отдаёт победу злу. Максу даже не приходится защищаться.",
      "epilogue": "Самая подозрительная защита была настоящей."
    },
    {
      "id": "chef-executed",
      "tone": "defeat",
      "title": "Счёт оборвался на единице",
      "when": [{ "type": "nomination", "operator": "equals", "value": "sasha" }],
      "text": "Саша был Поваром и почти вывел город на пару Ира—Макс. После его казни эта версия остаётся без голоса.",
      "epilogue": "Иногда неудобная теория была единственной верной."
    },
    {
      "id": "no-decision",
      "tone": "defeat",
      "title": "Заговор пережил день",
      "when": [{ "type": "nomination", "operator": "equals", "value": "nobody" }],
      "text": "Город откладывает решение. Ира и Макс впервые за день перестают спорить — ровно в полночь.",
      "epilogue": "Их разногласия закончились вместе с городом."
    },
    {
      "id": "fallback-ending",
      "tone": "defeat",
      "title": "Тихий заговор удался",
      "when": [],
      "text": "Демон остаётся неназванным. Город понял первую ложь, но не успел дойти до второй.",
      "epilogue": "Информации было достаточно. Времени — нет."
    }
  ],
  "reveal": [
    { "characterId": "ira", "role": "Бес", "team": "Зло", "icon": "assets/roles/imp.png" },
    { "characterId": "max", "role": "Отравитель", "team": "Зло", "icon": "assets/roles/poisoner.png" },
    { "characterId": "sasha", "role": "Повар", "team": "Добро", "icon": "assets/roles/chef.png" },
    { "characterId": "katya", "role": "Святой", "team": "Добро", "icon": "assets/roles/saint.png" }
  ]
};
