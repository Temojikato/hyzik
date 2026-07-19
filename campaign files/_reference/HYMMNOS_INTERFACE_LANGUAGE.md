# Hymmnos interface language

The player portal treats Hymmnos as its native interface language. Common is a Cypher-gated annotation, not the primary label. Clicking a registered Hymmnos headword opens its lexicon entry.

## Display contract

- Flavor, identity, navigation, and section labels render in canonical romanized Hymmnos through the Hymmnos font.
- The Common translation appears directly underneath once every registered word in that phrase has been unlocked.
- Before that, the translation line resolves word by word. An unlocked word shows its canonical meaning and each unknown word occupies its position as `•••`, matching the campaign lyric translator.
- Proper names and numbers remain themselves. They do not invent dictionary meanings.
- Mechanical values and instructions required to play safely remain readable: stats, HP, numerical effects, action requirements, timers, encounter state, and explicit rules.
- Interface phrases are compressed nominal labels. They are non-executable and therefore do not use Emotion Sounds or Song Magic execution grammar.
- Hymmnos lookup is case-sensitive before any compatibility fallback. For example, `DIA` is the computer command “input/dialog,” while `dia` is the Central noun “king/throne/ruler.”
- Emotion Sounds are identified as grammatical state encodings in the lexicon modal. Their canonical gloss may be a clause: `wa` is Emotion Sound III and means “It doesn't matter—I will accept things the way they are now.”

## Starter Cyphers

Every account begins with four structural Cyphers:

| Cypher | Family | Purpose |
| --- | --- | --- |
| 01 | Address | Names, calls, greetings, and recipients |
| 02 | Being | Existence, forms, roles, work, and Reyvateil identity |
| 03 | Self | Self-reference and ownership |
| 38 | Word | Words, language, speech, script, and grammar |

These expose enough of the portal to demonstrate the translation system without granting Song, Magic, Death, Chaos, or other plot-critical vocabulary.

Cypher 47 contains the canonical contextual nouns `ksyura` (destruction, ruin, collapse) and `tussu` (change). Neither is presented as a translation of the cosmological proper noun **Chaos**; the absence of a direct Hymmnos equivalent remains intentional and is documented in `CAMPAIGN_TITLE_HYMMNOS.md`.

## Canonical interface ledger

| Common intent | Hymmnos | Contextual reading |
| --- | --- | --- |
| Reyvateil link established | `revatail rinc irs` | Reyvateil / connect / exist |
| Class | `qyon` | duty, role, work |
| Features | `colmask` | form, shape, state |
| Hunger | `dsier` | desire |
| Abilities | `pawr` | power, strength |
| Feed | `accrroad eta` | give / eat |
| Ritual | `piterne` | rite |
| Social profile | `an colmask` | together / state |
| Combat profile | `velsog colmask` | battle / state |
| Techniques | `exec pawr` | execute / power |
| Songs | `hymmnos` | Song |
| Inherited techniques | `pawr oz revatail` | power / of / Reyvateil |
| Universal actions | `exec an` | act / together |
| Song repertoire | `hymmnos colmask` | Song / form |
| Growth and progression | `faja hao` | advance / higher |
| Combat rules | `wart oz velsog` | words / of / battle |
| Shared performance channel | `hymmnos an` | Song / together |
| Player state | `colmask oz noes` | state / of / oneself |
| Conditions and influence | `urdm en zuieg` | circumstance / and / influence |
| Resident Codex | `memora oz plargamera` | memory / of / people |
| Bestiary | `memora oz bister` | memory / of / beasts |
| Maps | `gkgula eux` | boundary / eye |
| Inventory | `ptrapica` | treasure |
| Translator | `wart anturn` | word / understand |
| Functions | `exec` | execute, operate |
| Log out | `sik` | leave, move away |
| Tower link | `tonelico rinc` | Tower / connection |
| Receiving | `drone` | take in, download |

Class, specialty, and descriptive phrases are generated from the same canonical lexicon and remain contextual compounds rather than invented vocabulary. Their implementations and token-validation test live in `src/data/hymmnosInterface.ts` and `src/data/hymmnosInterface.test.ts`.

## Cypher assignment

Lexicon entries are assigned by their English semantic meaning to the named Cypher family. Assignment by dictionary row number is forbidden: it made a Cypher's title unrelated to the vocabulary it revealed. Unclassified entries use a deterministic fallback among non-starter Cyphers so unknown or plot-significant words cannot accidentally become starter vocabulary.
