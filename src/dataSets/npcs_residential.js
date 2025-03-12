// dataSets/npcs_residential.js

module.exports = {
  // =====================================================
  // RESIDENTIAL DISTRICT
  // =====================================================

  // ----- The Resting Wyvern (Inn and Tavern) -----

  // Proprietor: Emilia Hearthstone
  "Emilia Hearthstone": {
    id: "emilia-hearthstone",
    imageUrl: "https://example.com/emilia.jpg",
    imageFiles: [
      { filename: "Emilia Hearthstone - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Emilia Hearthstone",
      age: "45",
      residence: "Residential District",
      workplace: "Owner of The Resting Wyvern",
      family: []
    },
    categories: {
      families: ["Hearthstone"],
      workplace: ["The Resting Wyvern"]
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes hospitality heals the weary soul.",
        level2: "Strives to create a warm sanctuary for all guests.",
        level3: "Values community and genuine care above all else.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Loved by regulars and local vendors alike.",
        level2: "Maintains strong ties with fellow innkeepers.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on divers’ tales rather than venturing into the Tower herself.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Rose from humble beginnings to build her renowned inn.",
        level2: "Her past is filled with hardships that forged her resilience.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Warm, empathetic, and welcoming.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure every guest feels rejuvenated.",
        level2: "To expand her inn while preserving its cozy charm.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Resting Wyvern
  "Tomas Barleybrew": {
    id: "tomas-barleybrew",
    imageUrl: "https://example.com/tomas.jpg",
    imageFiles: [
      { filename: "Tomas Barleybrew - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Tomas Barleybrew",
      age: "40",
      residence: "Residential District",
      workplace: "Cook at The Resting Wyvern",
      family: []
    },
    categories: {
      families: ["Barleybrew"],
      workplace: ["The Resting Wyvern"]
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes food is the heart of hospitality.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Cherished by guests for his hearty dishes.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Prefers the kitchen over Tower dangers.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned cooking from his family’s small eatery.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Jovial and creative in the kitchen.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To innovate comforting recipes.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Sarina Alefinger": {
    id: "sarina-alefinger",
    imageUrl: "https://example.com/sarina.jpg",
    imageFiles: [
      { filename: "Sarina Alefinger - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Sarina Alefinger",
      age: "32",
      residence: "Residential District",
      workplace: "Bartender at The Resting Wyvern",
      family: []
    },
    categories: {
      families: ["Alefinger"],
      workplace: ["The Resting Wyvern"]
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes a good drink can brighten any day.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for her friendly banter with patrons.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Hears stories but prefers the safety of the bar.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Started bartending early and quickly became a favorite.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Cheerful, quick-witted, and warm.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To keep her bar lively and welcoming.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Garrick Stoutshield": {
    id: "garrick-stoutshield",
    imageUrl: "https://example.com/garrick.jpg",
    imageFiles: [
      { filename: "Garrick Stoutshield - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Garrick Stoutshield",
      age: "42",
      residence: "Residential District",
      workplace: "Bouncer at The Resting Wyvern",
      family: []
    },
    categories: {
      families: ["Stoutshield"],
      workplace: ["The Resting Wyvern"]
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in maintaining order for the safety of all.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his strong presence and fair enforcement.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Remains on the ground, letting others brave the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Former local law enforcer with a solid reputation.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Steadfast, reliable, and protective.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure the inn remains a safe haven.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Silver Chalice (Upscale Inn) -----
  "Sir Reginald Porthos III": {
    id: "sir-reginald-porthos-iii",
    imageUrl: "https://example.com/reginald.jpg",
    imageFiles: [
      { filename: "Reginald Porthos III - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Sir Reginald Porthos III",
      age: "62",
      residence: "Residential District",
      workplace: "Owner of The Silver Chalice",
      family: []
    },
    categories: {
      families: ["Porthos"],
      workplace: ["The Silver Chalice"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in refined living and noble traditions.",
        level2: "Values chivalry and the art of fine dining.",
        level3: "Seeks to uphold honor in a modern world.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by high society and fellow retirees.",
        level2: "Maintains a reserved circle of trusted advisors.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has little direct experience, relying on hired divers for rare finds.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Once a valiant knight, now enjoying a quieter life running his inn.",
        level2: "His past is filled with honor and sacrifice.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Dignified, courteous, and thoughtful.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To provide luxury and comfort for his guests.",
        level2: "To host memorable events that reflect his noble ideals.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Silver Chalice
  "Lady Isolde": {
    id: "lady-isolde",
    imageUrl: "https://example.com/isolde.jpg",
    imageFiles: [
      { filename: "Lady Isolde - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lady Isolde",
      age: "48",
      residence: "Residential District",
      workplace: "Waitress at The Silver Chalice",
      family: []
    },
    categories: {
      families: ["Isolde"],
      workplace: ["The Silver Chalice"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in elegant service and refined taste.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by guests for her grace and attention.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Rarely involved with Tower expeditions.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Raised in a noble household, now serving in refined hospitality.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Elegant, poised, and discreet.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To maintain impeccable service and honor her heritage.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Bran Highcloak": {
    id: "bran-highcloak",
    imageUrl: "https://example.com/bran.jpg",
    imageFiles: [
      { filename: "Bran Highcloak - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Bran Highcloak",
      age: "38",
      residence: "Residential District",
      workplace: "Reservations Manager at The Silver Chalice",
      family: []
    },
    categories: {
      families: ["Highcloak"],
      workplace: ["The Silver Chalice"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in efficiency and discretion in managing guest relations.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected by colleagues for his organizational skills.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has minimal direct experience with the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Worked in high-end hospitality before joining the Chalice.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Calm, efficient, and professional.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To streamline operations and ensure guests’ satisfaction.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Derek Valor": {
    id: "derek-valor",
    imageUrl: "https://example.com/derek.jpg",
    imageFiles: [
      { filename: "Derek Valor - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Derek Valor",
      age: "42",
      residence: "Residential District",
      workplace: "Concierge at The Silver Chalice",
      family: []
    },
    categories: {
      families: ["Valor"],
      workplace: ["The Silver Chalice"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in providing exceptional service and personal attention.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for his dedication to guest satisfaction.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has little direct involvement with Tower expeditions.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Formerly worked in luxury hospitality across several cities.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Charming, attentive, and resourceful.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure every guest’s needs are met and to keep the Chalice running smoothly.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Drunken Drake (Tavern) -----
  "Big Tom": {
    id: "big-tom",
    imageUrl: "https://example.com/bigtom.jpg",
    imageFiles: [
      { filename: "Big Tom - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Big Tom",
      age: "50",
      residence: "Residential District",
      workplace: "Owner of The Drunken Drake",
      family: []
    },
    categories: {
      families: ["Tom"],
      workplace: ["The Drunken Drake"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in a rowdy spirit and the healing power of laughter.",
        level2: "Cherishes strong drinks and boisterous camaraderie.",
        level3: "Maintains that a lively tavern cures more than just thirst.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Well-known among regulars and local toughs.",
        level2: "Engages in friendly rivalry with other taverns.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Prefers the safety of his tavern over the perils of the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Once an adventurer, he settled down to run a rowdy tavern.",
        level2: "His past is filled with tales of both valor and wild nights.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Boisterous, friendly, and unapologetically loud.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To keep his tavern the heart of the community.",
        level2: "To ensure every patron leaves with a memorable story.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Drunken Drake
  "Margo Ironfist": {
    id: "margo-ironfist",
    imageUrl: "https://example.com/margo.jpg",
    imageFiles: [
      { filename: "Margo Ironfist - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Margo \"The Tank\" Ironfist",
      age: "38",
      residence: "Residential District",
      workplace: "Bartender/Enforcer at The Drunken Drake",
      family: []
    },
    categories: {
      families: ["Ironfist"],
      workplace: ["The Drunken Drake"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in mixing strong drinks with even stronger discipline.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Feared by troublemakers and respected by regulars.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Stays out of the Tower, handling conflicts here instead.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Has a background in both bartending and enforcements in rough taverns.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Tough, no-nonsense, yet surprisingly caring toward her regulars.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To maintain order and keep the tavern running smoothly.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Finn Quickfoot": {
    id: "finn-quickfoot",
    imageUrl: "https://example.com/finn.jpg",
    imageFiles: [
      { filename: "Finn Quickfoot - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Finn Quickfoot",
      age: "24",
      residence: "Residential District",
      workplace: "Server at The Drunken Drake",
      family: []
    },
    categories: {
      families: ["Quickfoot"],
      workplace: ["The Drunken Drake"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in speed, efficiency, and a quick wit.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Loved for his friendly and speedy service.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has not ventured into the Tower; focuses on serving with a smile.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up on the streets, learning to move fast and speak quicker.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Energetic, resourceful, and always upbeat.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To excel in his role and someday manage his own establishment.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Lena Sharpblade": {
    id: "lena-sharpblade",
    imageUrl: "https://example.com/lena.jpg",
    imageFiles: [
      { filename: "Lena Sharpblade - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lena Sharpblade",
      age: "30",
      residence: "Residential District",
      workplace: "Guard at The Drunken Drake",
      family: []
    },
    categories: {
      families: ["Sharpblade"],
      workplace: ["The Drunken Drake"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in strict order and the necessity of discipline.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Respected for her vigilance and fair enforcement.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Remains on the sidelines, preferring the safety of the tavern.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Has a background in security before joining the tavern.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Disciplined, stern, and highly reliable.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure the safety of the patrons and maintain order.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Quiet Corner (Small Inn) -----
  "Mira Softfoot": {
    id: "mira-softfoot",
    imageUrl: "https://example.com/mira-softfoot.jpg",
    imageFiles: [
      { filename: "Mira Softfoot - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Mira Softfoot",
      age: "33",
      residence: "Residential District",
      workplace: "Owner of The Quiet Corner",
      family: []
    },
    categories: {
      families: ["Softfoot"],
      workplace: ["The Quiet Corner"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in quiet service and the value of solitude.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Keeps a low profile and values discretion.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has minimal interaction with Tower expeditions.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up in a humble household and learned the art of hospitality slowly.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Reserved, soft-spoken, and efficient.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To provide a quiet refuge for travelers in need of privacy.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Quiet Corner
  "Elder Tom": {
    id: "elder-tom",
    imageUrl: "https://example.com/elder-tom.jpg",
    imageFiles: [
      { filename: "Elder Tom - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Elder Tom",
      age: "70",
      residence: "Residential District",
      workplace: "Manager at The Quiet Corner",
      family: []
    },
    categories: {
      families: ["Tom"],
      workplace: ["The Quiet Corner"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Values tradition and the comfort of familiar routines.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Beloved for his wisdom and calm demeanor.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has never shown interest in the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Lived through many seasons and now manages the inn with care.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Patient, kind, and nurturing.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To keep the inn a safe, welcoming haven.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Nina Gentle": {
    id: "nina-gentle",
    imageUrl: "https://example.com/nina.jpg",
    imageFiles: [
      { filename: "Nina Gentle - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Nina Gentle",
      age: "29",
      residence: "Residential District",
      workplace: "Server at The Quiet Corner",
      family: []
    },
    categories: {
      families: ["Gentle"],
      workplace: ["The Quiet Corner"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in attentive, personal service.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for her warm, caring nature.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has no interest in the Tower’s dangers.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Started in service at a young age and has refined her skills over time.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Gentle, empathetic, and efficient.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure every guest feels cared for in a modest setting.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Wandering Minstrel (Tavern and Performance Venue) -----
  "Lyra Silverstring": {
    id: "lyra-silverstring",
    imageUrl: "https://example.com/lyra.jpg",
    imageFiles: [
      { filename: "Lyra Silverstring - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lyra Silverstring",
      age: "36",
      residence: "Residential District",
      workplace: "Owner of The Wandering Minstrel",
      family: []
    },
    categories: {
      families: ["Silverstring"],
      workplace: ["The Wandering Minstrel"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that art and music heal the soul.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Surrounded by talented performers who share her vision.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Rarely ventures into the Tower, focusing on the stage instead.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Was once a wandering bard before settling down to run her venue.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Charismatic, creative, and inspiring.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To create a space where performers and patrons can share unforgettable moments.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Wandering Minstrel
  "Jasper Melody": {
    id: "jasper-melody",
    imageUrl: "https://example.com/jasper.jpg",
    imageFiles: [
      { filename: "Jasper Melody - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Jasper Melody",
      age: "27",
      residence: "Residential District",
      workplace: "Musician at The Wandering Minstrel",
      family: []
    },
    categories: {
      families: ["Melody"],
      workplace: ["The Wandering Minstrel"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the transformative power of music.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Popular among patrons for his lively tunes.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has only heard tales of the Tower’s mystique.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up playing instruments on the streets.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Energetic, passionate, and charming.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To one day compose a ballad that echoes through the town.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Elara Tuneweaver": {
    id: "elara-tuneweaver",
    imageUrl: "https://example.com/elara-tuneweaver.jpg",
    imageFiles: [
      { filename: "Elara Tuneweaver - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Elara Tuneweaver",
      age: "32",
      residence: "Residential District",
      workplace: "Singer at The Wandering Minstrel",
      family: []
    },
    categories: {
      families: ["Tuneweaver"],
      workplace: ["The Wandering Minstrel"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the purity of song and the magic of performance.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Works closely with other performers to create mesmerizing shows.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Her voice is said to carry echoes of ancient magic, though she stays on stage.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Hails from a family of musicians, carrying on a long tradition.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Enchanting, soulful, and deeply empathetic.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To inspire and unite the town through her performances.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Cedric Rhythm": {
    id: "cedric-rhythm",
    imageUrl: "https://example.com/cedric.jpg",
    imageFiles: [
      { filename: "Cedric Rhythm - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Cedric Rhythm",
      age: "30",
      residence: "Residential District",
      workplace: "Stage Manager at The Wandering Minstrel",
      family: []
    },
    categories: {
      families: ["Rhythm"],
      workplace: ["The Wandering Minstrel"]
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that every performance must be executed with precision.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his organizational skills and fair judgment.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on others for adventure tales; his focus is on the stage.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Worked his way up from small gigs to managing major events.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Calm, precise, and supportive of fellow performers.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure every show is flawless and memorable.",
        unlockedtier: 0
      }
    },
    locked: false
  }

  // =====================================================
  // (Additional Residential NPCs, Guild District, Artisan Quarter, etc. can be added here)
};
