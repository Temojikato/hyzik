# Combat Damage and Song Rules

This file is the campaign-facing source of truth for damage vocabulary and combat Songs. The matching software registry is `src/data/combatDamageTypes.ts`.

## Resolution

- Attacks roll `d20 + attack bonus` against the target's **Defence**. A result equal to or above Defence hits.
- Saving throws roll `d20 + the named aptitude` against the attacker's **Save Difficulty**.
- Player-facing descriptions must resolve the acting player's numbers. They must say `1d10 + 4`, not `1d10 + Force`.
- There is no mechanic called a "Guard test." Guard may be named as a saving-throw aptitude when an effect genuinely calls for one.

## Combat aptitudes

Every aptitude has a universal job. An aptitude should never exist only as flavor or be silently replaced by whichever other aptitude is higher.

| Aptitude | Universal job | Direct implementations | Typical saving throws |
| --- | --- | --- | --- |
| Force | Power and imposed movement | Force-doctrine Technique Attack, Strike, Shove | Breaking restraints and resisting forced passage |
| Finesse | Precision and evasion | Defence, Finesse-doctrine Technique Attack, Strike | Dodging bursts, traps, and aimed hazards |
| Guard | Endurance and stability | Maximum HP, HP growth, Defence, Brace | Poison, impact, and displacement |
| Resonance | Song output and magical force | Song Attack, Resonance-doctrine Technique Attack | Silence and hostile resonance |
| Focus | Control, perception, and intent | Save Difficulty, Focus-doctrine Technique Attack, tactical aid | Fear, deception, and mental control |
| Tempo | Speed and timing | Initiative, movement, Sprint, Withdraw | Escaping zones and timing hazards |

### Derived formulas

- **Defence:** `10 + Guard + Finesse`.
- **Initiative:** `Tempo`.
- **Technique Attack:** `2 + the Reyvateil doctrine's declared technique aptitude`. Vanguard and Bulwark use Force; Striker and Skirmisher use Finesse; Controller and Channeler use Resonance; Support and Tactician use Focus.
- **Song Attack:** `2 + Resonance`.
- **Save Difficulty:** `10 + Focus`.
- **Movement:** `5 + floor(Tempo / 2)` spaces.
- **Maximum HP:** the Reyvateil's level-one base, plus its HP-per-level growth and any Guard increases.

Attack rolls, saving throws, damage, positioning, and conditions are resolved at the table. The server authoritatively tracks initiative state, available actions and reactions, limited uses, active Canticles, level gates, and profile progression.

### Growth

Combat level follows `reyvateilLevel`. Each doctrine has a deterministic aptitude growth order; reaching a listed aptitude-increase level raises the next aptitude in that order up to its cap. Maximum HP, Defence, movement, attacks, Save Difficulty, and inherited Technique count are recalculated automatically. New Techniques join the player's deterministic inheritance pool at the doctrine's listed levels, while Songs reveal according to their own level gates.

## Canonical damage types

There is deliberately no universal element wheel. A monster, weapon, item, Song, or feature owns its specific `resistances`, `vulnerabilities`, and `immunities`. Never infer those from the type alone.

| Type | Family | Rules meaning |
| --- | --- | --- |
| Arcane | Esoteric | Unshaped magic that disrupts spells, wards, or constructed enchantments. |
| Blood | Esoteric | Vital force weaponized through flesh, sacrifice, circulation, or sympathetic wounds. |
| Fire | Elemental | Heat, flame, combustion, and supernatural burning. |
| Force | Energetic | Pure kinetic song-energy without ordinary material form. |
| Frost | Elemental | Cold severe enough to freeze tissue, liquid, or mechanisms. |
| Lightning | Elemental | Electrical discharge and nervous-system overload. |
| Metal | Physical | Magically driven metal as a substance: animated blades, iron splinters, or machinery. |
| Nature | Esoteric | Living growth, predatory flora, spores, and primal ecological force. |
| Piercing | Physical | Puncturing trauma caused by a narrow physical point. |
| Poison | Physical | Toxic harm delivered through venom, gas, contact, or corrupted metabolism. |
| Psychic | Esoteric | Direct injury to thought, perception, memory, or identity. |
| Radiant | Energetic | Purifying or overwhelming luminous energy. |
| Shadow | Esoteric | Harm expressed through darkness, absence, fear, or stolen presence. |
| Sonic | Energetic | Destructive vibration, pressure, resonance, or dissonance. |
| Stone | Physical | Earth and mineral mass driven with supernatural weight or sharpness. |
| Void | Esoteric | Unmaking energy from absence, dimensional rupture, or hostile nothingness. |
| Wind | Elemental | Cutting air, violent pressure changes, and atmospheric impact. |

### Data contract for future content

Weapons, items, monsters, and abilities should reference the lowercase type ID exactly: `arcane`, `blood`, `fire`, `force`, `frost`, `lightning`, `metal`, `nature`, `piercing`, `poison`, `psychic`, `radiant`, `shadow`, `sonic`, `stone`, `void`, or `wind`.

Creatures may separately define:

- `resistances: string[]` — halve matching damage.
- `vulnerabilities: string[]` — apply the creature's stated multiplier, normally double.
- `immunities: string[]` — take no matching damage.

Do not add a new damage type only to describe a weapon's material or shape when an existing type already expresses the actual harm.

## Combat Songs

Songs are separate from techniques and every Reyvateil has a level-gated repertoire.

- A **Verse** is a single-sentence instant. It resolves immediately and never interrupts another Song.
- A **Canticle** is a sustained stanza. Only one Canticle can hold the encounter-wide performance channel. Starting any Canticle immediately cuts the old one short, even when the same performer starts it.
- Song Magic is audible. A creature must be able to hear a Song to receive its effect.
- Canticles are allegiance-blind: every creature that can hear the performance receives its stated effect, including the performer, allies, and enemies. Beneficial Canticles can therefore strengthen an audible enemy; harmful Canticles can endanger allies.
- A monster tier may declare `SongHearing: "soundless"` to be immune to audible Song Magic, or `SongHearing: "audible"` to confirm that it is susceptible. A missing value means its hearing adaptation has not yet been documented and the administrator decides at the table.
- A Canticle may have `chantRounds` before its effect becomes active.
- A Canticle with `durationRounds: null` lasts until interrupted or combat ends. A numbered duration expires automatically as rounds advance.
- Song-focused identities know six potential Songs; other identities know four. Only one or two begin at level 1. The server rejects invocations below `levelRequired`.
- Content below the player’s current level is presented as a sealed lock: its mechanics, Hymmnos invocation, and translation remain concealed until it unlocks.
- Every Song has an optional `audioUrl`. Empty audio slots are valid now and can receive MP3 performances later without changing the combat model.
