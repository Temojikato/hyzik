// dataSets/npcs_guild.js

module.exports = {
  // =====================================================
  // GUILD DISTRICT
  // =====================================================

  // ----- The Diver's Guildhall -----
  // Proprietor: Guildmaster Harrick Stonewall
  "Harrick Stonewall": {
    id: "harrick-stonewall",
    imageUrl: "https://example.com/harrick.jpg",
    imageFiles: [
      { filename: "Harrick Stonewall - 1.png", locked: false },
      { filename: "Harrick Stonewall - 2.png", locked: true }
    ],
    basicInfo: {
      name: "Harrick Stonewall",
      age: "58",
      residence: "Guild District",
      workplace: "The Diver's Guildhall",
      family: []
    },
    categories: {
      families: ["Stonewall"],
      workplace: ["The Diver's Guildhall"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in discipline and honor amidst chaos.",
        level2: "Upholds the guild’s traditions with strict adherence.",
        level3: "Sees every expedition as a test of unity and strength.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by both newcomers and veterans for his stern guidance.",
        level2: "Known for his unwavering fairness.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has personally led several perilous expeditions into the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "A battle-hardened veteran who now trains new Divers.",
        level2: "His scars and stories bear witness to countless dangerous dives.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Stern and disciplined yet compassionate toward his guild.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To maintain the guild’s legacy and ensure safe expeditions.",
        level2: "To pass on his hard-won wisdom to the next generation.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Diver's Guildhall
  "Lena Guildscribe": {
    id: "lena-guildscribe",
    imageUrl: "https://example.com/lena_guildscribe.jpg",
    imageFiles: [
      { filename: "Lena Guildscribe - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lena Guildscribe",
      age: "32",
      residence: "Guild District",
      workplace: "The Diver's Guildhall",
      family: []
    },
    categories: {
      families: ["Guildscribe"],
      workplace: ["The Diver's Guildhall"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in precise record-keeping and fairness in registration.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for her diligence and clarity in managing records.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on secondhand reports rather than personal dives.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained in clerical arts at a prestigious academy.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Meticulous, kind, and detail-oriented.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To keep the guild’s records impeccable and assist new Divers.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Roran Questmaster": {
    id: "roran-questmaster",
    imageUrl: "https://example.com/roran.jpg",
    imageFiles: [
      { filename: "Roran Questmaster - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Roran Questmaster",
      age: "40",
      residence: "Guild District",
      workplace: "The Diver's Guildhall",
      family: []
    },
    categories: {
      families: ["Questmaster"],
      workplace: ["The Diver's Guildhall"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that every quest offers a chance to shape destiny.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his extensive knowledge of Tower mysteries.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Assigns quests based on detailed analysis of expedition reports.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "A former adventurer whose experiences now guide his quest assignments.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Charismatic, insightful, and a bit enigmatic.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To guide Divers safely and reveal new challenges within the Tower.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Kara Ironfist": {
    id: "kara-ironfist",
    imageUrl: "https://example.com/kara.jpg",
    imageFiles: [
      { filename: "Kara Ironfist - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Kara Ironfist",
      age: "36",
      residence: "Guild District",
      workplace: "The Diver's Guildhall",
      family: []
    },
    categories: {
      families: ["Ironfist"],
      workplace: ["The Diver's Guildhall"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in logistical precision and thorough preparation.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for her efficiency and practical mindset.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Ensures that all equipment and supplies are always ready.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Hails from a family of skilled logisticians.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Efficient, pragmatic, and focused.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To keep the guild's resources in perfect order.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- Reyvateil Sanctuary -----
  // Caretaker: Elder Serenia
  "Elder Serenia": {
    id: "elder-serenia",
    imageUrl: "https://example.com/serenia.jpg",
    imageFiles: [
      { filename: "Elder Serenia - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Elder Serenia",
      age: "500",
      residence: "Guild District - Reyvateil Sanctuary",
      workplace: "Caretaker of Reyvateil Sanctuary",
      family: []
    },
    categories: {
      families: ["Serenia"],
      workplace: ["Reyvateil Sanctuary"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in nurturing the ancient magic of the Reyvateil.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Revered for her wisdom and guiding presence.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has witnessed many divers return with relics.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Ancient and mysterious, her past is woven with secrets.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Calm, wise, and compassionate.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To maintain the sanctuary as a haven and training ground for Reyvateil.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for Reyvateil Sanctuary
  "Lyria Songweaver": {
    id: "lyria-songweaver",
    imageUrl: "https://example.com/lyria.jpg",
    imageFiles: [
      { filename: "Lyria Songweaver - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lyria Songweaver",
      age: "150",
      residence: "Guild District - Reyvateil Sanctuary",
      workplace: "Assistant at Reyvateil Sanctuary",
      family: []
    },
    categories: {
      families: ["Songweaver"],
      workplace: ["Reyvateil Sanctuary"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the harmony of song and magic to empower Reyvateil.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for her gentle guidance and youthful energy.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Assists in training sessions with firsthand accounts from veterans.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Raised within the sanctuary, steeped in ancient song magic.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Energetic, compassionate, and eager to learn.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To help every Reyvateil reach their full potential.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Thane Moonblade": {
    id: "thane-moonblade",
    imageUrl: "https://example.com/thane.jpg",
    imageFiles: [
      { filename: "Thane Moonblade - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Thane Moonblade",
      age: "42",
      residence: "Guild District",
      workplace: "Training Overseer at Reyvateil Sanctuary",
      family: []
    },
    categories: {
      families: ["Moonblade"],
      workplace: ["Reyvateil Sanctuary"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes rigorous physical training is essential to complement magic.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his strength and fair approach.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Coordinates demanding training sessions for Reyvateil.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "A seasoned warrior who now trains Reyvateil with unwavering dedication.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Disciplined, stern, yet encouraging.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure Reyvateil are physically prepared for the Tower’s challenges.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Alroen Lodge -----
  // Head Guide: Lareth Alroen
  "Lareth Alroen": {
    id: "lareth-alroen",
    imageUrl: "https://example.com/lareth.jpg",
    imageFiles: [
      { filename: "Lareth Alroen - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lareth Alroen",
      age: "47",
      residence: "Guild District - Alroen Lodge",
      workplace: "Head Guide at The Alroen Lodge",
      family: []
    },
    categories: {
      families: ["Alroen"],
      workplace: ["The Alroen Lodge"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes guides are the backbone of safe expeditions.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his expertise and experience in navigating the Tower.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has led numerous successful dives into the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "A veteran explorer from a long line of seasoned guides.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Confident, experienced, and pragmatic.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To train new guides and safeguard every expedition.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Alroen Lodge
  "Mira Alroen": {
    id: "mira-alroen",
    imageUrl: "https://example.com/mira-alroen.jpg",
    imageFiles: [
      { filename: "Mira Alroen - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Mira Alroen",
      age: "39",
      residence: "Guild District - Alroen Lodge",
      workplace: "Guide Trainer at The Alroen Lodge",
      family: ["Lareth Alroen"]
    },
    categories: {
      families: ["Alroen"],
      workplace: ["The Alroen Lodge"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the importance of proper training for every guide.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for her nurturing and supportive approach.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Assists in coordinating guide training sessions.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up learning the art of guiding from her elder brother.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Supportive, wise, and patient.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To mentor the next generation of Alroen guides.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Dorin Alroen": {
    id: "dorin-alroen",
    imageUrl: "https://example.com/dorin.jpg",
    imageFiles: [
      { filename: "Dorin Alroen - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Dorin Alroen",
      age: "25",
      residence: "Guild District - Alroen Lodge",
      workplace: "Guide Assistant at The Alroen Lodge",
      family: ["Alroen"]
    },
    categories: {
      families: ["Alroen"],
      workplace: ["The Alroen Lodge"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in learning by doing and cherishes every expedition.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Eager to prove himself and quickly earns respect.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has accompanied experienced guides on his first dives.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "New to guiding, full of ambition and eagerness to learn.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Energetic, curious, and determined.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To learn quickly and one day lead his own expedition.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Hall of Records -----
  // Archivist: Isabella Crane
  "Isabella Crane": {
    id: "isabella-crane",
    imageUrl: "https://example.com/isabella.jpg",
    imageFiles: [
      { filename: "Isabella Crane - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Isabella Crane",
      age: "55",
      residence: "Guild District - Hall of Records",
      workplace: "Archivist at The Hall of Records",
      family: []
    },
    categories: {
      families: ["Crane"],
      workplace: ["The Hall of Records"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in preserving every record and memory.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by divers and scholars for her precision.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Collects accounts of expeditions to document the Tower’s secrets.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Dedicated her life to the written word after apprenticing in a grand library.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Inquisitive, meticulous, and steadfast.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To compile a comprehensive archive of the town’s history and adventures.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Cedric Scrollkeeper": {
    id: "cedric-scrollkeeper",
    imageUrl: "https://example.com/cedric.jpg",
    imageFiles: [
      { filename: "Cedric Scrollkeeper - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Cedric Scrollkeeper",
      age: "40",
      residence: "Guild District - Hall of Records",
      workplace: "Librarian at The Hall of Records",
      family: []
    },
    categories: {
      families: ["Scrollkeeper"],
      workplace: ["The Hall of Records"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes knowledge shapes destiny.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for his rigorous record-keeping and sharp memory.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on documented reports rather than firsthand experience.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained in librarianship from an early age.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Methodical, calm, and focused.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure every event is accurately recorded.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Elara Bookbinder": {
    id: "elara-bookbinder",
    imageUrl: "https://example.com/elara-bookbinder.jpg",
    imageFiles: [
      { filename: "Elara Bookbinder - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Elara Bookbinder",
      age: "34",
      residence: "Guild District - Hall of Records",
      workplace: "Document Restorer at The Hall of Records",
      family: []
    },
    categories: {
      families: ["Bookbinder"],
      workplace: ["The Hall of Records"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes every document holds the soul of history.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for her careful preservation techniques.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has restored many ancient texts from divers' finds.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned the art of restoration from a family of scribes.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Patient, creative, and detail-oriented.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To preserve and restore the town’s historical legacy.",
        unlockedtier: 0
      }
    },
    locked: false
  }
};
