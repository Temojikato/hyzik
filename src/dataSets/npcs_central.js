// dataSets/npcs_centralplaza.js

module.exports = {
  // =====================================================
  // CENTRAL PLAZA
  // =====================================================

  // ----- Town Hall -----
  // Proprietor: Lord Alistair Pendragon (Mayor)
  "Lord Alistair Pendragon": {
    id: "lord-alistair-pendragon",
    imageUrl: "https://example.com/alistair.jpg",
    imageFiles: [
      { filename: "Lord Alistair Pendragon - 1.png", locked: false },
      { filename: "Lord Alistair Pendragon - 2.png", locked: false }
    ],
    basicInfo: {
      name: "Lord Alistair Pendragon",
      age: "60",
      residence: "Central Plaza",
      workplace: "Town Hall",
      family: []
    },
    categories: {
      families: ["Pendragon"],
      workplace: ["Town Hall"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in strong, just leadership for the town.",
        level2: "Maintains that transparency and fairness are essential in governance.",
        level3: "Views his role as a duty to protect and serve every resident.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by officials and citizens alike.",
        level2: "Maintains close, discreet relationships with trusted advisors.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on divers’ reports to guide town policies, without venturing into the Tower himself.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Rose from humble origins to become a respected leader.",
        level2: "His past includes both personal sacrifice and hard-won victories.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Grave, decisive, and compassionate in equal measure.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure efficient governance and prosperity for the town.",
        level2: "To mediate disputes fairly and maintain peace.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for Town Hall
  "Lady Miranda": {
    id: "lady-miranda",
    imageUrl: "https://example.com/miranda.jpg",
    imageFiles: [
      { filename: "Lady Miranda - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lady Miranda",
      age: "55",
      residence: "Central Plaza",
      workplace: "Town Hall (Schedule Manager)",
      family: []
    },
    categories: {
      families: ["Miranda"],
      workplace: ["Town Hall"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes organization and etiquette are the backbone of administration.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for her efficiency and courteous manner.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on reports and documentation rather than personal dives.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained in administrative arts in a prestigious household.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Elegant, poised, and methodical.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure all town records and schedules are impeccably maintained.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Sir Gareth Lawkeeper": {
    id: "sir-gareth-lawkeeper",
    imageUrl: "https://example.com/gareth.jpg",
    imageFiles: [
      { filename: "Sir Gareth Lawkeeper - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Sir Gareth Lawkeeper",
      age: "52",
      residence: "Central Plaza",
      workplace: "Town Hall (Policy and Regulation)",
      family: []
    },
    categories: {
      families: ["Lawkeeper"],
      workplace: ["Town Hall"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that law and order are paramount to societal success.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his impartiality and commitment to justice.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Remains strictly on the administrative side, leaving dangers to others.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Served in various governmental roles before joining Town Hall.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Gravely serious, unwavering, and principled.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure the town’s laws are upheld with fairness and precision.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Evelyn Beacon": {
    id: "evelyn-beacon",
    imageUrl: "https://example.com/evelyn.jpg",
    imageFiles: [
      { filename: "Evelyn Beacon - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Evelyn Beacon",
      age: "38",
      residence: "Central Plaza",
      workplace: "Town Hall (Secretary)",
      family: []
    },
    categories: {
      families: ["Beacon"],
      workplace: ["Town Hall"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the power of clear communication and record-keeping.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for her friendly and precise manner in managing documents.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Collects accounts and reports without personal risk.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Has a background in clerical work from diverse governmental institutions.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Approachable, efficient, and detail-oriented.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To support the town’s leadership through meticulous records.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Basilica of Harmony (Temple and Place of Worship) -----
  // Proprietor: Lady Seraphine Lightbringer (High Priestess)
  "Lady Seraphine Lightbringer": {
    id: "lady-seraphine-lightbringer",
    imageUrl: "https://example.com/seraphine.jpg",
    imageFiles: [
      { filename: "Lady Seraphine Lightbringer - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lady Seraphine Lightbringer",
      age: "57",
      residence: "Central Plaza",
      workplace: "High Priestess at The Basilica of Harmony",
      family: []
    },
    categories: {
      families: ["Lightbringer"],
      workplace: ["The Basilica of Harmony"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in spiritual healing and universal compassion.",
        level2: "Sees worship as a unifying force for the community.",
        level3: "Aims to inspire both reverence and hope among her followers.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by the devout and those seeking solace.",
        level2: "Keeps close ties with fellow clergy for spiritual guidance.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Rarely engages with the Tower but provides healing for returning divers.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Rose from humble origins to become a beacon of hope in troubled times.",
        level2: "Her journey is marked by personal sacrifice and divine inspiration.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Gentle, empathetic, and inspiring.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To provide free worship services and healing to all who seek it.",
        level2: "To expand her temple and influence in the community.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Basilica of Harmony
  "Brother Thaddeus": {
    id: "brother-thaddeus",
    imageUrl: "https://example.com/thaddeus.jpg",
    imageFiles: [
      { filename: "Brother Thaddeus - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Brother Thaddeus",
      age: "48",
      residence: "Central Plaza",
      workplace: "Cleric at The Basilica of Harmony",
      family: []
    },
    categories: {
      families: ["Thaddeus"],
      workplace: ["The Basilica of Harmony"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in serving the divine with humility.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Well-liked by the congregation for his gentle counsel.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Remains focused on spiritual duties rather than physical adventures.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Dedicated his life to religious service from a young age.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Calm, compassionate, and wise.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To help those in need of healing and spiritual guidance.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Sister Alina": {
    id: "sister-alina",
    imageUrl: "https://example.com/alina.jpg",
    imageFiles: [
      { filename: "Sister Alina - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Sister Alina",
      age: "40",
      residence: "Central Plaza",
      workplace: "Healer at The Basilica of Harmony",
      family: []
    },
    categories: {
      families: ["Alina"],
      workplace: ["The Basilica of Harmony"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the restorative power of divine magic.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Cherished for her gentle healing and comforting presence.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Assists divers with healing upon their return.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Hails from a long line of healers and nurturers.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Empathetic, patient, and kind.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To provide healing to all and to expand her healing arts.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Father Marcus": {
    id: "father-marcus",
    imageUrl: "https://example.com/marcus.jpg",
    imageFiles: [
      { filename: "Father Marcus - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Father Marcus",
      age: "50",
      residence: "Central Plaza",
      workplace: "Priest at The Basilica of Harmony",
      family: []
    },
    categories: {
      families: ["Marcus"],
      workplace: ["The Basilica of Harmony"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the sacred duty of guiding souls to peace.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his deep spirituality and calm demeanor.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Focuses on the spiritual aspect rather than the physical dangers of the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Devoted his life to the church after a personal awakening.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Solemn, caring, and wise.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To conduct ceremonies that bring solace and unity.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Basilic Headquarters (Police Station) -----
  // Captain: Lucius Serpenthelm
  "Lucius Serpenthelm": {
    id: "lucius-serpenthelm",
    imageUrl: "https://example.com/lucius.jpg",
    imageFiles: [
      { filename: "Lucius Serpenthelm - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lucius Serpenthelm",
      age: "55",
      residence: "Central Plaza",
      workplace: "Captain at The Basilic Headquarters",
      family: []
    },
    categories: {
      families: ["Serpenthelm"],
      workplace: ["The Basilic Headquarters"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in enforcing order with unwavering determination.",
        level2: "Values the balance between compassion and strict discipline.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by his officers for his leadership and fairness.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has little direct experience; focuses on local law enforcement.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "A veteran of many conflicts, he now dedicates himself to public safety.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Commanding, disciplined, yet empathetic when needed.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To maintain law and order and to keep the town safe.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Basilic Headquarters
  "Officer Mira Serpenthelm": {
    id: "officer-mira-serpenthelm",
    imageUrl: "https://example.com/mira_serpenthelm.jpg",
    imageFiles: [
      { filename: "Officer Mira Serpenthelm - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Officer Mira Serpenthelm",
      age: "28",
      residence: "Central Plaza",
      workplace: "Officer at The Basilic Headquarters",
      family: ["Lucius Serpenthelm"]
    },
    categories: {
      families: ["Serpenthelm"],
      workplace: ["The Basilic Headquarters"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in protecting the community with integrity.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Works diligently under her father’s command.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has heard many tales, but remains on duty locally.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained in law enforcement from a young age.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Brave, dutiful, and compassionate.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To uphold her father’s legacy and ensure community safety.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Inspector Thorne Viper": {
    id: "inspector-thorne-viper",
    imageUrl: "https://example.com/thorne_viper.jpg",
    imageFiles: [
      { filename: "Inspector Thorne Viper - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Inspector Thorne Viper",
      age: "45",
      residence: "Central Plaza",
      workplace: "Inspector at The Basilic Headquarters",
      family: []
    },
    categories: {
      families: ["Viper"],
      workplace: ["The Basilic Headquarters"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in meticulous investigation and the pursuit of truth.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his attention to detail and impartiality.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Focuses on internal affairs rather than external dangers.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Has a long history in criminal investigations and law enforcement.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Methodical, observant, and unwavering.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure justice is served without bias.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Guard Talia": {
    id: "guard-talia",
    imageUrl: "https://example.com/talia.jpg",
    imageFiles: [
      { filename: "Guard Talia - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Guard Talia",
      age: "32",
      residence: "Central Plaza",
      workplace: "Security at The Basilic Headquarters",
      family: []
    },
    categories: {
      families: ["Talia"],
      workplace: ["The Basilic Headquarters"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in strict enforcement and proactive protection.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Valued for her vigilance and strong sense of duty.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Remains focused on local security rather than Tower matters.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Has served as a guard in various roles since her youth.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Disciplined, alert, and resolute.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To maintain safety and order in the community.",
        unlockedtier: 0
      }
    },
    locked: false
  }
};
