module.exports = {
  "Venestria, The Tangled Vine": {
    Locked: false,
    Lore: {
      Formation:
        "Once a companion of an aspiring diver, their name lost to time, this creature has slept in its own roots for generations. Some have tried to tame it, most never return. Those who did now speak in riddles overcome by madness, hence little is known about this creature except its name etched into their minds.",
      "Social Tendencies":
        "Seeing how everyone returns mentally broken - or doesn't - Venestria is not expected to have any social capabilities.",
      Habitat:
        "From peeking through the windows and the 1 or 2 Divers that went in without interacting with Venestria we know that the whole room is filled with sharp-looking thorns. The bottom of the room is filled with the danger-sand, both hindering Venestria from coming out and alerting new Divers to turn away.",
      Behavior:
        "Unknown - Theorized to be dangerous and aggressive"
    },
    LoreLocked: false,
    Name: "Venestria, The Tangled Vine",
    Tiers: {
      Minor: {
        // In this tier, the loot table totals 100% with valid loot summing to 65% and a fallback "Nothing" at 35%.
        Loot: [
          { itemName: "Venestria's heart", itemChance: 100 },
          { itemName: "Precious Gem", itemChance: 20 },
          { itemName: "Essence of Nature", itemChance: 15 },
          { itemName: "Nothing", itemChance: 35 }
        ],
        Locked: false,
        Name: "Venestria, The Tangled Vine",
        Stats: {
          Strength: "???",
          Dexterity: "???",
          Constitution: "???",
          Intelligence: "???",
          Wisdom: "???",
          Charisma: "???"
        },
        Abilities: [
          "Is basically invisible when bunched between forestry and brush.",
          "Unknown"
        ],
        Description:
          "This legendary Avatar stands as a testament to ancient power. Revered and feared in equal measure, it quietly watches over its treasure-filled pods and exerts a mysterious influence over its slime progeny."
      }
    }
  }
};
