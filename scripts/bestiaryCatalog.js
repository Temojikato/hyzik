const descriptions = {
  Slime: 'Adaptive recyclers that assimilate sustained diets of matter, energy, emotion, memory, sound, or other Tower phenomena. Ordinary species culminate in an unstable Chaos apex; the Chaos Slime is an apex lineage at every stage.',
  Construct: 'Purpose-built Ancient machines animated and instructed by local Hymmnos. Their series reflect operating depth, material tolerance, protected value, or task complexity; corrupted CH-series execute fractured routines.',
  Beast: 'Descendants of preserved animals that filled the Tower\'s first ecological niches. Generations of scarcity, mutation, and Chaos exposure have turned recognizable survival strategies into monstrous adaptations.',
  Aberration: 'Concepts of Chaos made physical, plus rare mortals transformed beyond a stable species. Their normal forms already violate nature; their Chaos apexes violate their own established rule.',
  Avatar: 'Unique manifestations tied to the Deities of Chaos. They are not repeatable species and do not follow ordinary tier rules.',
  Reyvateil: 'Unique abandoned Reyvateil: former companions unable to return to a Diver\'s necklace or reach sanctuary, each twisted by isolation and Chaos in a personal way.',
};

module.exports = {
  Slime: { description: descriptions.Slime, ...require('../src/dataSets/slimes') },
  Construct: { description: descriptions.Construct, ...require('../src/dataSets/constructs') },
  Beast: { description: descriptions.Beast, ...require('../src/dataSets/beasts') },
  Aberration: { description: descriptions.Aberration, ...require('../src/dataSets/aberrations') },
  Avatar: { description: descriptions.Avatar, ...require('../src/dataSets/avatars') },
  Reyvateil: { description: descriptions.Reyvateil, ...require('../src/dataSets/Reyvateils') },
};

module.exports.descriptions = descriptions;
