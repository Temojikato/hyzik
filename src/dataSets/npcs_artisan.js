// dataSets/npcs_artisan.js

module.exports = {
  // =====================================================
  // ARTISAN QUARTER
  // =====================================================

  // ----- The Iron Forge (Blacksmith Workshop) -----
  // Proprietor: Thorgrim Stonebrow (Master Dwarf Smith)
  "Thorgrim Stonebrow": {
    id: "thorgrim-stonebrow",
    imageUrl: "https://example.com/thorgrim.jpg",
    imageFiles: [
      { filename: "Thorgrim Stonebrow - 1.png", locked: false },
      { filename: "Thorgrim Stonebrow - 2.png", locked: true }
    ],
    basicInfo: {
      name: "Thorgrim Stonebrow",
      age: "65",
      residence: "Artisan Quarter",
      workplace: "The Iron Forge",
      family: []
    },
    categories: {
      families: ["Stonebrow"],
      workplace: ["The Iron Forge"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the power of metal and fire to forge strength.",
        level2: "Upholds ancient dwarf traditions of craftsmanship.",
        level3: "Values honor in every strike of his hammer.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Respected by fellow smiths and adventurers alike.",
        level2: "Maintains a firm stance against poorly made wares.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has crafted weapons and armors for those returning from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Forged his reputation in countless battles and competitions.",
        level2: "Passed on many secrets of smithing through his years of labor.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Gruff, determined, and uncompromising in quality.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To craft and repair the finest weapons and armors.",
        level2: "To mentor aspiring smiths and preserve dwarf traditions.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Iron Forge
  "Felicia Greenleaf": {
    id: "felicia-greenleaf",
    imageUrl: "https://example.com/felicia.jpg",
    imageFiles: [
      { filename: "Felicia Greenleaf - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Felicia Greenleaf",
      age: "28",
      residence: "Artisan Quarter",
      workplace: "Assistant at The Iron Forge",
      family: []
    },
    categories: {
      families: ["Greenleaf"],
      workplace: ["The Iron Forge"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that strength comes from skillful hands and a clear mind.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for her agility and finesse in heavy forging tasks.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has assisted Thorgrim with tools for divers.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned the craft from a lineage of artisans.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Energetic, precise, and a quick learner.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To perfect her craft and one day become a master smith.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Ella Fireheart": {
    id: "ella-fireheart",
    imageUrl: "https://example.com/ella.jpg",
    imageFiles: [
      { filename: "Ella Fireheart - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Ella Fireheart",
      age: "34",
      residence: "Artisan Quarter",
      workplace: "Blacksmith at The Iron Forge",
      family: []
    },
    categories: {
      families: ["Fireheart"],
      workplace: ["The Iron Forge"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Values intricate design and precise craftsmanship.",
        level2: "Believes that every piece of armor and weapon is a work of art.",
        unlockedtier: 1
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for her innovative techniques and attention to detail.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Often crafts custom orders for divers returning from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained in both traditional and modern blacksmithing.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Passionate, creative, and always pushing boundaries.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To create masterpieces that blend strength with beauty.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Enchanter's Enclave (Enchantment Services) -----
  // Proprietor: Zara Nightweaver (Tiefling Enchanter)
  "Zara Nightweaver": {
    id: "zara-nightweaver",
    imageUrl: "https://example.com/zara.jpg",
    imageFiles: [
      { filename: "Zara Nightweaver - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Zara Nightweaver",
      age: "40",
      residence: "Artisan Quarter",
      workplace: "Owner of The Enchanter's Enclave",
      family: []
    },
    categories: {
      families: ["Nightweaver"],
      workplace: ["The Enchanter's Enclave"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that magic can enhance the mundane.",
        level2: "Sees enchantment as a delicate balance between art and science.",
        level3: "Maintains an air of mystery about her true powers.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Works closely with select mages and apprentices.",
        level2: "Keeps her inner circle secret and exclusive.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has enchanted many items brought back from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained in arcane arts from a young age and left her homeland to master enchantments.",
        level2: "Her past is whispered about but rarely confirmed.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Mysterious, confident, and alluring.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To imbue everyday items with rare magical properties.",
        level2: "To expand her clientele among discerning adventurers.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Enchanter's Enclave
  "Eldric Spellbinder": {
    id: "eldric-spellbinder",
    imageUrl: "https://example.com/eldric.jpg",
    imageFiles: [
      { filename: "Eldric Spellbinder - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Eldric Spellbinder",
      age: "38",
      residence: "Artisan Quarter",
      workplace: "Mage Assistant at The Enchanter's Enclave",
      family: []
    },
    categories: {
      families: ["Spellbinder"],
      workplace: ["The Enchanter's Enclave"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that enchantments must be precise and intentional.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his magical insight and clarity.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has assisted in enchanting relics from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Formerly a traveling mage who settled down to hone his craft.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Methodical, thoughtful, and a keen observer of magic.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To master the art of enchantment and unlock new potentials.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Lyra Glowmist": {
    id: "lyra-glowmist",
    imageUrl: "https://example.com/lyra-glowmist.jpg",
    imageFiles: [
      { filename: "Lyra Glowmist - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lyra Glowmist",
      age: "33",
      residence: "Artisan Quarter",
      workplace: "Sorceress at The Enchanter's Enclave",
      family: []
    },
    categories: {
      families: ["Glowmist"],
      workplace: ["The Enchanter's Enclave"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that elemental forces can be harnessed for enchanting power.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Works closely with Eldric to experiment with new spells.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has enhanced items with elemental magic from Tower expeditions.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained as a sorceress among her half-elf kin, embracing both light and flame.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Passionate, impulsive, and creative.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To push the boundaries of elemental enchantments.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Herbalist's Haven (Herbalist & Potion Ingredients) -----
  // Proprietor: Willow Greenbriar (Human Druid)
  "Willow Greenbriar": {
    id: "willow-greenbriar",
    imageUrl: "https://example.com/willow.jpg",
    imageFiles: [
      { filename: "Willow Greenbriar - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Willow Greenbriar",
      age: "50",
      residence: "Artisan Quarter",
      workplace: "Owner of The Herbalist's Haven",
      family: []
    },
    categories: {
      families: ["Greenbriar"],
      workplace: ["The Herbalist's Haven"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes nature holds the answers to healing and vitality.",
        level2: "Sees herbalism as both a science and an art.",
        unlockedtier: 1
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by local healers and adventurers alike.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on supplies sourced from Tower expeditions for rare herbs.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up close to nature and learned the craft from a druid mentor.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Insightful, nurturing, and in tune with nature.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To educate and supply the town with natural remedies and rare herbs.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Herbalist's Haven
  "Thorne Leafwhisper": {
    id: "thorne-leafwhisper",
    imageUrl: "https://example.com/thorne.jpg",
    imageFiles: [
      { filename: "Thorne Leafwhisper - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Thorne Leafwhisper",
      age: "40",
      residence: "Artisan Quarter",
      workplace: "Botanist at The Herbalist's Haven",
      family: []
    },
    categories: {
      families: ["Leafwhisper"],
      workplace: ["The Herbalist's Haven"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes every plant has a unique magic to offer.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his expertise in cultivating rare herbs.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Frequently accompanies divers to collect exotic plants.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Raised in a community of herbalists, he learned nature’s secrets early.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Calm, observant, and dedicated to the natural order.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To grow and share rare herbs that benefit all.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Sylvia Moss": {
    id: "sylvia-moss",
    imageUrl: "https://example.com/sylvia.jpg",
    imageFiles: [
      { filename: "Sylvia Moss - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Sylvia Moss",
      age: "37",
      residence: "Artisan Quarter",
      workplace: "Herbalist at The Herbalist's Haven",
      family: []
    },
    categories: {
      families: ["Moss"],
      workplace: ["The Herbalist's Haven"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that rare herbs can heal both body and spirit.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for her gentle manner and deep botanical knowledge.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Assists in sourcing unique ingredients from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Studied under renowned herbalists and now imparts that knowledge.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Caring, thoughtful, and dedicated to natural remedies.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To blend tradition with innovation in herbal remedies.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- Clockwork Wonders (Tinkerer and Gadget Shop) -----
  // Proprietor: Felix Cogsworth (Eccentric Gnome Inventor)
  "Felix Cogsworth": {
    id: "felix-cogsworth",
    imageUrl: "https://example.com/felix.jpg",
    imageFiles: [
      { filename: "Felix Cogsworth - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Felix Cogsworth",
      age: "45",
      residence: "Artisan Quarter",
      workplace: "Owner of Clockwork Wonders",
      family: []
    },
    categories: {
      families: ["Cogsworth"],
      workplace: ["Clockwork Wonders"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that innovation and invention are the heart of progress.",
        level2: "Views gadgets as a blend of art, science, and mischief.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Cherished by fellow inventors and eccentric minds.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has provided custom gadgets for divers venturing into the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "An inventor since childhood, with a flair for the unconventional.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Eccentric, clever, and endlessly inventive.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To design gadgets that revolutionize everyday life.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for Clockwork Wonders
  "Tilda Gearspin": {
    id: "tilda-gearspin",
    imageUrl: "https://example.com/tilda.jpg",
    imageFiles: [
      { filename: "Tilda Gearspin - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Tilda Gearspin",
      age: "22",
      residence: "Artisan Quarter",
      workplace: "Gadget Assembler at Clockwork Wonders",
      family: []
    },
    categories: {
      families: ["Gearspin"],
      workplace: ["Clockwork Wonders"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the joy of creating clever devices.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Energetic and eager, she works closely with Felix.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Assists in assembling specialized tools for expeditions.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "A prodigy in tinkering, learning from local masters.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Bright, enthusiastic, and creative.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To design the next breakthrough gadget.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Garrick Bolt": {
    id: "garrick-bolt",
    imageUrl: "https://example.com/garrick-bolt.jpg",
    imageFiles: [
      { filename: "Garrick Bolt - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Garrick Bolt",
      age: "35",
      residence: "Artisan Quarter",
      workplace: "Engineer at Clockwork Wonders",
      family: []
    },
    categories: {
      families: ["Bolt"],
      workplace: ["Clockwork Wonders"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in precision and durability in every mechanism.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his technical expertise and problem-solving skills.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Handles repairs and maintenance for complex clockwork devices.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned engineering on the job and quickly rose to a key role.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Pragmatic, meticulous, and calm under pressure.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To innovate devices that are both efficient and reliable.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Glass Menagerie (Glassblower and Artisan) -----
  // Proprietor: Elena Clearview (Elf Artisan)
  "Elena Clearview": {
    id: "elena-clearview",
    imageUrl: "https://example.com/elena.jpg",
    imageFiles: [
      { filename: "Elena Clearview - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Elena Clearview",
      age: "120",
      residence: "Artisan Quarter",
      workplace: "Owner of The Glass Menagerie",
      family: []
    },
    categories: {
      families: ["Clearview"],
      workplace: ["The Glass Menagerie"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes glass is a medium that captures both light and emotion.",
        level2: "Views every piece of glass art as a delicate balance of beauty and fragility.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by collectors and fellow artisans.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has crafted enchanted glass items for daring adventurers.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained in the art of glassblowing from a young age in an ancient artisan guild.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Meticulous, creative, and elegant.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To craft glass art that transcends the mundane.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Glass Menagerie
  "Gavin Shardspark": {
    id: "gavin-shardspark",
    imageUrl: "https://example.com/gavin.jpg",
    imageFiles: [
      { filename: "Gavin Shardspark - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Gavin Shardspark",
      age: "29",
      residence: "Artisan Quarter",
      workplace: "Glassblower at The Glass Menagerie",
      family: []
    },
    categories: {
      families: ["Shardspark"],
      workplace: ["The Glass Menagerie"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the transformative power of molten glass.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Valued for his precise and artistic craftsmanship.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has created custom glass pieces for adventurers returning from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned glassblowing from a revered mentor in his youth.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Creative, focused, and passionate about his art.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To produce masterpieces that inspire wonder.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Lila Prism": {
    id: "lila-prism",
    imageUrl: "https://example.com/lila-prism.jpg",
    imageFiles: [
      { filename: "Lila Prism - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lila Prism",
      age: "34",
      residence: "Artisan Quarter",
      workplace: "Enchanted Glass Designer at The Glass Menagerie",
      family: []
    },
    categories: {
      families: ["Prism"],
      workplace: ["The Glass Menagerie"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that glass can channel both beauty and magic.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for her innovative designs and enchanted creations.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has produced enchanted glass items sought by elite divers.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Honed her craft in a family of artisans, blending tradition with modern magic.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Elegant, inventive, and quietly confident.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To innovate and create glass art that pushes magical boundaries.",
        unlockedtier: 0
      }
    },
    locked: false
  }
};
