window.DEMO_SCENARIO = {
  "schemaVersion": 2,
  "meta": {
    "id": "hour-before-midnight",
    "title": "Час до полуночи",
    "subtitle": "Одна улика. Два способа убедить город.",
    "menuLabel": "Сценарий I",
    "synopsis": "Расскажите проверку честно или используйте ложную пару как приманку — затем соберите версию, которой поверят.",
    "duration": "5–7 минут",
    "author": "Клуб Blood on the Clocktower",
    "version": "0.3.0"
  },
  "settings": {
    "selectionSeconds": 10,
    "conversationsPerDay": 3,
    "fallback": {
      "characterId": "katya",
      "text": "Катя сама подходит к вам: «Ты собираешься весь день просто смотреть?»"
    }
  },
  "table": {
    "label": "Стол на пять игроков",
    "seats": [
      "you",
      "ira",
      "max",
      "katya",
      "sasha"
    ],
    "note": "Вы сидите между Ирой и Сашей. Макс сидит рядом с Катей."
  },
  "nightVisual": {
    "handImage": "assets/night/storyteller-palm-close.jpg",
    "credit": "Pixabay · CC0 / Public Domain"
  },
  "player": {
    "name": "Вы",
    "roleName": "Прачка",
    "roleIcon": "✦",
    "roleIconImage": "assets/roles/washerwoman.png",
    "team": "Добро",
    "description": "В первую ночь вы узнаёте двух игроков. Роль одного из них названа верно.",
    "task": "Найдите Демона и убедите в этом стол: расскажите ночную пару честно или используйте ложную как приманку.",
    "startingInformation": {
      "label": "Ночная информация",
      "text": "Один из этих двоих — Библиотекарь:",
      "roleIcon": "assets/roles/librarian.png",
      "roleName": "Библиотекарь",
      "suspects": [
        "ira",
        "max"
      ],
      "hint": "Библиотекарь — добрая роль, которая тоже получает информацию в первую ночь."
    },
    "setupNote": "За столом пять игроков: вы и четверо собеседников. Больше за этим столом никого нет."
  },
  "characters": [
    {
      "id": "ira",
      "name": "Ира",
      "tagline": "Слушает прежде, чем говорить",
      "sprites": {
        "neutral": "assets/characters/vn/demo/ira/neutral.png",
        "warm": "assets/characters/vn/demo/ira/warm.png",
        "suspicious": "assets/characters/vn/demo/ira/suspicious.png"
      },
      "startingTrust": 0,
      "allyHint": "Ира сверяет сведения, а не настроения. Пока ваши не сошлись.",
      "allyHintUnmet": "Вы так и не поговорили с Ирой.",
      "views": {
        "max": 1,
        "katya": 0
      }
    },
    {
      "id": "max",
      "name": "Макс",
      "tagline": "Уже собрал свою версию",
      "sprites": {
        "neutral": "assets/characters/vn/demo/max/neutral.png",
        "confident": "assets/characters/vn/demo/max/confident.png",
        "nervous": "assets/characters/vn/demo/max/nervous.png"
      },
      "startingTrust": 0,
      "allyHint": "Макс охотно берёт чужие секреты и почти ничего не отдаёт.",
      "allyHintUnmet": "Вы так и не поговорили с Максом.",
      "views": {
        "ira": 2,
        "katya": 1
      }
    },
    {
      "id": "sasha",
      "name": "Саша",
      "tagline": "Считает пары и совпадения",
      "sprites": {
        "neutral": "assets/characters/vn/demo/sasha/neutral.png",
        "amused": "assets/characters/vn/demo/sasha/amused.png",
        "concerned": "assets/characters/vn/demo/sasha/concerned.png"
      },
      "startingTrust": 0,
      "allyHint": "Саша считает пары. Одних слов ему мало.",
      "allyHintUnmet": "Вы так и не поговорили с Сашей.",
      "views": {
        "max": 1,
        "katya": 1
      }
    },
    {
      "id": "katya",
      "name": "Катя",
      "tagline": "Не любит говорить первой",
      "sprites": {
        "neutral": "assets/characters/vn/demo/katya/neutral.png",
        "angry": "assets/characters/vn/demo/katya/angry.png",
        "nervous": "assets/characters/vn/demo/katya/nervous.png"
      },
      "startingTrust": -1,
      "allyHint": "Катя ждёт, что её странную роль используют против неё.",
      "allyHintUnmet": "Вы так и не поговорили с Катей.",
      "views": {
        "max": 1,
        "ira": 0
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
    "maxPreparedStory": false,
    "baitedMax": false,
    "bluffExposed": false
  },
  "dialogues": {
    "ira": {
      "start": "ira_start",
      "startRules": [
        {
          "when": [
            {
              "type": "trust",
              "characterId": "ira",
              "operator": "gte",
              "value": 3
            }
          ],
          "node": "ira_allied"
        },
        {
          "when": [
            {
              "type": "conversationCount",
              "characterId": "ira",
              "operator": "gte",
              "value": 1
            }
          ],
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
                {
                  "type": "set",
                  "key": "toldIraRole",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "washerwoman"
                },
                {
                  "type": "set",
                  "key": "trustedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 2
                }
              ]
            },
            {
              "text": "Соврать: «Я Повар. У меня ноль пар зла.»",
              "goto": "ira_lie",
              "effects": [
                {
                  "type": "set",
                  "key": "liedToIra",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "chef"
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы назвались Поваром, а эту роль за столом уже занял Саша."
                }
              ]
            },
            {
              "text": "«Почему я должна тебе верить?»",
              "goto": "ira_proof"
            },
            {
              "text": "«Я дала Максу ложную пару. Он уже использует её против тебя.»",
              "conditions": [
                {
                  "type": "variable",
                  "key": "baitedMax",
                  "operator": "equals",
                  "value": true
                }
              ],
              "goto": "ira_bluff_case"
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
              "effects": [
                {
                  "type": "set",
                  "key": "askedIraForSecrecy",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Проверь его историю. Потом найдём друг друга.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "askedIraToCheckMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "ira",
                  "targetId": "max",
                  "value": 1
                }
              ]
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
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedSasha",
                  "value": true
                },
                {
                  "type": "suspicion",
                  "characterId": "ira",
                  "targetId": "sasha",
                  "value": 1
                }
              ]
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
              "effects": [
                {
                  "type": "set",
                  "key": "accusedMax",
                  "value": true
                }
              ]
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
              "effects": [
                {
                  "type": "set",
                  "key": "accusedMax",
                  "value": true
                },
                {
                  "type": "suspicion",
                  "characterId": "ira",
                  "targetId": "max",
                  "value": 1
                }
              ]
            },
            {
              "text": "Признаться, что в прошлый раз соврали",
              "goto": "ira_confession",
              "conditions": [
                {
                  "type": "variable",
                  "key": "liedToIra",
                  "operator": "equals",
                  "value": true
                }
              ],
              "effects": [
                {
                  "type": "set",
                  "key": "trustedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Ничего. Хотела услышать твою версию ещё раз.»",
              "endConversation": true
            }
          ]
        },
        "ira_max_case": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Он назвался Сыщиком и толкает казнь в меня. Слишком удобная история. Я проголосую за него.",
          "choices": [
            {
              "text": "«Тогда держимся вместе.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "trustedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "ira",
                  "targetId": "max",
                  "value": 1
                }
              ]
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
                {
                  "type": "set",
                  "key": "toldIraRole",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "washerwoman"
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 1
                }
              ]
            },
            {
              "text": "Оставить всё как есть",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы признались, что соврали, и не назвали настоящую роль."
                }
              ]
            }
          ]
        },
        "ira_allied": {
          "speaker": "ira",
          "emotion": "warm",
          "text": "Я тебе верю. Скажи прямо: сегодня казним или ждём ночи? Я подниму руку там, где скажешь, но потом это будет и моя ошибка тоже.",
          "choices": [
            {
              "text": "«Казним Макса. Другого дня у нас может не быть.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "ira",
                  "targetId": "max",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Сегодня никого. Пусть ночь покажет, кого Демон боится.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "ira",
                  "targetId": "max",
                  "value": -1
                }
              ]
            },
            {
              "text": "«Решай сама. Я не хочу отвечать за чужую казнь.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Ира попросила прямого ответа, а вы переложили решение на неё."
                }
              ]
            }
          ]
        },
        "ira_bluff_case": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Значит, ты проверяла не мою роль, а его реакцию. Какую пару Рассказчик показал на самом деле?",
          "choices": [
            {
              "text": "«Ира или Макс. Он поспешил сделать тебя целью, когда я убрала его из пары.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "bluffExposed",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "toldIraRole",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "washerwoman"
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 2
                },
                {
                  "type": "suspicion",
                  "characterId": "ira",
                  "targetId": "max",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Настоящую пару пока не раскрою.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы признались в блефе, но не дали Ире настоящую проверку."
                }
              ]
            }
          ]
        }
      }
    },
    "max": {
      "start": "max_start",
      "startRules": [
        {
          "when": [
            {
              "type": "suspicion",
              "characterId": "sasha",
              "targetId": "max",
              "operator": "gte",
              "value": 2
            }
          ],
          "node": "max_cornered"
        },
        {
          "when": [
            {
              "type": "conversationCount",
              "characterId": "max",
              "operator": "gte",
              "value": 1
            }
          ],
          "node": "max_repeat"
        },
        {
          "when": [
            {
              "type": "variable",
              "key": "maxKnowsPlayerRole",
              "operator": "equals",
              "value": true
            }
          ],
          "node": "max_knows"
        }
      ],
      "nodes": {
        "max_start": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Я Сыщик. Между Ирой и Катей есть приспешник Демона. Сегодня нужно казнить одну из них.",
          "choices": [
            {
              "text": "«Ира говорит, что она Библиотекарь.»",
              "goto": "max_pushes_ira",
              "effects": [
                {
                  "type": "set",
                  "key": "sharedIraClaim",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "max",
                  "targetId": "ira",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Я Прачка. Моя информация подозрительна для тебя.»",
              "goto": "max_deflects",
              "effects": [
                {
                  "type": "set",
                  "key": "toldMaxRole",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "maxKnowsPlayerRole",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "washerwoman"
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Кто уже слышал эту версию?»",
              "goto": "max_network"
            },
            {
              "text": "Блеф: «Я Прачка. Библиотекарь — Ира или Катя.»",
              "goto": "max_bluff",
              "effects": [
                {
                  "type": "set",
                  "key": "baitedMax",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "washerwoman"
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                }
              ]
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
              "effects": [
                {
                  "type": "set",
                  "key": "noticedLeak",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы обвинили Макса в том, что он выведал вашу роль."
                }
              ]
            },
            {
              "text": "«Что именно она сказала?»",
              "goto": "max_deflects"
            },
            {
              "text": "«Удобно. Теперь ты знаешь, кого убрать ночью.»",
              "goto": "max_accused",
              "effects": [
                {
                  "type": "set",
                  "key": "accusedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -2,
                  "note": "Вы прямо сказали Максу, что считаете его Демоном."
                }
              ]
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
              "effects": [
                {
                  "type": "set",
                  "key": "accusedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы отказались повторять версию Макса."
                }
              ]
            },
            {
              "text": "«Допустим. Я поговорю с Катей.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "leanedTowardMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "max",
                  "targetId": "ira",
                  "value": 1
                }
              ]
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
              "effects": [
                {
                  "type": "set",
                  "key": "accusedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы спросили Макса, почему он торопит казнь."
                }
              ]
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
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Или Саша вообще ничего не слышал.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "doubtedMaxNetwork",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы усомнились в том, что Макс вообще с кем-то говорил."
                }
              ]
            },
            {
              "text": "«Саша считает, что твоя пара с Катей объясняет его единицу.»",
              "conditions": [
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "max",
                  "operator": "gte",
                  "value": 2
                }
              ],
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "max",
                  "targetId": "sasha",
                  "value": 2
                }
              ]
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
              "effects": [
                {
                  "type": "set",
                  "key": "accusedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Разговор кончился тем, что Макс поймал вас на просьбе молчать."
                }
              ]
            }
          ]
        },
        "max_accused": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Сильное обвинение для человека с одной ночной подсказкой. Надеюсь, на площади у тебя будет что-то ещё.",
          "choices": [
            {
              "text": "«Увидимся на площади.»",
              "endConversation": true
            },
            {
              "text": "«Может быть, я блефую.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы сами сказали Максу, что могли блефовать."
                }
              ]
            }
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
              "effects": [
                {
                  "type": "set",
                  "key": "accusedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы сказали Максу, что он повторяется без фактов."
                }
              ]
            },
            {
              "text": "«Расскажи ещё раз про Сыщика.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "leanedTowardMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                }
              ]
            }
          ]
        },
        "max_cornered": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Саша ходит по столу и пересчитывает соседей. Если он остановится на мне, город потеряет день на пустую казнь. Ты ведь это понимаешь?",
          "choices": [
            {
              "text": "«Понимаю. Объясни, откуда у тебя проверка Сыщика.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы потребовали у Макса объяснить его проверку."
                }
              ]
            },
            {
              "text": "«Пустую — вряд ли. Ты первым назвал имена.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -2,
                  "note": "Вы сказали Максу, что казнь его пустой не будет."
                }
              ]
            },
            {
              "text": "«Успокойся. Я не тороплю стол.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "max",
                  "targetId": "sasha",
                  "value": 1
                }
              ]
            }
          ]
        },
        "max_bluff": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Ира или Катя? Тогда моя проверка и твоя пересекаются на них обеих. Удобно: можно проверить Иру прямо сегодня.",
          "choices": [
            {
              "text": "«Сначала спрошу, кому ты повторишь мою пару.»",
              "endConversation": true
            },
            {
              "text": "«Расскажи её Саше. Посмотрим, что он скажет.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "suspicion",
                  "characterId": "max",
                  "targetId": "ira",
                  "value": 1
                }
              ]
            }
          ]
        }
      }
    },
    "sasha": {
      "start": "sasha_start",
      "startRules": [
        {
          "when": [
            {
              "type": "variable",
              "key": "lieSpread",
              "operator": "equals",
              "value": true
            }
          ],
          "node": "sasha_heard_lie"
        },
        {
          "when": [
            {
              "type": "trust",
              "characterId": "katya",
              "operator": "gte",
              "value": 2
            },
            {
              "type": "spokenTo",
              "characterId": "katya",
              "operator": "truthy"
            }
          ],
          "node": "sasha_vouched"
        },
        {
          "when": [
            {
              "type": "conversationCount",
              "characterId": "sasha",
              "operator": "gte",
              "value": 1
            }
          ],
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
              "goto": "sasha_max",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "max",
                  "value": 1
                }
              ]
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
              "effects": [
                {
                  "type": "set",
                  "key": "accusedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "max",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Проверю Катю.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "katya",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Катя сама назвалась Затворником — её странность объясняется без зла.»",
              "conditions": [
                {
                  "type": "spokenTo",
                  "characterId": "katya",
                  "operator": "truthy"
                }
              ],
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "katya",
                  "value": -2
                },
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "max",
                  "value": 1
                }
              ]
            }
          ]
        },
        "sasha_katya": {
          "speaker": "sasha",
          "emotion": "amused",
          "text": "Сказала, что Затворник. Её роль может выглядеть злой для чужих способностей. Очень удобное объяснение. И иногда правдивое.",
          "choices": [
            {
              "text": "«Это подтверждает Иру.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "trustedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "katya",
                  "value": -1
                }
              ]
            },
            {
              "text": "«Или они договорились.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "katya",
                  "value": 1
                }
              ]
            }
          ]
        },
        "sasha_max": {
          "speaker": "sasha",
          "emotion": "concerned",
          "text": "Не слышал. Мы только поздоровались утром. Если он сказал иначе — спроси его, зачем.",
          "choices": [
            {
              "text": "«Этого достаточно.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "accusedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "max",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Возможно, вы оба темните.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": -1,
                  "note": "Вы предположили, что Саша темнит вместе с Максом."
                }
              ]
            }
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
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "washerwoman"
                },
                {
                  "type": "set",
                  "key": "confessedLie",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Катя всё перепутала.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "doubledDown",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": -2,
                  "note": "Вы настояли на лжи, которую Саша уже успел проверить."
                }
              ]
            },
            {
              "text": "«Сначала расскажи о своей единице.»",
              "goto": "sasha_pair"
            }
          ]
        },
        "sasha_repeat": {
          "speaker": "sasha",
          "emotion": "amused",
          "text": "Второй разговор со мной — это комплимент или отсутствие новых идей?",
          "choices": [
            {
              "text": "«Комплимент. Кого номинировать?»",
              "goto": "sasha_pair"
            },
            {
              "text": "«Отсутствие новых идей.»",
              "endConversation": true
            }
          ]
        },
        "sasha_vouched": {
          "speaker": "sasha",
          "emotion": "neutral",
          "text": "Катя за тебя поручилась. Ей есть что терять, значит, слова чего-то стоят. Что у тебя есть, кроме слов?",
          "choices": [
            {
              "text": "«Ночная информация. Один из пары Ира—Макс — Библиотекарь.»",
              "goto": "sasha_pair",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 2
                },
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "washerwoman"
                }
              ]
            },
            {
              "text": "«Пока только чужие версии. Расскажи про свою единицу.»",
              "goto": "sasha_pair",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                }
              ]
            }
          ]
        }
      }
    },
    "katya": {
      "start": "katya_start",
      "startRules": [
        {
          "when": [
            {
              "type": "trust",
              "characterId": "katya",
              "operator": "lte",
              "value": -2
            }
          ],
          "node": "katya_afraid"
        },
        {
          "when": [
            {
              "type": "conversationCount",
              "characterId": "katya",
              "operator": "gte",
              "value": 1
            }
          ],
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
              "effects": [
                {
                  "type": "set",
                  "key": "sharedIraInfo",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Я Прачка. Ищу Библиотекаря между Ирой и Максом.»",
              "goto": "katya_reacts",
              "effects": [
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "washerwoman"
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 2
                }
              ]
            },
            {
              "text": "Соврать: «Я и есть Библиотекарь.»",
              "goto": "katya_catches_lie",
              "effects": [
                {
                  "type": "set",
                  "key": "liedToKatya",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "librarian"
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -3,
                  "note": "Вы назвались Библиотекарем при игроке, который уже слышал это от Иры."
                }
              ]
            }
          ]
        },
        "katya_ira": {
          "speaker": "katya",
          "emotion": "neutral",
          "text": "Тогда Ира либо настоящая Библиотекарь, либо подготовила очень точную ложь. Я склоняюсь к первому.",
          "choices": [
            {
              "text": "«А Макс?»",
              "goto": "katya_max"
            },
            {
              "text": "«Этого мне достаточно.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "trustedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 1
                }
              ]
            }
          ]
        },
        "katya_reacts": {
          "speaker": "katya",
          "emotion": "neutral",
          "text": "Тогда Ира выглядит чисто. Макс утром слишком настойчиво спрашивал, кто получил информацию первой ночью.",
          "choices": [
            {
              "text": "«Значит, номинируем Макса.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "accusedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "katya",
                  "targetId": "max",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Сначала услышу его самого.»",
              "endConversation": true
            }
          ]
        },
        "katya_catches_lie": {
          "speaker": "katya",
          "emotion": "angry",
          "text": "Любопытно. Ира тоже назвалась Библиотекарем — и её сведения совпали с моей ролью. Я передам это Саше.",
          "choices": [
            {
              "text": "«Передай. Посмотрим, что случится.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -1,
                  "note": "Вы разрешили Кате пересказать вашу ложь."
                }
              ]
            },
            {
              "text": "«Подожди, это был блеф.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "triedToRetractLie",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 1
                }
              ]
            }
          ]
        },
        "katya_max": {
          "speaker": "katya",
          "emotion": "nervous",
          "text": "Он назвался Сыщиком и указал на нас с Ирой. Если казнят меня, моя роль станет очевидной слишком поздно.",
          "choices": [
            {
              "text": "«Я услышала достаточно.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "accusedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "katya",
                  "targetId": "max",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Очевидной — или удобной?»",
              "endConversation": true
            }
          ]
        },
        "katya_repeat": {
          "speaker": "katya",
          "emotion": "angry",
          "text": "Мы уже говорили. Пока ты ходила по городу, версии размножились. Что тебе нужно теперь?",
          "choices": [
            {
              "text": "«Подтверди: Ира сказала правду о твоей роли?»",
              "goto": "katya_ira"
            },
            {
              "text": "«Коротко: кому ты не веришь?»",
              "goto": "katya_max"
            },
            {
              "text": "«Ничего. Извини.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -1,
                  "note": "Вы пришли к Кате и не нашли, что сказать."
                }
              ]
            }
          ]
        },
        "katya_afraid": {
          "speaker": "katya",
          "emotion": "nervous",
          "text": "Ты уже один раз рассказала обо мне не то. Я Затворник, меня и без твоей помощи казнят по ошибке.",
          "choices": [
            {
              "text": "«Я была неправа. Скажи, что тебе нужно от стола.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Тогда просто не поднимай руку сегодня.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "suspicion",
                  "characterId": "katya",
                  "targetId": "max",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Затворник — удобная роль, чтобы объяснить что угодно.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -1,
                  "note": "Вы вслух усомнились в роли, которой Катя и так боится."
                }
              ]
            }
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
      "when": [
        {
          "type": "totalConversations",
          "operator": "gte",
          "value": 1
        }
      ],
      "title": "На другом конце площади",
      "text": "Саша и Катя отходят к окну. Слышно только обрывок: «…слишком удобно». Потом оба смотрят на Макса.",
      "characterIds": [
        "sasha",
        "katya"
      ],
      "effects": [
        {
          "type": "set",
          "key": "sashaKatyaTalked",
          "value": true
        }
      ]
    },
    {
      "id": "false-pair-travels",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [
        {
          "type": "variable",
          "key": "baitedMax",
          "operator": "equals",
          "value": true
        },
        {
          "type": "spokenTo",
          "characterId": "max",
          "operator": "truthy"
        }
      ],
      "title": "Слова пошли по кругу",
      "text": "Макс пересказывает Саше вашу ложную пару «Ира или Катя» и снова предлагает проверить Иру. Вы слышите собственные слова в чужой версии.",
      "characterIds": [
        "max",
        "sasha"
      ],
      "effects": [
        {
          "type": "set",
          "key": "falsePairSpread",
          "value": true
        }
      ]
    },
    {
      "id": "ira-shares-role",
      "trigger": "afterConversation",
      "once": true,
      "visible": false,
      "when": [
        {
          "type": "variable",
          "key": "toldIraRole",
          "operator": "equals",
          "value": true
        }
      ],
      "debugText": "Ира сообщила Максу, что игрок назвался Прачкой.",
      "effects": [
        {
          "type": "set",
          "key": "maxKnowsPlayerRole",
          "value": true
        }
      ]
    },
    {
      "id": "lie-travels",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [
        {
          "type": "totalConversations",
          "operator": "gte",
          "value": 2
        },
        {
          "type": "variable",
          "key": "liedToKatya",
          "operator": "equals",
          "value": true
        }
      ],
      "title": "Слово путешествует быстрее вас",
      "text": "Катя что-то горячо объясняет Саше. Вы различаете только слово «Библиотекарь» — и собственное имя.",
      "characterIds": [
        "katya",
        "sasha"
      ],
      "effects": [
        {
          "type": "set",
          "key": "lieSpread",
          "value": true
        }
      ]
    },
    {
      "id": "max-prepares-story",
      "trigger": "afterConversation",
      "once": true,
      "visible": false,
      "when": [
        {
          "type": "totalConversations",
          "operator": "gte",
          "value": 2
        }
      ],
      "debugText": "Макс подготовил публичное обвинение против Иры.",
      "effects": [
        {
          "type": "set",
          "key": "maxPreparedStory",
          "value": true
        }
      ]
    },
    {
      "id": "bell-rings",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [
        {
          "type": "totalConversations",
          "operator": "gte",
          "value": 3
        }
      ],
      "title": "Пора вернуться к столу",
      "text": "Рассказчик собирает всех у стола. Перед общим обсуждением решите, кому доверите свою версию.",
      "effects": []
    }
  ],
  "endings": [
    {
      "id": "executed-demon-after-bluff",
      "when": [
        {
          "type": "executed",
          "operator": "equals",
          "value": "max"
        },
        {
          "type": "variable",
          "key": "bluffExposed",
          "operator": "equals",
          "value": true
        }
      ],
      "tone": "victory",
      "label": "Разбор дня",
      "title": "Приманка сработала",
      "text": "Вы назвали Максу ложную пару, услышали, как он использовал её против Иры, и затем раскрыли Ире настоящую проверку. Она помогла собрать голоса. Макс оказался Чёртом; добро победило.",
      "epilogue": "Ложь принесла пользу, потому что вы вовремя показали, где она кончается.",
      "debrief": [
        "Вы дали Максу неверную пару, чтобы увидеть, куда он направит разговор.",
        "Макс пересказал её и сразу предложил казнить Иру.",
        "Вы раскрыли настоящую пару и убедили Иру проверить его версию."
      ]
    },
    {
      "id": "executed-demon-with-ally",
      "when": [
        {
          "type": "executed",
          "operator": "equals",
          "value": "max"
        },
        {
          "type": "approach",
          "operator": "equals",
          "value": "accepted"
        }
      ],
      "tone": "victory",
      "label": "Итог дня",
      "title": "Демон казнён в первый же день",
      "text": "Вы не просто угадали — вы привели к столу человека, который поднял руку вместе с вами. Макс был Чёртом. Партия закончилась днём, без единой ночной смерти.",
      "epilogue": "Так выглядит идеальный день доброго игрока. Он бывает редко.",
      "debrief": [
        "Вы открыли свою ночную пару союзнику.",
        "Другие сведения сошлись против Макса.",
        "Союзник поднял руку за проверяемую версию."
      ]
    },
    {
      "id": "executed-demon",
      "when": [
        {
          "type": "executed",
          "operator": "equals",
          "value": "max"
        }
      ],
      "tone": "victory",
      "label": "Итог дня",
      "title": "Вы угадали Демона",
      "text": "Стол вывел на плаху Макса, и жетон оказался Чёртом. Вы шли к этому в одиночку, и половину рук собрали чужие сомнения, а не ваши доводы — но результат один.",
      "epilogue": "Добро выигрывает казнью Демона. Сегодня повезло.",
      "debrief": [
        "Вы сопоставили ночную пару с тем, как Макс использовал чужие слова.",
        "Город собрал голоса против Макса.",
        "Казнённый Макс оказался Демоном."
      ]
    },
    {
      "id": "executed-you",
      "when": [
        {
          "type": "executed",
          "operator": "equals",
          "value": "you"
        }
      ],
      "tone": "defeat",
      "label": "Итог дня",
      "title": "Казнили вас",
      "text": "К вечеру ваше имя оказалось единственным, вокруг которого сошлись руки. Прачка умирает, её ночная информация уходит вместе с ней, а Чёрт получает свободную ночь.",
      "epilogue": "Доброму игроку опаснее всего выглядеть неудобно."
    },
    {
      "id": "executed-recluse",
      "when": [
        {
          "type": "executed",
          "operator": "equals",
          "value": "katya"
        }
      ],
      "tone": "defeat",
      "label": "Итог дня",
      "title": "Казнили Затворника",
      "text": "Катя говорила правду: она добрая, и её роль просто выглядит злой для чужих способностей. Город потратил день на игрока, который был на его стороне, а Чёрт даже не стал ничего доказывать.",
      "epilogue": "Изгой умирает от чужой уверенности чаще, чем от чужого расчёта."
    },
    {
      "id": "executed-good",
      "when": [
        {
          "type": "executedTeam",
          "operator": "equals",
          "value": "Добро"
        }
      ],
      "tone": "defeat",
      "label": "Итог дня",
      "title": "Казнили доброго",
      "text": "На плахе остался добрый игрок. В первый день это худшая из возможных сделок: город отдал голос, роль и ночь — и не получил ничего.",
      "epilogue": "Казнь в первый день — это ставка. Вы её проиграли."
    },
    {
      "id": "betrayed",
      "when": [
        {
          "type": "approach",
          "operator": "equals",
          "value": "betrayed"
        }
      ],
      "tone": "defeat",
      "label": "Итог дня",
      "title": "Разговор ушёл к столу",
      "text": "Тот, к кому вы подошли, отказался — и пересказал разговор всем. Теперь стол знает, кому вы верите и что у вас за версия. Чёрту не пришлось выяснять это самому.",
      "epilogue": "Личный разговор перестаёт быть личным на второй минуте."
    },
    {
      "id": "survived-nomination",
      "when": [
        {
          "type": "nominatedPlayer",
          "operator": "truthy"
        },
        {
          "type": "votesAgainstPlayer",
          "operator": "gte",
          "value": 2
        }
      ],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "Ваше имя прозвучало первым",
      "text": "Вас номинировали, и рук не хватило — но день вы закончили оправдываясь, а не проверяя. Завтра ваша ночная информация будет стоить ровно столько, сколько стол вам поверит.",
      "epilogue": "Пережить номинацию не то же самое, что остаться вне подозрений."
    },
    {
      "id": "trust-repair",
      "when": [
        {
          "type": "decision",
          "operator": "equals",
          "value": "ira"
        },
        {
          "type": "variable",
          "key": "lieSpread",
          "operator": "equals",
          "value": true
        },
        {
          "type": "approach",
          "operator": "equals",
          "value": "accepted"
        }
      ],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "Союз с оговорками",
      "text": "Ира согласилась держаться вместе, хотя ваша ложь уже успела обойти стол. Работать с вами она будет, верить каждому слову — нет.",
      "epilogue": "Ложь дешевле всего стоит тому, кто признался в ней первым."
    },
    {
      "id": "trusted-librarian",
      "when": [
        {
          "type": "decision",
          "operator": "equals",
          "value": "ira"
        },
        {
          "type": "variable",
          "key": "trustedIra",
          "operator": "equals",
          "value": true
        },
        {
          "type": "approach",
          "operator": "equals",
          "value": "accepted"
        }
      ],
      "tone": "victory",
      "label": "Итог дня",
      "title": "Есть с кем сверить записи",
      "text": "Ира и правда Библиотекарь. Две ночные подсказки, сложенные вместе, — это уже не догадка, а версия, и завтра вы придёте к столу не с пустыми руками.",
      "epilogue": "Добро выигрывает не догадками, а сведениями, которые сошлись."
    },
    {
      "id": "new-librarian-contact",
      "when": [
        {
          "type": "decision",
          "operator": "equals",
          "value": "ira"
        },
        {
          "type": "approach",
          "operator": "equals",
          "value": "accepted"
        }
      ],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "Первый шаг навстречу",
      "text": "Ира согласилась, но вашу роль вы так и не назвали. Союз есть, общей картины пока нет — а ночь коротка.",
      "epilogue": "Доверие без сведений держится ровно до первого спора."
    },
    {
      "id": "trusted-demon",
      "when": [
        {
          "type": "decision",
          "operator": "equals",
          "value": "max"
        },
        {
          "type": "approach",
          "operator": "equals",
          "value": "accepted"
        }
      ],
      "tone": "defeat",
      "label": "Итог дня",
      "title": "Секрет достался Максу",
      "text": "Вы договорились держаться одной версии с Чёртом. Он знает вашу роль, знает, кому вы верите, и знает, кого убирать ночью первым.",
      "epilogue": "Самый опасный союзник — тот, кто соглашается слишком легко."
    },
    {
      "id": "trusted-chef",
      "when": [
        {
          "type": "decision",
          "operator": "equals",
          "value": "sasha"
        },
        {
          "type": "approach",
          "operator": "equals",
          "value": "accepted"
        }
      ],
      "tone": "victory",
      "label": "Итог дня",
      "title": "Проверить, а не повторить",
      "text": "Саша — настоящий Повар, и его единица никуда не денется до завтра. Вы уходите со стола с человеком, который считает пары, а не верит интонациям.",
      "epilogue": "Числа переживают любую ночь. Слова — не всегда."
    },
    {
      "id": "trusted-recluse",
      "when": [
        {
          "type": "decision",
          "operator": "equals",
          "value": "katya"
        },
        {
          "type": "approach",
          "operator": "equals",
          "value": "accepted"
        }
      ],
      "tone": "victory",
      "label": "Итог дня",
      "title": "Услышать неудобную роль",
      "text": "Катя — Затворник, и вы единственная, кто выслушал её без готового приговора. Завтра она скажет вам правду раньше, чем городу.",
      "epilogue": "Изгой — не ошибка в раздаче, а игрок, которого некому защитить."
    },
    {
      "id": "refused",
      "when": [
        {
          "type": "approach",
          "operator": "equals",
          "value": "refused"
        }
      ],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "Вам отказали",
      "text": "Союз не сложился, но и лишнего вы не сказали. День прошёл впустую — а впустую для доброго игрока в первый день это почти нормально.",
      "epilogue": "Осторожный отказ дешевле громкой ошибки."
    },
    {
      "id": "alone",
      "when": [
        {
          "type": "decision",
          "operator": "equals",
          "value": "nobody"
        }
      ],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "Свою версию вы оставили при себе",
      "text": "Вы никому не предложили союз и никого не вывели на плаху. Ваша ночная информация цела, но защищать её завтра придётся в одиночку.",
      "epilogue": "Молчание сохраняет сведения и тратит день."
    },
    {
      "id": "fallback-ending",
      "when": [],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "Обсуждение продолжается",
      "text": "Вы возвращаетесь за общий стол. Версии останутся на завтра, а ночь всё расставит по местам.",
      "epilogue": "Партия продолжается."
    }
  ],
  "reveal": [
    {
      "characterId": "ira",
      "role": "Библиотекарь",
      "team": "Добро",
      "icon": "assets/roles/librarian.png"
    },
    {
      "characterId": "max",
      "role": "Чёрт",
      "team": "Зло",
      "icon": "assets/roles/imp.png"
    },
    {
      "characterId": "sasha",
      "role": "Повар",
      "team": "Добро",
      "icon": "assets/roles/chef.png"
    },
    {
      "characterId": "katya",
      "role": "Затворник",
      "team": "Добро",
      "icon": "assets/roles/recluse.png"
    }
  ],
  "decision": {
    "title": "К кому вы подойдёте перед обсуждением?",
    "prompt": "Подойти можно к любому. Вопрос в том, станет ли он держаться вашей версии — и что сделает, если откажет.",
    "statements": [
      {
        "characterId": "ira",
        "variants": [
          {
            "when": [
              {
                "type": "variable",
                "key": "trustedIra",
                "operator": "equals",
                "value": true
              }
            ],
            "text": "«Моя информация совпала. Макс строит удобное обвинение.»"
          },
          {
            "text": "«Я Библиотекарь. Катя подтвердила мою информацию.»"
          }
        ]
      },
      {
        "characterId": "max",
        "variants": [
          {
            "when": [
              {
                "type": "variable",
                "key": "maxPreparedStory",
                "operator": "equals",
                "value": true
              }
            ],
            "text": "«Ира — в моей проверке. Её красивая история появилась слишком вовремя.»"
          },
          {
            "text": "«Моя проверка указывает на Иру или Катю.»"
          }
        ]
      },
      {
        "characterId": "sasha",
        "variants": [
          {
            "when": [
              {
                "type": "variable",
                "key": "lieSpread",
                "operator": "equals",
                "value": true
              }
            ],
            "text": "«У нас слишком много Библиотекарей. Но Макс солгал мне раньше.»"
          },
          {
            "text": "«Моя единица лучше всего объясняется парой Макс—Катя.»"
          }
        ]
      },
      {
        "characterId": "katya",
        "variants": [
          {
            "text": "«Я Затворник. Не делайте мою странность доказательством зла.»"
          }
        ]
      }
    ],
    "allowNobody": true,
    "actionLabel": "Предложить союз",
    "allyTrust": 1,
    "refuseBelow": -3,
    "betrayBelow": -1,
    "odds": [
      {
        "minTrust": 2,
        "chance": 0.95
      },
      {
        "minTrust": 1,
        "chance": 0.85
      },
      {
        "minTrust": 0,
        "chance": 0.5
      },
      {
        "minTrust": -1,
        "chance": 0.25
      },
      {
        "minTrust": -2,
        "chance": 0.1
      }
    ]
  },
  "trust": {
    "min": -4,
    "max": 4
  },
  "vote": {
    "title": "Стол решает, казнить ли сегодня",
    "prompt": "Ваша номинация. Днём первой партии казнь — это ставка: угадали — сняли Демона, ошиблись — отдали злу доброго игрока. Промолчать тоже ход.",
    "abstainLabel": "Промолчать",
    "majority": 3,
    "voteAt": 2,
    "nominateAt": 2,
    "urgentAt": 3
  }
};
