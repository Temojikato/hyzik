// dataSets/npcs.js

module.exports = {
  // =====================================================
  // MARKET DISTRICT
  // =====================================================

  // ----- The Endless Emporium -----
  // Proprietor
  "Marlowe Thistlefoot": {
    id: "marlowe-thistlefoot",
    imageUrl: "https://example.com/elara.jpg",
    imageFiles: [
      { filename: "Marlowe Thistlefoot - 1.png", locked: false },
      { filename: "Marlowe Thistlefoot - 2.png", locked: true }
    ],
    basicInfo: {
      name: "Marlowe Thistlefoot",
      age: "42",
      residence: "124",
      workplace: "Is the owner of The Endless Emporium",
      family: ["Bethanie Thistlefoot"]
    },
    categories: {
      families: ["Thistlefoot", "McGommery"],
      workplace: ["The Endless Emporium"],
      faction: ["The Silent Shadows"]
    },
    categoryLocks: {
      faction: true 
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Keeps his ears perked to catch useful gossip, always ready to report or withhold information as needed.",
        level2: "Disdains authority figures and avoids serving them.",
        level3: "Believes that the common folk deserve a voice, even if it means defying the elite.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Friends and Foes",
        level1: "Friendly with most customers; a good listener.",
        level2: "Has a contentious relationship with his sister, who works for a rival establishment.",
        level3: "Prefers to keep a neutral stance with outsiders.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has never set foot in the Tower but hears plenty of stories.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Born and raised in town, groomed to run the family business.",
        level2: "His father was murdered when he was 13; a dark secret haunts him.",
        level3: "His mother vanished when he was 32, leaving unanswered questions.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Shrewd, resourceful, with a hidden compassionate streak.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To run his shop efficiently while keeping a finger on the town’s pulse.",
        level2: "To challenge local authority when necessary.",
        level3: "To uncover the truth behind his family's tragedies.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff Members for The Endless Emporium
  "Jenna Greenleaf": {
    id: "jenna-greenleaf",
    imageUrl: "https://example.com/jenna.jpg",
    imageFiles: [
      { filename: "Jenna Greenleaf - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Jenna Greenleaf",
      age: "76",
      residence: "Market District",
      workplace: "Assistant at The Endless Emporium",
      family: ["Felicia Greenleaf"]
    },
    categories: {
      families: [],
      workplace: ["The Endless Emporium"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in honest work and treating every customer with kindness.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Gets along well with most staff, and especially with her employer.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has never ventured into the Tower; it's too dangerous.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up in a small village and moved to town for better opportunities.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Cheerful, resourceful, and always ready with a smile.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To learn the trade and someday run her own business.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Borak Stonehand": {
    id: "borak-stonehand",
    imageUrl: "https://example.com/borak.jpg",
    imageFiles: [
      { filename: "Borak Stonehand - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Borak Stonehand",
      age: "48",
      residence: "Market District",
      workplace: "Inventory Manager at The Endless Emporium",
      family: []
    },
    categories: {
      families: ["Stonehand"],
      workplace: ["The Endless Emporium"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Values reliability and precision in managing inventory.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Well-liked by colleagues for his no-nonsense attitude.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has only heard stories from daring adventurers.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Worked in warehouses before joining the Emporium.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Stoic, dependable, and quietly observant.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure every item is accounted for and the store runs smoothly.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- Arcane Antiques -----
  // Proprietor
  "Elara Moonshadow": {
    id: "elara-moonshadow",
    imageUrl: "https://example.com/elara.jpg",
    imageFiles: [
      { filename: "Elara Moonshadow - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Elara Moonshadow",
      age: "310",
      residence: "Market District - Arcane Antiques",
      workplace: "Owner of Arcane Antiques",
      family: []
    },
    categories: {
      families: [],
      workplace: ["Arcane Antiques"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Seeks to preserve ancient magics and protect magical relics.",
        level2: "Believes that true magic should never fall into the wrong hands.",
        level3: "Maintains an aura of mystery, hinting at deeper secrets.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by arcane scholars; works closely with trusted assistants.",
        level2: "Keeps her true alliances hidden.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Occasionally sends envoys to the Tower for minor relics.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Born into an ancient elven lineage of mystics.",
        level2: "Left her secluded homeland to share her wisdom with the world.",
        level3: "Her past remains shrouded in mystery and whispers of betrayal.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Elegant, reserved, and profoundly insightful.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To secure lost magical artifacts and build a safe haven for true magic.",
        level2: "To maintain her shop as a beacon of genuine enchantment.",
        level3: "To one day reveal her true purpose to those she trusts.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for Arcane Antiques
  "Thorn Silvertongue": {
    id: "thorn-silvertongue",
    imageUrl: "https://example.com/thorn.jpg",
    imageFiles: [
      { filename: "Thorn Silvertongue - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Thorn Silvertongue",
      age: "35",
      residence: "Market District",
      workplace: "Assistant at Arcane Antiques",
      family: []
    },
    categories: {
      families: [],
      workplace: ["Arcane Antiques"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the power of enchantments and careful appraisal of magical items.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Charming and witty, he smooths over delicate negotiations.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has accompanied Elara on minor expeditions into the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Once a traveling merchant, he found his niche in arcane artifacts.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Charismatic, clever, and a bit mysterious.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To learn all there is to know about magical relics and to secure his future.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Mira Starweaver": {
    id: "mira-starweaver",
    imageUrl: "https://example.com/mira-starweaver.jpg",
    imageFiles: [
      { filename: "Mira Starweaver - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Mira Starweaver",
      age: "120",
      residence: "Market District",
      workplace: "Artifact Restorer at Arcane Antiques",
      family: []
    },
    categories: {
      families: [],
      workplace: ["Arcane Antiques"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that every relic has a story that must be preserved.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Reserved but efficient; respected by colleagues.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has restored items retrieved from the Tower with delicate precision.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Hails from a long line of curators and restorers.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Quiet, meticulous, and profoundly focused.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To perfect her craft and preserve the legacy of ancient magic.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Blade and Bow -----
  // Proprietor
  "Gromm Ironhammer": {
    id: "gromm-ironhammer",
    imageUrl: "https://example.com/gromm.jpg",
    imageFiles: [
      { filename: "Gromm Ironhammer - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Gromm Ironhammer",
      age: "55",
      residence: "Market District",
      workplace: "Owner of The Blade and Bow",
      family: []
    },
    categories: {
      families: ["Ironhammer"],
      workplace: ["The Blade and Bow"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in honor and the strength of the warrior spirit.",
        level2: "Has a strict code of conduct and distrusts magic.",
        level3: "Sees personal might as the true source of power.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Respected among fellow warriors.",
        level2: "Keeps a cautious distance from potential rivals.",
        level3: "Values loyalty and honest combat above all.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Rarely enters the Tower; prefers the solidity of his shop.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "A former adventurer who retired to run his weapon shop.",
        level2: "Carries scars and battle tales from his past exploits.",
        level3: "His legacy is built on both his skill and his honor.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Gruff, stoic, and principled.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To maintain a reputation for quality weapons.",
        level2: "To train a worthy successor one day.",
        level3: "To atone for past mistakes by protecting the weak.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Blade and Bow
  "Lara Swiftarrow": {
    id: "lara-swiftarrow",
    imageUrl: "https://example.com/lara.jpg",
    imageFiles: [
      { filename: "Lara Swiftarrow - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lara Swiftarrow",
      age: "28",
      residence: "Market District",
      workplace: "Assistant at The Blade and Bow",
      family: []
    },
    categories: {
      families: ["Swiftarrow"],
      workplace: ["The Blade and Bow"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in precision and swift action, much like an arrow in flight.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Works well with Gromm and the rest of the team.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has accompanied Gromm on a few ventures into the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up honing her archery skills in the wilds.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Energetic, focused, and fiercely independent.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To master her archery and support her mentor in his endeavors.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Thorin Battleborn": {
    id: "thorin-battleborn",
    imageUrl: "https://example.com/thorin.jpg",
    imageFiles: [
      { filename: "Thorin Battleborn - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Thorin Battleborn",
      age: "40",
      residence: "Market District",
      workplace: "Weapon Specialist at The Blade and Bow",
      family: []
    },
    categories: {
      families: ["Battleborn"],
      workplace: ["The Blade and Bow"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in brute strength and the power of raw skill.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Respected by customers for his no-nonsense approach.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has little interest in the magical dangers of the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Once fought in many battles, now focuses on guiding customers to the right weapons.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Gruff but fair, with a quiet determination.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To maintain his reputation as a reliable weapon expert.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- Shield and Anvil -----
  // Proprietor
  "Helena Strongwall": {
    id: "helena-strongwall",
    imageUrl: "https://example.com/helena.jpg",
    imageFiles: [
      { filename: "Helena Strongwall - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Helena Strongwall",
      age: "40",
      residence: "Market District",
      workplace: "Owner of Shield and Anvil",
      family: []
    },
    categories: {
      families: ["Strongwall"],
      workplace: ["Shield and Anvil"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the sanctity of protection and the value of sturdy armor.",
        level2: "Views craftsmanship as both art and duty.",
        level3: "Stands by traditional methods against modern trends.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Respected among local blacksmiths and armorers.",
        level2: "Collaborates on custom pieces while remaining wary of competition.",
        level3: "Keeps a cautious eye on those who compromise quality.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Rarely needed in the Tower but has repaired gear for a few brave souls.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained from childhood in the art of blacksmithing within a warrior family.",
        level2: "Inherited the shop after proving her mettle in several contests.",
        level3: "Her legacy is built on countless lives saved by her armors.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Pragmatic, tough, and no-nonsense, with a compassionate streak.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To perfect her craft and protect her clients at all costs.",
        level2: "To expand her workshop and train the next generation.",
        level3: "To preserve her family’s long-standing tradition of quality.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for Shield and Anvil
  "Borin Steelshield": {
    id: "borin-steelshield",
    imageUrl: "https://example.com/borin.jpg",
    imageFiles: [
      { filename: "Borin Steelshield - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Borin Steelshield",
      age: "50",
      residence: "Market District",
      workplace: "Armor Specialist at Shield and Anvil",
      family: []
    },
    categories: {
      families: ["Steelshield"],
      workplace: ["Shield and Anvil"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that quality armor is the first line of defense.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Works closely with Helena and the local smiths.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has occasionally repaired gear from adventurers returning from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned the trade from his father, a renowned armorer.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Honest, diligent, and steadfast.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure every customer is safely armored.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Elise Ironhand": {
    id: "elise-ironhand",
    imageUrl: "https://example.com/elise.jpg",
    imageFiles: [
      { filename: "Elise Ironhand - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Elise Ironhand",
      age: "35",
      residence: "Market District",
      workplace: "Assistant at Shield and Anvil",
      family: []
    },
    categories: {
      families: ["Ironhand"],
      workplace: ["Shield and Anvil"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Values precision and a keen eye for fine craftsmanship.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Works in harmony with Borin and Helena.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has assisted in minor repairs for adventurers returning from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained as an apprentice from a young age.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Efficient, friendly, and meticulous.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To master her craft and support her team.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Alchemist's Alembic -----
  // Proprietor
  "Beryl Fizzlebang": {
    id: "beryl-fizzlebang",
    imageUrl: "https://example.com/beryl.jpg",
    imageFiles: [
      { filename: "Beryl Fizzlebang - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Beryl Fizzlebang",
      age: "38",
      residence: "Market District",
      workplace: "Owner of The Alchemist's Alembic",
      family: []
    },
    categories: {
      families: ["Fizzlebang"],
      workplace: ["The Alchemist's Alembic"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in experimentation and the transformative power of alchemy.",
        level2: "Sees science and magic as intertwined.",
        level3: "Strives to push boundaries while protecting his customers.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Has a loyal team and maintains balanced relationships with local healers.",
        level2: "Is cautious of those who might exploit his formulas.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Occasionally retrieves rare ingredients from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up in a family of alchemists and struck out on his own early.",
        level2: "Established his shop through hard work and secret experiments.",
        level3: "His innovative potions have made him a local legend.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Eccentric, passionate, and endlessly curious.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To craft potions that surprise and heal.",
        level2: "To expand his inventory with rare Tower finds.",
        level3: "To perfect a groundbreaking formula.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Alchemist's Alembic
  "Pip Sparkleflame": {
    id: "pip-sparkleflame",
    imageUrl: "https://example.com/pip.jpg",
    imageFiles: [
      { filename: "Pip Sparkleflame - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Pip Sparkleflame",
      age: "22",
      residence: "Market District",
      workplace: "Assistant at The Alchemist's Alembic",
      family: []
    },
    categories: {
      families: ["Sparkleflame"],
      workplace: ["The Alchemist's Alembic"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Eager to learn and quick to experiment.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Cheerful and helpful to both customers and his mentor.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has helped retrieve minor ingredients from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Hails from a family with modest means, eager to prove himself.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Optimistic, energetic, and full of ideas.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To one day become a master alchemist in his own right.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Mira Starbrew": {
    id: "mira-starbrew",
    imageUrl: "https://example.com/mira-starbrew.jpg",
    imageFiles: [
      { filename: "Mira Starbrew - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Mira Starbrew",
      age: "35",
      residence: "Market District",
      workplace: "Assistant at The Alchemist's Alembic",
      family: []
    },
    categories: {
      families: ["Starbrew"],
      workplace: ["The Alchemist's Alembic"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the balance between innovation and tradition in alchemy.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Quietly efficient and supportive of her mentor.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has accompanied her boss on several trips into the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Always had a natural talent for potion-making from a young age.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Calm, methodical, and thoughtful.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To learn every secret of the ancient alchemical arts.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Whispering Quill -----
  // Proprietor
  "Professor Thaddeus Quill": {
    id: "thaddeus-quill",
    imageUrl: "https://example.com/quill.jpg",
    imageFiles: [
      { filename: "Thaddeus Quill - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Professor Thaddeus Quill",
      age: "68",
      residence: "Market District",
      workplace: "Owner of The Whispering Quill",
      family: []
    },
    categories: {
      families: ["Quill"],
      workplace: ["The Whispering Quill"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the power of knowledge and the written word.",
        level2: "Sees books as both weapons and shields in the fight for truth.",
        level3: "Is driven to preserve ancient lore and educate future generations.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Respected by scholars and fellow scribes.",
        level2: "Keeps his circle small to protect his secrets.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Rarely ventures into the Tower, instead collecting tales from divers.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Born to a family of scribes, he was immersed in literature from early on.",
        level2: "Traveled far and wide in search of lost texts.",
        level3: "Now runs his bookstore as a sanctuary for forgotten lore.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Eloquent, reflective, and occasionally enigmatic.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To amass a collection of rare manuscripts.",
        level2: "To educate those seeking wisdom.",
        level3: "To pen a tome uniting the realm’s lore.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Whispering Quill
  "Evelyn Page": {
    id: "evelyn-page",
    imageUrl: "https://example.com/evelyn.jpg",
    imageFiles: [
      { filename: "Evelyn Page - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Evelyn Page",
      age: "26",
      residence: "Market District",
      workplace: "Assistant at The Whispering Quill",
      family: []
    },
    categories: {
      families: [],
      workplace: ["The Whispering Quill"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that every word holds power.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Enthusiastic and supportive of her mentor.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has never ventured into the Tower; prefers the quiet of the shop.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up reading and writing; a natural librarian.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Friendly, curious, and eager to learn.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To expand her knowledge and assist in preserving lore.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Silas Inkheart": {
    id: "silas-inkheart",
    imageUrl: "https://example.com/silas.jpg",
    imageFiles: [
      { filename: "Silas Inkheart - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Silas Inkheart",
      age: "30",
      residence: "Market District",
      workplace: "Scribe at The Whispering Quill",
      family: []
    },
    categories: {
      families: ["Inkheart"],
      workplace: ["The Whispering Quill"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in precision and clarity in the written word.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Works diligently to record and preserve important texts.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on accounts from others rather than firsthand experience.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained under several masters of calligraphy and record-keeping.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Quiet, methodical, and deeply committed to his craft.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To compile a comprehensive record of the town’s history.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- Trinkets and Treasures -----
  // Proprietor
  "Seraphina Glidewing": {
    id: "seraphina-glidewing",
    imageUrl: "https://example.com/seraphina.jpg",
    imageFiles: [
      { filename: "Seraphina Glidewing - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Seraphina Glidewing",
      age: "33",
      residence: "Market District",
      workplace: "Owner of Trinkets and Treasures",
      family: []
    },
    categories: {
      families: [],
      workplace: ["Trinkets and Treasures"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that every trinket tells a story and holds magic within.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Has built a network of collectors and secret informants.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Occasionally acquires artifacts from daring divers.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Started collecting curiosities at a young age and turned passion into profit.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Charming, eccentric, and always with a knowing smile.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To uncover rare and mysterious items and control the town’s secrets.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for Trinkets and Treasures
  "Kai Featherfall": {
    id: "kai-featherfall",
    imageUrl: "https://example.com/kai.jpg",
    imageFiles: [
      { filename: "Kai Featherfall - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Kai Featherfall",
      age: "24",
      residence: "Market District",
      workplace: "Assistant at Trinkets and Treasures",
      family: []
    },
    categories: {
      families: ["Featherfall"],
      workplace: ["Trinkets and Treasures"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that beauty lies in the details of every artifact.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for his keen eye and friendly disposition.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has seen a few wonders during divers' expeditions.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up around collectors and learned the art of appraisal.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Cheerful, observant, and detail-oriented.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To refine his skills in appraisal and artifact curation.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Tamsin Brightspark": {
    id: "tamsin-brightspark",
    imageUrl: "https://example.com/tamsin.jpg",
    imageFiles: [
      { filename: "Tamsin Brightspark - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Tamsin Brightspark",
      age: "29",
      residence: "Market District",
      workplace: "Artifact Identifier at Trinkets and Treasures",
      family: []
    },
    categories: {
      families: ["Brightspark"],
      workplace: ["Trinkets and Treasures"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that every artifact carries a hidden history.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for her keen ability to spot fakes and forgeries.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Often examines items brought back from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned her trade in a family of treasure hunters.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Sharp, discerning, and a bit mysterious.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To become the foremost expert in identifying rare artifacts.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Golden Grain -----
  // Proprietor
  "Marcus Wheatley": {
    id: "marcus-wheatley",
    imageUrl: "https://example.com/marcus.jpg",
    imageFiles: [
      { filename: "Marcus Wheatley - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Marcus Wheatley",
      age: "48",
      residence: "Market District",
      workplace: "Owner of The Golden Grain",
      family: []
    },
    categories: {
      families: ["Wheatley"],
      workplace: ["The Golden Grain"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the power of sustenance and reliable supplies.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by local merchants for his fair prices.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on divers for rare ingredients but rarely ventures himself.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Came from humble beginnings and built his business on trust.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Pragmatic, reliable, and fair-minded.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To keep his store thriving and expand its reach.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Golden Grain
  "Lila Harvest": {
    id: "lila-harvest",
    imageUrl: "https://example.com/lila.jpg",
    imageFiles: [
      { filename: "Lila Harvest - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lila Harvest",
      age: "30",
      residence: "Market District",
      workplace: "Assistant at The Golden Grain",
      family: []
    },
    categories: {
      families: ["Harvest"],
      workplace: ["The Golden Grain"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the importance of quality and consistency in supplies.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Friendly and reliable, she assists Marcus diligently.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has accompanied divers on minor retrievals.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up in a farming community and values honest labor.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Cheerful, hardworking, and supportive.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To learn the trade and ensure the store’s reputation remains high.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Hugo Mills": {
    id: "hugo-mills",
    imageUrl: "https://example.com/hugo.jpg",
    imageFiles: [
      { filename: "Hugo Mills - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Hugo Mills",
      age: "38",
      residence: "Market District",
      workplace: "Assistant at The Golden Grain",
      family: []
    },
    categories: {
      families: ["Mills"],
      workplace: ["The Golden Grain"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the efficiency of bulk trade and quality produce.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Works in tandem with Lila to maintain the store’s flow.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has minimal direct experience with Tower expeditions.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned the business from a young age in a family of merchants.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Methodical and calm, with a pragmatic approach.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure smooth operations and expand the store's distribution.",
        unlockedtier: 0
      }
    },
    locked: false
  },
};
