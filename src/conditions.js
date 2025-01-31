// conditionsData.js
module.exports = [
  // 1) Your original "Madness" example
  {
    name: "Madness",
    color: "#fff352",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Confused",
        effect:
          "You see things that aren't there and miss what is. You can no longer make investigation or perception checks.",
      },
      {
        name: "Mad King",
        effect:
          "You are the most powerful creature in all the lands. A superiority complex takes over—do not let anyone talk back to you without insulting their stupidity.",
      },
      {
        name: "Fall to Madness",
        effect:
          "The end is coming. The world is about to end. You might as well live out your greatest desires. 'No' does not exist.",
      },
    ],
  },

  // ---------------------
  //         7 SINS
  // ---------------------

  // 2) Pride
  {
    name: "Pride",
    color: "#ffd700",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Boastful",
        effect:
          "You cannot accept help. You must claim credit for group successes and refuse to share glory with others.",
      },
      {
        name: "Arrogant",
        effect:
          "You belittle anyone offering advice or instructions. You feel you know best in every scenario.",
      },
      {
        name: "Vainglorious",
        effect:
          "You become obsessed with your own image or achievements. All actions must reinforce how 'great' you are.",
      },
    ],
  },

  // 3) Greed
  {
    name: "Greed",
    color: "#bba14f",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Covetous",
        effect:
          "You can’t resist picking up or pocketing small valuables lying around, even if they belong to an ally.",
      },
      {
        name: "Hoarder",
        effect:
          "You refuse to spend resources. You want all items for yourself, storing them away and not sharing with the party.",
      },
      {
        name: "Insatiable",
        effect:
          "You will do nearly anything for additional wealth, betraying deals or ignoring moral concerns to gain more treasure.",
      },
    ],
  },

  // 4) Lust
  {
    name: "Lust",
    color: "#ff69b4",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Flirtatious",
        effect:
          "You become easily distracted by attractive NPCs or illusions. You try to chat them up even in serious moments.",
      },
      {
        name: "Obsessive",
        effect:
          "You fixate on a single character or ephemeral vision, following or pleasing them at the expense of other tasks.",
      },
      {
        name: "All-Consuming Desire",
        effect:
          "Every action must serve your pursuit of pleasure or beauty, ignoring rational caution or group objectives.",
      },
    ],
  },

  // 5) Envy
  {
    name: "Envy",
    color: "#88b04b",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Jealous Eye",
        effect:
          "You grow resentful whenever anyone else has something you lack—wealth, success, attention.",
      },
      {
        name: "Petty Theft",
        effect:
          "You might attempt to sabotage or steal from allies or NPCs who own prized items you envy.",
      },
      {
        name: "Malicious Resentment",
        effect:
          "You actively hinder others’ progress or achievements, insisting you alone deserve the best or the first pick.",
      },
    ],
  },

  // 6) Gluttony
  {
    name: "Gluttony",
    color: "#e9967a",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Voracious Appetite",
        effect: "You consume supplies faster than normal, always insisting on large or extravagant meals.",
      },
      {
        name: "Food Hoarding",
        effect:
          "You stash extra rations or delicacies away from the party, refusing to share unless absolutely necessary.",
      },
      {
        name: "Insatiable Craving",
        effect:
          "You’ll devour anything remotely edible, ignoring caution about spoilage or potential poisoning.",
      },
    ],
  },

  // 7) Wrath
  {
    name: "Wrath",
    color: "#d21f3c",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Irritable",
        effect:
          "Small inconveniences or minor comments irritate you greatly. You respond rudely or aggressively in conversation.",
      },
      {
        name: "Fury’s Edge",
        effect:
          "You lash out verbally at any perceived slight, possibly jeopardizing negotiations or alliances.",
      },
      {
        name: "Raging Temper",
        effect:
          "Your anger dominates logic. You break objects or sabotage group plans if you feel even slightly insulted or thwarted.",
      },
    ],
  },

  // 8) Sloth
  {
    name: "Sloth",
    color: "#708090",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Inertia",
        effect: "You drag your feet on decisions or tasks, always looking for ways to rest or do nothing.",
      },
      {
        name: "Unmotivated",
        effect:
          "You lose interest in ongoing missions, letting others do the heavy lifting while you lounge about.",
      },
      {
        name: "Apathy",
        effect:
          "You stop caring about consequences or dangers. You refuse to exert effort, even if it endangers the party.",
      },
    ],
  },

  // ---------------------
  //       7 VIRTUES
  // ---------------------

  // 9) Chastity
  {
    name: "Chastity",
    color: "#ffc0cb",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Reserved",
        effect: "You politely decline any flirtation or intimacy, focusing on tasks with gentle courtesy.",
      },
      {
        name: "Pure Mind",
        effect:
          "You avoid crass jokes or indecent discussions, gently steering conversation toward polite topics.",
      },
      {
        name: "Holy Austerity",
        effect:
          "You become unwaveringly modest, refusing all worldly indulgences—this includes fancy feasts, lavish gifts, etc.",
      },
    ],
  },

  // 10) Temperance
  {
    name: "Temperance",
    color: "#a3c1ad",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Self-Control",
        effect: "You ration supplies carefully, never overindulging or wasting resources.",
      },
      {
        name: "Moderate",
        effect:
          "You frown upon gluttony or excess in any form—food, valuables, or comforts—encouraging balanced consumption.",
      },
      {
        name: "Abstinent",
        effect:
          "You refuse all luxuries or amusements you deem unnecessary, living as frugally as possible to set an example.",
      },
    ],
  },

  // 11) Charity
  {
    name: "Charity",
    color: "#ffefd5",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Sharing Spirit",
        effect:
          "You frequently offer your items or resources to NPCs or allies who appear in need, even if it inconveniences you.",
      },
      {
        name: "Open-Hearted",
        effect:
          "You actively seek out those who might benefit from your help, giving away coin or gear without expecting reward.",
      },
      {
        name: "Benevolent Giver",
        effect:
          "You strive to solve others’ problems first, ignoring personal gain. You cannot turn away from pleas for aid.",
      },
    ],
  },

  // 12) Diligence
  {
    name: "Diligence",
    color: "#008b8b",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Hard Worker",
        effect: "You volunteer to do the tedious tasks, from setting up camp to cleaning gear, refusing shortcuts.",
      },
      {
        name: "Focused",
        effect:
          "You meticulously organize the party’s inventory or documents, ensuring everything is documented and neat.",
      },
      {
        name: "Tireless Endeavor",
        effect:
          "You keep pushing forward on quests, refusing rest or breaks until an objective is completed or group consensus stops you.",
      },
    ],
  },

  // 13) Patience
  {
    name: "Patience",
    color: "#f5f5dc",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Calm Listener",
        effect:
          "You never interrupt or rush conversations. Even if bored, you wait politely for others to finish speaking.",
      },
      {
        name: "Steady Hand",
        effect:
          "You perform careful actions (like picking locks or forging gear) with a calm approach, taking extra time for precision.",
      },
      {
        name: "Unshakeable Poise",
        effect:
          "You remain composed even in urgent crises, methodically approaching solutions without panic or frustration.",
      },
    ],
  },

  // 14) Kindness
  {
    name: "Kindness",
    color: "#ffd5cd",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Gentle Manners",
        effect: "Your speech is friendly and courteous, rarely raising your voice or criticizing harshly.",
      },
      {
        name: "Compassionate Help",
        effect:
          "You actively comfort distressed NPCs or allies, offering emotional support even if it slows your progress.",
      },
      {
        name: "Bountiful Heart",
        effect:
          "You’ll sacrifice personal items or inconveniences to ensure others’ well-being, refusing to let anyone suffer alone.",
      },
    ],
  },

  // 15) Humility
  {
    name: "Humility",
    color: "#faf0be",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Modest",
        effect: "You never brag about personal accomplishments, preferring to highlight teammates’ contributions.",
      },
      {
        name: "Low-Profile",
        effect:
          "You politely decline special treatment, titles, or VIP privileges, insisting you’re just another traveler.",
      },
      {
        name: "Selfless",
        effect:
          "You regularly downplay your own role in group victories. Even if you saved the day, you credit the group or luck.",
      },
    ],
  },

  // ---------------------
  //  Additional Conditions
  // ---------------------

  // 16) Morphosis
  {
    name: "Morphosis",
    color: "#c680ff",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Shifting Senses",
        effect:
          "Colors, sounds, and textures feel subtly alien. Familiar places become bizarre, but no harm is done.",
      },
      {
        name: "Adaptive Skin",
        effect:
          "Your skin/appearance morphs slightly to mimic environment. You might look partially camouflaged in certain terrain.",
      },
      {
        name: "Metamorphic Whim",
        effect:
          "Your body/hair changes color daily or grows odd patterns. You remain functional, but it’s disorienting.",
      },
    ],
  },

  // 17) Harmony
  {
    name: "Harmony",
    color: "#c2f0c2",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Balanced Mind",
        effect:
          "You feel an internal equilibrium, resisting emotional extremes. Social conflicts bother you less.",
      },
      {
        name: "Aural Calm",
        effect:
          "Your presence soothes anxious NPCs or party members, reducing hostility or tension in negotiations.",
      },
      {
        name: "Unified Spirit",
        effect:
          "You sense a gentle connection to all living things, empathizing strongly with wildlife and even plants.",
      },
    ],
  },

  // 18) Enlightenment
  {
    name: "Enlightenment",
    color: "#e7ffc7",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Open Mind",
        effect:
          "You gain sudden insights about local lore or philosophical truths. You see beyond mundane details.",
      },
      {
        name: "Light of Clarity",
        effect:
          "Complex riddles or puzzles come more naturally. Overthinking fades; solutions appear elegantly.",
      },
      {
        name: "Cosmic Understanding",
        effect:
          "You interpret intangible forces or cosmic signs, weaving them into your decision-making without confusion.",
      },
    ],
  },

  // 19) Divergence
  {
    name: "Divergence",
    color: "#dbe5f1",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Split Mind",
        effect:
          "Your thoughts branch, letting you consider contradictory ideas simultaneously (roleplay effect).",
      },
      {
        name: "Alternate Vision",
        effect:
          "You see an alternative version of events playing out in your peripheral vision, slightly distracting you.",
      },
      {
        name: "Dimensional Drift",
        effect:
          "Your presence flickers in subtle ways, as if multiple realities converge around you. Others might see faint afterimages.",
      },
    ],
  },

  // 20) “Innovation Overdrive” (bad innovation)
  {
    name: "Virtuoso",
    color: "#c9c9c9",
    thresholds: [5, 20, 50, 100],
    conditionEffects: [
      {
        name: "Ceaseless Brainstorm",
        effect:
          "Your mind leaps from idea to idea, rarely finishing a single thought or plan. You can’t stay on topic for long.",
      },
      {
        name: "Reckless Prototype",
        effect:
          "You’re compelled to build or modify contraptions quickly—skipping safety or testing. It might break or cause confusion later.",
      },
      {
        name: "Obsessive Tinkering",
        effect:
          "You can’t help but dismantle or ‘improve’ gear belonging to you or others, ignoring protests or potential damage.",
      },
    ],
  },
];