# VENESTRIA — The Name Beneath the Thorns

Status: Eleven Music v2 test draft, lexically audited 2026-07-18.

## Narrative function

This is Venestria's Floor 1 reveal and battle theme. It should first sound like a lullaby continuing long after the person it was meant for disappeared, then reveal itself as territorial Song Magic.

The canonical source material establishes that:

- Venestria was once the companion of an aspiring Diver whose name is lost.
- She has slept in her own roots for generations.
- Her room is filled with sharp thorns.
- Danger-sand both confines her and warns Divers away.
- Most people who try to tame her never return; survivors speak in riddles and retain her name in their minds.

The `Tiers.Minor.Description` text about an Avatar, treasure-filled pods, and slime progeny is a duplicate of the Avatar of Greed and Patience description and is excluded from this song as copy contamination.

## Eleven Music v2 prompt

```text
A 2-minute dark-fantasy ritual boss theme for the first-floor room of Venestria, an abandoned Reyvateil who has slept inside her own roots for generations. 72 BPM, 6/8, D Phrygian. Begin almost silent: a close, breathy female solo voice, detuned music box, bowed glass, bass clarinet, deep cello harmonics, dry sand hiss, root-creak percussion, and a slow sub-bass pulse. Lyrics begin at 0:12.

At 0:42, make the room seem to wake: organic polyrhythm, thorn-scrape strings, and whispered copies of the lead voice arriving one beat late. At 1:00, turn it into a dangerous but tragic battle hymn with low frame drums, dissonant string ostinato, and a corrupted female choir. Keep the original small voice audible inside the choir, as though the abandoned companion is still trapped inside the creature.

Sing exactly the supplied Hymmnos lyrics. No English words or ad-libs. Use clear consonants, elongated vowels, a rolled R in “Rrha” and “rre,” and increasingly obsessive repetition of “Venestria.” She should sound abandoned, ancient, defensive, and territorial—not gleefully evil. Her lullaby has become a defense spell. After 1:50, instrumental only; end unresolved with one distant whispered “Venestria.”

Avoid EDM drops, modern pop hooks, trailer brass, power-metal guitars, bright major harmony, cheerful resolution, excessive melisma, and a clean triumphant ending.
```

## Custom lyrics

Use the canonical spelling below for the first test generation.

```text
[Intro]
{instrumental, dormant root pulse and dry sand hiss}

[Lament]
{single breathy female voice}
Was jyel ga loss ferx.
Was jyel ga sapon ferx.
Was jyel ga knawa rre moy hagol.
Rrha jyel erra slep ween dorn.

[Rooting]
Was jyel ga chs corpu oz dorn en shazra.
Was jyel ga knawa rre sabl giue mea.

[Awakening]
{whispers multiply into a delayed choir}
Was guwo ra fountaina roon shazra.
Was guwo ra rinc yor shazra.

[Chorus]
{full corrupted choir, lead voice still clear}
Rrha jyel erra zethpa yor dahzel.
Rrha jyel erra neee xaczor.
Rrha jyel erra hymme manac Venestria.
Rrha jyel erra rinc yor shazra.

[Breakdown]
{voices circle from different distances}
Venestria.
Rrha jyel erra neee xaczor.
Venestria.
Rrha jyel erra hymme manac Venestria.

[Outro]
{solo whisper; instruments fall away}
Was jyel ga sapon ferx.
Rrha jyel erra slep ween dorn.
Venestria.
```

The braces are performance directions, not lyrics. Eleven Music v2 documents curly braces as inline cues and square brackets as section names.

## Player-facing poetic translation

> I have lost my companion.  
> I remember my companion.  
> I know the years have passed.  
> I sleep inside the wood.
>
> I become a body of wood and thorn-vine.  
> I know the sand imprisons me.
>
> In anger, I cover the room with thorn-vine.  
> In anger, I bind you in it.
>
> Lost in a trance, I cut you with briars.  
> I call out questions without end.  
> I sing the soul-name: Venestria.  
> I bind you into the thorns.
>
> Venestria. Questions. Venestria.  
> The name is all that remains.
>
> I remember my companion.  
> I sleep inside the wood.  
> Venestria.

The last sentence of the breakdown is poetic interpretation, not a literal lyric line. It combines the repeated proper name with campaign knowledge that survivors retain Venestria's name while speaking in riddles.

## Emotional program

| Emotion Sound | Literal emotional state | Dramatic function |
|---|---|---|
| `Was jyel ga` | Very intense loneliness; the singer wants this state to end soon. | The Reyvateil still remembers loss and wants release. |
| `Was guwo ra` | Very intense anger/resentment; the singer wants this state to continue. | Her defense response wakes and sustains itself. |
| `Rrha jyel erra` | Trance-like loneliness; the singer wants this state to last eternally. | The corruption: abandonment has become her preferred permanent state. |

## Line validation ledger

All lines use Standard Hymmnos first-person syntax unless `rre` marks an external subject. Venestria owns every Emotion Sound.

| Hymmnos | Pronunciation guide | Conservative literal parse | Poetic/campaign reading | Syntax |
|---|---|---|---|---|
| `Was jyel ga loss ferx.` | was jeel ga los feex | In intense loneliness that I want to end, I lose a companion. | My Diver is gone. | ES + V + O |
| `Was jyel ga sapon ferx.` | was jeel ga sapon feex | In intense loneliness that I want to end, I remember a companion. | I still remember the bond. | ES + V + O |
| `Was jyel ga knawa rre moy hagol.` | was jeel ga noowa rre moi hagol | In intense loneliness that I want to end, I know that years pass. | Generations went by. | ES + speaker V + `rre` + S + subject V |
| `Rrha jyel erra slep ween dorn.` | rolled-rra jeel erra slep win dorn | In trance-like loneliness that I want forever, I sleep inside wood. | I sleep within my own roots. `Root` is conveyed contextually as the inside of wood. | ES + V + locative compound |
| `Was jyel ga chs corpu oz dorn en shazra.` | was jeel ga chis korpu oz dorn en shazra | In intense loneliness that I want to end, I become a body of wood and thorn-vine. | My roots and thorns became my body. | ES + V + compound |
| `Was jyel ga knawa rre sabl giue mea.` | was jeel ga noowa rolled-rre sabul giwe miia | In intense loneliness that I want to end, I know that sand imprisons me. | The danger-sand is also my cage. | ES + speaker V + `rre` + S + subject V + O |
| `Was guwo ra fountaina roon shazra.` | was guuo ra faunteina ruun shazra | In intense resentment that I want continued, I fill/cover the room with thorn-vine. | The room closes in with thorns. | ES + V + O + compound |
| `Was guwo ra rinc yor shazra.` | was guuo ra rink yoa shazra | In intense resentment that I want continued, I bind you with thorn-vine. | Venestria entangles an intruder. | ES + V + O + compound |
| `Rrha jyel erra zethpa yor dahzel.` | rolled-rra jeel erra zespa yoa daazee | In trance-like loneliness that I want forever, I slash you with briar. | The thorns attack as an extension of her sleep. | ES + V + O + compound |
| `Rrha jyel erra neee xaczor.` | rolled-rra jeel erra nee zakutsaa | In trance-like loneliness that I want forever, I call out questions. | The questions become the survivors' riddles. | ES + V + O |
| `Rrha jyel erra hymme manac Venestria.` | rolled-rra jeel erra hyum manak Venestria | In trance-like loneliness that I want forever, I sing/resonate the soul-name Venestria. | Her name is impressed on the minds that escape. | ES + V + O + proper-name complement |
| `Rrha jyel erra rinc yor shazra.` | rolled-rra jeel erra rink yoa shazra | In trance-like loneliness that I want forever, I bind you with thorn-vine. | The victim is drawn into the same permanent entanglement. | ES + V + O + compound |

## Lexicon evidence

| Token | Part of speech | Meaning used | Dialect | Lexicon paragraph |
|---|---|---|---|---:|
| `Rrha` | E.s. I | trance state | Central | 807 |
| `Was` | E.s. I | very intensely | Central | 1031 |
| `jyel` | E.s. II | loneliness | Central | 471 |
| `guwo` | E.s. II | anger, resentment | Central | 355 |
| `ga` | E.s. III | I want this to end soon | Central | 304 |
| `ra` | E.s. III | I want this state to continue | Central | 765 |
| `erra` | E.s. III | I want this to last eternally | Central | 220 |
| `loss` | verb | lose, perish | unmarked | 546 |
| `ferx` | noun | friend, companion, partner | unmarked | 260 |
| `sapon` | verb | remember, recall | unmarked | 838 |
| `knawa` | verb | know, understand | Central | 501 |
| `rre` | subject marker | marks the following external subject | Central | 805 |
| `moy` | noun | time, years | unmarked | 602 |
| `hagol` | verb | time passes/goes by | unmarked | 370 |
| `slep` | verb | sleep | Central | 879 |
| `ween` | conjunction/locative | inside of, in | Central | 1056 |
| `dorn` | noun | tree, wood | Central | 174 |
| `chs` | verb | become; complete metaphorical change | Central | 91 |
| `corpu` | noun | body, flesh | unmarked | 111 |
| `oz` | possessive preposition | of | Central | 688 |
| `en` | conjunction | and | Central | 200 |
| `shazra` | noun | thorny vine/shrub; only for thorned plants | Central | 858 |
| `sabl` | noun | sand | Central | 825 |
| `giue` | verb | curse, seize, imprison | unmarked | 327 |
| `mea` | object pronoun | me | Central | 576 |
| `fountaina` | verb/adjective | fill, cover, hide | Central | 281 |
| `roon` | noun | room, enclosed place | unmarked | 801 |
| `rinc` | verb | connect, tie, bind | unmarked | 793 |
| `yor` | object pronoun | you | Central | 1119 |
| `zethpa` | verb | cut, slash | Central | 1150 |
| `dahzel` | noun | thorn, briar | unmarked | 131 |
| `neee` | verb | call out | Central | 623 |
| `xaczor` | noun | question, query | unmarked | 1082 |
| `hymme` | verb/noun | sing, play, resonate | Central | 422 |
| `manac` | noun | true name, name of the soul | Kurt Ciel | 564 |

`manac` is the only marked non-Central lexical choice. It is deliberate because the soul-name concept directly serves the canon detail that Venestria's name remains etched in survivors' minds. Standard Hymmnos can contain registered vocabulary from another dialect; no Pastalie grammar or Emotion Verbs are used here.

## Proper noun and uncertainty record

- `Venestria` is a campaign proper noun, not a claimed dictionary word.
- The lexicon has no direct word for `root`, so `slep ween dorn` literally says “sleep inside wood”; the roots are a contextual reading supported by Venestria's lore.
- The lexicon has no direct word for `riddle`, so `neee xaczor` literally says “call out questions”; riddle-speech is the contextual reading.
- The lyrics establish that Venestria lost her companion but do not invent the companion's name, cause of death, or exact circumstances of the separation.
- Execution status: executable Standard Hymmnos Song Magic. Section labels, brace directions, and the isolated proper-name refrain are musical metadata/vocal calls, not additional executable clauses.

## First-generation listening checks

1. Confirm that the singer articulates `jyel` as approximately “jeel,” not “jai-el.”
2. Confirm that `Rrha` and `rre` have an audible rolled R.
3. Confirm that the first minute sounds sorrowful and confined rather than villainous.
4. Confirm that the shift from `Was jyel ga` to `Rrha jyel erra` is musically obvious.
5. Confirm that “Venestria” is intelligible but not repeated so often that the clue becomes comic.
6. If pronunciation fails, adjust only delivery cues first. Do not change canonical Hymmnos spelling without re-auditing the token.
