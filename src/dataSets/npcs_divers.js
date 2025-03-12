// dataSets/npcs_divers.js

module.exports = {
  // =====================================================
  // DIVERS (NPCs)
  // =====================================================

  // ----- Diver: Lynn Marie Collins (The Minstrel of Healing Prayers) -----
  "Lynn Marie Collins": {
    id: "lynn-marie-collins",
    imageUrl: "https://example.com/lynn-marie-collins.jpg", // Replace with your actual image URL
    imageFiles: [
      { filename: "Lynn Marie Collins - 1.png", locked: false },
      { filename: "Lynn Marie Collins - 2.png", locked: true }
    ],
    basicInfo: {
      name: "Lynn Marie Collins",
      age: "324",
      residence: "938",
      workplace: "Diver",
      family: []
    },
    categories: {
      families: ["Collins"],
      workplace: ["Diver"],
      faction: []
    },
    categoryLocks: {
      faction: false
    },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Nothin will stop her from getting back home to Phlegatos.",
        level2: "They might have taken the Nine Hells' power away, but its morals live true. She adapts but never accepts. She is a Hellion after all.",
        unlockedtier: 1
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known among divers as 'The Minstrel of Healing Prayers' for her soothing presence and comforting heat. You would be hard-pressed to find a diver speaking ill of her.",
        level2: "Mostly huddles with the Guild and other divers, seems to have little interest in truly assimilating in the town.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "One of the few daily active divers she is considered to be quite knowledgable about the tower. She has never gone past the 19th floor yet however.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Pulled into the town from Phlegethos - Nine Hell's 4th district - ten years ago.",
        level2: "A unique blend of half-elf grace and devil resilience, marked by striking blue hair.",
        level3: "Feels that her body has been remade — her innate magic diminished, yet tiny sparks of her past still linger.",
        unlockedtier: 2
      },
      personality: {
        title: "Personality",
        level1: "Resolute, introspective, and quietly defiant in the face of loss.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To rediscover and reclaim the lost fragments of her magical prowess.",
        level2: "To find a way back home, driven by hope and unyielding determination.",
        unlockedtier: 0
      }
    },
    locked: false
  }
};
