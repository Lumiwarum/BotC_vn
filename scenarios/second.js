window.SECOND_SCENARIO = {
  "schemaVersion": 2,
  "meta": {
    "id": "quiet-conspiracy",
    "title": "Тихий заговор",
    "subtitle": "Последний день. Одна верная казнь.",
    "menuLabel": "Сценарий II",
    "synopsis": "Живых осталось трое. Казнить Демона — победа; ошибиться или промолчать — проиграть.",
    "duration": "5–7 минут",
    "author": "Клуб Blood on the Clocktower",
    "version": "0.3.0"
  },
  "settings": {
    "selectionSeconds": 10,
    "conversationsPerDay": 3,
    "fallback": {
      "characterId": "sasha",
      "text": "Саша стучит по своим записям: «Если ты никого не выберешь, версии выберут тебя»."
    },
    "dayNumber": 3
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
    "note": "За столом пятеро; Макс и Саша погибли раньше. Живы вы, Ира и Катя. У каждого мёртвого остался один последний голос.",
    "ghostVotes": true,
    "dead": [
      "max",
      "sasha"
    ]
  },
  "finalNight": {
    "victim": "katya"
  },
  "nightVisual": {
    "handImage": "assets/night/storyteller-palm-close.jpg",
    "credit": "Pixabay · CC0 / Public Domain"
  },
  "player": {
    "name": "Вы",
    "roleName": "Сыщик",
    "roleIcon": "✦",
    "roleIconImage": "assets/roles/investigator.png",
    "team": "Добро",
    "description": "В первую ночь вы узнаёте: один из двух игроков — Отравитель.",
    "task": "Добейтесь казни Демона сегодня. Ошибочная казнь или пропуск отдадут победу злу.",
    "startingInformation": {
      "label": "Ночная информация",
      "text": "Один из этих двоих — Отравитель:",
      "roleIcon": "assets/roles/poisoner.png",
      "roleName": "Отравитель",
      "suspects": [
        "max",
        "sasha"
      ],
      "hint": "Отравитель помогает Демону и делает сведения добрых ролей ненадёжными. Приспешник в этой партии один. Демон ещё жив — иначе партия уже закончилась бы."
    },
    "setupNote": "Это последний день партии на пять человек. Макс и Саша погибли раньше: они могут разговаривать, но не номинировать. У каждого мёртвого остался один последний голос, и тратят его только наверняка. Для казни нужны две руки — живых или мёртвых.",
    "phaseLabel": "Вспомните первую ночь"
  },
  "characters": [
    {
      "id": "ira",
      "name": "Ира",
      "tagline": "Говорит быстро и уверенно",
      "sprites": {
        "neutral": "assets/characters/vn/second/ira/neutral.png",
        "warm": "assets/characters/vn/second/ira/warm.png",
        "suspicious": "assets/characters/vn/second/ira/suspicious.png"
      },
      "startingTrust": 0,
      "allyHint": "Ира собирает чужие роли быстрее, чем отдаёт свои. Пока вы ей ничего не дали.",
      "allyHintUnmet": "Вы так и не поговорили с Ирой.",
      "views": {
        "katya": 1
      }
    },
    {
      "id": "max",
      "name": "Макс",
      "tagline": "Мёртв, но продолжает спорить",
      "sprites": {
        "neutral": "assets/characters/vn/second/max/neutral.png",
        "confident": "assets/characters/vn/second/max/confident.png",
        "nervous": "assets/characters/vn/second/max/nervous.png"
      },
      "startingTrust": 0,
      "allyHint": "Максу нужна ваша проверка, а не вы. Без неё разговор для него пустой.",
      "allyHintUnmet": "Вы так и не поговорили с Максом.",
      "views": {
        "katya": 2,
        "ira": 0
      }
    },
    {
      "id": "sasha",
      "name": "Саша",
      "tagline": "Мёртв; его число всё ещё важно",
      "sprites": {
        "neutral": "assets/characters/vn/second/sasha/neutral.png",
        "amused": "assets/characters/vn/second/sasha/amused.png",
        "concerned": "assets/characters/vn/second/sasha/concerned.png"
      },
      "startingTrust": 0,
      "allyHint": "Саша ждёт второго слоя: не кто виноват, а кому это выгодно.",
      "allyHintUnmet": "Вы так и не поговорили с Сашей.",
      "views": {
        "ira": 1,
        "max": 1
      }
    },
    {
      "id": "katya",
      "name": "Катя",
      "tagline": "Её защита звучит как угроза",
      "sprites": {
        "neutral": "assets/characters/vn/second/katya/neutral.png",
        "angry": "assets/characters/vn/second/katya/angry.png",
        "nervous": "assets/characters/vn/second/katya/nervous.png"
      },
      "startingTrust": -1,
      "allyHint": "Катя уже слышала, что её роль — удобный блеф. От вас она ждёт того же.",
      "allyHintUnmet": "Вы так и не поговорили с Катей.",
      "views": {
        "ira": 0
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
        },
        {
          "when": [
            {
              "type": "variable",
              "key": "iraKnowsPlayerRole",
              "operator": "equals",
              "value": true
            }
          ],
          "node": "ira_knows"
        }
      ],
      "nodes": {
        "ira_start": {
          "speaker": "ira",
          "emotion": "warm",
          "text": "Живых трое. Я Библиотекарь: в первую ночь узнала, что Саша или Катя — Святой. Катя подтвердила роль. Макс теперь говорит, что она врёт.",
          "choices": [
            {
              "text": "«Почему Катя доверилась именно тебе?»",
              "goto": "ira_explains"
            },
            {
              "text": "«Что думаешь о Максе?»",
              "goto": "ira_sacrifices"
            },
            {
              "text": "«Моя информация касается Макса и Саши.»",
              "goto": "ira_fishes",
              "effects": [
                {
                  "type": "set",
                  "key": "hintedInvestigation",
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
                  "targetId": "katya",
                  "value": 1
                }
              ]
            }
          ]
        },
        "ira_knows": {
          "speaker": "ira",
          "emotion": "warm",
          "text": "Ты Сыщик? Значит, Отравитель — Макс или Саша, и оба уже мертвы. Приспешник вне игры. Зачем нам рисковать казнью сегодня?",
          "choices": [
            {
              "text": "«Откуда ты знаешь мою роль?»",
              "goto": "ira_caught",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы спросили Иру, откуда она знает вашу роль."
                }
              ]
            },
            {
              "text": "«Почему не Катю?»",
              "goto": "ira_sacrifices"
            },
            {
              "text": "«Слишком быстро ты всё решила.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы сказали Ире, что она решает слишком быстро."
                }
              ]
            }
          ]
        },
        "ira_explains": {
          "speaker": "ira",
          "emotion": "neutral",
          "text": "Катя сама назвала мне роль. Я получила её ночью — или удачно угадала. Других доказательств у меня нет.",
          "choices": [
            {
              "text": "«Звучит разумно.»",
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
                }
              ]
            },
            {
              "text": "«Звучит так, будто ты заранее знала ответ.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы сказали Ире, что она знала ответ заранее."
                }
              ]
            },
            {
              "text": "«Саша считает, что твоя история слишком точная для одной ночи.»",
              "conditions": [
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "ira",
                  "operator": "gte",
                  "value": 2
                }
              ],
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
                  "targetId": "sasha",
                  "value": 2
                }
              ]
            }
          ]
        },
        "ira_sacrifices": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Макса уже не казнить. Он просит вывести Катю, но я бы оставила день без казни: слишком мало уверенности.",
          "choices": [
            {
              "text": "«Ты предлагаешь пропустить последний день?»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы усомнились, что Ира вообще готова кого-то казнить."
                }
              ]
            },
            {
              "text": "«Тогда помоги назвать Катю.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "iraPromisedMaxVote",
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
                  "targetId": "katya",
                  "value": 1
                }
              ]
            }
          ]
        },
        "ira_fishes": {
          "speaker": "ira",
          "emotion": "neutral",
          "text": "Тогда не раскрывай больше. Мёртвых уже не казнить, решать будем между живыми. Я поговорю с Катей первой.",
          "choices": [
            {
              "text": "«Хорошо. Но мою роль не угадывай.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Нет. Сначала я проверю твою историю.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы отказались делиться, пока не проверите историю Иры."
                }
              ]
            }
          ]
        },
        "ira_caught": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Макс рассказал мне про твою проверку после смерти. Мёртвые тоже умеют выбирать, кому доверять.",
          "choices": [
            {
              "text": "«И после этого ты предлагаешь ничего не казнить?»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы указали Ире, что она знает вашу роль и всё равно зовёт никого не казнить."
                }
              ]
            },
            {
              "text": "«Макс мог быть Отравителем. Катю это ещё не оправдывает.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedMax",
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
                  "targetId": "katya",
                  "value": 1
                }
              ]
            }
          ]
        },
        "ira_repeat": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Мы втроём решаем игру. Чью версию ты принесёшь на площадь?",
          "choices": [
            {
              "text": "«Опаснее. Ты знаешь слишком много.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -2,
                  "note": "Вы сказали Ире в лицо, что считаете её опаснее Макса."
                }
              ]
            },
            {
              "text": "«Ты предлагаешь пропустить казнь?»",
              "goto": "ira_sacrifices"
            }
          ]
        },
        "ira_allied": {
          "speaker": "ira",
          "emotion": "warm",
          "text": "Я не готова казнить Катю только по словам Макса. Может, оставим день без казни?",
          "choices": [
            {
              "text": "«Допустим, сегодня не казним никого.»",
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
                  "targetId": "katya",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Почему твой совет спасёт нас от ночи?»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы спросили Иру, как пропуск казни переживёт ночь."
                },
                {
                  "type": "set",
                  "key": "suspectedIra",
                  "value": true
                }
              ]
            },
            {
              "text": "«Нет. Сегодня надо казнить Демона.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "suspicion",
                  "characterId": "ira",
                  "targetId": "katya",
                  "value": -1
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
              "characterId": "katya",
              "targetId": "max",
              "operator": "gte",
              "value": 2
            }
          ],
          "node": "max_panics"
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
        }
      ],
      "nodes": {
        "max_start": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Я Эмпат. Я мёртв, но первую ночь помню: единица, один из моих соседей злой — Ира или Катя. Катя называет себя Святым, а это самый удобный щит. Я в твоей проверке?",
          "choices": [
            {
              "text": "«Я Сыщик. Отравитель — ты или Саша.»",
              "goto": "max_hears_role",
              "effects": [
                {
                  "type": "set",
                  "key": "toldMaxRole",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "investigator"
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Почему ты решил, что ты в моей проверке?»",
              "goto": "max_guesses"
            },
            {
              "text": "«Единица не говорит, кто из двоих. Катю ты выбрал сам.»",
              "goto": "max_cornered",
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы поймали Макса на том, что Катю из пары он выбрал сам."
                }
              ]
            }
          ]
        },
        "max_hears_role": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Я знаю свою роль. Значит, Отравитель — Саша, и его единица ничего не стоит. Свой последний голос я берегу для Кати. Убедить Иру придётся тебе.",
          "choices": [
            {
              "text": "«Слишком простой ответ.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы назвали ответ Макса слишком простым."
                }
              ]
            },
            {
              "text": "«Сначала услышу Катю.»",
              "endConversation": true
            },
            {
              "text": "«Согласна. Пока.»",
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
                  "targetId": "katya",
                  "value": 1
                }
              ]
            }
          ]
        },
        "max_guesses": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Ты спрашиваешь, как Сыщик. Если я в твоей паре — пусть: я знаю свою роль. Но мёртвый приспешник тебе не нужен. Тебе нужен живой Демон. Проверь Катю.",
          "choices": [
            {
              "text": "«Ты назвал Катю до того, как я раскрыла сведения.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы указали Максу, что он назвал Катю раньше вас."
                }
              ]
            },
            {
              "text": "«Возможно. Проверю её.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "suspicion",
                  "characterId": "max",
                  "targetId": "katya",
                  "value": 1
                }
              ]
            }
          ]
        },
        "max_cornered": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Ира спорит со мной с первого дня. Демон так со своим приспешником не играет. Значит, Катя. Сегодня решать живым.",
          "choices": [
            {
              "text": "«Или вы спорите напоказ.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedMax",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы предположили, что Макс и Ира спорят напоказ."
                }
              ]
            },
            {
              "text": "«Кто подтвердит твою роль?»",
              "endConversation": true
            }
          ]
        },
        "max_repeat": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "У меня остался один голос, и я знаю, на кого его потрачу: Катя всё ещё жива, а её роль слишком удобна. Спроси Иру, готова ли она казнить.",
          "choices": [
            {
              "text": "«Ира советует пропустить день. Ты ей веришь?»",
              "conditions": [
                {
                  "type": "spokenTo",
                  "characterId": "ira",
                  "operator": "truthy"
                }
              ],
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "caughtEvilMismatch",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "suspectedIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы пересказали Максу совет Иры и спросили, верит ли он ей."
                },
                {
                  "type": "suspicion",
                  "characterId": "max",
                  "targetId": "katya",
                  "value": -1
                }
              ]
            },
            {
              "text": "«Трать свой голос как хочешь. Я спрошу живых.»",
              "endConversation": true
            }
          ]
        },
        "max_panics": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Катя повторяет, что я подставил её перед смертью. Но её слова о Святом никто не может проверить до казни.",
          "choices": [
            {
              "text": "«Значит, объясни свою единицу ещё раз. Медленно.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы потребовали у Макса объяснить его единицу заново."
                }
              ]
            },
            {
              "text": "«Разбираться и не будут. Ты сам сделал Катю целью.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -2,
                  "note": "Вы сказали Максу, что он сам назначил себе врага."
                }
              ]
            },
            {
              "text": "«Я проверю твою версию у Кати.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "suspicion",
                  "characterId": "max",
                  "targetId": "katya",
                  "value": -1
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
              "key": "sashaKnowsPlayerRole",
              "operator": "equals",
              "value": true
            }
          ],
          "node": "sasha_knows"
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
          "emotion": "concerned",
          "text": "Я Повар. Я мёртв, но последний голос у меня остался — и потрачу я его только наверняка. А первая ночь осталась: я получил единицу, одну соседнюю пару зла. Ира сидит рядом с Максом; Макс сидел рядом с Катей.",
          "choices": [
            {
              "text": "«Думаешь, они и есть пара зла?»",
              "goto": "sasha_pair",
              "effects": [
                {
                  "type": "set",
                  "key": "sashaSawPair",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Что сказала Катя?»",
              "goto": "sasha_katya"
            },
            {
              "text": "«Ира советует пропустить день.»",
              "conditions": [
                {
                  "type": "spokenTo",
                  "characterId": "ira",
                  "operator": "truthy"
                }
              ],
              "goto": "sasha_sacrifice",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "ira",
                  "value": 1
                }
              ]
            }
          ]
        },
        "sasha_knows": {
          "speaker": "sasha",
          "emotion": "neutral",
          "text": "Катя сказала, что ты Сыщик. Она рискует жизнью, называясь Святым, но её история пока последовательна.",
          "choices": [
            {
              "text": "«Кого тогда номинировать?»",
              "goto": "sasha_pair"
            },
            {
              "text": "«Почему она рассказала тебе?»",
              "goto": "sasha_katya"
            }
          ]
        },
        "sasha_pair": {
          "speaker": "sasha",
          "emotion": "concerned",
          "text": "Если Макс был Отравителем, моя единица указывает на его соседа — Иру или Катю. Ира первой узнала роль Кати и теперь зовёт не казнить никого.",
          "choices": [
            {
              "text": "«Значит, цель — Ира.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedIra",
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
                  "targetId": "ira",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Сначала проверю их отдельно.»",
              "endConversation": true
            },
            {
              "text": "«Катя назвалась мне Святым. Её казнь заканчивает партию — что бы ни говорил Макс.»",
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
          "emotion": "neutral",
          "text": "Катя назвалась Святым. Если это правда, её казнь сразу отдаёт победу злу. Пропустить день тоже нельзя: ночью Демон убьёт одного из троих, и живых останется двое. Значит, кто-то из живых тебе врёт.",
          "choices": [
            {
              "text": "«Я ей верю. С Катей спешить не стану.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "believedKatya",
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
              "text": "«Удобный щит не делает её доброй.»",
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
        "sasha_sacrifice": {
          "speaker": "sasha",
          "emotion": "amused",
          "text": "Макс умер. Если он был Отравителем, обещание Иры не казнить никого спасает Демона, а не Катю.",
          "choices": [
            {
              "text": "«Запомню это.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedIra",
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
                  "targetId": "ira",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Или Ира просто добрая.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "ira",
                  "value": -1
                }
              ]
            }
          ]
        },
        "sasha_repeat": {
          "speaker": "sasha",
          "emotion": "amused",
          "text": "Второй разговор со мной — значит, тебе нужен мой последний голос. Какую улику ты ещё не сказала живым?",
          "choices": [
            {
              "text": "«Коротко: Ира или Катя?»",
              "goto": "sasha_pair"
            },
            {
              "text": "«На площади узнаем.»",
              "endConversation": true
            }
          ]
        },
        "sasha_vouched": {
          "speaker": "sasha",
          "emotion": "neutral",
          "text": "Катя за тебя поручилась. Мой последний голос ещё при мне, и я хочу знать, на что его тратить. Что в твоей проверке?",
          "choices": [
            {
              "text": "«Макс или ты. Я склоняюсь к Максу.»",
              "goto": "sasha_pair",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 2
                },
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "max",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "katya",
                  "value": -1
                },
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "investigator"
                }
              ]
            },
            {
              "text": "«Проверку не отдам. Расскажи лучше про свою единицу.»",
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
          "text": "Я Святой. Если меня казнят, добро проиграет сразу. Если сегодня не казнят никого, ночью Демон убьёт одного из нас троих.",
          "choices": [
            {
              "text": "«Я Сыщик. Отравитель — Макс или Саша.»",
              "goto": "katya_hears_info",
              "effects": [
                {
                  "type": "set",
                  "key": "toldKatyaRole",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "playerClaim",
                  "value": "investigator"
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Кто знал твою роль?»",
              "goto": "katya_ira"
            },
            {
              "text": "«Святой — идеальный блеф для зла.»",
              "goto": "katya_angry",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -2,
                  "note": "Вы вслух назвали роль Кати идеальным блефом для зла."
                }
              ]
            }
          ]
        },
        "katya_hears_info": {
          "speaker": "katya",
          "emotion": "angry",
          "text": "Значит, приспешник уже мёртв, и живой злой остался один — Демон. Это Ира или я. Я знаю, что не я. А Макс весь день уговаривает всех казнить Святого. Кому это выгодно?",
          "choices": [
            {
              "text": "«Кто ещё знал твою роль?»",
              "goto": "katya_ira"
            },
            {
              "text": "«Я пока тебе не верю.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -1,
                  "note": "Вы сказали Кате, что пока ей не верите."
                }
              ]
            },
            {
              "text": "«Хорошо. Тебя не номинирую.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "believedKatya",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 2
                }
              ]
            }
          ]
        },
        "katya_ira": {
          "speaker": "katya",
          "emotion": "neutral",
          "text": "Ира спросила о моей роли первой. Через минуту назвалась Библиотекарем и «нашла» Святого между мной и Сашей. А теперь зовёт пропустить решающую казнь.",
          "choices": [
            {
              "text": "«Она построила проверку вокруг твоей роли.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedIra",
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
                  "targetId": "ira",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Или действительно получила тебя ночью.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "trustedIra",
                  "value": true
                },
                {
                  "type": "suspicion",
                  "characterId": "katya",
                  "targetId": "ira",
                  "value": -1
                }
              ]
            }
          ]
        },
        "katya_angry": {
          "speaker": "katya",
          "emotion": "angry",
          "text": "Я понимаю, насколько удобно звучит Святой. Но если мы ошибёмся сегодня, другой попытки не будет.",
          "choices": [
            {
              "text": "«Ладно. Не буду спешить.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "believedKatya",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Это решит город.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -1,
                  "note": "Вы оставили судьбу Кати «городу»."
                }
              ]
            }
          ]
        },
        "katya_repeat": {
          "speaker": "katya",
          "emotion": "nervous",
          "text": "Я повторяю одно и то же: Макс подставил меня, а Ира просит не казнить никого. Какой из этих ходов помогает добру?",
          "choices": [
            {
              "text": "«Ира воспользовалась словами Макса.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedMax",
                  "value": true
                },
                {
                  "type": "suspicion",
                  "characterId": "katya",
                  "targetId": "ira",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Ира — своей слишком точной информацией.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "suspectedIra",
                  "value": true
                },
                {
                  "type": "suspicion",
                  "characterId": "katya",
                  "targetId": "ira",
                  "value": 1
                }
              ]
            }
          ]
        },
        "katya_afraid": {
          "speaker": "katya",
          "emotion": "nervous",
          "text": "Ты уже назвала Святого удобным блефом. Макс тоже так говорил. Мне нужна причина, по которой ты назовёшь Иру, а не меня.",
          "choices": [
            {
              "text": "«Я была неправа. Я не дам казнить тебя сегодня.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 2
                },
                {
                  "type": "set",
                  "key": "believedKatya",
                  "value": true
                }
              ]
            },
            {
              "text": "«Тогда объясни, зачем Ира предлагает пропустить день.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 1
                },
                {
                  "type": "suspicion",
                  "characterId": "katya",
                  "targetId": "ira",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Молчать — тоже стратегия.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -1,
                  "note": "Вы посоветовали Кате молчать, когда её вели на плаху."
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
      "id": "public-disagreement",
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
      "title": "Слишком громкий спор",
      "text": "Макс спорит с Катей даже после смерти. Ира просит не торопиться с казнью. Катя напоминает: следующей ночи для добра не будет.",
      "characterIds": [
        "ira",
        "max"
      ],
      "effects": [
        {
          "type": "set",
          "key": "publicFight",
          "value": true
        }
      ]
    },
    {
      "id": "evil-coordinates",
      "trigger": "afterConversation",
      "once": true,
      "visible": false,
      "when": [
        {
          "type": "spokenTo",
          "characterId": "max",
          "operator": "equals",
          "value": true
        },
        {
          "type": "variable",
          "key": "toldMaxRole",
          "operator": "equals",
          "value": true
        }
      ],
      "debugText": "Макс передал Ире роль игрока; зло согласовало противоположные публичные версии.",
      "effects": [
        {
          "type": "set",
          "key": "iraKnowsPlayerRole",
          "value": true
        },
        {
          "type": "set",
          "key": "evilCoordinated",
          "value": true
        }
      ]
    },
    {
      "id": "katya-trusts-sasha",
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
          "key": "toldKatyaRole",
          "operator": "equals",
          "value": true
        }
      ],
      "title": "Катя выбирает своего собеседника",
      "text": "Катя отводит мёртвого Сашу к двери и быстро повторяет свою историю. Номинировать он не может, но свой последний голос теперь держит для Иры.",
      "characterIds": [
        "katya",
        "sasha"
      ],
      "effects": [
        {
          "type": "set",
          "key": "sashaKnowsPlayerRole",
          "value": true
        },
        {
          "type": "suspicion",
          "characterId": "sasha",
          "targetId": "ira",
          "value": 1
        }
      ]
    },
    {
      "id": "ira-prepares-frame",
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
      "debugText": "Ира решила публично пожертвовать Максом, если это снимет подозрения с неё.",
      "effects": [
        {
          "type": "set",
          "key": "iraPreparedFrame",
          "value": true
        }
      ]
    },
    {
      "id": "second-bell",
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
      "text": "Рассказчик зовёт всех пятерых к столу. Номинируют только живые; мёртвые поднимут руку один раз. Две руки решат последнюю казнь.",
      "effects": []
    }
  ],
  "endings": [
    {
      "id": "executed-demon-with-ally",
      "when": [
        {
          "type": "executed",
          "operator": "equals",
          "value": "ira"
        },
        {
          "type": "approach",
          "operator": "equals",
          "value": "accepted"
        },
        {
          "type": "decision",
          "operator": "equals",
          "value": "katya"
        }
      ],
      "tone": "victory",
      "label": "Последний день",
      "title": "Две руки остановили Демона",
      "text": "Вы связали две улики: проверка Сыщика показала, что приспешник уже мёртв, а единица Повара указала на соседа Макса. Катя поверила вашей версии и подняла вторую руку за Иру. Ира была Чёртом; добро победило.",
      "epilogue": "На решающем дне важно убедить тех, у кого ещё есть голос, — живых и мёртвых.",
      "debrief": [
        "Вы связали проверку Сыщика с единицей Повара.",
        "Катя поверила версии и подняла вторую руку.",
        "Казнь Иры закончила партию победой добра."
      ]
    },
    {
      "id": "executed-demon",
      "when": [
        {
          "type": "executed",
          "operator": "equals",
          "value": "ira"
        }
      ],
      "tone": "victory",
      "label": "Последний день",
      "title": "Вы добились нужной казни",
      "text": "Ира оказалась Чёртом. Её призыв пропустить день был опасен: ночью она убила бы ещё одного живого. Вы назвали её и собрали две руки. Добро победило.",
      "epilogue": "Проверка называла приспешника; поведение выдало Демона.",
      "debrief": [
        "Вы назвали Иру, несмотря на её просьбу ждать.",
        "На её казнь хватило голосов.",
        "Ира была Демоном; ночного убийства не случилось."
      ]
    },
    {
      "id": "executed-saint",
      "when": [
        {
          "type": "executed",
          "operator": "equals",
          "value": "katya"
        }
      ],
      "tone": "defeat",
      "label": "Последний день",
      "title": "Казнён Святой",
      "text": "Катя говорила правду. Её казнь сразу принесла победу злу — ждать ночи не пришлось. Макс был Отравителем и оставил после смерти ложную версию, которую вы приняли.",
      "epilogue": "Странная защита может быть правдой, даже когда она удобна.",
      "debrief": [
        "Вы приняли версию Макса о Кате.",
        "Город казнил Святого.",
        "Способность Святого немедленно принесла победу злу."
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
      "label": "Последний день",
      "title": "Казнили вас",
      "text": "Вы были Сыщиком, но город не поверил вашей версии. После казни осталось двое живых; по правилам зло победило сразу.",
      "epilogue": "Сведения полезны, лишь если вы успели сделать их убедительными.",
      "debrief": [
        "Город не принял вашу проверку.",
        "После вашей казни остались только двое живых.",
        "При двух живых зло победило сразу."
      ]
    },
    {
      "id": "night-kill",
      "when": [
        {
          "type": "executed",
          "operator": "equals",
          "value": "nobody"
        }
      ],
      "tone": "defeat",
      "label": "Ночь после последнего дня",
      "title": "Пропуск стоил партии",
      "text": "Вы не казнили никого. Ночью Чёрт убил Катю; за столом остались вы и Ира. При двух живых зло победило. Ира предлагала ждать именно потому, что ей хватало одной ночи.",
      "epilogue": "Осторожность тоже бывает решением — и у него есть цена.",
      "debrief": [
        "Вы оставили плаху пустой.",
        "Ночью Демон убил Катю.",
        "Остались двое живых, поэтому победило зло."
      ]
    },
    {
      "id": "fallback-ending",
      "tone": "defeat",
      "label": "Последний день",
      "title": "Демон пережил день",
      "text": "Ира осталась жива. Город не остановил Демона до конца решающего дня.",
      "epilogue": "Пересмотрите, кому помогли ваши слова."
    }
  ],
  "reveal": [
    {
      "characterId": "ira",
      "role": "Чёрт",
      "team": "Зло",
      "icon": "assets/roles/imp.png"
    },
    {
      "characterId": "max",
      "role": "Отравитель",
      "team": "Зло",
      "icon": "assets/roles/poisoner.png"
    },
    {
      "characterId": "sasha",
      "role": "Повар",
      "team": "Добро",
      "icon": "assets/roles/chef.png"
    },
    {
      "characterId": "katya",
      "role": "Святой",
      "team": "Добро",
      "icon": "assets/roles/saint.png"
    }
  ],
  "decision": {
    "title": "Кого из живых попросить о поддержке?",
    "prompt": "Макс и Саша не заключают союзов, но у каждого остался последний голос. Подойти можно только к Ире или Кате.",
    "statements": [
      {
        "characterId": "ira",
        "variants": [
          {
            "when": [
              {
                "type": "variable",
                "key": "iraPreparedFrame",
                "operator": "equals",
                "value": true
              }
            ],
            "text": "«Макс уже мёртв. Без уверенности лучше не казнить никого.»"
          },
          {
            "text": "«Макс уже мёртв. Без уверенности лучше не казнить никого.»"
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
                "key": "evilCoordinated",
                "operator": "equals",
                "value": true
              }
            ],
            "text": "«Казните Катю. Моя информация не могла ошибаться.»"
          },
          {
            "text": "«Казните Катю. Моя информация не могла ошибаться.»"
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
                "key": "suspectedIra",
                "operator": "equals",
                "value": true
              }
            ],
            "text": "«Моя единица осталась: сопоставьте Макса с его живыми соседями.»"
          },
          {
            "text": "«Моя единица осталась: сопоставьте Макса с его живыми соседями.»"
          }
        ]
      },
      {
        "characterId": "katya",
        "variants": [
          {
            "text": "«Казнь меня или пропуск дня — две дороги к победе зла.»"
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
    "title": "Последняя казнь",
    "prompt": "Назовите живого игрока. Казнь Демона спасёт добро; казнь доброго или пропуск закончат партию.",
    "abstainLabel": "Промолчать",
    "majority": 2,
    "voteAt": 1,
    "nominateAt": 2,
    "urgentAt": 3
  }
};
