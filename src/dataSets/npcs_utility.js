// dataSets/npcs_utility.js

module.exports = {
  // =====================================================
  // UTILITY BUILDINGS
  // =====================================================

  // ----- The Foundry (Metal Processing and Refinement) -----
  // Proprietor: Greta Ironforge – A stern, uncompromising human metalworker.
  "Greta Ironforge": {
    id: "greta-ironforge",
    imageUrl: "https://example.com/greta.jpg",
    imageFiles: [
      { filename: "Greta Ironforge - 1.png", locked: false },
      { filename: "Greta Ironforge - 2.png", locked: true }
    ],
    basicInfo: {
      name: "Greta Ironforge",
      age: "50",
      residence: "Utility Buildings",
      workplace: "The Foundry",
      family: []
    },
    categories: {
      families: ["Ironforge"],
      workplace: ["The Foundry"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes raw metal is a canvas for strength and destiny.",
        level2: "Insists on rigorous refinement to preserve a metal’s true purity.",
        level3: "Demands uncompromising excellence from herself and her apprentices.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Feared and respected by local smiths; her verdict is final.",
        level2: "Few dare cross her, yet those who earn her respect become lifelong allies.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Receives rare ores and metals from daring divers who brave the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Raised in a long line of metalworkers, she learned the art by fire and sweat.",
        level2: "Her reputation was forged in bitter trials and countless furnace hours.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Gruff, relentless, and uncompromising—but secretly fair.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To perfect her craft and produce ingots of unmatched quality.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Foundry
  "Bram Steelhammer": {
    id: "bram-steelhammer",
    imageUrl: "https://example.com/bram.jpg",
    imageFiles: [
      { filename: "Bram Steelhammer - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Bram Steelhammer",
      age: "55",
      residence: "Utility Buildings",
      workplace: "The Foundry (Metal Purification)",
      family: []
    },
    categories: {
      families: ["Steelhammer"],
      workplace: ["The Foundry"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes purified metal is the essence of true strength.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Esteemed by his peers for his unwavering attention to detail.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on divers for raw ore but perfects it with his own techniques.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up among the forges, where every spark told a story of endurance.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Stoic, meticulous, and fiercely dedicated.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To refine metals to an ideal standard and pass on his knowledge.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Fiona Alloy": {
    id: "fiona-alloy",
    imageUrl: "https://example.com/fiona.jpg",
    imageFiles: [
      { filename: "Fiona Alloy - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Fiona Alloy",
      age: "40",
      residence: "Utility Buildings",
      workplace: "The Foundry (Alloy Specialist)",
      family: []
    },
    categories: {
      families: ["Alloy"],
      workplace: ["The Foundry"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that combining elements creates wonders beyond the sum of their parts.",
        level2: "Experiments with unusual alloy formulas to achieve extraordinary results.",
        unlockedtier: 1
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Admired by those who seek innovation in metalwork.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Supplies custom alloys to divers returning with exotic ores.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Studied under the best alloy-smiths and quickly surpassed conventional methods.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Innovative, spirited, and fearless in experimentation.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To pioneer new alloys that revolutionize weapon and armor production.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Rurik Moltensmith": {
    id: "rurik-moltensmith",
    imageUrl: "https://example.com/rurik.jpg",
    imageFiles: [
      { filename: "Rurik Moltensmith - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Rurik Moltensmith",
      age: "30",
      residence: "Utility Buildings",
      workplace: "The Foundry (Intricate Metalwork)",
      family: []
    },
    categories: {
      families: ["Moltensmith"],
      workplace: ["The Foundry"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that even the smallest piece of metal can be transformed into art.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Praised for his intricate designs and creative approach.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Often crafts specialized items from rare metals found in the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "A prodigy in delicate metalwork who earned respect at a young age.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Inventive, attentive, and passionate about his craft.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To create small wonders that leave a lasting impression on all.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Grain Mill (Mill and Flour Processing) -----
  // Proprietor: Miller Thompson – A diligent human miller.
  "Miller Thompson": {
    id: "miller-thompson",
    imageUrl: "https://example.com/miller.jpg",
    imageFiles: [
      { filename: "Miller Thompson - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Miller Thompson",
      age: "52",
      residence: "Utility Buildings",
      workplace: "The Grain Mill",
      family: []
    },
    categories: {
      families: ["Thompson"],
      workplace: ["The Grain Mill"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that every grain is a blessing and every millstone a testament to hard work.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Alliances",
        level1: "Respected for his steady hand and dedication to quality milling.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on divers for rare grain supplies from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned the art of milling from his father and modernized the process.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Diligent, methodical, and warm-hearted.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure that the town is supplied with top-quality flour.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Grain Mill
  "Hannah Thompson": {
    id: "hannah-thompson",
    imageUrl: "https://example.com/hannah.jpg",
    imageFiles: [
      { filename: "Hannah Thompson - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Hannah Thompson",
      age: "48",
      residence: "Utility Buildings",
      workplace: "Flour Packaging Manager at The Grain Mill",
      family: []
    },
    categories: {
      families: ["Thompson"],
      workplace: ["The Grain Mill"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in precision and care when handling food supplies.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for her efficient work and warm smile.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Assists in packaging special flour batches from Tower-sourced grains.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Worked alongside her husband to modernize traditional milling methods.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Caring, precise, and attentive to detail.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure that every bag of flour meets the highest standards.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Jake Graincrusher": {
    id: "jake-graincrusher",
    imageUrl: "https://example.com/jake.jpg",
    imageFiles: [
      { filename: "Jake Graincrusher - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Jake Graincrusher",
      age: "45",
      residence: "Utility Buildings",
      workplace: "Milling Operator at The Grain Mill",
      family: []
    },
    categories: {
      families: ["Graincrusher"],
      workplace: ["The Grain Mill"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the raw power of machinery and steady labor.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his strength and dependable work ethic.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Focuses on the grind; he leaves dangerous endeavors to others.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned the trade through years of working in harsh conditions.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Rugged, hardworking, and unyielding.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To keep the mill running with minimal downtime and maximum output.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Ella Sifter": {
    id: "ella-sifter",
    imageUrl: "https://example.com/ella-sifter.jpg",
    imageFiles: [
      { filename: "Ella Sifter - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Ella Sifter",
      age: "38",
      residence: "Utility Buildings",
      workplace: "Quality Control at The Grain Mill",
      family: []
    },
    categories: {
      families: ["Sifter"],
      workplace: ["The Grain Mill"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that quality is the foundation of trust in food production.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Valued for her meticulous eye for detail.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Relies on refined processes to ensure consistency, regardless of Tower unpredictability.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained in quality control and developed an instinct for perfection.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Precise, calm, and unwavering in her standards.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure every batch of flour meets rigorous quality benchmarks.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Waterworks (Water Extraction and Purification) -----
  // Proprietor: Mira Clearwater – A pragmatic human engineer.
  "Mira Clearwater": {
    id: "mira-clearwater",
    imageUrl: "https://example.com/mira-clearwater.jpg",
    imageFiles: [
      { filename: "Mira Clearwater - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Mira Clearwater",
      age: "44",
      residence: "Utility Buildings",
      workplace: "The Waterworks",
      family: []
    },
    categories: {
      families: ["Clearwater"],
      workplace: ["The Waterworks"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that pure water is the lifeblood of the town.",
        level2: "Devotes herself to harnessing and purifying even the most contaminated sources.",
        unlockedtier: 1
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for her pragmatic approach and technical skill.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Regularly coordinates with divers to source rare water samples from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Worked in engineering from a young age, driven by a fascination with fluid dynamics.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Pragmatic, precise, and relentlessly innovative.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure the town always has access to the purest water possible.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Waterworks
  "Jonas Stream": {
    id: "jonas-stream",
    imageUrl: "https://example.com/jonas.jpg",
    imageFiles: [
      { filename: "Jonas Stream - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Jonas Stream",
      age: "36",
      residence: "Utility Buildings",
      workplace: "Water Extraction Technician at The Waterworks",
      family: []
    },
    categories: {
      families: ["Stream"],
      workplace: ["The Waterworks"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in precision when harnessing the raw power of water.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Valued for his meticulous attention to detail in extraction processes.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has a keen sense for detecting the best water sources in the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Honed his craft working on various waterworks before joining Mira.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Methodical, reliable, and keenly observant.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To optimize extraction methods for maximum purity and efficiency.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Lila Dew": {
    id: "lila-dew",
    imageUrl: "https://example.com/lila-dew.jpg",
    imageFiles: [
      { filename: "Lila Dew - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Lila Dew",
      age: "33",
      residence: "Utility Buildings",
      workplace: "Quality Control Specialist at The Waterworks",
      family: []
    },
    categories: {
      families: ["Dew"],
      workplace: ["The Waterworks"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that every drop of water must be pure and free of enchantments.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for her rigorous testing and high standards.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Ensures that water samples meet strict quality criteria.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained as a technician and quickly rose to oversee quality control.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Exacting, patient, and dedicated to perfection.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To guarantee that the town’s water supply remains pristine.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Remy Flow": {
    id: "remy-flow",
    imageUrl: "https://example.com/remy.jpg",
    imageFiles: [
      { filename: "Remy Flow - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Remy Flow",
      age: "30",
      residence: "Utility Buildings",
      workplace: "Maintenance Expert at The Waterworks",
      family: []
    },
    categories: {
      families: ["Flow"],
      workplace: ["The Waterworks"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in the importance of keeping systems running smoothly.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his practical skills and swift problem-solving.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Maintains and repairs the complex network of pipes and filters.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Gained hands-on experience in various engineering roles before joining The Waterworks.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Resourceful, calm under pressure, and inventive.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure a flawless water distribution system throughout the town.",
        unlockedtier: 0
      }
    },
    locked: false
  }
};
