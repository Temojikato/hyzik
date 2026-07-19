# Tower Bestiary: Ecology, Tiers, and Chaos Rules

Status: DM working reference. The source lore in `Lore/The Tower.docx` remains authoritative; this file records the implemented expansion and combat vocabulary.

## Category boundaries

- **Slimes** are adaptive recyclers. A slime becomes a species by consuming one substance, energy, emotion, memory, sound, or concept for a sustained period. Colonies exchange exudations, influence nearby adaptations, and normally cannot harm one another with those exudations. A core left after death concentrates the assimilated resource.
- **Constructs** are Ancient machines, not wildlife. Local Hymmnos powers them and shapes their instructions. Their series indicate operating depth, material tolerance, protected value, or task complexity. Their ordinary behavior is deterministic and can be studied. Silencing their powering Hymmnos can make them inert, but destabilizing a room's Hymmnos can have consequences beyond the encounter.
- **Beasts** descend from animals preserved inside the Tower. They filled the first ecological niches before generations of scarcity, selection, and leaking Chaos turned recognizable survival strategies into monstrous adaptations. They still form an ecosystem: grazers, scavengers, pollinators, predators, burrowers, and salvage foragers all have roles.
- **Aberrations** are concepts of Chaos made physical. Rare transformed humans also belong here. An aberration's ordinary form already violates nature; its Chaos apex violates the one internal rule that made the ordinary form predictable.
- **Avatars** are unique divine manifestations and do not use the repeatable population rules below.
- **Abandoned Reyvateil** are unique named people. They are former companions who could not return to a Diver's necklace or reach sanctuary and were individually distorted by isolation and Chaos. They never receive generic Minor/Regular/Greater ladders or mandatory “Chaos versions.” Their encounter data describes the one individual.

## Repeatable population tiers

Every repeatable Slime, Construct, Beast, and Aberration species has four implemented threat states:

1. **Minor** — young, low-capacity, or lightly developed. Suitable as an early-floor introduction to the species' core rule.
2. **Regular** — mature and fully adapted. Adds a control, movement, or interaction tool that makes groups tactically meaningful.
3. **Greater** — old, deep-rated, or ecologically dominant. Adds the complete species kit and should anchor an encounter rather than fill it casually.
4. **Chaos** — the apex state. It retains the species' identity but direct Chaos exposure destabilizes timing, target, causality, or terrain. It is always the last and strongest ordinary population tier.

Constructs display these as role-specific series names (for example, Loam Borer, Bedrock Borer, Adamant Borer, then `CH-D3LV3R`) while retaining Minor/Regular/Greater/Chaos database keys so encounter and loot systems can reason about their danger consistently.

The **Chaos Slime** is the exception inside the repeatable rules: its Minor, Regular, and Greater forms are all Chaos-tier encounters. Even a Minor Chaos Slime is stronger than an ordinary Greater Slime. Its `d8` table can change damage type, targeting, spatial rules, ongoing effects, or the state of other slimes.

## Chaos combat rule

- At the start of every Chaos creature's turn, roll the die shown on its **Chaos Flux table**.
- Resolve the result before choosing its ordinary Action.
- Unless the result names a target, select randomly from every eligible creature, including the Chaos creature and its allies.
- The same result may occur on consecutive turns.
- Chaos is not shorthand for “more damage.” Tables deliberately attack different rules: target identity, position, initiative, duration, terrain, audibility, resistance, causality, or the relationship between an instruction and its outcome.
- A Chaos state is not a stable evolution that can be bred or relied upon. It is direct leakage overwhelming an established adaptation or program.

## Combat record contract

Every implemented repeatable tier records authoritative values for:

- Hit Points and Defence (encounters cannot start without them)
- Initiative and movement in spaces
- the six combat aptitudes: Force, Finesse, Guard, Focus, Tempo, Resonance
- Attack Bonus and Save Difficulty
- primary damage type, using the campaign's documented damage-type vocabulary
- Song Hearing: `audible` or `soundless`
- complete ability text with attack bonuses, save values, damage dice, range, and timing
- tier-gated material loot; Chaos labels count as the highest loot-source tier

These are encounter values, not D&D Challenge Ratings. Rough baselines before role adjustments are 28 / 64 / 128 / 232 HP for Minor / Regular / Greater / Chaos, with Defence and attack accuracy rising at every tier. Brutes exchange Defence and speed for HP; guardians gain Defence; skirmishers gain speed and initiative; artillery lose HP for range; controllers and supports invest in Focus and Resonance.

## Implemented catalog

### Slimes

- Fire Slime — flame and heat
- Earth Slime — soil, ore, and load-bearing stone
- Water Slime — clean water and hydraulic pressure
- Lightning Slime — electrical charge
- Wind Slime — airflow and pressure
- Magma Slime — stone and molten heat together
- Frost Slime — stolen heat and old ice
- Shadow Slime — darkness and cast shadows
- Sound Slime — vibration, voices, and repeated songs
- Time Slime — temporal anomalies and repeated moments
- Memory Slime — residual memory and psychic impressions
- Emotion Slime — fear, joy, grief, rage, and other shed emotions
- Chaos Slime — direct leakage rather than a stable diet; three apex tiers

An ordinary species' Chaos tier is also its specialized Chaos form: the Chaos tier of Water Slime is a Water Chaos Slime, the Chaos tier of Sound Slime is a Sound Chaos Slime, and so forth.

### Constructs

- `14S3R` — survey, foundry, and vault cutting lasers
- `UNM0V3D` — immobile anchors assigned to a charge
- `P4L4D1N` — curse-resistant purity guardians
- `JU663RN4UT` — load-moving stone foundation frames
- `M0UNT41N` — mobile shells around bound elemental furnaces
- `D3LV3R` — loam, bedrock, and adamant excavation borers
- `C4RT0GR4PH` — room, floor, and mutation surveyors
- `M3ND-R` — masonry, Hymmnos, and containment-seal repair units
- `H4UL-R` — pantry, foundry, and relic freight carriers
- `S3AL-W4RD` — hazard, entity, and divine containment wardens
- `D00R-K33P` — service, trial, and dimensional threshold systems

### Beasts

- Rootback Grazer — herd herbivore and mobile seedbed
- Glasswing Carrion Moth — mineral-winged carrion cleaner
- Choir Bat — coordinated aerial echolocator
- Riftclaw Stalker — spatial-seam ambush predator
- Rimehorn Burrower — cold-soil heat hunter
- Cindermaw Salamander — furnace scavenger and molten-glass spitter
- Lantern Hound — social luminous guide and darkness hunter
- Siltcoil Serpent — waterway filter predator
- Ironbeak Forager — metal-sorting salvage bird
- Bloomgut Tortoise — long-lived migratory seed vault

### Aberrations

- Echo Husk — a last sentence given a hollow body
- Grief Leech — mourning made parasitic appetite
- Folded Witness — mutually exclusive viewpoints made flesh
- False Door — the certainty that an exit must exist
- Clock-Eater — discarded time and impatience made predator
- Hollow Choir — a Song continuing without a singer
- Skin of Yesterday — a human survivor reduced to remembered identities
- Hunger That Walks — appetite without a body capable of satisfaction
- Unwritten Thing — a new law trying to exist before reality can describe it

### Unique abandoned Reyvateil

- **Venestria, The Tangled Vine** — a single abandoned companion hidden inside a room-sized root system. Her entry uses one `Unique` encounter profile and no species ladder.

## Encounter placement guidance

- Teach a species with one Minor specimen and terrain that demonstrates its ecological rule before using groups or mixed tiers.
- Regular encounters work best when two species occupy complementary niches rather than when one stat block is multiplied without context.
- A Greater specimen should change how the room is approached and should protect, feed, or compete with something that explains its age.
- Chaos tiers should be rare story events, containment breaches, or deep-floor apexes. Their roll tables are strong enough to swing encounters in either direction; do not balance them as deterministic damage races.
- The first protected tutorial floors may contain Minor and selected Regular populations. A Chaos encounter there should signal a specific containment failure, not ordinary local wildlife.
- Unique Reyvateil encounters should reveal personal history, failed sanctuary, and the broken Diver bond. Reusing their mechanics under a different name would erase what makes them Reyvateil.

## Bestiary discovery progression

Bestiary knowledge is shared campaign knowledge and advances only when the administrator ends a completed encounter. Merely opening the encounter builder, adding a creature, or abandoning a battle does not reveal anything.

- The first completed encounter with a species unlocks its base entry and its first authored lore fragment. Its tier profiles and stat blocks remain hidden.
- Every later completed encounter with that species reveals one more authored lore fragment, in this order: Formation, Social Tendencies, Habitat, Behavior, then Rarity. Species with fewer authored fields stop when their available lore is exhausted.
- A particular tier profile unlocks after that exact tier has appeared in two completed encounters. Fighting a Minor specimen twice does not reveal the Regular, Greater, or Chaos profile.
- Multiple bodies of the same species and tier in one encounter count as one observation, preventing a swarm from completing the research track at once.
- Fighting several different tiers of one species in the same encounter advances each tier's observation count once, but the species lore still advances only once.
- Unique abandoned Reyvateil follow the same observation cadence for their single encounter profile. This reveals knowledge progressively without inventing generic tiers or copies of a unique being.

Completed encounter documents are the audit trail. When the bestiary content is reseeded, the discovery rebuild replays that history so earned knowledge is preserved.
