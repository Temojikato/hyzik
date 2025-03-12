// dataSets/npcs_healing.js

module.exports = {
  // =====================================================
  // HEALING AND MEDICAL DISTRICT
  // =====================================================

  // ----- The Healing Hand Clinic (Medical Clinic) -----
  // Healer / Proprietor: Sister Mercy – A cold, dedicated human cleric.
  "Sister Mercy": {
    id: "sister-mercy",
    imageUrl: "https://example.com/sister-mercy.jpg",
    imageFiles: [
      { filename: "Sister Mercy - 1.png", locked: false },
      { filename: "Sister Mercy - 2.png", locked: true }
    ],
    basicInfo: {
      name: "Sister Mercy",
      age: "47",
      residence: "Healing District",
      workplace: "The Healing Hand Clinic",
      family: []
    },
    categories: {
      families: ["Mercy"],
      workplace: ["The Healing Hand Clinic"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that stoic detachment is necessary to deliver impartial care.",
        level2: "Maintains that only the strongest resolve can heal the wounded.",
        level3: "Sees her cold demeanor as a shield to protect herself from emotional entanglements.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected (and feared) by patients and staff for her unwavering discipline.",
        level2: "Keeps a professional distance from all, trusting few.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has treated a handful of adventurers returning from the Tower, each with strange ailments.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Raised in a harsh monastery where compassion was measured in duty, not warmth.",
        level2: "Her early experiences with loss forged a resolute commitment to healing.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Reserved, methodical, and rigorously disciplined.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To provide medical care with clinical efficiency, regardless of personal feeling.",
        level2: "To further her studies in healing magic and rare restorative techniques.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Healing Hand Clinic
  "Dr. Alaric Healwell": {
    id: "dr-alaric-healwell",
    imageUrl: "https://example.com/alaric.jpg",
    imageFiles: [
      { filename: "Dr. Alaric Healwell - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Dr. Alaric Healwell",
      age: "52",
      residence: "Healing District",
      workplace: "Advanced Medical Care at The Healing Hand Clinic",
      family: []
    },
    categories: {
      families: ["Healwell"],
      workplace: ["The Healing Hand Clinic"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that science and magic must merge for true healing.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his innovative treatments and compassionate approach.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has treated many adventurers with unusual injuries from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained as a doctor in a bustling metropolis before finding his calling here.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Empathetic, patient, and ever-curious about new healing methods.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To develop treatments that blend arcane remedies with modern medicine.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Nurse Eliza": {
    id: "nurse-eliza",
    imageUrl: "https://example.com/eliza.jpg",
    imageFiles: [
      { filename: "Nurse Eliza - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Nurse Eliza",
      age: "34",
      residence: "Healing District",
      workplace: "Patient Care at The Healing Hand Clinic",
      family: []
    },
    categories: {
      families: ["Eliza"],
      workplace: ["The Healing Hand Clinic"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in nurturing the body with gentle care.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Cherished by patients for her kindness and attentive care.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has assisted in stabilizing adventurers with severe injuries.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Grew up caring for sick relatives and discovered her passion for healing.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Gentle, warm, and reassuring.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure every patient receives personalized care and support.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Apothecary Tom": {
    id: "apothecary-tom",
    imageUrl: "https://example.com/tom.jpg",
    imageFiles: [
      { filename: "Apothecary Tom - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Apothecary Tom",
      age: "45",
      residence: "Healing District",
      workplace: "Potion & Remedy Supply at The Healing Hand Clinic",
      family: []
    },
    categories: {
      families: ["Tom"],
      workplace: ["The Healing Hand Clinic"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that every potion is a blend of art and science.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Valued for his extensive knowledge of herbal remedies and potions.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Often secures rare ingredients from the Tower for his concoctions.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned the secrets of herbal alchemy from traveling apothecaries.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Pragmatic, shrewd, and quietly inventive.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To perfect his recipes and create breakthrough remedies.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- The Mending Mind Clinic (Mental Health Clinic) -----
  // Healer / Proprietor: Father Clarity – A compassionate human cleric.
  "Father Clarity": {
    id: "father-clarity",
    imageUrl: "https://example.com/clarity.jpg",
    imageFiles: [
      { filename: "Father Clarity - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Father Clarity",
      age: "53",
      residence: "Healing District",
      workplace: "Leader of The Mending Mind Clinic",
      family: []
    },
    categories: {
      families: ["Clarity"],
      workplace: ["The Mending Mind Clinic"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in healing not just the body, but the mind.",
        level2: "Advocates for emotional resilience and spiritual balance.",
        level3: "Sees mental health as the cornerstone of true well-being.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Respected for his compassionate approach and deep insight.",
        level2: "Works closely with both medical and spiritual counselors.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "He treats divers suffering from trauma and stress after their expeditions.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Has dedicated his life to easing mental burdens, emerging from his own trials.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Calm, empathetic, and nurturing.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To provide accessible counseling and foster community healing.",
        level2: "To develop new methods for emotional and mental recovery.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for The Mending Mind Clinic
  "Dr. Remus Solace": {
    id: "dr-remus-solace",
    imageUrl: "https://example.com/remus.jpg",
    imageFiles: [
      { filename: "Dr. Remus Solace - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Dr. Remus Solace",
      age: "45",
      residence: "Healing District",
      workplace: "Psychiatrist at The Mending Mind Clinic",
      family: []
    },
    categories: {
      families: ["Solace"],
      workplace: ["The Mending Mind Clinic"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in understanding the mind as a path to healing.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Widely respected for his insightful and empathetic diagnoses.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "He treats psychological scars left by Tower expeditions.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Studied under renowned psychiatrists before dedicating his life to therapy.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Thoughtful, gentle, and deeply perceptive.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To guide his patients toward lasting emotional resilience.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Nurse Liora": {
    id: "nurse-liora",
    imageUrl: "https://example.com/liora.jpg",
    imageFiles: [
      { filename: "Nurse Liora - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Nurse Liora",
      age: "38",
      residence: "Healing District",
      workplace: "Mental Health Nurse at The Mending Mind Clinic",
      family: []
    },
    categories: {
      families: ["Liora"],
      workplace: ["The Mending Mind Clinic"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes in compassionate care and emotional support.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Praised for her kindness and ability to soothe troubled minds.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Provides care for patients recovering from Tower-induced stress.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Gained experience working in crisis centers before joining the clinic.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Warm, empathetic, and reassuring.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To support every patient’s journey toward mental recovery.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Counselor Mira": {
    id: "counselor-mira",
    imageUrl: "https://example.com/counselor-mira.jpg",
    imageFiles: [
      { filename: "Counselor Mira - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Counselor Mira",
      age: "42",
      residence: "Healing District",
      workplace: "Therapist at The Mending Mind Clinic",
      family: []
    },
    categories: {
      families: ["Mira"],
      workplace: ["The Mending Mind Clinic"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that open communication can heal the deepest wounds.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Known for her keen insight into both individual and group dynamics.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Facilitates therapy sessions for adventurers traumatized by the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Trained in psychology and counseling after personal hardships.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Empathetic, assertive, and dedicated to emotional healing.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To foster an environment where mental health is openly addressed.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  "Herbalist Rowan": {
    id: "herbalist-rowan",
    imageUrl: "https://example.com/rowan.jpg",
    imageFiles: [
      { filename: "Herbalist Rowan - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Herbalist Rowan",
      age: "40",
      residence: "Healing District",
      workplace: "Herbal Specialist at The Mending Mind Clinic",
      family: []
    },
    categories: {
      families: ["Rowan"],
      workplace: ["The Mending Mind Clinic"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that nature’s remedies can soothe both body and mind.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Valued for her knowledge of calming herbal infusions.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Provides natural remedies sourced from rare Tower flora.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Learned the secrets of herbal healing from an ancient druid circle.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Gentle, intuitive, and resourceful.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To create blends that ease mental distress and promote recovery.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // ----- Cremia’s Salvation (Apothecary) -----
  // Proprietor: Master Alchemist Cremia – A unique, mute Reyvateil.
  "Cremia's Salvation": {
    id: "cremia-salvation",
    imageUrl: "https://example.com/cremia.jpg",
    imageFiles: [
      { filename: "Cremia's Salvation - 1.png", locked: false },
      { filename: "Cremia's Salvation - 2.png", locked: true }
    ],
    basicInfo: {
      name: "Cremia's Salvation",
      age: "Unknown",
      residence: "Healing District",
      workplace: "Apothecary (Healing Salves and Potions)",
      family: []
    },
    categories: {
      families: ["Cremia"],
      workplace: ["Cremia's Salvation"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Uses alchemy as a silent language to understand what people need.",
        level2: "Believes that every concoction is a blend of mystery and healing.",
        unlockedtier: 2
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Her presence is enigmatic; many seek her out for remedies no one else can provide.",
        unlockedtier: 1
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Sources rare ingredients from the Tower and transforms them into potent cures.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "No one knows her full past—her silence speaks volumes of ancient secrets.",
        level2: "Rumors say she once belonged to a mystical order that vanished without a trace.",
        unlockedtier: 1
      },
      personality: {
        title: "Personality",
        level1: "Quiet, inscrutable, yet incredibly perceptive.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To craft custom potions that meet the unspoken needs of her customers.",
        unlockedtier: 0
      }
    },
    locked: false
  },

  // Staff for Cremia’s Salvation
  "Potion Courier Silas": {
    id: "potion-courier-silas",
    imageUrl: "https://example.com/silas.jpg",
    imageFiles: [
      { filename: "Potion Courier Silas - 1.png", locked: false }
    ],
    basicInfo: {
      name: "Potion Courier Silas",
      age: "32",
      residence: "Healing District",
      workplace: "Courier and Sales at Cremia’s Salvation",
      family: []
    },
    categories: {
      families: ["Silas"],
      workplace: ["Cremia's Salvation"],
      faction: []
    },
    categoryLocks: { faction: false },
    lore: {
      ideologies: {
        title: "Ideologies",
        level1: "Believes that speed and discretion are key in delivering healing remedies.",
        unlockedtier: 0
      },
      friendsAndFoes: {
        title: "Associations",
        level1: "Trusted by customers for his reliable service.",
        unlockedtier: 0
      },
      towerExperience: {
        title: "Tower Experience",
        level1: "Has braved dangerous routes to deliver rare ingredients from the Tower.",
        unlockedtier: 0
      },
      personalHistory: {
        title: "Personal History",
        level1: "Honed his skills on the streets, now serving as the apothecary’s trusted courier.",
        unlockedtier: 0
      },
      personality: {
        title: "Personality",
        level1: "Resourceful, discreet, and quick-witted.",
        unlockedtier: 0
      },
      goals: {
        title: "Goals",
        level1: "To ensure that every order reaches its destination safely and promptly.",
        unlockedtier: 0
      }
    },
    locked: false
  }
};
