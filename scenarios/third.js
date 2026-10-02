window.THIRD_SCENARIO = {
  "schemaVersion": 2,
  "meta": {
    "id": "strangers-in-red",
    "title": "Свои среди чужих",
    "subtitle": "Вы знаете, что вы злой. Осталось найти своих.",
    "menuLabel": "Сценарий III · за зло",
    "synopsis": "Вас не познакомили с приспешником. Найдите контакт, придумайте блеф и не раскройтесь не тому человеку.",
    "duration": "5–7 минут",
    "author": "Клуб Blood on the Clocktower",
    "version": "0.3.0"
  },
  "settings": {
    "selectionSeconds": 10,
    "conversationsPerDay": 3,
    "fallback": {
      "characterId": "max",
      "text": "Макс задерживается у двери: «Мы ещё не говорили. Есть минутка?»"
    }
  },
  "table": {
    "label": "Стол на пять игроков",
    "seats": [
      "you",
      "max",
      "ira",
      "katya",
      "sasha"
    ],
    "note": "Вы сидите между Максом и Сашей."
  },
  "nightVisual": {
    "handImage": "assets/night/storyteller-palm-close.jpg",
    "credit": "Pixabay · CC0 / Public Domain",
    "caption": "Рассказчик напоминает вашу роль. На приспешника не указывает."
  },
  "player": {
    "name": "Вы",
    "roleName": "Левиафан",
    "roleIcon": "✦",
    "roleIconImage": "assets/roles/leviathan.png",
    "team": "Зло",
    "description": "Вы — Левиафан. Ночью никто не умирает: зло выигрывает казнями и временем. Осталось найти союзника и договориться, что говорить городу.",
    "task": "Найдите приспешника и согласуйте правдоподобные роли до голосования.",
    "startingInformation": {
      "label": "Знакомства не было",
      "text": "Рассказчик показал три роли, которых нет в игре: Швея, Рыбак и Савант. Но не показал вашего приспешника.",
      "roleIcon": "assets/roles/leviathan.png",
      "roleName": "Левиафан",
      "suspects": [],
      "hint": "На скрипте есть Маковка: пока она жива, зло не узнаёт друг друга. Эти три отсутствующие роли — ваши безопасные блефы, а не имена союзников. Про Левиафана стол знает с начала партии — но не знает, кто это."
    },
    "setupNote": "Партия по клубному скрипту leviaxaan: за столом пять игроков — вы и четверо собеседников. Маковка мешает злу познакомиться, поэтому приспешника вам не показали. Марионетка есть на скрипте — этим можно воспользоваться. Левиафан не убивает по ночам, и стол знает, что он в игре; зло выигрывает казнями добрых. Ваша команда уже злая, смены роли этой ночью не было."
  },
  "characters": [
    {
      "id": "ira",
      "name": "Ира",
      "tagline": "Слишком охотно узнаёт ваши секреты",
      "sprites": {
        "neutral": "assets/characters/vn/third/ira/neutral.png",
        "warm": "assets/characters/vn/third/ira/warm.png",
        "suspicious": "assets/characters/vn/third/ira/suspicious.png"
      },
      "startingTrust": 0,
      "allyHint": "Ира ждёт от вас признания, а не осторожности. Без него разговор для неё пустой.",
      "allyHintUnmet": "Вы так и не поговорили с Ирой.",
      "views": {
        "max": 0,
        "katya": 0
      }
    },
    {
      "id": "max",
      "name": "Макс",
      "tagline": "Присматривается к каждому",
      "sprites": {
        "neutral": "assets/characters/vn/third/max/neutral.png",
        "confident": "assets/characters/vn/third/max/confident.png",
        "nervous": "assets/characters/vn/third/max/nervous.png"
      },
      "startingTrust": 0,
      "allyHint": "Макс ждал от вас чего-то конкретного, а получил только общие слова.",
      "allyHintUnmet": "Вы так и не поговорили с Максом.",
      "views": {
        "ira": 1,
        "katya": 1
      }
    },
    {
      "id": "sasha",
      "name": "Саша",
      "tagline": "Ваш сосед за игровым столом",
      "sprites": {
        "neutral": "assets/characters/vn/third/sasha/neutral.png",
        "amused": "assets/characters/vn/third/sasha/amused.png",
        "concerned": "assets/characters/vn/third/sasha/concerned.png"
      },
      "startingTrust": -1,
      "allyHint": "Стрелка Шугенжи указывает на вас, и вы не дали Саше ничего взамен.",
      "allyHintUnmet": "Вы так и не поговорили с Сашей.",
      "views": {
        "max": 1
      }
    },
    {
      "id": "katya",
      "name": "Катя",
      "tagline": "Не спешит обещать поддержку",
      "sprites": {
        "neutral": "assets/characters/vn/third/katya/neutral.png",
        "angry": "assets/characters/vn/third/katya/angry.png",
        "nervous": "assets/characters/vn/third/katya/nervous.png"
      },
      "startingTrust": 0,
      "allyHint": "Катя решает по сведениям. Вы не принесли ей ни одного.",
      "allyHintUnmet": "Вы так и не поговорили с Катей.",
      "views": {
        "max": 1,
        "ira": 0
      }
    }
  ],
  "initialState": {
    "claimedPoppy": false,
    "exposedToIra": false,
    "iraWarnedKatya": false,
    "maxKnowsDemon": false,
    "learnedWord": false,
    "marionetteBluff": false,
    "sashaDoubts": false,
    "exposedToKatya": false,
    "exposedToGood": false,
    "sharedSafeBluff": false,
    "maxBluff": "none"
  },
  "dialogues": {
    "ira": {
      "start": "ira_start",
      "startRules": [
        {
          "when": [
            {
              "type": "trust",
              "characterId": "katya",
              "operator": "lte",
              "value": -1
            }
          ],
          "node": "ira_watched"
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
          "emotion": "warm",
          "text": "Я тоже ищу своих. Если ночью никого не показали — ты не одна. Скажи честно, какую роль получила?",
          "choices": [
            {
              "text": "Осторожно: «А почему ты думаешь, что мне кого-то должны были показать?»",
              "goto": "ira_probe"
            },
            {
              "text": "Блеф: «Я Маковка. Поэтому вы и не познакомились.»",
              "goto": "ira_poppy",
              "effects": [
                {
                  "type": "set",
                  "key": "claimedPoppy",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы назвались Маковкой — Ира эту роль уже слышала и не поверила."
                }
              ]
            },
            {
              "text": "Рискнуть: «Я Левиафан. Ты мой приспешник?»",
              "goto": "ira_confession",
              "effects": [
                {
                  "type": "set",
                  "key": "exposedToIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 2
                }
              ]
            }
          ]
        },
        "ira_probe": {
          "speaker": "ira",
          "emotion": "neutral",
          "text": "Просто проверяю, кто клюнет. При Маковке доброму выгодно притвориться злым: вдруг кто-нибудь сам расскажет лишнее.",
          "choices": [
            {
              "text": "«То есть это была приманка?»",
              "endConversation": true
            },
            {
              "text": "«Я Швея. Больше пока ничего.»",
              "endConversation": true
            },
            {
              "text": "«Ты предложила это первой. Значит, ловишь признание, а не ищешь своих.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "readIraBait",
                  "value": true
                }
              ]
            }
          ]
        },
        "ira_poppy": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Маковка? Эту роль я уже слышала. Почему ты уверена, что зло не познакомилось?",
          "choices": [
            {
              "text": "«Проверяла твою реакцию. Роль пока не раскрою.»",
              "endConversation": true
            },
            {
              "text": "«Потому что я на самом деле Демон.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "exposedToIra",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 2
                }
              ]
            }
          ]
        },
        "ira_confession": {
          "speaker": "ira",
          "emotion": "warm",
          "text": "Допустим. Дай мне время: я проверю одну вещь у Кати. Пока никому больше не признавайся.",
          "choices": [
            {
              "text": "«Подожду. Только не рассказывай ей.»",
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
              "text": "«Нет, сначала скажи свою роль.»",
              "goto": "ira_probe",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы потребовали её роль сразу после собственного признания."
                }
              ]
            }
          ]
        },
        "ira_repeat": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "После первого разговора у меня стало больше вопросов. Особенно к тому, кто пытается искать зло под видом зла.",
          "choices": [
            {
              "text": "«Ты ведь не обещала, что сама злая.»",
              "endConversation": true
            },
            {
              "text": "«Я всё ещё предлагаю играть вместе.»",
              "endConversation": true
            },
            {
              "text": "«Кате не понравилось, что Макс выпытывал у неё слово. Спроси её сама.»",
              "conditions": [
                {
                  "type": "suspicion",
                  "characterId": "katya",
                  "targetId": "max",
                  "operator": "gte",
                  "value": 1
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
                  "targetId": "max",
                  "value": 2
                }
              ]
            }
          ]
        },
        "ira_watched": {
          "speaker": "ira",
          "emotion": "suspicious",
          "text": "Катя считает, что ты играешь против стола. Мне это даже нравится: значит, тебе есть что скрывать.",
          "choices": [
            {
              "text": "«Ей просто не понравился мой вопрос.»",
              "endConversation": true
            },
            {
              "text": "«Допустим, есть. Что ты предложишь?»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": 1
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
              "type": "variable",
              "key": "maxKnowsDemon",
              "operator": "equals",
              "value": true
            }
          ],
          "node": "max_partner"
        },
        {
          "when": [
            {
              "type": "trust",
              "characterId": "max",
              "operator": "gte",
              "value": 2
            }
          ],
          "node": "max_warm"
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
          "emotion": "nervous",
          "text": "Как называется ткань для театрального занавеса? У меня вертится слово, но я хочу услышать его от тебя.",
          "choices": [
            {
              "text": "«Ты пытаешься заставить меня сказать слово Мецефеля?»",
              "goto": "max_word",
              "effects": [
                {
                  "type": "set",
                  "key": "learnedWord",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                }
              ]
            },
            {
              "text": "Блеф: «Я Маковка. От меня тебе лучше отойти.»",
              "goto": "max_poppy",
              "effects": [
                {
                  "type": "set",
                  "key": "claimedPoppy",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы назвались Маковкой — Макс уже слышал это от Иры и решил, что вы просто шумите."
                }
              ]
            },
            {
              "text": "«Я Левиафан. Давай перестанем угадывать.»",
              "goto": "max_partner",
              "effects": [
                {
                  "type": "set",
                  "key": "maxKnowsDemon",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 2
                }
              ]
            }
          ]
        },
        "max_word": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Если я Мецефель, первый добрый игрок, сказавший мне тайное слово, станет злым ночью. Слово — «бархат». Но мне нужен тот, кто уже на моей стороне.",
          "choices": [
            {
              "text": "«Уже на твоей. Я Левиафан.»",
              "goto": "max_partner",
              "effects": [
                {
                  "type": "set",
                  "key": "maxKnowsDemon",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Назвать чужую способность легко. Я ещё проверю.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы усомнились в его способности и ничего не дали взамен."
                }
              ]
            }
          ]
        },
        "max_poppy": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Ира сказала мне почти то же самое. Забавно: две Маковки, а никто никому не верит. Может, кто-то из вас просто ищет контакт?",
          "choices": [
            {
              "text": "«Да. Я Левиафан, это был блеф.»",
              "goto": "max_partner",
              "effects": [
                {
                  "type": "set",
                  "key": "maxKnowsDemon",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Значит, Ира врёт.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Вы свалили всё на Иру, так и не сказав ничего о себе."
                }
              ]
            }
          ]
        },
        "max_partner": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Я Мецефель. Тебя мне не показали. Если ты правда Левиафан, дай свободную добрую роль: я пока блефовал слишком осторожно.",
          "choices": [
            {
              "text": "«Савант свободен. Тебя мне тоже не показали.»",
              "conditions": [
                {
                  "type": "variable",
                  "key": "sharedSafeBluff",
                  "operator": "falsy"
                }
              ],
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "maxKnowsDemon",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "sharedSafeBluff",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "maxBluff",
                  "value": "savant"
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Сначала проверю твою историю у других.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Макс попросил свободную роль, а вы ушли проверять его у других."
                }
              ]
            },
            {
              "text": "«Возьми Маковку. Ира уже назвалась ей — пусть разбираются между собой.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                },
                {
                  "type": "set",
                  "key": "collidingBluff",
                  "value": true
                },
                {
                  "type": "suspicion",
                  "characterId": "max",
                  "targetId": "ira",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Держись Рыбака — ты его уже назвал. Тебя мне тоже не показали.»",
              "conditions": [
                {
                  "type": "variable",
                  "key": "sharedSafeBluff",
                  "operator": "truthy"
                }
              ],
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "maxKnowsDemon",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 2
                }
              ]
            }
          ]
        },
        "max_repeat": {
          "speaker": "max",
          "emotion": "nervous",
          "text": "Мне всё ещё нужен человек, который понимает, зачем я подбираю слова. За столом слишком много лишних ушей.",
          "choices": [
            {
              "text": "«Я Левиафан. Попробуем довериться друг другу.»",
              "goto": "max_partner",
              "effects": [
                {
                  "type": "set",
                  "key": "maxKnowsDemon",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Пока не готова раскрыться.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Второй разговор подряд — и снова ничего конкретного."
                }
              ]
            }
          ]
        },
        "max_warm": {
          "speaker": "max",
          "emotion": "confident",
          "text": "Теперь я почти уверен, что ты — тот, кого мне не показали. Скажи, какую роль мне заявить, и я подстроюсь.",
          "choices": [
            {
              "text": "«Говори, что ты Рыбак. Эту роль сегодня никто не называл.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                },
                {
                  "type": "set",
                  "key": "sharedSafeBluff",
                  "value": true
                },
                {
                  "type": "set",
                  "key": "maxBluff",
                  "value": "fisherman"
                }
              ]
            },
            {
              "text": "«Не заявляй роль. Пусть все спрашивают Иру.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": 1
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы направили внимание стола на Иру, и ей это передали."
                },
                {
                  "type": "suspicion",
                  "characterId": "max",
                  "targetId": "ira",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Я ещё не уверена, что ты меня не ловишь.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "max",
                  "value": -1,
                  "note": "Макс открылся первым, а вы в ответ усомнились в нём."
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
              "key": "sashaDoubts",
              "operator": "equals",
              "value": true
            }
          ],
          "node": "sasha_doubts"
        },
        {
          "when": [
            {
              "type": "trust",
              "characterId": "sasha",
              "operator": "lte",
              "value": -2
            }
          ],
          "node": "sasha_cold"
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
          "text": "Я Шугенжа. Мне сказали, что ближайшее ко мне зло — по часовой стрелке. По часовой от меня сидишь ты. Это ещё не приговор, но объясниться придётся.",
          "choices": [
            {
              "text": "Блеф: «Ты моя Марионетка. Я Левиафан.»",
              "goto": "sasha_marionette",
              "effects": [
                {
                  "type": "set",
                  "key": "marionetteBluff",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": -1,
                  "note": "Стрелка Шугенжи указывала на вас, а вы ответили встречным обвинением."
                }
              ]
            },
            {
              "text": "«Что ты заметил у Макса?»",
              "goto": "sasha_max"
            },
            {
              "text": "«А Ира кого-то искала?»",
              "goto": "sasha_ira"
            },
            {
              "text": "«По часовой от тебя сижу не только я. Посмотри, кто дальше.»",
              "goto": "sasha_max",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                },
                {
                  "type": "set",
                  "key": "pointedAtMax",
                  "value": true
                }
              ]
            }
          ]
        },
        "sasha_marionette": {
          "speaker": "sasha",
          "emotion": "concerned",
          "text": "Марионетка думает, что она добрая, и сидит рядом с Демоном. Мы соседи — версия возможна. Но соседство ещё не делает твои слова правдой.",
          "choices": [
            {
              "text": "«Не объявляй об этом. Сначала сравни свои сведения.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "sashaDoubts",
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
              "text": "«Просто голосуй, как я скажу.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": -2,
                  "note": "Вы приказали Саше голосовать по указке, ничего не объяснив."
                }
              ]
            }
          ]
        },
        "sasha_max": {
          "speaker": "sasha",
          "emotion": "amused",
          "text": "Он спросил меня про ткань. Я сказал «велюр». Макс попросил другое слово — слишком настойчиво для обычного разговора.",
          "choices": [
            {
              "text": "«Похоже на Мецефеля, который ищет кодовое слово.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "learnedWord",
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
                  "value": 2
                }
              ]
            },
            {
              "text": "«Может, ему просто нужен костюм.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": -1,
                  "note": "Вы отмахнулись от единственного наблюдения, которое Саша принёс сам."
                }
              ]
            }
          ]
        },
        "sasha_ira": {
          "speaker": "sasha",
          "emotion": "concerned",
          "text": "Ира всем предлагает признаться в зле. Добрые тоже так ловят признания. Если она угадает твою роль, это ещё не значит, что ей показали тебя ночью.",
          "choices": [
            {
              "text": "«Ира ловит признания: мне она сама предложила назваться злой.»",
              "conditions": [
                {
                  "type": "variable",
                  "key": "readIraBait",
                  "operator": "equals",
                  "value": true
                }
              ],
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 2
                },
                {
                  "type": "suspicion",
                  "characterId": "sasha",
                  "targetId": "ira",
                  "value": 2
                }
              ]
            },
            {
              "text": "«Хорошая проверка на лишнюю уверенность.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Я всё-таки поговорю с ней.»",
              "endConversation": true
            }
          ]
        },
        "sasha_doubts": {
          "speaker": "sasha",
          "emotion": "concerned",
          "text": "Я проверил правило у Рассказчика: он не подтверждает мне, Марионетка ли я. Пока я считаю себя добрым. Но твою версию никому не передал.",
          "choices": [
            {
              "text": "«Тогда пока держимся рядом, без обещаний о голосах.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Можешь проверить мои слова дальше.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Я соврала про Марионетку. Проверь сам, кто сидит по часовой от тебя.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 2
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -1,
                  "note": "Саша пересказал Кате, что вы сами признались во лжи про Марионетку."
                }
              ]
            }
          ]
        },
        "sasha_repeat": {
          "speaker": "sasha",
          "emotion": "amused",
          "text": "Мы снова разговариваем. Ты ищешь союзника или человека, который поверит, что он твой союзник?",
          "choices": [
            {
              "text": "Блеф: «Второе. Ты моя Марионетка.»",
              "goto": "sasha_marionette",
              "effects": [
                {
                  "type": "set",
                  "key": "marionetteBluff",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": -1,
                  "note": "Вы повторили версию про Марионетку, не добавив ни одного довода."
                }
              ]
            },
            {
              "text": "«Пытаюсь понять Макса.»",
              "goto": "sasha_max"
            },
            {
              "text": "«Катя уже подозревает Иру. Тебе не обязательно быть первым.»",
              "conditions": [
                {
                  "type": "suspicion",
                  "characterId": "katya",
                  "targetId": "ira",
                  "operator": "gte",
                  "value": 2
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
                  "targetId": "ira",
                  "value": 2
                }
              ]
            }
          ]
        },
        "sasha_cold": {
          "speaker": "sasha",
          "emotion": "concerned",
          "text": "Отдельных разговоров с тобой я больше не хочу. Каждый раз выходило, что твоя версия удобна только тебе.",
          "choices": [
            {
              "text": "«Тогда просто выслушай про Макса и решай сам.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Хорошо. Больше не подойду.»",
              "endConversation": true
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
              "type": "variable",
              "key": "iraWarnedKatya",
              "operator": "equals",
              "value": true
            }
          ],
          "node": "katya_warned"
        },
        {
          "when": [
            {
              "type": "trust",
              "characterId": "sasha",
              "operator": "gte",
              "value": 2
            },
            {
              "type": "spokenTo",
              "characterId": "sasha",
              "operator": "truthy"
            }
          ],
          "node": "katya_vouched"
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
          "emotion": "neutral",
          "text": "Я Завхоз. Во вступлении мне показали одного точно доброго игрока — Иру. Больше ничего. А здесь все слишком увлечены тем, кто кому союзник.",
          "choices": [
            {
              "text": "«Ира говорит так, будто знает зло.»",
              "goto": "katya_ira"
            },
            {
              "text": "«Ира предлагала мне признаться в зле. Тебе она это предлагала?»",
              "conditions": [
                {
                  "type": "spokenTo",
                  "characterId": "ira",
                  "operator": "truthy"
                }
              ],
              "goto": "katya_ira",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 1
                },
                {
                  "type": "trust",
                  "characterId": "ira",
                  "value": -1,
                  "note": "Вы пересказали Кате её приватное предложение."
                },
                {
                  "type": "set",
                  "key": "readIraBait",
                  "value": true
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
              "text": "«Макс просил произнести слово?»",
              "goto": "katya_word",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 1
                }
              ]
            },
            {
              "text": "Рискнуть: «Я Левиафан. Ты со мной?»",
              "goto": "katya_exposed",
              "effects": [
                {
                  "type": "set",
                  "key": "exposedToKatya",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -3,
                  "note": "Вы признались Кате в роли Левиафана."
                }
              ]
            }
          ]
        },
        "katya_ira": {
          "speaker": "katya",
          "emotion": "nervous",
          "text": "Она назвалась мне Маковкой, но просила никому не говорить. Если это правда, она как раз заинтересована выманить у зла признание.",
          "choices": [
            {
              "text": "«Значит, её предложение может быть ловушкой.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "suspicion",
                  "characterId": "katya",
                  "targetId": "ira",
                  "value": 1
                }
              ]
            },
            {
              "text": "Блеф: «Тогда она врёт. Маковка — я.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "claimedPoppy",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -1,
                  "note": "Катя знает от Иры, что Маковка — Ира. Ваш блеф её только насторожил."
                }
              ]
            }
          ]
        },
        "katya_word": {
          "speaker": "katya",
          "emotion": "neutral",
          "text": "Да. Я не стала повторять. Если он Мецефель, смена команды произойдёт ночью, а не прямо в разговоре. Пока я играю за добро.",
          "choices": [
            {
              "text": "«Значит, слова ещё никого не объединили.»",
              "endConversation": true,
              "effects": [
                {
                  "type": "set",
                  "key": "learnedWord",
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
              "text": "«Спасибо, этого достаточно.»",
              "endConversation": true
            },
            {
              "text": "«Ира на меня злится. Спроси у неё почему — увидишь, как она ловит признания.»",
              "conditions": [
                {
                  "type": "trust",
                  "characterId": "ira",
                  "operator": "lte",
                  "value": -1
                }
              ],
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
            }
          ]
        },
        "katya_exposed": {
          "speaker": "katya",
          "emotion": "angry",
          "text": "Нет. И если это шутка, момент выбран ужасно. Я не обещаю держать такое признание в секрете.",
          "choices": [
            {
              "text": "«Это была проверка реакции.»",
              "endConversation": true
            },
            {
              "text": "«Тогда разговор окончен.»",
              "endConversation": true
            }
          ]
        },
        "katya_warned": {
          "speaker": "katya",
          "emotion": "angry",
          "text": "Ира рассказала, что ты назвалась Левиафаном. Я допускаю добрый блеф, но предлагать мне тайный союз после этого странно.",
          "choices": [
            {
              "text": "«Она всё-таки передала мои слова.»",
              "endConversation": true
            },
            {
              "text": "«Ира сама представилась злой.»",
              "goto": "katya_ira"
            }
          ]
        },
        "katya_repeat": {
          "speaker": "katya",
          "emotion": "neutral",
          "text": "Я не собираюсь менять команду из-за чьей-то уверенной реплики. Сначала сведения, потом обещания.",
          "choices": [
            {
              "text": "«Согласна. Что ты знаешь об Ире?»",
              "goto": "katya_ira"
            },
            {
              "text": "«Ладно, увидимся за столом.»",
              "endConversation": true
            }
          ]
        },
        "katya_vouched": {
          "speaker": "katya",
          "emotion": "neutral",
          "text": "Саша сказал, что с тобой можно говорить. Я верю ему, а не тебе — но слушать буду.",
          "choices": [
            {
              "text": "«Что ты заметила за Ирой?»",
              "goto": "katya_ira",
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 1
                }
              ]
            },
            {
              "text": "«Кому ты собираешься верить к вечеру?»",
              "endConversation": true,
              "effects": [
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": 1
                }
              ]
            },
            {
              "text": "Рискнуть: «Я Левиафан. Ты со мной?»",
              "goto": "katya_exposed",
              "effects": [
                {
                  "type": "set",
                  "key": "exposedToKatya",
                  "value": true
                },
                {
                  "type": "trust",
                  "characterId": "katya",
                  "value": -3,
                  "note": "Вы признались Кате, которая пришла к вам по слову Саши."
                },
                {
                  "type": "trust",
                  "characterId": "sasha",
                  "value": -2,
                  "note": "Катя рассказала Саше, чем закончилось его поручительство за вас."
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
      "id": "first-whispers",
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
      "title": "Мимо закрытой двери",
      "text": "Ира и Катя проходят мимо закрытой двери. Вы слышите: «Никого не показали? А с чего ты решил, что я должна это знать?»",
      "effects": []
    },
    {
      "id": "ira-spreads-confession",
      "trigger": "afterConversation",
      "once": true,
      "visible": false,
      "when": [
        {
          "type": "variable",
          "key": "exposedToIra",
          "operator": "equals",
          "value": true
        }
      ],
      "debugText": "Настоящая Маковка Ира предупредила Катю о признании героя.",
      "effects": [
        {
          "type": "set",
          "key": "iraWarnedKatya",
          "value": true
        },
        {
          "type": "set",
          "key": "exposedToGood",
          "value": true
        }
      ]
    },
    {
      "id": "direct-confession",
      "trigger": "afterConversation",
      "once": true,
      "visible": false,
      "when": [
        {
          "type": "variable",
          "key": "exposedToKatya",
          "operator": "equals",
          "value": true
        }
      ],
      "debugText": "Добрая Катя услышала прямое признание героя в роли Левиафана.",
      "effects": [
        {
          "type": "set",
          "key": "exposedToGood",
          "value": true
        }
      ]
    },
    {
      "id": "borrowed-role",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [
        {
          "type": "variable",
          "key": "maxBluff",
          "operator": "equals",
          "value": "savant"
        }
      ],
      "title": "Знакомая версия",
      "text": "У общего стола Макс уже называет себя Савантом: днём он ходит к Рассказчику и приносит два факта, один из которых ложный. Он воспользовался вашей подсказкой.",
      "characterIds": [
        "max"
      ],
      "effects": []
    },
    {
      "id": "borrowed-role-fisherman",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [
        {
          "type": "variable",
          "key": "maxBluff",
          "operator": "equals",
          "value": "fisherman"
        }
      ],
      "title": "Знакомая версия",
      "text": "У общего стола Макс уже называет себя Рыбаком: свой единственный совет от Рассказчика он, по его словам, бережёт для решающего дня. Он воспользовался вашей подсказкой.",
      "characterIds": [
        "max"
      ],
      "effects": []
    },
    {
      "id": "return-to-table",
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
      "title": "Кому открыть карты?",
      "text": "Рассказчик зовёт всех обратно. Вы ещё успеваете договориться с одним человеком, как продолжать игру.",
      "effects": []
    },
    {
      "id": "max-hears-the-pointer",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [
        {
          "type": "variable",
          "key": "pointedAtMax",
          "operator": "equals",
          "value": true
        }
      ],
      "title": "Подсказка вернулась",
      "text": "Саша негромко повторяет вашу мысль: «Дальше по часовой сидит Макс». Макс слышит это и коротко смотрит на вас.",
      "effects": [
        {
          "type": "trust",
          "characterId": "max",
          "value": -1,
          "note": "Саша повторил вашу подсказку про «дальше по часовой» — Макс понял, чья это была мысль."
        }
      ]
    },
    {
      "id": "colliding-poppy-claims",
      "trigger": "afterConversation",
      "once": true,
      "visible": true,
      "when": [
        {
          "type": "variable",
          "key": "collidingBluff",
          "operator": "equals",
          "value": true
        }
      ],
      "title": "Две Маковки за столом",
      "text": "Макс заявляет Маковку — и почти сразу то же самое делает Ира. Катя записывает обоих в подозрительные и вспоминает, с кем вы говорили перед этим.",
      "effects": [
        {
          "type": "trust",
          "characterId": "katya",
          "value": -1,
          "note": "Вы подсунули Максу блеф, который столкнулся с заявлением Иры; Катя заметила вашу руку."
        }
      ]
    }
  ],
  "decision": {
    "title": "К кому вы подойдёте перед голосованием?",
    "prompt": "Подойти можно к любому. Вопрос в том, согласится ли он держаться вашей версии — и что сделает, если откажет.",
    "actionLabel": "Предложить союз",
    "allowNobody": true,
    "statements": [
      {
        "characterId": "ira",
        "variants": [
          {
            "when": [
              {
                "type": "trust",
                "characterId": "ira",
                "operator": "gte",
                "value": 2
              }
            ],
            "text": "«Ты был со мной откровенен. Я это запомнила.»"
          },
          {
            "when": [
              {
                "type": "variable",
                "key": "exposedToIra",
                "operator": "equals",
                "value": true
              }
            ],
            "text": "«Помню, что ты мне сказала. Вернёмся к этому за столом.»"
          },
          {
            "text": "«Секреты лучше обсуждать вдвоём.»"
          }
        ]
      },
      {
        "characterId": "max",
        "variants": [
          {
            "when": [
              {
                "type": "trust",
                "characterId": "max",
                "operator": "gte",
                "value": 2
              }
            ],
            "text": "«Я готов. Скажи слово — и я повторю за тобой всё, что нужно.»"
          },
          {
            "when": [
              {
                "type": "variable",
                "key": "sharedSafeBluff",
                "operator": "equals",
                "value": true
              }
            ],
            "text": "«Твою подсказку я запомнил. Продолжим вместе?»"
          },
          {
            "text": "«Я всё ещё ищу правильного собеседника.»"
          }
        ]
      },
      {
        "characterId": "sasha",
        "variants": [
          {
            "when": [
              {
                "type": "trust",
                "characterId": "sasha",
                "operator": "lte",
                "value": -2
              }
            ],
            "text": "«Я уже сказал за столом, куда показывает моя стрелка. Не подходи ко мне отдельно.»"
          },
          {
            "when": [
              {
                "type": "variable",
                "key": "sashaDoubts",
                "operator": "equals",
                "value": true
              }
            ],
            "text": "«Я сомневаюсь, но твою версию пока не раскрыл.»"
          },
          {
            "text": "«Уверенное заявление не подтверждает роль.»"
          }
        ]
      },
      {
        "characterId": "katya",
        "variants": [
          {
            "when": [
              {
                "type": "trust",
                "characterId": "katya",
                "operator": "lte",
                "value": -2
              }
            ],
            "text": "«Я записала всё, что ты сегодня сказала. Зачитать?»"
          },
          {
            "when": [
              {
                "type": "variable",
                "key": "iraWarnedKatya",
                "operator": "equals",
                "value": true
              }
            ],
            "text": "«Мне есть что спросить о твоём разговоре с Ирой.»"
          },
          {
            "text": "«За добро я играю осознанно.»"
          }
        ]
      }
    ],
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
  "endings": [
    {
      "id": "betrayed-and-executed",
      "when": [
        {
          "type": "approach",
          "operator": "equals",
          "value": "betrayed"
        },
        {
          "type": "executed",
          "operator": "equals",
          "value": "you"
        }
      ],
      "tone": "defeat",
      "label": "Итог дня",
      "title": "Вас сдали и казнили",
      "text": "Тот, к кому вы подошли, пересказал разговор всему столу — и сам же вас номинировал. Руки поднялись быстро, перебить этот счёт было некому. Мецефель так и не понял, что весь день сидел рядом со своим Демоном.",
      "epilogue": "Предлагать союз тому, кто вам не верит, дороже, чем промолчать."
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
      "title": "Вы остались на плахе",
      "text": "Вас номинировали, рук хватило, и до конца дня никто не собрал больше. Днём вы не смогли объяснить, почему всё сходится на вашем месте за столом, и город снял с себя первый вопрос — вами.",
      "epilogue": "Демона выдают не роли, а разговоры."
    },
    {
      "id": "turned-on-minion",
      "when": [
        {
          "type": "pactBroken",
          "operator": "truthy"
        },
        {
          "type": "executed",
          "operator": "equals",
          "value": "max"
        }
      ],
      "tone": "defeat",
      "label": "Итог дня",
      "title": "Вы назвали собственного приспешника",
      "text": "Час назад Макс согласился держаться вашей версии, а на голосовании вы подняли за него руку. Он остался на плахе — единственный за этим столом, кто мог работать на вас.",
      "epilogue": "Зло проигрывает не городу, а собственным союзам."
    },
    {
      "id": "executed-minion",
      "when": [
        {
          "type": "executed",
          "operator": "equals",
          "value": "max"
        }
      ],
      "tone": "defeat",
      "label": "Итог дня",
      "title": "Казнён свой",
      "text": "Стол оставил на плахе Макса. Он был Мецефелем — единственным приспешником за этим столом и единственным, кто мог бы работать на вас. Вы остались злом в одиночку.",
      "epilogue": "Иногда хуже всего сработать точно и не в ту сторону."
    },
    {
      "id": "turned-on-ally-executed",
      "when": [
        {
          "type": "pactBroken",
          "operator": "truthy"
        },
        {
          "type": "executedTeam",
          "operator": "equals",
          "value": "Добро"
        }
      ],
      "tone": "victory",
      "label": "Итог дня",
      "title": "Союзник пошёл на плаху",
      "text": "Вы подняли руку за того, кто только что согласился вас поддержать. Он не удержался: рук хватило, добрый игрок казнён. Левиафану нужен второй такой день — но стол запомнил, как быстро вы сдали своего.",
      "epilogue": "Победа есть. Доверия к вам завтра не будет."
    },
    {
      "id": "turned-on-ally",
      "when": [
        {
          "type": "pactBroken",
          "operator": "truthy"
        }
      ],
      "tone": "defeat",
      "label": "Итог дня",
      "title": "Предали без выгоды",
      "text": "Вы пошли против собственного союзника, и с этой минуты он голосовал против вас. На плахе к вечеру не осталось никого: он жив, вы живы, а договорённость, ради которой вы потратили день, сгорела за одну минуту.",
      "epilogue": "Хуже сорванного союза только сорванный своими руками."
    },
    {
      "id": "executed-good-with-ally",
      "when": [
        {
          "type": "executedTeam",
          "operator": "equals",
          "value": "Добро"
        },
        {
          "type": "approach",
          "operator": "equals",
          "value": "accepted"
        }
      ],
      "tone": "victory",
      "label": "Итог дня",
      "title": "Голоса пошли за вами",
      "text": "Вы договорились заранее, и на номинации это решило всё: рука союзника поднялась вместе с вашей, счёт перебить никто не сумел. Добрый игрок казнён. Левиафану нужен второй такой день — и первый уже есть.",
      "epilogue": "Договорённость до номинации стоит дороже любой ночной способности."
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
      "tone": "victory",
      "label": "Итог дня",
      "title": "Один добрый уже казнён",
      "text": "Стол сам вывел на плаху доброго игрока, и вам хватило доверия, чтобы вас не заподозрили. Левиафану нужно, чтобы казнили больше одного доброго; половина работы сделана без союзника.",
      "epilogue": "Иногда достаточно не мешать городу ошибаться."
    },
    {
      "id": "betrayed-survived",
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
      "text": "Вас не казнили, но ваш разговор пересказали при всех. К вечеру каждый за столом знает, кому вы предлагали союз и какими словами. Завтра начнётся не с чистого листа.",
      "epilogue": "Отказ можно пережить. Пересказ — нет."
    },
    {
      "id": "survived-nomination",
      "when": [
        {
          "type": "nominatedPlayer",
          "operator": "truthy"
        }
      ],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "Вас назвали, но рук не хватило",
      "text": "Ваше имя прозвучало, и на счёт смотрели все. Голосов не набралось — но теперь стол знает, кого проверять первым, и завтра для этого хватит одной руки.",
      "epilogue": "Пережить номинацию не то же самое, что остаться незамеченным."
    },
    {
      "id": "quiet-table",
      "when": [
        {
          "type": "nominations",
          "operator": "equals",
          "value": 0
        }
      ],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "День без единой номинации",
      "text": "Никто не назвал никого. Стол разошёлся, так и не проверив ни одной версии, и Рассказчик объявил ночь. Для Левиафана это не потеря — но и не выигрыш: добрым досталась целая ночь на размышления.",
      "epilogue": "Левиафан ночью не убивает: тихий день лишь приближает пятый, а быстрее к победе ведут казни добрых."
    },
    {
      "id": "ally-quiet-day",
      "when": [
        {
          "type": "approach",
          "operator": "equals",
          "value": "accepted"
        }
      ],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "Союз есть, казни нет",
      "text": "Номинации были, но на плахе никто не удержался. Зато вы уходите со стола не один: с вами согласились держаться одной версии. Завтра этот голос будет считаться вместе с вашим.",
      "epilogue": "Первый день зла — про знакомства, а не про казни."
    },
    {
      "id": "refused-quiet-day",
      "when": [
        {
          "type": "approach",
          "operator": "equals",
          "value": "refused"
        }
      ],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "Отказ без последствий",
      "text": "Вам отказали, но промолчали. День закончился без казни. Вы потеряли его и ничего не приобрели — кроме понимания, кому пока не стоит открываться.",
      "epilogue": "Осторожный отказ дешевле громкого союза."
    },
    {
      "id": "alone-quiet-day",
      "when": [
        {
          "type": "approach",
          "operator": "equals",
          "value": "none"
        }
      ],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "День без обещаний",
      "text": "Вы не подошли ни к кому, и на плахе к вечеру никого не осталось. Никто не узнал о вас лишнего — но и приспешник по-прежнему не знает, что вы за столом вдвоём.",
      "epilogue": "Молчание сохраняет тайну и тратит день."
    },
    {
      "id": "fallback-ending",
      "when": [],
      "tone": "neutral",
      "label": "Итог дня",
      "title": "День закончился",
      "text": "Вы возвращаетесь за общий стол. Злу ещё предстоит договориться, а добру — проверить чужие признания.",
      "epilogue": "Партия продолжается."
    }
  ],
  "reveal": [
    {
      "characterId": "ira",
      "role": "Маковка",
      "team": "Добро",
      "icon": "assets/roles/poppygrower.png"
    },
    {
      "characterId": "max",
      "role": "Мецефель",
      "team": "Зло",
      "icon": "assets/roles/mezepheles.png"
    },
    {
      "characterId": "sasha",
      "role": "Шугенжа",
      "team": "Добро",
      "icon": "assets/roles/shugenja.png"
    },
    {
      "characterId": "katya",
      "role": "Завхоз",
      "team": "Добро",
      "icon": "assets/roles/steward.png"
    }
  ],
  "trust": {
    "min": -4,
    "max": 4
  },
  "vote": {
    "title": "Стол ищет казнь",
    "prompt": "Ваша номинация. Назвать можно только того, кого сегодня ещё не называли, и только один раз за день.",
    "abstainLabel": "Промолчать",
    "majority": 3,
    "nominateAt": 2,
    "urgentAt": 3,
    "voteAt": 1
  }
};
