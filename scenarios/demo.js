window.DEMO_SCENARIO = {
  "schemaVersion": 1,
  "meta": {
    "id": "hour-before-midnight",
    "title": "Час до полуночи",
    "subtitle": "Три разговора. Четыре версии. Один Демон.",
    "menuLabel": "Сценарий I",
    "synopsis": "Ваша ночная информация связывает доброго игрока и Демона. Решите, кому из них верить.",
    "duration": "5–7 минут",
    "author": "Клуб Blood on the Clocktower",
    "version": "0.1.0"
  },
  "settings": {
    "selectionSeconds": 10,
    "conversationsPerDay": 3,
    "fallback": {
      "characterId": "katya",
      "text": "Катя сама подходит к вам: «Ты собираешься весь день просто смотреть?»"
    }
  },
  "nightVisual": {
    "handImage": "assets/night/storyteller-open-palm.jpg",
    "credit": "Фото: Mohammad Hassaan / Pexels · жетоны: Blood on the Clocktower Wiki"
  },
  "player": {
    "name": "Вы",
    "roleName": "Прачка",
    "roleIcon": "✦",
    "roleIconImage": "assets/roles/washerwoman.png",
    "team": "Добро",
    "description": "В первую ночь вы узнаёте двух игроков. Роль одного из них названа верно.",
    "startingInformation": {
      "label": "Ночная информация",
      "text": "Один из этих двоих — Библиотекарь:",
      "roleIcon": "assets/roles/librarian.png",
      "roleName": "Библиотекарь",
      "suspects": ["Ира", "Макс"],
      "hint": "Библиотекарь — добрая роль, которая тоже получает информацию в первую ночь."
    }
  },
  "characters": [
    {
      "id": "ira",
      "name": "Ира",
      "tagline": "Слушает прежде, чем говорить",
      "sprites": {
        "neutral": "assets/characters/ira-neutral.svg",
        "warm": "assets/characters/ira-warm.svg",
        "suspicious": "assets/characters/ira-suspicious.svg"
      }
    },
    {
      "id": "max",
      "name": "Макс",
      "tagline": "Уже собрал свою версию",
      "sprites": {
        "neutral": "assets/characters/max-neutral.svg",
        "confident": "assets/characters/max-confident.svg",
        "nervous": "assets/characters/max-nervous.svg"
      }
    },
    {
      "id": "sasha",
      "name": "Саша",
      "tagline": "Считает пары и совпадения",
      "sprites": {
        "neutral": "assets/characters/sasha-neutral.svg",
        "amused": "assets/characters/sasha-amused.svg",
        "concerned": "assets/characters/sasha-concerned.svg"
      }
    },
    {
      "id": "katya",
      "name": "Катя",
      "tagline": "Не любит говорить первой",
      "sprites": {
        "neutral": "assets/characters/katya-neutral.svg",
        "angry": "assets/characters/katya-angry.svg",
        "nervous": "assets/characters/katya-nervous.svg"
      }
    }
  ],
  "initialState": {
    "playerClaim": "none",
    "toldIraRole": false,
    "toldMaxRole": false,
    "liedToIra": false,
    "liedToKatya": false,
    "accusedMax": false,
    "trustedIra": false,
    "maxKnowsPlayerRole": false,
    "sashaKatyaTalked": false,
    "lieSpread": false,
    "maxPreparedStory": false
  },
  "dialogues": {
    "ira": {
      "start": "ira_start",
      "startRules": [
        {
          "when": [{ "type": "conversationCount", "characterId": "ira", "operator": "gte", "value": 1 }],
          "node": "ira_repeat"
        }
      ],
      "nodes": {
        "ira_start": {
          "speaker": "ira",
          "emotion": "neutral",
          "text": "Давай быстро. Я Библиотекарь. Ночью узнала, что либо Саша, либо Катя — Затворник.",
          "choices": [
            {
              "text": "«Я Прачка. Моя проверка указывает на тебя или Макса.»",
              "goto": "ira_trust",
              "effects": [
                { "type": "set", "key": "toldIraRole", "value": true },
                { "type": "set", "key": "playerClaim", "value": "washerwoman" },
                { "type": "set", "key": "trustedIra", "value": true }
              ]
            },
            {
              "text": "Соврать: «Я Повар. У меня ноль пар зла.»",
              "goto": "ira_lie",
              "effects": [
                { "type": "set", "key": "liedToIra", "value": true },
                { "type": "set", "key": "playerClaim", "value": "chef" }
              ]
            },
            {
              "text": "«Почему я должна тебе верить?»",
              "goto": "ira_proof"
            }
          ]
        },
        "ira_trust": {
          "speaker": "ira",
          "emotion": "warm",
          "text": "Тогда наши сведения сходятся: я и есть Библиотекарь. Макс в твоей паре — плохая новость. Я поговорю с ним.",
          "choices": [
            {
              "text": "«Только не говори ему мою роль.»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "askedIraForSecrecy", "value": true }]
            },
            {
              "text": "«Проверь его историю. Потом найдём друг друга.»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "askedIraToCheckMax", "value": true }]
            }
          ]
        },
        "ira_lie": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Странно. Саша тоже назвался Поваром. Один из вас врёт — или не понимает, что происходит.",
          "choices": [
            {
              "text": "«Тогда держи это между нами.»",
              "endConversation": true
            },
            {
              "text": "«Возможно, Саша блефует.»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "suspectedSasha", "value": true }]
            }
          ]
        },
        "ira_proof": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Не должна. Но спроси Катю, Затворник ли она. Если подтвердит — у меня появится основание.",
          "choices": [
            {
              "text": "«Хорошо. Вернусь, если успею.»",
              "endConversation": true
            },
            {
              "text": "«Сначала поговорю с Максом.»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "accusedMax", "value": true }]
            }
          ]
        },
        "ira_repeat": {
          "speaker": "ira",
          "emotion": "warm",
          "text": "Снова ты. Значит, этот разговор важнее двух других. Что изменилось?",
          "choices": [
            {
              "text": "«Я всё ещё думаю, что Макс — Демон.»",
              "goto": "ira_max_case",
              "effects": [{ "type": "set", "key": "accusedMax", "value": true }]
            },
            {
              "text": "Признаться, что в прошлый раз соврали",
              "goto": "ira_confession",
              "conditions": [{ "type": "variable", "key": "liedToIra", "operator": "equals", "value": true }],
              "effects": [{ "type": "set", "key": "trustedIra", "value": true }]
            },
            {
              "text": "«Ничего. Хотел услышать твою версию ещё раз.»",
              "endConversation": true
            }
          ]
        },
        "ira_max_case": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Он назвался Следователем и толкает казнь в меня. Слишком удобная история. Я проголосую за него.",
          "choices": [
            {
              "text": "«Тогда держимся вместе.»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "trustedIra", "value": true }]
            },
            {
              "text": "«Я пока ничего не обещаю.»",
              "endConversation": true
            }
          ]
        },
        "ira_confession": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Плохое время для исповеди. Но честность хотя бы запоздала, а не исчезла совсем.",
          "choices": [
            {
              "text": "Рассказать настоящую роль",
              "endConversation": true,
              "effects": [
                { "type": "set", "key": "toldIraRole", "value": true },
                { "type": "set", "key": "playerClaim", "value": "washerwoman" }
              ]
            },
            {
              "text": "Оставить всё как есть",
              "endConversation": true
            }
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
        },
        {
          "when": [{ "type": "variable", "key": "maxKnowsPlayerRole", "operator": "equals", "value": true }],
          "node": "max_knows"
        }
      ],
      "nodes": {
        "max_start": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Я Следователь. Между Ирой и Катей есть приспешник Демона. Сегодня нужно казнить одну из них.",
          "choices": [
            {
              "text": "«Ира говорит, что она Библиотекарь.»",
              "goto": "max_pushes_ira",
              "effects": [{ "type": "set", "key": "sharedIraClaim", "value": true }]
            },
            {
              "text": "«Я Прачка. Моя информация подозрительна для тебя.»",
              "goto": "max_deflects",
              "effects": [
                { "type": "set", "key": "toldMaxRole", "value": true },
                { "type": "set", "key": "maxKnowsPlayerRole", "value": true },
                { "type": "set", "key": "playerClaim", "value": "washerwoman" }
              ]
            },
            {
              "text": "«Кто уже слышал эту версию?»",
              "goto": "max_network"
            }
          ]
        },
        "max_knows": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Ты Прачка, верно? Ира уже успела поделиться. Не переживай — я умею хранить чужие секреты.",
          "choices": [
            {
              "text": "«Я просила её молчать.»",
              "goto": "max_smiles",
              "effects": [{ "type": "set", "key": "noticedLeak", "value": true }]
            },
            {
              "text": "«Что именно она сказала?»",
              "goto": "max_deflects"
            },
            {
              "text": "«Удобно. Теперь ты знаешь, кого убрать ночью.»",
              "goto": "max_accused",
              "effects": [{ "type": "set", "key": "accusedMax", "value": true }]
            }
          ]
        },
        "max_pushes_ira": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Конечно говорит. Если она приспешник, ей нужна добрая роль для прикрытия. Твоя информация могла быть отравлена.",
          "choices": [
            {
              "text": "«И всё же я проверю твою версию.»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "accusedMax", "value": true }]
            },
            {
              "text": "«Допустим. Я поговорю с Катей.»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "leanedTowardMax", "value": true }]
            }
          ]
        },
        "max_deflects": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Подозрительна — не значит ложна. Возможно, Ира добрая, а ты отравлена. Но казнить сегодня всё равно нужно.",
          "choices": [
            {
              "text": "«Тогда почему ты так спешишь?»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "accusedMax", "value": true }]
            },
            {
              "text": "«Подумаю.»",
              "endConversation": true
            }
          ]
        },
        "max_network": {
          "speaker": "max",
          "emotion": "neutral",
          "text": "Саша слышал. Катя — пока нет. Видишь? Я не разбрасываюсь информацией направо и налево.",
          "choices": [
            {
              "text": "«Значит, теперь нас трое.»",
              "endConversation": true
            },
            {
              "text": "«Или Саша вообще ничего не слышал.»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "doubtedMaxNetwork", "value": true }]
            }
          ]
        },
        "max_smiles": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "В этом городе просьба молчать обычно означает: «расскажи только самому полезному человеку». Видимо, им оказался я.",
          "choices": [
            {
              "text": "Закончить разговор",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "accusedMax", "value": true }]
            }
          ]
        },
        "max_accused": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Сильное обвинение для человека с одной ночной подсказкой. Надеюсь, на площади у тебя будет что-то ещё.",
          "choices": [
            { "text": "«Увидимся на площади.»", "endConversation": true },
            { "text": "«Может быть, я блефую.»", "endConversation": true }
          ]
        },
        "max_repeat": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Вернулась ко мне? Хороший знак. Ира стала ещё подозрительнее, пока тебя не было.",
          "choices": [
            {
              "text": "«Ты повторяешь обвинение, но не добавляешь фактов.»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "accusedMax", "value": true }]
            },
            {
              "text": "«Расскажи ещё раз про Следователя.»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "leanedTowardMax", "value": true }]
            }
          ]
        }
      }
    },
    "sasha": {
      "start": "sasha_start",
      "startRules": [
        {
          "when": [{ "type": "variable", "key": "lieSpread", "operator": "equals", "value": true }],
          "node": "sasha_heard_lie"
        },
        {
          "when": [{ "type": "conversationCount", "characterId": "sasha", "operator": "gte", "value": 1 }],
          "node": "sasha_repeat"
        }
      ],
      "nodes": {
        "sasha_start": {
          "speaker": "sasha",
          "emotion": "neutral",
          "text": "Я Повар. Получил единицу: где-то за столом есть ровно одна соседняя пара злых игроков.",
          "choices": [
            {
              "text": "«Кого ты ставишь в эту пару?»",
              "goto": "sasha_pair"
            },
            {
              "text": "«Катя сказала тебе свою роль?»",
              "goto": "sasha_katya"
            },
            {
              "text": "«Макс утверждает, что ты слышал его проверку.»",
              "goto": "sasha_max"
            }
          ]
        },
        "sasha_pair": {
          "speaker": "sasha",
          "emotion": "concerned",
          "text": "Макс сидит рядом с Катей. Это красиво укладывается в единицу — настолько красиво, что я себе не доверяю.",
          "choices": [
            {
              "text": "«Я тоже подозреваю Макса.»",
              "endConversation": true,
              "effects": [{ "type": "set", "key": "accusedMax", "value": true }]
            },
            { "text": "«Проверю Катю.»", "endConversation": true }
          ]
        },
        "sasha_katya": {
          "speaker": "sasha",
          "emotion": "amused",
          "text": "Сказала, что Затворник. Её роль может выглядеть злой для чужих способностей. Очень удобное объяснение. И иногда правдивое.",
          "choices": [
            { "text": "«Это подтверждает Иру.»", "endConversation": true, "effects": [{ "type": "set", "key": "trustedIra", "value": true }] },
            { "text": "«Или они договорились.»", "endConversation": true }
          ]
        },
        "sasha_max": {
          "speaker": "sasha",
          "emotion": "concerned",
          "text": "Не слышал. Мы только поздоровались утром. Если он сказал иначе — спроси его, зачем.",
          "choices": [
            { "text": "«Этого достаточно.»", "endConversation": true, "effects": [{ "type": "set", "key": "accusedMax", "value": true }] },
            { "text": "«Возможно, вы оба темните.»", "endConversation": true }
          ]
        },
        "sasha_heard_lie": {
          "speaker": "sasha",
          "emotion": "concerned",
          "text": "Катя говорит, что ты назвалась Библиотекарем. Забавно: Ира утверждает то же самое. Сколько у нас сегодня библиотек?",
          "choices": [
            {
              "text": "Признаться: «Я соврала Кате. На самом деле я Прачка.»",
              "endConversation": true,
              "effects": [
                { "type": "set", "key": "playerClaim", "value": "washerwoman" },
                { "type": "set", "key": "confessedLie", "value": true }
              ]
            },
            { "text": "«Катя всё перепутала.»", "endConversation": true, "effects": [{ "type": "set", "key": "doubledDown", "value": true }] },
            { "text": "«Сначала расскажи о своей единице.»", "goto": "sasha_pair" }
          ]
        },
        "sasha_repeat": {
          "speaker": "sasha",
          "emotion": "amused",
          "text": "Второй разговор со мной — это комплимент или отсутствие новых идей?",
          "choices": [
            { "text": "«Комплимент. Кого номинировать?»", "goto": "sasha_pair" },
            { "text": "«Отсутствие новых идей.»", "endConversation": true }
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
          "text": "Раз уж пришла: я Затворник. Добрая, но чужие способности иногда могут принять меня за зло. Да, звучит подозрительно.",
          "choices": [
            {
              "text": "«Ира назвала тебя или Сашу Затворником.»",
              "goto": "katya_ira",
              "effects": [{ "type": "set", "key": "sharedIraInfo", "value": true }]
            },
            {
              "text": "«Я Прачка. Ищу Библиотекаря между Ирой и Максом.»",
              "goto": "katya_reacts",
              "effects": [{ "type": "set", "key": "playerClaim", "value": "washerwoman" }]
            },
            {
              "text": "Соврать: «Я и есть Библиотекарь.»",
              "goto": "katya_catches_lie",
              "effects": [
                { "type": "set", "key": "liedToKatya", "value": true },
                { "type": "set", "key": "playerClaim", "value": "librarian" }
              ]
            }
          ]
        },
        "katya_ira": {
          "speaker": "katya",
          "emotion": "neutral",
          "text": "Тогда Ира либо настоящая Библиотекарь, либо подготовила очень точную ложь. Я склоняюсь к первому.",
          "choices": [
            { "text": "«А Макс?»", "goto": "katya_max" },
            { "text": "«Этого мне достаточно.»", "endConversation": true, "effects": [{ "type": "set", "key": "trustedIra", "value": true }] }
          ]
        },
        "katya_reacts": {
          "speaker": "katya",
          "emotion": "neutral",
          "text": "Тогда Ира выглядит чисто. Макс утром слишком настойчиво спрашивал, кто получил информацию первой ночью.",
          "choices": [
            { "text": "«Значит, номинируем Макса.»", "endConversation": true, "effects": [{ "type": "set", "key": "accusedMax", "value": true }] },
            { "text": "«Сначала услышу его самого.»", "endConversation": true }
          ]
        },
        "katya_catches_lie": {
          "speaker": "katya",
          "emotion": "angry",
          "text": "Любопытно. Ира тоже назвалась Библиотекарем — и её сведения совпали с моей ролью. Я передам это Саше.",
          "choices": [
            { "text": "«Передай. Посмотрим, что случится.»", "endConversation": true },
            { "text": "«Подожди, это был блеф.»", "endConversation": true, "effects": [{ "type": "set", "key": "triedToRetractLie", "value": true }] }
          ]
        },
        "katya_max": {
          "speaker": "katya",
          "emotion": "nervous",
          "text": "Он назвался Следователем и указал на нас с Ирой. Если казнят меня, моя роль станет очевидной слишком поздно.",
          "choices": [
            { "text": "«Я услышала достаточно.»", "endConversation": true, "effects": [{ "type": "set", "key": "accusedMax", "value": true }] },
            { "text": "«Очевидной — или удобной?»", "endConversation": true }
          ]
        },
        "katya_repeat": {
          "speaker": "katya",
          "emotion": "angry",
          "text": "Мы уже говорили. Пока ты ходила по городу, версии размножились. Что тебе нужно теперь?",
          "choices": [
            { "text": "«Подтверди: Ира сказала правду о твоей роли?»", "goto": "katya_ira" },
            { "text": "«Коротко: кому ты не веришь?»", "goto": "katya_max" },
            { "text": "«Ничего. Извини.»", "endConversation": true }
          ]
        }
      }
    }
  },
  "events": [
    {
      "id": "square-whispers",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [{ "type": "totalConversations", "operator": "gte", "value": 1 }],
      "title": "На другом конце площади",
      "text": "Саша и Катя отходят к окну. Слышно только обрывок: «…слишком удобно». Потом оба смотрят на Макса.",
      "characterIds": ["sasha", "katya"],
      "effects": [{ "type": "set", "key": "sashaKatyaTalked", "value": true }]
    },
    {
      "id": "ira-shares-role",
      "trigger": "afterConversation",
      "once": true,
      "visible": false,
      "when": [{ "type": "variable", "key": "toldIraRole", "operator": "equals", "value": true }],
      "debugText": "Ира сообщила Максу, что игрок назвался Прачкой.",
      "effects": [{ "type": "set", "key": "maxKnowsPlayerRole", "value": true }]
    },
    {
      "id": "lie-travels",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [
        { "type": "totalConversations", "operator": "gte", "value": 2 },
        { "type": "variable", "key": "liedToKatya", "operator": "equals", "value": true }
      ],
      "title": "Слово путешествует быстрее вас",
      "text": "Катя что-то горячо объясняет Саше. Вы различаете только слово «Библиотекарь» — и собственное имя.",
      "characterIds": ["katya", "sasha"],
      "effects": [{ "type": "set", "key": "lieSpread", "value": true }]
    },
    {
      "id": "max-prepares-story",
      "trigger": "afterConversation",
      "once": true,
      "visible": false,
      "when": [{ "type": "totalConversations", "operator": "gte", "value": 2 }],
      "debugText": "Макс подготовил публичное обвинение против Иры.",
      "effects": [{ "type": "set", "key": "maxPreparedStory", "value": true }]
    },
    {
      "id": "bell-rings",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [{ "type": "totalConversations", "operator": "gte", "value": 3 }],
      "title": "Колокол созывает город",
      "text": "Разговоры обрываются. Времени на ещё одну версию уже нет — пора назвать подозреваемого.",
      "effects": []
    }
  ],
  "nomination": {
    "title": "Номинации начинаются",
    "prompt": "Вы услышали только часть разговоров. Кому довериться?",
    "statements": [
      {
        "characterId": "ira",
        "variants": [
          {
            "when": [{ "type": "variable", "key": "trustedIra", "operator": "equals", "value": true }],
            "text": "«Моя информация совпала. Макс строит удобное обвинение.»"
          },
          { "text": "«Я Библиотекарь. Катя подтвердила мою информацию.»" }
        ]
      },
      {
        "characterId": "max",
        "variants": [
          {
            "when": [{ "type": "variable", "key": "maxPreparedStory", "operator": "equals", "value": true }],
            "text": "«Ира — в моей проверке. Её красивая история появилась слишком вовремя.»"
          },
          { "text": "«Моя проверка указывает на Иру или Катю.»" }
        ]
      },
      {
        "characterId": "sasha",
        "variants": [
          {
            "when": [{ "type": "variable", "key": "lieSpread", "operator": "equals", "value": true }],
            "text": "«У нас слишком много Библиотекарей. Но Макс солгал мне раньше.»"
          },
          { "text": "«Моя единица лучше всего объясняется парой Макс—Катя.»" }
        ]
      },
      {
        "characterId": "katya",
        "variants": [
          { "text": "«Я Затворник. Не делайте мою странность доказательством зла.»" }
        ]
      }
    ],
    "allowNobody": true
  },
  "endings": [
    {
      "id": "messy-victory",
      "tone": "victory",
      "title": "Город выжил. Но всё записал.",
      "when": [
        { "type": "nomination", "operator": "equals", "value": "max" },
        { "type": "variable", "key": "lieSpread", "operator": "equals", "value": true }
      ],
      "text": "Макса казнят — и он оказывается Демоном. Ваша ложь не погубила город, зато уже стала главным событием вечера.",
      "epilogue": "Правильный вывод иногда переживает очень неправильный путь."
    },
    {
      "id": "clean-victory",
      "tone": "victory",
      "title": "Город встречает рассвет",
      "when": [{ "type": "nomination", "operator": "equals", "value": "max" }],
      "text": "Макса казнят. Его история рассыпается, и город узнаёт Демона — за минуту до полуночи.",
      "epilogue": "Вы не узнали всего. Вы узнали достаточно."
    },
    {
      "id": "librarian-falls",
      "tone": "defeat",
      "title": "Казнён не тот человек",
      "when": [{ "type": "nomination", "operator": "equals", "value": "ira" }],
      "text": "Ира была настоящим Библиотекарем. Пока город спорит над её записями, Макс спокойно дожидается полуночи.",
      "epilogue": "Уверенность звучала убедительнее правды."
    },
    {
      "id": "wrong-target",
      "tone": "defeat",
      "title": "Демон остаётся в толпе",
      "when": [{ "type": "nomination", "operator": "includes", "value": ["sasha", "katya"] }],
      "text": "Город тратит последнее голосование на доброго игрока. Макс благодарит всех за продуктивное обсуждение.",
      "epilogue": "Самая странная роль оказалась не самой опасной."
    },
    {
      "id": "no-nomination",
      "tone": "defeat",
      "title": "Полночь не ждёт",
      "when": [{ "type": "nomination", "operator": "equals", "value": "nobody" }],
      "text": "Город решает не рисковать. Демон принимает это решение с большим уважением и остаётся в живых.",
      "epilogue": "Отсутствие решения тоже оказалось решением."
    },
    {
      "id": "fallback-ending",
      "tone": "defeat",
      "title": "Колокол бьёт двенадцать",
      "when": [],
      "text": "Демон переживает голосование. Городу придётся внимательнее слушать шёпот в следующий раз.",
      "epilogue": "Не всякая тайна раскрывается за один день."
    }
  ],
  "reveal": [
    { "characterId": "ira", "role": "Библиотекарь", "team": "Добро", "icon": "assets/roles/librarian.png" },
    { "characterId": "max", "role": "Бес", "team": "Зло", "icon": "assets/roles/imp.png" },
    { "characterId": "sasha", "role": "Повар", "team": "Добро", "icon": "assets/roles/chef.png" },
    { "characterId": "katya", "role": "Затворник", "team": "Добро", "icon": "assets/roles/recluse.png" }
  ]
};
