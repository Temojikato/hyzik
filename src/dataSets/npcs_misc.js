// dataSets/npcs_misc.js

module.exports = {
  // =====================================================
  // ADDITIONAL NOTABLE LOCATIONS
  // =====================================================

  // ----- The Whispering Woods (Small Grove/Park) -----
  // Caretaker: Thalia Leafwhisper – A serene human druid who tends to the grove.
  "Thalia Leafwhisper": {
    id: "thalia-leafwhisper",
    imageUrl: "https://example.com/thalia-leafwhisper.jpg",
    imageFiles: [
      { filename: "Thalia Leafwhisper - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Thalia Leafwhisper",
      age: "42",
      residence: "Whispering Woods",
      workplace: "Caretaker of The Whispering Woods",
      family: []
    },
    categories: {
      families: ["Leafwhisper"],
      workplace: ["The Whispering Woods"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that the soft murmur of nature holds ancient secrets.",
        level2: "Seeks to preserve the grove as a sacred retreat for reflection.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Deeply respected for her gentle guidance and attunement to nature.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Prefers the whisper of leaves to the clamor of the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Raised in a remote village where the forest was both teacher and sanctuary.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Calm, nurturing, and wise beyond her years.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To maintain the grove as a haven of peace and healing.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Whispering Woods
  "Eldric Green": {
    id: "eldric-green",
    imageUrl: "https://example.com/eldric-green.jpg",
    imageFiles: [
      { filename: "Eldric Green - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Eldric Green",
      age: "38",
      residence: "Whispering Woods",
      workplace: "Botanist & Groundskeeper",
      family: []
    },
    categories: {
      families: ["Green"],
      workplace: ["The Whispering Woods"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes every bloom and leaf tells a story of life’s resilience.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Cherished for his gentle care and encyclopedic knowledge of flora.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Finds solace in nature, far removed from the Tower’s chaos.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Has spent years cataloging the rare species of the woods.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Thoughtful, meticulous, and quietly passionate.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To document and protect the grove’s natural wonders.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Nora Blossom": {
    id: "nora-blossom",
    imageUrl: "https://example.com/nora-blossom.jpg",
    imageFiles: [
      { filename: "Nora Blossom - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Nora Blossom",
      age: "30",
      residence: "Whispering Woods",
      workplace: "Caretaker Assistant",
      family: []
    },
    categories: {
      families: ["Blossom"],
      workplace: ["The Whispering Woods"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the beauty and healing power of nature’s simplicity.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Adored for her warmth and the tender care she offers visitors.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Prefers the quiet of the grove over the perils of the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up among gardeners and learned early the art of nurturing life.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Cheerful, empathetic, and naturally kind.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure that every visitor leaves the grove with renewed hope.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Shadow Alley (Hidden Black Market) -----
  // Proprietor: "The Shade" – A mysterious figure who deals in secrets and forbidden goods.
  "The Shade": {
    id: "the-shade",
    imageUrl: "https://example.com/shade.jpg",
    imageFiles: [
      { filename: "The Shade - 1.png", locked: true }
    ],
    basicInfo: {
      name: "The Shade",
      age: "Unknown",
      residence: "Shadow Alley",
      workplace: "Hidden Black Market",
      family: []
    },
    categories: {
      families: [],
      workplace: ["Shadow Alley"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Operates in darkness, believing that secrets are the true power.",
        level2: "Keeps his dealings shrouded to maintain his mystique.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Feared and respected among the underworld; few know his true identity.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Remains distant from the Tower, preferring to let others risk the light.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "His origins are obscured by rumors of ancient pacts and hidden debts.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Elusive, cunning, and ruthless when needed.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To control the flow of illicit goods and information without ever revealing himself.",
        unlockedtier: 0
      }
    },
    locked: true
  },

  // Staff for The Shadow Alley
  "Silas Darkmoor": {
    id: "silas-darkmoor",
    imageUrl: "https://example.com/silas-darkmoor.jpg",
    imageFiles: [
      { filename: "Silas Darkmoor - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Silas Darkmoor",
      age: "38",
      residence: "Shadow Alley",
      workplace: "Transactions Manager",
      family: []
    },
    categories: {
      families: ["Darkmoor"],
      workplace: ["Shadow Alley"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes secrecy and discretion are the keys to power in the underground.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for his cold calculation and unmatched network of informants.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has only heard whispered rumors of Tower exploits.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Vanished from a prominent position in society before resurfacing in the shadows.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Calculating, reserved, and ever watchful.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To secure forbidden knowledge and profit from its secrecy.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Nyx Ravenclaw": {
    id: "nyx-ravenclaw",
    imageUrl: "https://example.com/nyx.jpg",
    imageFiles: [
      { filename: "Nyx Ravenclaw - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Nyx Ravenclaw",
      age: "29",
      residence: "Shadow Alley",
      workplace: "Information Broker",
      family: []
    },
    categories: {
      families: ["Ravenclaw"],
      workplace: ["Shadow Alley"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that the hidden truth is the most potent currency.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Commands respect with her extensive, covert network of secrets.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Collects whispered rumors from those who dare the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Fled a life of hardship and learned to trust only the darkness.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Mysterious, sharp, and always alert.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To trade in the most coveted secrets for those with the coin to pay.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Vex Shadowstep": {
    id: "vex-shadowstep",
    imageUrl: "https://example.com/vex.jpg",
    imageFiles: [
      { filename: "Vex Shadowstep - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Vex Shadowstep",
      age: "31",
      residence: "Shadow Alley",
      workplace: "Goods & Security Overseer",
      family: []
    },
    categories: {
      families: ["Shadowstep"],
      workplace: ["Shadow Alley"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes stealth and cunning rule the underground market.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Feared by competitors and respected for her ruthless efficiency.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Stays in the shadows, leaving dangerous exploits to others.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Rose from a life of poverty, mastering the art of covert trade.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Ruthless, agile, and always calculating.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To dominate the black market and silence any rivals.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Tower Entrance (Gateway to the Tower of Chaos) -----
  "Tower Entrance": {
    id: "tower-entrance",
    imageUrl: "https://example.com/tower-entrance.jpg",
    imageFiles: [
      { filename: "Tower Entrance - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Tower Entrance",
      age: "N/A",
      residence: "Central Plaza",
      workplace: "Gateway to the Tower of Chaos",
      family: []
    },
    categories: {
      families: [],
      workplace: ["Tower Entrance"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Stands as the solemn boundary between order and chaos.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Guarded by elite sentries who embody both duty and sacrifice.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "The threshold for all who dare enter the Tower’s mysteries.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "An ancient gateway forged by forgotten hands and steeped in legend.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Imposing, enigmatic, and ever-watchful.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To protect the town by ensuring only the prepared may cross.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Tower Entrance
  "Captain Elric Stone": {
    id: "captain-elric-stone",
    imageUrl: "https://example.com/elric-stone.jpg",
    imageFiles: [
      { filename: "Captain Elric Stone - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Captain Elric Stone",
      age: "48",
      residence: "Central Plaza",
      workplace: "Guard at The Tower Entrance",
      family: []
    },
    categories: {
      families: ["Stone"],
      workplace: ["Tower Entrance"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes vigilance is the shield that defends against chaos.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his martial prowess and unyielding duty.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has witnessed the triumphs and tragedies of many Divers.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "A decorated veteran chosen to protect the town’s most dangerous threshold.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Commanding, resolute, and alert at all times.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure that only those truly ready may pass through the gateway.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Sentry Jax": {
    id: "sentry-jax",
    imageUrl: "https://example.com/jax.jpg",
    imageFiles: [
      { filename: "Sentry Jax - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Sentry Jax",
      age: "35",
      residence: "Central Plaza",
      workplace: "Guard at The Tower Entrance",
      family: []
    },
    categories: {
      families: ["Jax"],
      workplace: ["Tower Entrance"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in swift reaction and precise action against threats.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Noted for his agility and quick decision-making.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has an uncanny knack for spotting irregularities at the entrance.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained in martial disciplines from childhood.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Alert, agile, and decisive.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To maintain the security of the entrance at all costs.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Sentry Mira": {
    id: "sentry-mira",
    imageUrl: "https://example.com/mira-sentry.jpg",
    imageFiles: [
      { filename: "Sentry Mira - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Sentry Mira",
      age: "32",
      residence: "Central Plaza",
      workplace: "Scout at The Tower Entrance",
      family: []
    },
    categories: {
      families: ["Mira"],
      workplace: ["Tower Entrance"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes careful observation is key to preempting danger.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for her discreet vigilance and sharp intuition.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Expert at detecting subtle signs of threat near the gateway.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Developed her keen observational skills while working in high-risk areas.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Observant, cautious, and perceptive.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To alert her team at the first sign of danger.",
        unlockedtier: 0
      }
    },
    locked: false
  }
};
