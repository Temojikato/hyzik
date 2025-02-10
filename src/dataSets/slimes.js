module.exports = {
  "Fire Slime": {
    Locked: false,
    Lore: {
      Formation: "Born in volcanic magma flows, these slimes radiate heat.",
      "Social Tendencies": "Typically form small hives in lava tubes.",
      Habitat: "Often found in the Tower’s volcanic chambers or near intense flames.",
      Behavior: "Curious but can be hostile when disturbed, drawn to flammable materials.",
      Rarity: "Moderately common in areas rich in heat on the bottom floors."
    },
    LoreLocked: false,
    Name: "Fire Slime",
    Tiers: {
      Minor: {
        // The three valid fire-themed drops sum to 75% and the "Nothing" entry makes up the remaining 25%.
        Loot: [
          { itemName: "Bomb", itemChance: 10 },
          { itemName: "Arcane Oil", itemChance: 20 },
          { itemName: "Coal", itemChance: 20 },
          { itemName: "Torch", itemChance: 20 },
          { itemName: "Nothing", itemChance: 30 }
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
          { itemName: "Infernal Shard", itemChance: 10 },
          { itemName: "Bomb", itemChance: 10 },
          { itemName: "Arcane Oil", itemChance: 10 },
          { itemName: "Coal", itemChance: 10 },
          { itemName: "Flame Essence", itemChance: 40 },
          { itemName: "Torch", itemChance: 14 },
          { itemName: "Ember Fragment", itemChance: 11 },
          { itemName: "Nothing", itemChance: 25 }
        ],
        Description: "Regular Fire Slimes are the grown version of the Minor Fire Slime. Though many Slimes find different ways of mutating, these just simply ate more fire. Not much of a difference from their predecessors except for some extra height, weight, power etc. Just a bigger version. They do have better senses of sight than the Minor's.",
        Locked: true,
        Name: "Regular Fire Slime",
        Stats: {
          Strength: "14",
          Dexterity: "12",
          Constitution: "15",
          Intelligence: "8",
          Wisdom: "11",
          Charisma: "7"
        },
      },
      Greater: {
        Loot: [
          { itemName: "Infernal Shard", itemChance: 20 },
          { itemName: "Bomb", itemChance: 20 },
          { itemName: "Arcane Oil", itemChance: 19 },
          { itemName: "Flame Essence", itemChance: 20 },
          { itemName: "Ember Fragment", itemChance: 20 },
          { itemName: "Crown Forged in Infernal Forge", itemChance: 1 },
        ],
        Description: "Greater Fire Slimes are quite rare. It is theorized the amount of fire they need to consume to become this big is close to unfathomable and would usually take about 2 full generations worth of time. Extremely dangerous, should not be taken lightly even though they're slimes.",
        Locked: true,
        Name: "Greater Fire Slime",
        Stats: {
          Strength: "18",
          Dexterity: "15",
          Constitution: "18",
          Intelligence: "10",
          Wisdom: "11",
          Charisma: "7"
        },
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
      Rarity: "Fairly common in the earlier floors of the Tower as dirt is spread everywhere."
    },
    LoreLocked: false,
    Name: "Earth Slime",
    Tiers: {
      Minor: {
        Loot: [
          { itemName: "Stone", itemChance: 20 },
          { itemName: "Shovel", itemChance: 12 },
          { itemName: "Pickaxe", itemChance: 12 },
          { itemName: "Powdered Stone", itemChance: 20 },
          { itemName: "Metal Ore", itemChance: 11 },
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
          { itemName: "Stone", itemChance: 10 },
          { itemName: "Shovel", itemChance: 10 },
          { itemName: "Pickaxe", itemChance: 10 },
          { itemName: "Precious Gem", itemChance: 10 },
          { itemName: "Powdered Stone", itemChance: 10 },
          { itemName: "Metal Ore", itemChance: 20 },
          { itemName: "Silica Sand", itemChance: 10 },
          { itemName: "Fragment of Steel", itemChance: 10 },
          { itemName: "Nothing", itemChance: 10 }
        ],
        Description: "A mid-level Earth Slime with rocky exterior patches.",
        Locked: true,
        Name: "Regular Earth Slime",
        Stats: {
          Strength: "16",
          Dexterity: "9",
          Constitution: "18",
          Intelligence: "5",
          Wisdom: "5",
          Charisma: "5"
        },
      },
      Greater: {
        Loot: [
          { itemName: "Stone", itemChance: 10 },
          { itemName: "Precious Gem", itemChance: 10 },
          { itemName: "Metal Ore", itemChance: 10 },
          { itemName: "Rune Stone", itemChance: 20 },
          { itemName: "Silica Sand", itemChance: 20 },
          { itemName: "Fragment of Steel", itemChance: 25 },
          { itemName: "Petal of Life", itemChance: 5 }
        ],
        Description: "A mid-level Earth Slime with rocky exterior patches.",
        Locked: true,
        Name: "Greater Earth Slime",
        Stats: {
          Strength: "16",
          Dexterity: "9",
          Constitution: "18",
          Intelligence: "5",
          Wisdom: "5",
          Charisma: "5"
        },
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
          { itemName: "Water", itemChance: 20 },
          { itemName: "Oil", itemChance: 20 },
          { itemName: "Morning Dew", itemChance: 20 },
          { itemName: "Raw Fish", itemChance: 20 },
          { itemName: "Nothing", itemChance: 20 }
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
          { itemName: "Water", itemChance: 15 },
          { itemName: "Oil", itemChance: 15 },
          { itemName: "Morning Dew", itemChance: 15 },
          { itemName: "Raw Fish", itemChance: 15 },
          { itemName: "Essence of Light", itemChance: 15 },
          { itemName: "Fragment of Mana", itemChance: 15 },
          { itemName: "Nothing", itemChance: 10 }
        ],
        Description: "Just a bigger version of the Minor Water Slime. It packs more force, but also usually leaves behind more water. Hence this is one of the most hunted creatures in the Tower. Please do not skip harvesting these, we always need more water.",
        Locked: true,
        Name: "Regular Water Slime",
        Stats: {
          Strength: "14",
          Dexterity: "14",
          Constitution: "14",
          Intelligence: "9",
          Wisdom: "10",
          Charisma: "7"
        },
      },
      Greater: {
        Loot: [
          { itemName: "Pure Spring Water", itemChance: 20 },
          { itemName: "Morning Dew", itemChance: 20 },
          { itemName: "Essence of Light", itemChance: 20 },
          { itemName: "Fragment of Mana", itemChance: 20 },
          { itemName: "Holy Water", itemChance: 20 },
        ],
        Description: "A slime big enough to be confused for a giant flood wave coming at you. They hold even less shape than their inferior counterparts and so are often mistaken for a puddle or otherwise. One of the more dangerous 'basic' slimes, tread with care.",
        Locked: true,
        Name: "Greater Water Slime",
        Stats: {
          Strength: "18",
          Dexterity: "18",
          Constitution: "18",
          Intelligence: "9",
          Wisdom: "10",
          Charisma: "7"
        },
      }
    }
  },

  "Lightning Slime": {
    Locked: false,
    Lore: {
      Formation: "Manifested from charged storm clouds or electric fields.",
      "Social Tendencies": "Rarely found in groups, they dissipate if not recharged and so often are cannibals - if you can even call it that.",
      Habitat: "High tower spires or areas with constant static buildup. Elevation suits them. Beware for any falling on top of you.",
      Behavior: "Energetic and skittish, quick to discharge electricity if you get too close. Always hungry, so hide any electrical charge from them.",
      Rarity: "Less common as most groups are quickly reduced to 1 and then 0; usually appear during storms or near power sources where they can keep charging."
    },
    LoreLocked: false,
    Name: "Lightning Slime",
    Tiers: {
      Minor: {
        Loot: [
          // Lacking a dedicated lightning item in our database, we repurpose "Glowstone" and "Wind Essence" for a stormy feel.
          { itemName: "Glowstone", itemChance: 25 },
          { itemName: "Nothing", itemChance: 25 },
          { itemName: "Essence of Light", itemChance: 25 },
          { itemName: "Stamina Elixir", itemChance: 25 },
        ],
        Description: "Minor Lightning Elementals are living storms flickering with the essence of Chaos. They are agile and can set enemies ablaze with a mere touch. Divers often ignore them as they are rare as they are - hence not many tactics have built against them - and there's no obvious use for their essences, as the lightning that forms them quickly dissipates after defeat. They are said to be extremely quirky and should be treated with caution.",
        Locked: false,
        Name: "Minor Lightning Slime",
        Stats: {
          Strength: "8",
          Dexterity: "16",
          Constitution: "12",
          Intelligence: "12",
          Wisdom: "10",
          Charisma: "7"
        },
        Abilities: [
          "Although some electricity can still hurt it, most of it is absorbed by these creatures.",
          "Can momentarily paralyze people wearing any kind of conductive metal.",
          "Slips through tiny gaps by dispersing into a spark of energy."
        ],
      },
      Regular: {
        Loot: [
          // Lacking a dedicated lightning item in our database, we repurpose "Glowstone" and "Wind Essence" for a stormy feel.
          { itemName: "Nothing", itemChance: 10 },
          { itemName: "Lightning-Infused Amulet", itemChance: 5 },
          { itemName: "Fragment of Rage", itemChance: 20 },
          { itemName: "Storm Essence", itemChance: 15 },
          { itemName: "Essence of Light", itemChance: 15 },
          { itemName: "Stamina Elixir", itemChance: 15 },
          { itemName: "Fragment of Justice", itemChance: 20 }
        ],
        Description: "A crackling slime radiating constant static discharge.",
        Locked: true,
        Name: "Regular Lightning Slime",
        Stats: {
          Strength: "8",
          Dexterity: "18",
          Constitution: "14",
          Intelligence: "14",
          Wisdom: "10",
          Charisma: "7"
        },
      },
      Greater: {
        Loot: [
          // Lacking a dedicated lightning item in our database, we repurpose "Glowstone" and "Wind Essence" for a stormy feel.
          { itemName: "Fragment of Rage", itemChance: 20 },
          { itemName: "Lightning-Infused Amulet", itemChance: 5 },
          { itemName: "Storm Essence", itemChance: 15 },
          { itemName: "Essence of Light", itemChance: 20 },
          { itemName: "Mystic Locket", itemChance: 1 },
          { itemName: "Stamina Elixir", itemChance: 19 },
          { itemName: "Fragment of Justice", itemChance: 20 }
        ],
        Description: "A storm incarnate.",
        Locked: true,
        Name: "Greater Lightning Slime",
        Stats: {
          Strength: "8",
          Dexterity: "18",
          Constitution: "17",
          Intelligence: "15",
          Wisdom: "12",
          Charisma: "9"
        },
      },
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
          { itemName: "Wind Essence", itemChance: 30 },
          { itemName: "Feather", itemChance: 30 },
          { itemName: "Nothing", itemChance: 40 }
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
      },
      Regular: {
        // For Wind Slime, we use the one clearly thematic drop.
        Loot: [
          { itemName: "Wind Essence", itemChance: 20 },
          { itemName: "Fragment of Melody", itemChance: 10 },
          { itemName: "Fragment of Precision", itemChance: 10 },
          { itemName: "Shard of Harmony", itemChance: 10 },
          { itemName: "Shard of Tranquility", itemChance: 10 },
          { itemName: "Feather", itemChance: 20 },
          { itemName: "Nothing", itemChance: 20 }
        ],
        Locked: true,
        Name: "Minor Wind Slime",
        Stats: {
          Strength: "12",
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
      },
      Greater: {
        // For Wind Slime, we use the one clearly thematic drop.
        Loot: [
          { itemName: "Fragment of Melody", itemChance: 20 },
          { itemName: "Fragment of Precision", itemChance: 20 },
          { itemName: "Shard of Harmony", itemChance: 20 },
          { itemName: "Shard of Tranquility", itemChance: 20 },
          { itemName: "Storm Crystal", itemChance: 20 },
        ],
        Locked: true,
        Name: "Minor Wind Slime",
        Stats: {
          Strength: "16",
          Dexterity: "18",
          Constitution: "16",
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
    Locked: true,
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
