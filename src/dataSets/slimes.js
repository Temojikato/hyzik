module.exports = {
  "Fire Slime": {
    Locked: false,
    Lore: {
      Formation: "Born in volcanic magma flows, these slimes radiate heat.",
      "Social Tendencies": "Typically form small hives in lava tubes.",
      Habitat: "Often found in the Tower’s volcanic chambers or near intense flames.",
      Behavior: "Curious but can be hostile when disturbed, drawn to flammable materials.",
      Rarity: "Moderately common in areas rich in heat."
    },
    LoreLocked: false,
    Name: "Fire Slime",
    Tiers: {
      Minor: {
        // The three valid fire-themed drops sum to 75% and the "Nothing" entry makes up the remaining 25%.
        Loot: [
          { itemName: "Infernal Shard", itemChance: 30 },
          { itemName: "Flame Essence", itemChance: 20 },
          { itemName: "Ember Fragment", itemChance: 25 },
          { itemName: "Nothing", itemChance: 25 }
        ],
        Locked: false,
        Name: "Minor Fire Slime",
        Stats: {
          Strength: "8",
          Dexterity: "16",
          Constitution: "12",
          Intelligence: "6",
          Wisdom: "10",
          Charisma: "7"
        },
        Abilities: [
          "Remains nearly invisible while fully immersed in fire.",
          "Capable of igniting foes or objects on contact.",
          "Radiates an orange glow that can illuminate nearby areas."
        ],
        Description:
          "Minor Fire Slimes are living flickers of flame. They rely on surrounding heat sources to thrive, and can quickly set foes ablaze if approached carelessly. Divers harvest them for cooking or warmth, capturing the crystallized flames they leave behind."
      },
      Regular: {
        Loot: [
          { itemName: "Infernal Shard", itemChance: 35 },
          { itemName: "Flame Essence", itemChance: 25 },
          { itemName: "Ember Fragment", itemChance: 30 },
          { itemName: "Nothing", itemChance: 10 }
        ],
        Description: "A standard Fire Slime that glows a warm orange.",
        Locked: true,
        Name: "Regular Fire Slime",
        Stats: {
          Dexterity: "12",
          Strength: "14"
        }
      }
    }
  },

  "Earth Slime": {
    Locked: false,
    Lore: {
      Formation: "Forged in mineral-rich soil, these slimes are quite sturdy.",
      "Social Tendencies": "Often found underground, slowly consuming minerals.",
      Habitat: "Subterranean tunnels and caverns, often near ore deposits.",
      Behavior: "Slow-moving yet territorial when threatened.",
      Rarity: "Fairly common in deeper sections of the Tower."
    },
    LoreLocked: false,
    Name: "Earth Slime",
    Tiers: {
      Minor: {
        Loot: [
          // For Earth Slime we use drops that already exist (“Stone” and “Powdered Stone”) and a fallback.
          { itemName: "Stone", itemChance: 35 },
          { itemName: "Powdered Stone", itemChance: 40 },
          { itemName: "Nothing", itemChance: 25 }
        ],
        Locked: false,
        Name: "Minor Earth Slime",
        Stats: {
          Strength: "14",
          Dexterity: "10",
          Constitution: "16",
          Intelligence: "5",
          Wisdom: "10",
          Charisma: "5"
        },
        Abilities: [
          "Blends seamlessly with dirt or sand when motionless.",
          "Can tunnel through stone and soil without leaving a trace.",
          "Creates localized tremors that stagger nearby creatures."
        ],
        Description:
          "Minor Earth Slimes are composed of dense rock and soil, making them sturdy foes despite a sluggish nature. They are often found feeding on mineral deposits. Divers collect the rocky remains of defeated Earth Slimes for construction and crafting."
      },
      Regular: {
        Loot: [
          // For Earth Slime we use drops that already exist (“Stone” and “Powdered Stone”) and a fallback.
          { itemName: "Stone", itemChance: 40 },
          { itemName: "Powdered Stone", itemChance: 50 },
          { itemName: "Nothing", itemChance: 10 }
        ],
        Description: "A mid-level Earth Slime with rocky exterior patches.",
        Locked: true,
        Name: "Regular Earth Slime",
        Stats: {
          Dexterity: "10",
          Strength: "16"
        }
      }
    }
  },

  "Water Slime": {
    Locked: false,
    Lore: {
      Formation: "Coalesced from freshwater lakes and springs.",
      "Social Tendencies": "Frequently gather in large, watery colonies.",
      Habitat: "Most often found in the Tower's damp or flooded chambers.",
      Behavior: "Generally passive, but will defend themselves if threatened.",
      Rarity: "Common wherever clean water accumulates."
    },
    LoreLocked: false,
    Name: "Water Slime",
    Tiers: {
      Minor: {
        Loot: [
          // For Water Slime we use drops that exist (“Pure Spring Water” and “Water”) plus fallback.
          { itemName: "Pure Spring Water", itemChance: 30 },
          { itemName: "Water", itemChance: 45 },
          { itemName: "Nothing", itemChance: 25 }
        ],
        Locked: false,
        Name: "Minor Water Slime",
        Stats: {
          Strength: "10",
          Dexterity: "14",
          Constitution: "12",
          Intelligence: "5",
          Wisdom: "10",
          Charisma: "7"
        },
        Abilities: [
          "Nearly invisible when fully submerged in water.",
          "Can reshape its fluid body to slip through tight spaces.",
          "Able to drench foes, weakening fire-based attacks and exposing them to cold."
        ],
        Description:
          "Minor Water Slimes are fluid beings, usually peaceful unless disturbed. Divers prize the pristine water left behind when these slimes are slain, stored in a slimy sac that helps preserve its purity."
      },
      Regular: {
        Loot: [
          // For Water Slime we use drops that exist (“Pure Spring Water” and “Water”) plus fallback.
          { itemName: "Pure Spring Water", itemChance: 40 },
          { itemName: "Water", itemChance: 50 },
          { itemName: "Nothing", itemChance: 10 }
        ],
        Description: "A fluid Water Slime that can deliver mild aquatic attacks.",
        Locked: true,
        Name: "Regular Water Slime",
        Stats: {
          Dexterity: "14",
          Strength: "12"
        }
      }
    }
  },

  "Lightning Slime": {
    Locked: false,
    Lore: {
      Formation: "Manifested from charged storm clouds or electric fields.",
      "Social Tendencies": "Rarely found in groups, they dissipate if not recharged.",
      Habitat: "High tower spires or areas with constant static buildup.",
      Behavior: "Energetic and skittish, quick to discharge electricity if threatened.",
      Rarity: "Less common; usually appear during storms or near power sources."
    },
    LoreLocked: false,
    Name: "Lightning Slime",
    Tiers: {
      Minor: {
        Loot: [
          // Lacking a dedicated lightning item in our database, we repurpose "Glowstone" and "Wind Essence" for a stormy feel.
          { itemName: "Glowstone", itemChance: 35 },
          { itemName: "Wind Essence", itemChance: 40 },
          { itemName: "Nothing", itemChance: 25 }
        ],
        Description: "A tiny spark-like slime with a flicker of electrical energy.",
        Locked: false,
        Name: "Minor Lightning Slime",
        Stats: {
          Dexterity: "14",
          Strength: "8"
        }
      },
      Regular: {
        Loot: [
          // Lacking a dedicated lightning item in our database, we repurpose "Glowstone" and "Wind Essence" for a stormy feel.
          { itemName: "Glowstone", itemChance: 40 },
          { itemName: "Wind Essence", itemChance: 50 },
          { itemName: "Nothing", itemChance: 10 }
        ],
        Description: "A crackling slime radiating constant static discharge.",
        Locked: true,
        Name: "Regular Lightning Slime",
        Stats: {
          Dexterity: "18",
          Strength: "10"
        }
      }
    }
  },

  "Wind Slime": {
    Locked: false,
    Lore: {
      Formation: "Spawned from swirling gusts within towering peaks or windy canyons.",
      "Social Tendencies": "Seldom remain in one place, drifting along air currents.",
      Habitat: "High places exposed to strong winds, such as cliff edges or open spires.",
      Behavior: "Skittish and elusive, using quick bursts of air to evade threats.",
      Rarity: "Uncommon; difficult to capture due to its near-invisibility."
    },
    LoreLocked: false,
    Name: "Wind Slime",
    Tiers: {
      Minor: {
        // For Wind Slime, we use the one clearly thematic drop.
        Loot: [
          { itemName: "Wind Essence", itemChance: 75 },
          { itemName: "Nothing", itemChance: 25 }
        ],
        Locked: false,
        Name: "Minor Wind Slime",
        Stats: {
          Strength: "6",
          Dexterity: "18",
          Constitution: "12",
          Intelligence: "5",
          Wisdom: "10",
          Charisma: "6"
        },
        Abilities: [
          "Barely visible; appears as a distortion or gentle breeze.",
          "Can generate forceful gusts of air to shove opponents off balance.",
          "Slips through tiny gaps by dispersing into a localized breeze."
        ],
        Description:
          "Minor Wind Slimes are essentially pockets of living air. Their swift, intangible nature makes them popular among Divers who capture them to circulate fresh air in confined areas. When threatened, they rely on speedy hit-and-run tactics."
      }
    }
  },

  "Chaos Slime": {
    Locked: false,
    Lore: {
      Formation: "Formed where elemental forces violently clash and intermingle.",
      "Social Tendencies": "Highly erratic; typically solitary, lurking in unstable zones.",
      Habitat: "Regions of the Tower suffused with multiple elemental energies.",
      Behavior: "Unpredictable, shifting between aggressive and passive forms at random.",
      Rarity: "Quite rare, as they require extreme conditions to develop."
    },
    LoreLocked: false,
    Name: "Chaos Slime",
    Tiers: {
      Minor: {
        Loot: [
          // For a chaotic creature, we mix drops from several elements.
          { itemName: "Flame Essence", itemChance: 20 },
          { itemName: "Wind Essence", itemChance: 20 },
          { itemName: "Stone", itemChance: 15 },
          { itemName: "Pure Spring Water", itemChance: 20 },
          { itemName: "Nothing", itemChance: 25 }
        ],
        Locked: false,
        Name: "Minor Chaos Slime",
        Stats: {
          Strength: "16",
          Dexterity: "16",
          Constitution: "14",
          Intelligence: "8",
          Wisdom: "10",
          Charisma: "10"
        },
        Abilities: [
          "Rapidly alternates among fire, water, earth, or wind-like traits.",
          "Unpredictable bursts of energy can strike foes at range.",
          "Difficult to contain or approach safely due to constant morphing."
        ],
        Description:
          "Minor Chaos Slimes embody the raw forces of multiple elements, cycling through each at random intervals. This volatility makes them dangerous, yet some Divers seek them out for rare multi-element resources. Skilled hunters approach with caution, knowing that no two encounters unfold the same way."
      }
    }
  }
};
