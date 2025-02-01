module.exports = {
  "Avatar of Greed and Patience": {
    Locked: false,
    Lore: {
      Formation:
        "The only discovered Avatar of any of the current Deities of Chaos, let alone ancient ones. One of the oldest of them all, it is quite unsure what generation they belong to. The progenitor of Slimes and thus a very important part of the Tower, even for the people.",
      "Social Tendencies":
        "It is theorized it has a way to communicate with all its offspring, but nothing has been confirmed.",
      Habitat:
        "Its pods are known to be filled with treasure. 'Take some out and the Slimes are sure to consume you, but leave some there and eventually you will be rewarded', or so some Divers have come to believe.",
      Behavior:
        "It doesn't seem to have any visual sentience—it just sits there. It collects, it sheds, and it appears eternal and unmoving."
    },
    LoreLocked: false,
    Name: "Avatar of Greed and Patience",
    Tiers: {
      Minor: {
        // In this tier, the loot table totals 100% with valid loot summing to 65% and a fallback "Nothing" at 35%.
        Loot: [
          { itemName: "Gold Ingot", itemChance: 30 },
          { itemName: "Precious Gem", itemChance: 20 },
          { itemName: "Ancient Manuscript", itemChance: 15 },
          { itemName: "Nothing", itemChance: 35 }
        ],
        Locked: false,
        Name: "Avatar of Greed and Patience",
        Stats: {
          Strength: "30",
          Dexterity: "10",
          Constitution: "28",
          Intelligence: "15",
          Wisdom: "20",
          Charisma: "18"
        },
        Abilities: [
          "Exudes an aura of timeless greed that saps the will of intruders.",
          "Its silent, watchful presence instills both fear and awe.",
          "Can cause nearby foes to hesitate, giving it time to shed valuable resources."
        ],
        Description:
          "This legendary Avatar stands as a testament to ancient power. Revered and feared in equal measure, it quietly watches over its treasure-filled pods and exerts a mysterious influence over its slime progeny."
      }
    }
  }
};
