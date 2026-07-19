const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve(__dirname, '../src/reyvateils.json');
const outputPath = path.resolve(__dirname, '../src/generated/reyvateilCombatCatalog.json');
const functionsOutputPath = path.resolve(__dirname, '../functions-admin/combatCatalog.json');

// These are combat identities, not professions. A Reyvateil is the chassis;
// the title describes how that individual translates song into violence.
const identities = {
  thundara: ['Stormbreak Vanguard', 'vanguard', 'lightning', ['Stormbound', 'Skybreaker', 'Thunderhead'], [4, 3, 4, 3, 2, 3]],
  gronk: ['Lithic Bastion', 'bulwark', 'stone', ['Bedrock', 'Crystalheart', 'Faultline'], [4, 2, 5, 2, 4, 1]],
  ragnor: ['Cinderwake Ravager', 'vanguard', 'fire', ['Cinderwake', 'Ashen', 'Furnaceborn'], [5, 3, 3, 3, 2, 2]],
  melodia: ['Canticle Conductor', 'support', 'sonic', ['Canticle', 'Silver Chorus', 'Resonant'], [2, 3, 2, 5, 4, 3]],
  harmonix: ['Resonance Weaver', 'controller', 'sonic', ['Harmonic', 'Prismatic Echo', 'Dissonant'], [2, 3, 2, 5, 5, 2]],
  lyra: ['Valkyric Virtuoso', 'tactician', 'sonic', ['Valkyric', 'Ethereal String', 'Final Refrain'], [2, 4, 2, 4, 4, 4]],
  serapha: ['Dawnward Hierophant', 'support', 'radiant', ['Dawnward', 'Haloed', 'Merciful Sun'], [2, 2, 4, 4, 5, 2]],
  lumiel: ['Aurora Theurge', 'channeler', 'radiant', ['Aurora', 'Starlit', 'Crystal Dawn'], [2, 3, 3, 5, 4, 2]],
  vespera: ['Twilight Confessor', 'controller', 'shadow', ['Vesper', 'Moonless', 'Dreaming Dusk'], [2, 3, 3, 4, 5, 2]],
  sylvane: ['Verdant Cantor', 'support', 'nature', ['Verdant', 'Petalbound', 'Rootsong'], [2, 3, 3, 4, 4, 3]],
  faelith: ['Wildbloom Shepherd', 'controller', 'nature', ['Wildbloom', 'Antlered', 'Sporewake'], [3, 3, 3, 4, 4, 2]],
  terralyn: ['Deepstone Warden', 'bulwark', 'stone', ['Deepstone', 'Mossclad', 'Stalagmite'], [4, 2, 5, 3, 4, 1]],
  valora: ['Iron Oathkeeper', 'bulwark', 'metal', ['Ironbound', 'Engraved', 'Oathforged'], [4, 3, 5, 2, 3, 2]],
  arcanix: ['Kinetic Duelist', 'skirmisher', 'force', ['Kinetic', 'Momentum', 'Vector'], [3, 5, 2, 3, 3, 5]],
  sentora: ['Runeguard Marshal', 'tactician', 'metal', ['Runeguard', 'Sentinel', 'Silverplate'], [3, 3, 4, 3, 4, 3]],
  zenara: ['Stillwater Adept', 'skirmisher', 'psychic', ['Stillwater', 'Silent Palm', 'Tranquil'], [3, 5, 3, 2, 5, 4]],
  kinetix: ['Velocity Savant', 'skirmisher', 'force', ['Velocity', 'Flutterstep', 'Pulsebound'], [3, 5, 2, 3, 3, 5]],
  serenix: ['Serene Tempest', 'controller', 'psychic', ['Serene', 'Mindful Storm', 'Quiet River'], [2, 4, 3, 3, 5, 3]],
  radiant: ['Consecrated Smith', 'bulwark', 'radiant', ['Consecrated', 'Blessed Iron', 'Beacon'], [4, 2, 5, 3, 4, 2]],
  valorin: ['Sigilbound Custodian', 'support', 'radiant', ['Sigilbound', 'Humble Vigil', 'Runic Grace'], [3, 2, 5, 3, 4, 2]],
  etherea: ['Celestial Intercessor', 'support', 'radiant', ['Celestial', 'Softward', 'Offering'], [2, 3, 3, 5, 5, 2]],
  sylvanna: ['Thornpath Stalker', 'striker', 'nature', ['Thornpath', 'Leafveil', 'Vinebound'], [3, 5, 3, 2, 3, 4]],
  windrunner: ['Galecrest Lancer', 'skirmisher', 'wind', ['Galecrest', 'Crosswind', 'Skyborne'], [3, 5, 2, 3, 3, 5]],
  falconis: ['Talon-Eye Huntress', 'striker', 'piercing', ['Talon-Eye', 'Featherfall', 'Raptor'], [3, 5, 2, 2, 4, 5]],
  shadowlyn: ['Umbral Infiltrator', 'striker', 'shadow', ['Umbral', 'Nightlift', 'Shade'], [2, 5, 2, 4, 3, 5]],
  whisper: ['Hushblade Savant', 'controller', 'shadow', ['Hushblade', 'Silken Dark', 'Whispered Hex'], [2, 5, 2, 3, 4, 4]],
  nightshade: ['Nocturne Venefex', 'striker', 'poison', ['Nocturne', 'Nightshade', 'Venomwake'], [3, 5, 2, 3, 3, 4]],
  emberlyn: ['Furnace Cantor', 'channeler', 'fire', ['Furnace', 'Emberwing', 'Blazing Rune'], [2, 3, 2, 5, 4, 3]],
  frostia: ['Rimeglass Arcanist', 'controller', 'frost', ['Rimeglass', 'True Frost', 'Crystal Winter'], [2, 3, 3, 5, 5, 2]],
  storma: ['Voltaic Invoker', 'channeler', 'lightning', ['Voltaic', 'Static Rune', 'Stormhum'], [2, 4, 2, 5, 3, 4]],
  nyxara: ['Starless Occultist', 'controller', 'void', ['Starless', 'Witchlight', 'Deepsea Veil'], [2, 3, 3, 5, 5, 2]],
  voidwing: ['Abyssal Nocturnist', 'channeler', 'void', ['Abyssal', 'Voidlantern', 'Miasmic'], [2, 3, 3, 5, 4, 3]],
  eclipsa: ['Eclipse Sovereign', 'tactician', 'shadow', ['Eclipse', 'Forced Night', 'Twilight Crown'], [2, 4, 3, 4, 4, 4]],
  arcanis: ['Runescript Magister', 'tactician', 'arcane', ['Runescript', 'Blasphemous', 'Spelllight'], [2, 3, 2, 5, 5, 3]],
  mystara: ['Aetheric Restorer', 'support', 'arcane', ['Aetheric', 'Mystic Overlay', 'Revitalizing'], [2, 3, 3, 5, 4, 3]],
  enchantra: ['Glyphweave Architect', 'controller', 'arcane', ['Glyphweave', 'Enchanting', 'Lexicon'], [2, 3, 2, 5, 5, 3]],
  cogwyn: ['Clockwork Ordinator', 'tactician', 'metal', ['Clockwork', 'Gearwing', 'Automated'], [3, 3, 4, 4, 4, 2]],
  fluxara: ['Circuitflow Savant', 'support', 'force', ['Circuitflow', 'Life-Radar', 'Energy'], [2, 3, 3, 5, 4, 3]],
  gearlock: ['Malfunction Artillerist', 'striker', 'metal', ['Malfunction', 'Gear-Driven', 'Hammerlock'], [3, 4, 4, 4, 3, 2]],
  crimsonis: ['Sanguine Puppeteer', 'controller', 'blood', ['Sanguine', 'Fleshcraft', 'Bloodpuppet'], [3, 3, 4, 4, 5, 1]],
  hemoria: ['Vitality Harrower', 'vanguard', 'blood', ['Vitality', 'Nemesis Mark', 'Bloody Bridge'], [4, 3, 5, 3, 3, 2]],
  sanguis: ['Crimson Occultator', 'striker', 'blood', ['Crimson', 'Bloodshadow', 'Occult Mark'], [4, 4, 3, 4, 3, 2]],
};

const roleTemplates = {
  vanguard: [
    ['Assault', 'action', 'turn', 1, 'Strike one nearby enemy for 1d10 + Force {damage} damage, then move 2 spaces without provoking.'],
    ['Roar', 'action', 'round', 1, 'Enemies within 2 spaces make a Focus saving throw against your Save Difficulty or become Exposed until your next turn.'],
    ['Surge', 'quick', 'round', 1, 'Gain 2 Guard and advantage on your next Force test this turn.'],
    ['Reversal', 'reaction', 'round', 1, 'When hit nearby, reduce the damage by 1d8 + Guard and step toward the attacker.'],
    ['Cataclysm', 'action', 'encounter', 1, 'Crash through a 3-space line and make a Technique attack against each creature\'s Defense. On a hit, deal 3d8 {damage} damage and knock it Prone.'],
    ['Challenge', 'action', 'turn', 1, 'Mark one enemy you can see. It has disadvantage against allies until your next turn.'],
    ['Overrun', 'quick', 'round', 1, 'Move up to half speed through hostile spaces; the first enemy crossed takes Force damage.'],
    ['Refusal', 'reaction', 'encounter', 2, 'When reduced to 0 HP, remain at 1 HP and immediately make a basic Strike.'],
    ['Worldsplitter', 'action', 'encounter', 1, 'Deal 4d10 + Force {damage} damage to one adjacent target; the attack is Resonant and ignores 2 Defense.'],
    ['Momentum', 'passive', 'passive', 0, 'The first time you enter an enemy\'s reach each round, gain 1 Defense until that round ends.'],
  ],
  bulwark: [
    ['Interdict', 'action', 'turn', 1, 'Strike for 1d8 + Force {damage} damage and bind the target\'s attention until your next turn.'],
    ['Rampart', 'action', 'round', 1, 'Create adjacent cover; you and one ally gain 3 Defense until your next turn.'],
    ['Anchor', 'quick', 'round', 1, 'You cannot be moved and attacks against you have disadvantage until your next turn.'],
    ['Aegis', 'reaction', 'round', 1, 'Take a hit meant for an adjacent ally and reduce it by Guard.'],
    ['Citadel', 'action', 'encounter', 1, 'For one round, allies within 2 spaces gain resistance to all damage and cannot be displaced.'],
    ['Lock', 'action', 'turn', 1, 'Make a Technique attack against an adjacent enemy\'s Defense. On a hit, it becomes Rooted until the end of its next turn.'],
    ['Advance', 'quick', 'round', 1, 'Move 2 spaces with one adjacent willing ally; neither provokes reactions.'],
    ['Unbroken', 'reaction', 'encounter', 2, 'Cancel one critical hit against a creature within 2 spaces; it becomes a normal hit.'],
    ['Absolute Wall', 'action', 'encounter', 1, 'Raise a 4-space barrier with 20 HP and Defense equal to yours.'],
    ['Holdfast', 'passive', 'passive', 0, 'While adjacent to an ally, both of you gain 1 Defense.'],
  ],
  striker: [
    ['Execution', 'action', 'turn', 1, 'Attack one target for 1d10 + Finesse {damage} damage; deal +1d6 if it is Exposed.'],
    ['Ambush', 'action', 'round', 1, 'Move 3 spaces, then attack with advantage for 2d8 {damage} damage.'],
    ['Feint', 'quick', 'round', 1, 'One enemy makes a Focus saving throw against your Save Difficulty; on failure your next attack against it ignores reactions.'],
    ['Slip', 'reaction', 'round', 1, 'When targeted, move 1 space and impose disadvantage on the attack.'],
    ['Predation', 'action', 'encounter', 1, 'Make three attacks against one target, each dealing 1d8 {damage} damage.'],
    ['Expose', 'action', 'turn', 1, 'Deal 1d6 damage and make the target Exposed until an ally hits it.'],
    ['Vanish', 'quick', 'round', 1, 'Become Hidden until you attack, cast, or end your turn in clear sight.'],
    ['Riposte', 'reaction', 'encounter', 2, 'After an enemy misses you, immediately deal 1d10 + Finesse {damage} damage to it.'],
    ['Final Quiet', 'action', 'encounter', 1, 'Attack for 5d8 {damage}; roll with advantage if no enemy is adjacent to the target.'],
    ['Opening', 'passive', 'passive', 0, 'Once per round, deal +Tempo damage to a target that has not acted this round.'],
  ],
  skirmisher: [
    ['Lunge', 'action', 'turn', 1, 'Move 2 spaces and strike for 1d8 + Finesse {damage} damage.'],
    ['Orbit', 'action', 'round', 1, 'Circle a target up to 4 spaces and attack twice for 1d6 {damage} each.'],
    ['Accelerate', 'quick', 'round', 1, 'Gain 3 spaces of movement and advantage on Finesse tests this turn.'],
    ['Afterimage', 'reaction', 'round', 1, 'When attacked, move 2 spaces; if this breaks range, the attack misses.'],
    ['Meteor Step', 'action', 'encounter', 1, 'Cross up to 8 spaces in a straight line; each enemy crossed takes 2d8 {damage}.'],
    ['Displace', 'action', 'turn', 1, 'Make a Technique attack against Defense. On a hit, deal 1d6 {damage} damage and move the target 2 spaces.'],
    ['Updraft', 'quick', 'round', 1, 'Leap to any visible space within 4 spaces, ignoring terrain.'],
    ['Vector Turn', 'reaction', 'encounter', 2, 'Redirect a ranged attack that misses you toward another legal target.'],
    ['Zero Distance', 'action', 'encounter', 1, 'Teleport adjacent to a visible target and deal 4d8 + Tempo {damage} damage.'],
    ['Flow State', 'passive', 'passive', 0, 'After moving 4 or more spaces on your turn, gain 1 Defense until your next turn.'],
  ],
  controller: [
    ['Snare', 'action', 'turn', 1, 'Attack at 6 spaces for 1d8 + Resonance {damage}; the target loses 1 space of movement.'],
    ['Field', 'action', 'round', 1, 'Create a 2-space zone; enemies entering it make a Tempo saving throw against your Save Difficulty or become Rooted for the turn.'],
    ['Distort', 'quick', 'round', 1, 'One creature within 5 spaces makes a Guard saving throw against your Save Difficulty. On failure, move it 1 space.'],
    ['Interference', 'reaction', 'round', 1, 'Impose disadvantage on an enemy test you can see within 5 spaces.'],
    ['Cascade', 'action', 'encounter', 1, 'Make a Song attack against the Defense of each creature in a 3-space burst. On a hit, deal 3d6 {damage} damage and leave it Silenced for one turn.'],
    ['Fracture', 'action', 'turn', 1, 'A target within 6 spaces makes a Focus saving throw against your Save Difficulty, becoming Exposed on failure.'],
    ['Fold', 'quick', 'round', 1, 'Exchange positions with a willing ally within 5 spaces.'],
    ['Denial', 'reaction', 'encounter', 2, 'Cancel a non-ultimate technique used within 5 spaces; its action is spent.'],
    ['Closed World', 'action', 'encounter', 1, 'Create a 4-space sealed field for one round. A creature attempting to cross makes a Force saving throw against your Save Difficulty.'],
    ['Pressure', 'passive', 'passive', 0, 'Enemies suffering one of your conditions take 1 Resonance damage at the start of their turns.'],
  ],
  support: [
    ['Mend', 'action', 'turn', 1, 'Restore 1d8 + Resonance HP to a creature within 5 spaces.'],
    ['Chorus', 'action', 'round', 1, 'Up to three allies gain advantage on their next test before your next turn.'],
    ['Uplift', 'quick', 'round', 1, 'An ally within 5 spaces may move 2 spaces without provoking.'],
    ['Shelter', 'reaction', 'round', 1, 'Reduce damage to an ally within 5 spaces by 1d8 + Focus.'],
    ['Restoration', 'action', 'encounter', 1, 'Restore 3d8 + Resonance HP and end one harmful condition on an ally.'],
    ['Guidance', 'action', 'turn', 1, 'An ally may immediately repeat one failed test with advantage.'],
    ['Concord', 'quick', 'round', 1, 'Give your unused reaction to an ally until the start of your next turn.'],
    ['Refrain', 'reaction', 'encounter', 2, 'When an ally drops to 0 HP within 5 spaces, leave them at 1 HP instead.'],
    ['Grand Hymn', 'action', 'encounter', 1, 'All allies within 5 spaces restore 2d8 HP and reset one round-use technique.'],
    ['Harmony', 'passive', 'passive', 0, 'The first ally you help each round also gains 1 Defense until its next turn.'],
  ],
  channeler: [
    ['Bolt', 'action', 'turn', 1, 'Attack a target within 7 spaces for 1d10 + Resonance {damage} damage.'],
    ['Wave', 'action', 'round', 1, 'Make a Technique attack against the Defense of each target in a 4-space line. On a hit, deal 2d6 {damage} damage and push it 2 spaces.'],
    ['Charge', 'quick', 'round', 1, 'Add 1d8 {damage} damage to your next technique this turn.'],
    ['Feedback', 'reaction', 'round', 1, 'When hit by a technique, deal Resonance {damage} back to its user.'],
    ['Overload', 'action', 'encounter', 1, 'A 3-space burst deals 4d8 {damage}; you become Exposed until your next turn.'],
    ['Pierce', 'action', 'turn', 1, 'Attack for 1d8 {damage} and ignore 2 Defense.'],
    ['Phase', 'quick', 'round', 1, 'Pass through occupied spaces and solid cover during this turn.'],
    ['Absorb', 'reaction', 'encounter', 2, 'Reduce incoming elemental damage to zero and empower your next attack by 1d8.'],
    ['Terminal Verse', 'action', 'encounter', 1, 'One target within 8 spaces makes a Finesse saving throw against your Save Difficulty, taking 5d8 + Resonance {damage} damage on failure or half on success.'],
    ['Conduit', 'passive', 'passive', 0, 'When you roll maximum on a damage die, gain 1 temporary HP.'],
  ],
  tactician: [
    ['Directive', 'action', 'turn', 1, 'One ally within 6 spaces may make a basic Strike using your Focus bonus.'],
    ['Formation', 'action', 'round', 1, 'Reposition up to three willing allies by 2 spaces each.'],
    ['Readiness', 'quick', 'round', 1, 'Choose an ally; it regains its reaction and gains 1 Defense for the round.'],
    ['Counterorder', 'reaction', 'round', 1, 'After an enemy moves, shift one ally 2 spaces without provoking.'],
    ['Perfect Sequence', 'action', 'encounter', 1, 'Three allies may each move and make a basic Strike in an order you choose.'],
    ['Analysis', 'action', 'turn', 1, 'Reveal a target\'s Defense and lowest aptitude; the next attack against it has advantage.'],
    ['Switch', 'quick', 'round', 1, 'Exchange initiative positions with a willing ally until the round ends.'],
    ['Contingency', 'reaction', 'encounter', 2, 'Turn one failed allied test within 6 spaces into a success, then become Exposed.'],
    ['Checkmate', 'action', 'encounter', 1, 'Choose a visible enemy; until your next turn all allies deal +1d8 damage to it.'],
    ['Overview', 'passive', 'passive', 0, 'At the start of each round, mark one visible enemy; the first ally to hit it gains 2 movement.'],
  ],
};

// Every doctrine has one deliberate technique aptitude. This avoids the old
// `max(Force, Finesse)` shortcut, which made the lower aptitude mechanically
// irrelevant for many Reyvateils.
const roleTechniqueAptitude = {
  vanguard: 'force',
  bulwark: 'force',
  striker: 'finesse',
  skirmisher: 'finesse',
  controller: 'resonance',
  support: 'focus',
  channeler: 'resonance',
  tactician: 'focus',
};

// Aptitude growth is automatic and doctrine-specific for now. The order is
// explicit so profiles can be reproduced deterministically at any level.
const roleAptitudeGrowthOrder = {
  vanguard: ['force', 'guard', 'tempo', 'resonance', 'focus'],
  bulwark: ['guard', 'force', 'focus', 'resonance', 'tempo'],
  striker: ['finesse', 'tempo', 'force', 'focus', 'resonance'],
  skirmisher: ['tempo', 'finesse', 'focus', 'force', 'resonance'],
  controller: ['focus', 'resonance', 'tempo', 'finesse', 'guard'],
  support: ['focus', 'resonance', 'guard', 'tempo', 'finesse'],
  channeler: ['resonance', 'focus', 'tempo', 'guard', 'finesse'],
  tactician: ['focus', 'tempo', 'resonance', 'finesse', 'guard'],
};

// Every Reyvateil knows a complete Song set in addition to inherited
// techniques. Verses resolve immediately and never interrupt a Canticle.
// Canticles occupy the one shared performance channel for the encounter.
// Their effects are audible, not allegiance-aware: unless a Song explicitly
// says otherwise, every creature capable of hearing it is affected.
const roleSongTemplates = {
  vanguard: [
    ['Warcry Verse', 'verse', 'turn', 1, 0, 0, 'Make a Song attack against one target within 5 spaces. On a hit, deal 1d8 + Resonance {damage} damage.'],
    ['Unbroken Verse', 'verse', 'round', 1, 0, 0, 'Gain temporary HP equal to 1d6 + Guard and advantage on your next melee attack this turn.', 'performer'],
    ['Marching Canticle', 'canticle', 'encounter', 1, 0, null, 'While this Canticle is active, each affected creature\'s first hit each round deals +1d4 {damage} damage.'],
    ['Cataclysm Canticle', 'canticle', 'encounter', 1, 1, 3, 'After one round of chanting, each affected creature within 3 spaces cannot take reactions and takes Resonance {damage} damage at the start of its turn for 3 rounds.'],
  ],
  bulwark: [
    ['Shelter Verse', 'verse', 'turn', 1, 0, 0, 'One ally within 5 spaces gains +2 Defense until your next turn.'],
    ['Rebuke Verse', 'verse', 'round', 1, 0, 0, 'Make a Song attack against one target within 5 spaces. On a hit, deal 1d6 + Resonance {damage} damage and it cannot move closer to an ally this turn.'],
    ['Rampart Canticle', 'canticle', 'encounter', 1, 0, null, 'While this Canticle is active, each affected creature within 3 spaces gains +1 Defense.'],
    ['Citadel Canticle', 'canticle', 'encounter', 1, 1, 3, 'After one round of chanting, each affected creature within 3 spaces gains resistance to {damage} damage and cannot be forcibly moved for 3 rounds.'],
  ],
  striker: [
    ['Killing Verse', 'verse', 'turn', 1, 0, 0, 'Make a Song attack against one target within 6 spaces. On a hit, deal 1d10 + Resonance {damage} damage.'],
    ['Opening Verse', 'verse', 'round', 1, 0, 0, 'One target within 6 spaces makes a Focus saving throw against your Save Difficulty, becoming Exposed on failure.'],
    ['Predator Canticle', 'canticle', 'encounter', 1, 0, null, 'While this Canticle is active, each affected creature\'s first hit against an Exposed target each round deals +1d6 {damage} damage.'],
    ['Final Quiet Canticle', 'canticle', 'encounter', 1, 1, 3, 'After one round of chanting, each affected creature scores a critical hit on 19 or 20 with its attacks for 3 rounds.'],
  ],
  skirmisher: [
    ['Waystep Verse', 'verse', 'turn', 1, 0, 0, 'Move up to 3 spaces, then make a Song attack against one target within 3 spaces for 1d8 + Resonance {damage} damage.'],
    ['Afterimage Verse', 'verse', 'round', 1, 0, 0, 'Move up to half your movement without provoking reactions and gain +2 Defense until your next turn.', 'performer'],
    ['Gale Canticle', 'canticle', 'encounter', 1, 0, null, 'While this Canticle is active, each affected creature gains 2 movement and the first space it leaves each turn does not provoke reactions.'],
    ['Zero-Distance Canticle', 'canticle', 'encounter', 1, 1, 3, 'After one round of chanting, each affected creature may teleport 2 spaces instead of taking its normal movement for 3 rounds.'],
  ],
  controller: [
    ['Binding Verse', 'verse', 'turn', 1, 0, 0, 'Make a Song attack against one target within 6 spaces. On a hit, deal 1d6 + Resonance {damage} damage and Root it until its next turn.'],
    ['Dissonance Verse', 'verse', 'round', 1, 0, 0, 'One target within 6 spaces makes a Resonance saving throw against your Save Difficulty, becoming Silenced until your next turn on failure.'],
    ['Pressure Canticle', 'canticle', 'encounter', 1, 0, null, 'While this Canticle is active, each affected creature suffering a condition takes Resonance {damage} damage at the start of its turn.'],
    ['Closed-World Canticle', 'canticle', 'encounter', 1, 1, 3, 'After one round of chanting, create a 4-space field for 3 rounds. Each affected creature treats it as difficult terrain and cannot leave without spending an action.'],
  ],
  support: [
    ['Mending Verse', 'verse', 'turn', 1, 0, 0, 'One creature within 5 spaces restores 1d8 + Resonance HP.'],
    ['Cleansing Verse', 'verse', 'round', 1, 0, 0, 'End one harmful condition on a creature within 5 spaces or grant it temporary HP equal to Focus.'],
    ['Restoration Canticle', 'canticle', 'encounter', 1, 0, null, 'While this Canticle is active, the first wounded affected creature to begin a turn within 4 spaces restores Resonance HP.'],
    ['Grand Chorus Canticle', 'canticle', 'encounter', 1, 1, 3, 'After one round of chanting, each affected creature within 4 spaces gains advantage on its first attack each round for 3 rounds.'],
  ],
  channeler: [
    ['Bolting Verse', 'verse', 'turn', 1, 0, 0, 'Make a Song attack against one target within 8 spaces. On a hit, deal 1d10 + Resonance {damage} damage.'],
    ['Wave Verse', 'verse', 'round', 1, 0, 0, 'Make a Song attack against the Defense of each target in a 4-space line. On a hit, deal 2d6 {damage} damage.', 'area-hearers'],
    ['Conduit Canticle', 'canticle', 'encounter', 1, 0, null, 'While this Canticle is active, the first maximum damage die rolled by each affected creature each round grants it temporary HP equal to Resonance.'],
    ['Overload Canticle', 'canticle', 'encounter', 1, 1, 3, 'After one round of chanting, each affected creature\'s first Song or technique hit each round deals +2d6 {damage} damage for 3 rounds.'],
  ],
  tactician: [
    ['Directive Verse', 'verse', 'turn', 1, 0, 0, 'One ally within 6 spaces may immediately make a basic Strike using your Focus bonus.'],
    ['Readiness Verse', 'verse', 'round', 1, 0, 0, 'One ally within 6 spaces regains its reaction and may move 2 spaces without provoking.'],
    ['Formation Canticle', 'canticle', 'encounter', 1, 0, null, 'While this Canticle is active, one willing affected creature may move 1 space whenever another affected creature ends its turn.'],
    ['Perfect-Sequence Canticle', 'canticle', 'encounter', 1, 1, 3, 'After one round of chanting, the first miss by an affected creature each round may be rerolled for 3 rounds.'],
  ],
};

const advancedSongTemplates = [
  ['Ascendant Verse', 'verse', 'encounter', 2, 0, 0, 'Make a Song attack against one target within 8 spaces. On a hit, deal 3d8 + Resonance {damage} damage; on a miss, deal half damage.'],
  ['Sovereign Canticle', 'canticle', 'encounter', 1, 1, 3, 'After one round of chanting, each affected creature within 5 spaces gains +2 Defence and adds 1d8 {damage} damage to its first hit each round for 3 rounds.'],
];

const socialTemplates = [
  ['Field Counsel', 'Read the immediate environment and reveal one practical danger the group has overlooked.', 900, 'hymmnos pagle'],
  ['Quiet Industry', 'Complete a careful mundane task with supernatural steadiness and without drawing attention.', 1200, 'gyen quive'],
  ['Memory Thread', 'Preserve an exact sensory memory and replay its important details for the group.', 1800, 'erphy ture'],
  ['Sheltered Passage', 'Guide nearby companions through one environmental obstacle with reduced risk.', 2400, 'khal m.y.b.'],
  ['Private Signal', 'Send a subtle, recognizable sign to one nearby ally without alerting casual observers.', 600, 'hymmnos quive'],
];

const damageHeadword = {
  lightning: 'quesa', stone: 'ganna', fire: 'fayra', sonic: 'hymmnos', radiant: 'fhau', shadow: 'dazua',
  nature: 'plina', metal: 'gigeadeth', force: 'pauwel', psychic: 'eje', wind: 'fhyu', piercing: 'arrya',
  poison: 'kuhle', frost: 'jue lyuma', arcane: 'maya', void: 'dazua', blood: 'prooth',
};
const techniqueHeadwords = ['zethpa', 'rinc', 'pauwel', 'cecet', 'ruinie', 'gyaeje', 'm.y.b.', 'tarfe', 'zodaw', 'ture'];
const songHeadwords = ['hymmnos', 'wearequewie', 'yorr', 'exec', 'zethpa', 'rinc'];

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const baseById = new Map(JSON.parse(fs.readFileSync(sourcePath, 'utf8')).map((entry) => [entry.id, entry]));

const catalog = Object.fromEntries(Object.entries(identities).map(([id, tuple]) => {
  const [specialtyTitle, role, damageType, motifs, aptitudeValues] = tuple;
  const base = baseById.get(id);
  if (!base) throw new Error(`Missing Reyvateil ${id}`);
  const templates = roleTemplates[role];
  if (!templates) throw new Error(`Unknown combat role ${role}`);
  const aptitudes = Object.fromEntries(['force', 'finesse', 'guard', 'resonance', 'focus', 'tempo'].map((key, index) => [key, aptitudeValues[index]]));
  const techniqueAptitude = roleTechniqueAptitude[role];
  const songFocused = ['controller', 'support', 'channeler'].includes(role) || ['sonic', 'arcane'].includes(damageType);
  const startsWithTwoSongs = aptitudes.resonance >= 5;
  const songUnlockLevels = songFocused
    ? (startsWithTwoSongs ? [1, 1, 3, 5, 7, 9] : [1, 2, 4, 6, 8, 10])
    : (startsWithTwoSongs ? [1, 1, 4, 7] : [1, 3, 5, 7]);
  const combatAbilities = templates.map(([suffix, actionType, reset, uses, effect], index) => {
    const name = `${motifs[index % motifs.length]} ${suffix}`;
    return {
      id: `${id}-combat-${slug(name)}`,
      name,
      description: effect.replaceAll('{damage}', damageType).replaceAll('Defense', 'Defence'),
      actionType,
      reset,
      uses,
      range: /within (\d+) spaces/.exec(effect)?.[1] ? Number(/within (\d+) spaces/.exec(effect)[1]) : (/adjacent|nearby/.test(effect) ? 1 : 0),
      damageType,
      tags: [role, damageType, index === 8 ? 'ultimate' : index === 9 ? 'passive' : 'technique'],
      hymmnos: { headword: `${damageHeadword[damageType]} ${techniqueHeadwords[index]}` },
    };
  });
  const songTemplates = songFocused ? [...roleSongTemplates[role], ...advancedSongTemplates] : roleSongTemplates[role];
  const combatSongs = songTemplates.map(([suffix, songForm, reset, uses, chantRounds, durationRounds, effect, audienceOverride], index) => {
    const name = `${motifs[index % motifs.length]} ${suffix}`;
    const audience = audienceOverride || (songForm === 'canticle' ? 'all-hearers' : 'chosen-hearer');
    const audibilityRule = audience === 'all-hearers'
      ? 'Every creature that can hear this Canticle is affected, including the performer, allies, and enemies.'
      : audience === 'area-hearers'
        ? 'This Verse affects every creature in its area that can hear it.'
        : audience === 'performer'
          ? 'The performer must be able to hear their own Verse.'
          : 'The chosen target must be able to hear this Verse.';
    return {
      id: `${id}-song-${slug(name)}`,
      name,
      description: `${audibilityRule} ${effect.replaceAll('{damage}', damageType).replaceAll('Defense', 'Defence')}`,
      actionType: 'action',
      reset,
      uses,
      range: /within (\d+) spaces/.exec(effect)?.[1] ? Number(/within (\d+) spaces/.exec(effect)[1]) : 0,
      damageType,
      tags: [role, damageType, 'song', songForm],
      songForm,
      audience,
      levelRequired: songUnlockLevels[index],
      chantRounds,
      durationRounds,
      audioUrl: '',
      hymmnos: { headword: `hymmnos ${damageHeadword[damageType]} ${songHeadwords[index % songHeadwords.length]}` },
    };
  });
  const socialAbilities = [
    ...base.abilities.map((ability, index) => ({ ...ability, id: ability.id || `${id}-social-${slug(ability.name)}-${index + 1}` })),
    ...socialTemplates.map(([suffix, description, cooldown, headword], index) => ({
      id: `${id}-social-${slug(motifs[index % motifs.length])}-${index + 6}`,
      name: `${motifs[index % motifs.length]} ${suffix}`,
      description: `${description} Its expression reflects ${base.features.charAt(0).toLowerCase()}${base.features.slice(1)}`,
      cooldown,
      icon: '',
      hymmnos: { headword },
    })),
  ];
  const maxHp = 16 + aptitudes.guard * 4 + (role === 'vanguard' ? 4 : role === 'bulwark' ? 8 : 0);
  const defense = 10 + aptitudes.guard + aptitudes.finesse;
  return [id, {
    catalogVersion: 3,
    id,
    specialtyTitle,
    role,
    damageType,
    techniqueAptitude,
    aptitudes,
    derived: {
      maxHp,
      defense,
      initiative: aptitudes.tempo,
      techniqueAttack: 2 + aptitudes[techniqueAptitude],
      songAttack: 2 + aptitudes.resonance,
      saveDifficulty: 10 + aptitudes.focus,
      movement: 5 + Math.floor(aptitudes.tempo / 2),
    },
    growth: {
      hitPointsPerLevel: 3 + aptitudes.guard,
      aptitudeIncreaseLevels: [2, 4, 6, 8, 10],
      aptitudeGrowthOrder: roleAptitudeGrowthOrder[role],
      newTechniqueLevels: [3, 7],
      newSongLevels: songUnlockLevels.filter((level) => level > 1),
      songCapacity: combatSongs.length,
      evolutionLevel: 5,
      aptitudeCap: 7,
    },
    combatAbilities,
    combatSongs,
    socialAbilities,
  }];
}));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);
fs.writeFileSync(functionsOutputPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Built ${Object.keys(catalog).length} Reyvateil combat profiles at ${outputPath}`);
