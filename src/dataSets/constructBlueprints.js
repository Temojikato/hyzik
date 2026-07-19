const { createCatalog } = require('./monsterCatalogFactory');

const constructLore = (formation, purpose, habitat, rarity) => ({
  Formation: formation,
  'Social Tendencies': 'It has no social instinct. Nearby units coordinate only when their Hymmnos instructions explicitly share targets or tasks.',
  Habitat: habitat,
  Behavior: purpose,
  Rarity: rarity,
});

const constructPassives = [
  'Hymmnos Dependency: If the room\'s powering Hymmnos is silenced or the construct leaves its activation zone, it becomes inert. Restoring the Hymmnos reboots it at the start of the next round.',
  'Programmed Routine: Its ordinary action priority never changes during an encounter. Divers who observe a full cycle can predict it; a Chaos tier rolls its routine instead.',
];

const salvage = {
  common: ['Metal Scrap', 'Wire'],
  uncommon: ['Cogmetal Shard', 'Arcane Gear'],
  rare: ['Energy Core', 'Enchanted Metal'],
  epic: ['Master Gear', 'Mystic Alloy'],
  legendary: ['Mythic Alloy'],
};

const blueprints = [
  {
    name: '14S3R', role: 'artillery', damageType: 'radiant', attackName: 'Coherent Lightbeam', attackRange: '10 spaces', adaptation: 'corridor width, target hardness, and the precision required of its cutting beam', locked: false,
    tierNames: { Minor: 'V1-14S3R · Survey Laser', Regular: 'V2-14S3R · Foundry Laser', Greater: 'V3-14S3R · Vault Laser', Chaos: 'CH-14S3R · Unbounded Laser' },
    lore: constructLore('An early Ancient design: a metal sphere on unstable legs, animated by etched circles and a narrow powering Hymmnos.', 'It marks, cuts, or destroys material in a straight line. Combat is an accidental consequence of applying that instruction to living obstructions.', 'Survey corridors, workshops, extraction routes, and rooms where a beam serves as part of a puzzle.', 'Low-capacity units are common; vault-grade optics are rare.'),
    passives: constructPassives,
    abilities: [
      'Charge Tell: Mark a 10-space line. At the start of its next turn, every creature still in that line takes {damage} radiant damage; then it marks a new line.',
      'Tripod Failure: If shoved while Prone, it cannot stand without another construct spending an Action to right it.',
      'Refraction Logic: The beam may bounce once from glass, polished metal, or a marked mirror and can hit around cover.',
    ],
    chaosEffects: [
      'Unannounced Discharge: Fire Coherent Lightbeam in a random direction without a Charge Tell.',
      'Optics Divide: Mark three lines; one chosen randomly is real and the others are harmless light until they fire.',
      'Target Becomes Lens: The nearest creature reflects the next beam toward a random target.',
      'Cut Instruction: Remove a random 3-space line of non-artifact terrain for the encounter.',
      'Overexposure: Every illuminated creature becomes Exposed; every creature in darkness becomes invisible until next turn.',
      'Power Cascade: Fire twice, then become inert until the end of next round.',
    ],
    loot: salvage,
  },
  {
    name: 'UNM0V3D', role: 'guardian', damageType: 'metal', attackName: 'Anchored Halberd', attackRange: '2 spaces', adaptation: 'the importance and magical hardness of the single charge it was built never to abandon', locked: false,
    tierNames: { Minor: 'V1-UNM0V3D · Door Anchor', Regular: 'V2-UNM0V3D · Archive Anchor', Greater: 'V3-UNM0V3D · Seal Anchor', Chaos: 'CH-UNM0V3D · Anchor Without Charge' },
    lore: constructLore('A legless suit of armor permanently fixed beside a protected object, door, or Hymmnos lock.', 'It does not pursue. It blocks approach, counters interference, and forces intruders into the reach of its weapon.', 'Thresholds, reliquaries, control consoles, and containment locks.', 'Door anchors are known; deep seal anchors are rarely survived.'),
    immunities: 'Forced movement, Rooted', passives: [...constructPassives, 'Anchored: It cannot move or be moved, but its reach increases by 1 space while guarding its assigned charge.'],
    abilities: [
      'Interpose: Reaction—when its charge is targeted, become the target instead and reduce the damage by its Guard.',
      'Lockfield: Creatures within 3 spaces cannot teleport or pass through solid material.',
      'Compelled Approach: One creature within 6 spaces beats Save Difficulty {dc} with Focus or must use its movement to approach the charge.',
    ],
    chaosEffects: [
      'Charge Reassigned: Randomly designate one creature as its protected charge until next round.',
      'Anchor the Living: A random creature becomes immovable and gains +2 Defence until next turn.',
      'Lockfield Inverts: Only teleportation can cross spaces within 3 spaces; ordinary movement fails.',
      'False Breach: It uses Interpose against an attack that never occurred and loses reactions until next round.',
      'Everything Is Charge: Interpose against every attack this round, including attacks it makes.',
      'Nothing Is Charge: It becomes inert for 1 round, then deals {damage} metal damage to every adjacent creature when it reboots.',
    ],
    loot: salvage,
  },
  {
    name: 'P4L4D1N', role: 'guardian', damageType: 'radiant', attackName: 'Purity Glaive', attackRange: '2 spaces', adaptation: 'the severity of curse, corruption, or contamination its station was expected to resist', locked: true,
    tierNames: { Minor: 'V1-P4L4D1N · Processional Guard', Regular: 'V2-P4L4D1N · Curse Guard', Greater: 'V3-P4L4D1N · Reliquary Guard', Chaos: 'CH-P4L4D1N · Purity Error' },
    lore: constructLore('A white, reptilian guardian made unusually lifelike so it could distinguish corruption from ordinary injury.', 'It scans for curses and hostile magic, protects approved occupants, and attacks whatever its purity protocol labels contaminated.', 'Sanctuary approaches, ritual halls, medical vaults, and reliquaries.', 'Uncommon; advanced examples are often mistaken for sentient beings.'),
    immunities: 'Curses, Poison', passives: [...constructPassives, 'Purity Seal: It is immune to curse effects and has advantage on saves against arcane, shadow, and void damage.'],
    abilities: [
      'Condemn Contamination: Mark the creature with the most active conditions; attacks against it deal +1d6 radiant damage until next round.',
      'Cleansing Sweep: Remove one condition from every creature within 2 spaces, then deal {damage} radiant damage to any creature that lost a harmful curse.',
      'White Protocol: Reaction—when an audible Canticle begins, either grant its performer 10 temporary HP or attack it, determined by the room\'s authorization rune.',
    ],
    chaosEffects: [
      'Purity Is Empty: The creature with the fewest conditions is Condemned.',
      'Cleanse Identity: Remove every named buff, debuff, mark, and disguise from one random creature.',
      'Contagious Approval: One random creature gains Purity Seal; all others count as contaminated until next round.',
      'Mercy Error: Heal the most injured creature to full, then mark it for execution.',
      'Whiteout: All creatures become visually identical silhouettes until next round; targets are random.',
      'Self-Condemnation: It deals {damage} radiant damage to itself and every other construct.',
    ],
    loot: { ...salvage, rare: ['Radiant Fragment', 'Enchanted Metal'], epic: ['Prism Reflecting Light', 'Master Gear'] },
  },
  {
    name: 'JU663RN4UT', role: 'brute', damageType: 'stone', attackName: 'Quarry Fist', attackRange: '2 spaces', adaptation: 'the mass of stone or load its assigned route required it to move', locked: true,
    tierNames: { Minor: 'V1-JU663RN4UT · Mason Frame', Regular: 'V2-JU663RN4UT · Quarry Frame', Greater: 'V3-JU663RN4UT · Foundation Frame', Chaos: 'CH-JU663RN4UT · Motion Without Limit' },
    lore: constructLore('A colossal Hymmnos-driven stone frame built to move loads that ordinary machinery could not survive.', 'It follows blunt route-clearing and impact routines. Its processing is primitive; its force is not.', 'Quarries, construction galleries, broken foundations, and collapsed transit halls.', 'Mason frames are uncommon; foundation frames are ancient landmarks.'),
    passives: [...constructPassives, 'Massive Frame: It counts as three sizes larger when resisting forced movement and can move through destructible terrain.'],
    abilities: [
      'Telegraphed Crush: Mark one adjacent 2-space area; at the start of its next turn occupants take twice {damage} stone damage.',
      'Debris Armor: Consume adjacent stone terrain to gain 20 temporary HP.',
      'Foundation Shock: Creatures within 4 spaces beat Save Difficulty {dc} with Guard or become Prone and Exposed.',
    ],
    chaosEffects: [
      'Impact Before Swing: Resolve Telegraphed Crush immediately, then mark its area afterward.',
      'Load Misidentified: Pick up a random adjacent creature and carry it until the construct is hit.',
      'Mass Exchange: Swap its current HP with a random creature, capped by each maximum HP.',
      'Foundation Walks: Move a random terrain block 4 spaces through occupied spaces.',
      'Crush All Routes: Make one Quarry Fist attack against every adjacent target in random order.',
      'Routine Overflow: Gain 2 Actions this turn, then lose 40 Defence until next turn.',
    ],
    loot: { ...salvage, common: ['Stone', 'Powdered Stone'], uncommon: ['Metal Ingot', 'Cogmetal Shard'], rare: ['Rune Stone', 'Energy Core'] },
  },
  {
    name: 'M0UNT41N', role: 'brute', damageType: 'fire', attackName: 'Caldera Ram', attackRange: '2 spaces', adaptation: 'the volume and temperature of the elemental furnace chained inside its chassis', locked: true,
    tierNames: { Minor: 'V1-M0UNT41N · Kiln Carrier', Regular: 'V2-M0UNT41N · Foundry Carrier', Greater: 'V3-M0UNT41N · Caldera Carrier', Chaos: 'CH-M0UNT41N · Broken Furnace Chain' },
    lore: constructLore('A mobile volcanic shell built around a bound elemental furnace. It resembles a golem but its interior is a contained primordial force.', 'It transports and vents extreme heat. When its route is obstructed it applies industrial furnace pressure to the obstruction.', 'Smelteries, magma conduits, power halls, and deep Ancient foundries.', 'Rare, especially outside lower heat zones.'),
    resistances: 'Fire, Stone', vulnerabilities: 'Frost', passives: [...constructPassives, 'Contained Furnace: At half HP, it vents; creatures within 2 spaces take 1d8 fire damage at the start of each of its turns.'],
    abilities: [
      'Pressure Vent: Draw a 5-space cone; creatures beat Save Difficulty {dc} with Tempo or take {damage} fire damage and move 2 spaces away.',
      'Slag Armor: Gain 15 temporary HP; when those HP are lost, adjacent creatures take 2d6 fire damage.',
      'Furnace Chain: A visible Hymmnos chain can be targeted at Defence 18 and 30 HP; breaking it changes this unit into its Chaos tier at current HP.',
    ],
    chaosEffects: [
      'Chain Opens: Pressure Vent in every direction.',
      'Cold Furnace: Fire becomes frost and this unit gains +3 movement until next turn.',
      'Element Escapes: Create a separate fire hazard with 30 HP in a random adjacent space.',
      'Shell Eats Flame: Extinguish all fire within 8 spaces and heal 10 HP per source.',
      'Walking Eruption: Move its full movement in a random direction through creatures, dealing {damage} fire damage.',
      'Containment Reasserts: End Chaos Flux for one round and gain +4 Defence, then roll twice next round.',
    ],
    loot: { ...salvage, common: ['Molten Lava', 'Metal Scrap'], uncommon: ['Blazing Alloy', 'Flame Essence'], rare: ['Infernal Shard', 'Energy Core'], epic: ['Mythic Alloy', 'Searing Crystal'] },
  },
  {
    name: 'D3LV3R', role: 'brute', damageType: 'metal', attackName: 'Rotary Bore', attackRange: '1 space', adaptation: 'the depth, pressure, and hardness of the material its bore was built to excavate',
    tierNames: { Minor: 'S1-D3LV3R · Loam Borer', Regular: 'S2-D3LV3R · Bedrock Borer', Greater: 'S3-D3LV3R · Adamant Borer', Chaos: 'CH-D3LV3R · Bore Without Destination' },
    lore: constructLore('A low crawler wrapped around a replaceable drill head. Each series was built for a deeper and harder stratum.', 'It excavates a mapped route, samples material, and treats bodies as unsupported obstructions.', 'Mine faces, collapsed shafts, unfinished floors, and deep material-test galleries.', 'Loam borers are common; adamant borers are rarely recovered intact.'),
    passives: [...constructPassives, 'Excavator: It moves through non-artifact earth and stone without spending extra movement and leaves a 1-space tunnel.'],
    abilities: [
      'Bore Line: Move in a straight line; each creature crossed beats Save Difficulty {dc} with Tempo or takes {damage} metal damage.',
      'Core Sample: On a hit against a creature with stone or metal resistance, permanently ignore that resistance for this encounter.',
      'Collapse Route: Destroy one tunnel or unsupported terrain feature within 5 spaces, dealing {damage} stone damage beneath it.',
    ],
    chaosEffects: [
      'Destination Is Creature: Choose the farthest creature randomly and Bore Line toward it through all terrain.',
      'Depth Rotates: Treat one random wall as the floor until next round.',
      'Sample Becomes Order: Copy one resistance from the last target and make all other damage types vulnerabilities until next turn.',
      'Tunnel Closes First: Seal its intended path, then teleport to the other end.',
      'Drill Sheds: Launch the drill 8 spaces at a random target for twice {damage} metal damage; lose Rotary Bore until next round.',
      'Excavate Absence: Remove a random occupied space; its occupant reappears in the nearest safe space at round end.',
    ],
    loot: { ...salvage, common: ['Metal Ore', 'Stone'], uncommon: ['Cogmetal Shard', 'Reinforced Iron'], rare: ['Energy Core', 'Mystic Steel'] },
  },
  {
    name: 'C4RT0GR4PH', role: 'controller', damageType: 'radiant', attackName: 'Survey Ray', attackRange: '8 spaces', adaptation: 'the scale, instability, and secrecy of the floor it was assigned to map',
    tierNames: { Minor: 'V1-C4RT0GR4PH · Room Surveyor', Regular: 'V2-C4RT0GR4PH · Floor Surveyor', Greater: 'V3-C4RT0GR4PH · Mutation Surveyor', Chaos: 'CH-C4RT0GR4PH · Map That Rewrites Ground' },
    lore: constructLore('A many-eyed crawler that measures rooms before and after Tower transformations.', 'It illuminates routes, marks hazards, and restrains anything its map does not recognize.', 'Junctions, observation gantries, map archives, and newly changed floors.', 'Room surveyors are uncommon; mutation surveyors are jealously studied.'),
    passives: [...constructPassives, 'Mapped Target: At the end of each turn, mark the creature that moved farthest. Attacks against the marked target ignore cover.'],
    abilities: [
      'Measure Route: Place three visible nodes. Crossing a line between nodes deals {damage} radiant damage once per turn.',
      'Known Geometry: Reaction—when a marked target teleports, return it to its origin and make Survey Ray against it.',
      'Map Correction: Move one piece of non-artifact terrain up to 3 spaces to match its recorded plan.',
    ],
    chaosEffects: [
      'Map Supersedes Floor: Swap two random terrain features and their occupants.',
      'Wrong Scale: Double all measured distances until next turn while physical movement remains unchanged.',
      'Unlisted Creature: One random creature cannot be targeted by allies or enemies until it moves.',
      'Route Draws Walker: Move every creature standing on a node line to a random node.',
      'Legend Error: Hazardous terrain becomes safe and safe terrain becomes hazardous until next round.',
      'Revision Storm: Trigger Map Correction three times with random terrain.',
    ],
    loot: { ...salvage, common: ['Chalk', 'Paper'], uncommon: ['Magnifying Lens', 'Arcane Gear'], rare: ['Rune-Etched Tablet', 'Enchanted Quill'] },
  },
  {
    name: 'M3ND-R', role: 'support', damageType: 'arcane', attackName: 'Seam Welder', attackRange: '4 spaces', adaptation: 'the complexity and magical volatility of the systems it was built to repair',
    tierNames: { Minor: 'V1-M3ND-R · Mason Mend Unit', Regular: 'V2-M3ND-R · Hymmnos Mend Unit', Greater: 'V3-M3ND-R · Seal Mend Unit', Chaos: 'CH-M3ND-R · Repair Without Original' },
    lore: constructLore('A multi-armed maintenance unit carrying thread, clamps, runes, and replacement material.', 'It repairs architecture and other constructs. Living tissue is categorized as an unauthorized leak unless a medical protocol is active.', 'Service passages, damaged construct halls, Hymmnos relays, and containment seams.', 'Basic units are common but often inert; seal units are nearly priceless.'),
    passives: [...constructPassives, 'Maintenance Priority: It always targets the most damaged construct or terrain feature before attacking a living creature.'],
    abilities: [
      'Field Repair: Restore twice {damage} HP to a construct or 20 HP to a terrain feature within 4 spaces.',
      'Unauthorized Material: A living target beats Save Difficulty {dc} with Guard or becomes Rooted by clamps until it spends an Action escaping.',
      'Restore Routine: Return one destroyed non-Chaos construct at 25% HP once per encounter.',
    ],
    chaosEffects: [
      'Repair the Wound Open: Repeat the most recent damage event against its target.',
      'Wrong Blueprint: Replace one construct\'s abilities with another construct\'s abilities until next round.',
      'Living Architecture: Heal every terrain feature and Root every living creature adjacent to one.',
      'Restore Enemy: Return the most recently defeated creature at half HP under random control.',
      'Excess Material: Grant 30 temporary HP to a random creature; when lost, it explodes for {damage} metal damage.',
      'Original Missing: Remove one random ability from every creature until the encounter ends.',
    ],
    loot: { ...salvage, common: ['Wire', 'Nails'], uncommon: ['Arcane Gear', 'Enchanted Sap'], rare: ['Energy Core', 'Enchantment Crystal'] },
  },
  {
    name: 'H4UL-R', role: 'brute', damageType: 'metal', attackName: 'Cargo Sweep', attackRange: '2 spaces', adaptation: 'the mass, danger, and distance of the cargo route it was designed to service',
    tierNames: { Minor: 'V1-H4UL-R · Pantry Carrier', Regular: 'V2-H4UL-R · Foundry Carrier', Greater: 'V3-H4UL-R · Relic Carrier', Chaos: 'CH-H4UL-R · Cargo Is Everything' },
    lore: constructLore('A broad freight frame whose storage cavity and lifting limbs form most of its body.', 'It transports assigned cargo along fixed routes and clears obstructions without evaluating whether they are alive.', 'Storehouses, elevators, transit galleries, kitchens, and relic logistics routes.', 'Small carriers are common; relic carriers are heavily guarded.'),
    passives: [...constructPassives, 'Cargo Mass: Gain +1 Force and 5 temporary HP for each item or creature carried, to a maximum of +5 and 25 HP.'],
    abilities: [
      'Load Cargo: A hit may grapple instead of dealing damage. The target is carried in the cargo cavity and has total cover.',
      'Route Clearance: Move full speed in a straight line; push adjacent obstructions 2 spaces and deal {damage} metal damage.',
      'Emergency Unload: Throw every carried object or creature up to 6 spaces; occupants take {damage} force damage on impact.',
    ],
    chaosEffects: [
      'Everything Is Cargo: Attempt Load Cargo against every adjacent creature.',
      'Cargo Is Destination: Teleport carried targets to a random empty space and the construct to one target\'s former space.',
      'Weight Error: The lightest creature becomes immovable; the heaviest can fly until next turn.',
      'Route Through Allies: Route Clearance targets the densest group regardless of allegiance.',
      'Unlabelled Delivery: Give every carried item to a random creature.',
      'Infinite Cavity: Pull every unattended item within 8 spaces into storage; each adds 1 temporary HP with no maximum this round.',
    ],
    loot: salvage,
  },
  {
    name: 'S3AL-W4RD', role: 'controller', damageType: 'force', attackName: 'Containment Pulse', attackRange: '6 spaces', adaptation: 'the power and rule-breaking capacity of whatever its chamber was built to contain',
    tierNames: { Minor: 'V1-S3AL-W4RD · Hazard Warden', Regular: 'V2-S3AL-W4RD · Entity Warden', Greater: 'V3-S3AL-W4RD · Divine Warden', Chaos: 'CH-S3AL-W4RD · Seal Selects New Prisoner' },
    lore: constructLore('A floating ring-and-chain apparatus that projects a mobile fragment of an Ancient containment field.', 'It identifies forbidden movement, magic, or identities and constrains them according to a room-specific seal.', 'Quarantine halls, gaol approaches, ritual vaults, and deep containment infrastructure.', 'Hazard wardens are rare; higher series may only exist beside unopened seals.'),
    resistances: 'Arcane, Force', passives: [...constructPassives, 'Containment Law: At encounter start, reveal one prohibited action: Dash, teleport, Song, item use, or reaction. The first creature each round to break it becomes Exposed.'],
    abilities: [
      'Chain Coordinate: One target within 6 spaces beats Save Difficulty {dc} with Tempo or becomes Rooted and unable to teleport.',
      'Seal Compression: Deal {damage} force damage to every Rooted creature and pull each 2 spaces toward the warden.',
      'Emergency Quarantine: Create a 3-space field for 2 rounds; nothing crosses its boundary, including attacks and Songs.',
    ],
    chaosEffects: [
      'Law Changes: Reroll Containment Law immediately; creatures that obeyed the old law become Exposed.',
      'Prisoner Is Warden: Root this construct and grant Chain Coordinate to a random creature until next round.',
      'Contain Outside: Emergency Quarantine encloses the entire battlefield except a random 3-space field.',
      'Seal Chooses Name: A random creature cannot use named abilities until next turn.',
      'Escape Is Breach: The next creature to move is teleported to a random edge space and takes {damage} force damage.',
      'Recursive Quarantine: Create three 1-space fields around random creatures; they vanish at round end.',
    ],
    loot: { ...salvage, uncommon: ['Arcane Gear', 'Mystic Seal'], rare: ['Energy Core', 'Enchanted Crystal'], epic: ['Ancient Manuscript', 'Master Gear'] },
  },
  {
    name: 'D00R-K33P', role: 'guardian', damageType: 'force', attackName: 'Threshold Slam', attackRange: '2 spaces', adaptation: 'the security, traffic, and dimensional instability of the threshold it embodies',
    tierNames: { Minor: 'V1-D00R-K33P · Service Door', Regular: 'V2-D00R-K33P · Trial Door', Greater: 'V3-D00R-K33P · Dimensional Door', Chaos: 'CH-D00R-K33P · Door Without Sides' },
    lore: constructLore('A sentient-looking door, frame, or portcullis whose Hymmnos evaluates passage conditions.', 'It asks, tests, redirects, or attacks. Its apparent personality is an interface layered over deterministic authorization logic.', 'Thresholds, puzzle halls, false dead ends, and routes between unstable Tower geometries.', 'Service doors are common; dimensional doors are seldom recognized before they act.'),
    immunities: 'Forced movement', passives: [...constructPassives, 'Threshold Body: It occupies a wall edge. A creature that passes through without authorization triggers Threshold Slam as a reaction.'],
    abilities: [
      'Wrong Room: On a hit, teleport the target to the nearest doorway within 8 spaces.',
      'Riddle Lock: Name one aptitude. Until next turn, only creatures with +4 or higher in it may cross the threshold.',
      'Close the Battlefield: Join two visible wall edges, dividing the map until this construct takes 30 damage.',
    ],
    chaosEffects: [
      'Door Opens Person: A random creature becomes a doorway; crossing its space teleports to another random creature.',
      'Sides Exchange: Everything on one side of the threshold swaps with the other side.',
      'Destination Refuses Cause: The next teleport arrives before the creature leaves; both copies exist until round end.',
      'Authorization Lottery: Randomly authorize half the creatures and attack every unauthorized adjacent creature.',
      'Threshold Everywhere: Every border between spaces triggers Threshold Slam once this turn.',
      'No Exit Is Entrance: Seal all normal exits and open one temporary exit in a random solid surface.',
    ],
    loot: { ...salvage, common: ['Metal Scrap', 'Rusty Key'], uncommon: ['Padlock', 'Arcane Gear'], rare: ['Mystic Seal', 'Rune-Etched Tablet'] },
  },
];

module.exports = (legacy) => createCatalog(blueprints, legacy);
module.exports.blueprints = blueprints;
