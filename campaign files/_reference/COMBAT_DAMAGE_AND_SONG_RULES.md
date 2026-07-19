# Combat Damage and Song Rules

This file is the campaign-facing source of truth for damage vocabulary and combat Songs. The matching software registry is `src/data/combatDamageTypes.ts`.

## Resolution

- Attacks roll `d20 + attack bonus` against the target's **Defence**. A result equal to or above Defence hits.
- Saving throws roll `d20 + the named aptitude` against the attacker's **Save Difficulty**.
- Player-facing descriptions must resolve the acting player's numbers. They must say `1d10 + 4`, not `1d10 + Force`.
- There is no mechanic called a "Guard test." Guard may be named as a saving-throw aptitude when an effect genuinely calls for one.

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
- A Canticle may have `chantRounds` before its effect becomes active.
- A Canticle with `durationRounds: null` lasts until interrupted or combat ends. A numbered duration expires automatically as rounds advance.
- Song-focused identities know six potential Songs; other identities know four. Only one or two begin at level 1. The server rejects invocations below `levelRequired`.
- Every Song has an optional `audioUrl`. Empty audio slots are valid now and can receive MP3 performances later without changing the combat model.

