# Hymmnos Authoring Protocol

Status: mandatory working protocol for campaign lyrics, compiled 2026-07-18.

The objective is not word-for-word English substitution. The objective is a valid Hymmnos lyric whose literal vocabulary, grammar, emotional perspective, and poetic interpretation are all auditable.

## Authorities

1. Campaign vocabulary authority: `campaign files/[DM] Tower of Chaos/Lore/Hymmnos Lexicon.docx`.
2. Campaign-specific behavior: `Lore/The Town.docx`, especially P103–P122.
3. Standard syntax and emotion sounds: [Hymmnoserver Standard Grammar](https://hymmnoserver.uguu.ca/grammar.php).
4. Dialect boundaries: [Hymmnoserver Dialects](https://hymmnoserver.uguu.ca/dialects.php).
5. Pastalie-specific syntax, only when deliberately selected: [Hymmnoserver Pastalie Grammar](https://hymmnoserver.uguu.ca/grammar2.php).

The local lexicon contains 1,133 extracted entries: 333 marked Central, 174 Pastalie, 109 Kurt Ciel, 86 Ancient Metafalss, 24 Alpha/Cluster variants, 384 marked with no specific dialect (`-`), and a small number with missing or variant labels. It includes nouns, verbs, adjectives, particles, pronouns, command words, Emotion Sounds, and Pastalie Emotion Verbs.

The extracted machine index is `campaign files/_reference/HYMMNOS_LEXICON_INDEX.json`. It is derived from the DOCX for search and validation; the DOCX remains authoritative if extraction ever disagrees with it.

## Source hierarchy for lyrics

- New user instructions override all prior creative choices.
- The local lexicon controls whether a Hymmnos word exists, its spelling, pronunciation, part of speech, meaning, note, and dialect.
- Formal grammar sources control syntax where the campaign files are silent.
- Existing songs control story intent and motif only. Their Hymmnos wording is not authoritative.
- English translations in draft songs describe intended meaning, not proof that the attached Hymmnos line says that meaning.

An audit of the existing intended Hymmnos lines found 88 unique tokens outside the local lexicon, including English, Japanese, unmarked compounds, placeholders, and campaign proper nouns. Several lines also mix languages or omit the structure needed for executable Song Magic. These drafts must be revalidated or rewritten before reuse. The raw audit is stored in `campaign files/_reference/HYMMNOS_EXISTING_LYRICS_AUDIT.json`.

## Campaign-local facts about Hymmnos

From `The Town.docx`:

- It is an ancient code-like language used by Reyvateil for Song Magic and rooted in the Tower’s ancient technology.
- It can be sung, etched into solid objects, or magiscripted in the air.
- It is written left-to-right.
- Uppercase has emotional significance in Pastalie.
- Nouns do not inherently distinguish singular from plural; context supplies number.
- It operates independently of ordinary Pandemonium and Chaos laws, which makes it unusually effective in this campaign plane.

## Standard Hymmnos grammar baseline

Standard Hymmnos is speaker-centered and defaults to first person. A normal executable phrase begins with a three-part Emotion Sound:

`[degree] [emotion] [desirability] + [verb] + [object/compound]`

The three Emotion Sound positions encode:

1. Degree: how strongly or willingly the singer feels.
2. Nature: happiness, focus, sadness, protectiveness, hope, fear, anger, loneliness, determination, and so on.
3. Desirability: whether the singer wants the present state to stop, continue, continue forever, remain tolerable, never recur, or is indifferent.

The emotion belongs to the singer even when the sentence describes somebody else.

For an explicit non-speaker subject, Standard Hymmnos uses the external-perspective structure with `rre` or a subject-form pronoun:

`[Emotion Sound] + [speaker verb] + rre + [subject] + [subject verb] + [object/compound]`

This matters whenever an English lyric says “he,” “she,” “they,” a named NPC, a god, a Diver, the dead, or the Tower. Simply placing a third-person noun before an English-like verb sequence is not automatically valid executable Hymmnos.

An Emotion Sound can be made persistent across a passage. An explicitly supplied Emotion Sound overrides the persistent one for a particular sentence.

Emotion Sounds and the initial verb may be omitted for non-magical spoken or sung Hymmnos. According to the standard grammar source, such emotionless language is not processed by Towers. Therefore every campaign song must explicitly state whether it is executable Song Magic or merely lyrical Hymmnos.

## Pastalie boundary

Pastalie is not Standard Hymmnos with decorative capitalization. It compresses emotional information into Emotion Verbs and uses its own invocation syntax. A Pastalie Emotion Verb may encode the singer’s feeling and its scope in a single alternating-case word.

Rules:

- Do not insert a dotted Pastalie Emotion Verb into an otherwise Standard sentence merely because it appears in the dictionary.
- Do not generate alternating capitalization by intuition; construct it from the Pastalie grammar and validate each component.
- Use `/.` only when an invocation is intended; `!` or `?` can terminate without invocation according to the Pastalie grammar source.
- Pastalie should be selected for a clear singer/server/lore reason, not only for sound.

## Dialect policy

Default for general Tower-facing Song Magic: Central Standard Note plus entries marked with no specific dialect.

Ancient Metafalss may be used deliberately for sacred, mythic, archaic, or high-intensity passages. Kurt Ciel, Cluster, Alpha, and Pastalie words require an explicit note in the lyric ledger.

Central Standard historically accepts registered words from other dialects, so a mixed-dialect phrase is not automatically impossible. It is still a marked choice: compatibility, efficiency, singer identity, age, and ritual purpose should be recorded. Do not drift between dialects merely to make a rhyme.

## Lexical construction rules

1. Every non-proper Hymmnos token must exactly match a local lexicon headword, including punctuation and meaningful case.
2. Check the English meaning, Japanese meaning when helpful, part of speech, dialect, and any usage note.
3. Never infer meaning from an English-looking form. Important false-friend examples:
   - `grave` means a mountain/building recess or interior, not a burial grave.
   - `deadl` means day/days/everyday, not dead.
   - Actual death words include `morto`, `mortoa`, `zodal`, and `zodaw`, with different dialects and parts of speech.
4. Unknown-meaning entries and entries without a usable definition may add texture only; they cannot carry an essential plot fact.
5. Proper names may remain proper names, but must be listed as such. Campaign Common words such as Omnia, Diver, Chaos, faction names, or invented deity names are not silently treated as Hymmnos vocabulary.
6. Do not import a word from an online lexicon unless it also exists in the local campaign lexicon or the user explicitly approves expanding the campaign dictionary.

## Compounds, circumlocution, and metaphor

The user explicitly permits creative composition when a direct word is missing. Use three increasingly poetic methods:

1. Attested description: combine real dictionary words into a transparent phrase.
2. Contextual naming: identify a thing by its role, origin, color, consequence, or relationship.
3. Narrative metaphor: state an observable image whose intended meaning emerges from campaign context.

For example, the local lexicon has no direct “apple” headword, but it does have:

- `rudje`: red/scarlet/crimson, Central, P812.
- `dornpica`: nut/fruit/seed, Kurt Ciel, P176.
- `pikca`: fruit/nut, Pastalie, P718.
- `dorn`: tree/wood, Central, P174.
- `oz`: possessive “of,” Central, P688.

Possible poetic descriptions can therefore be built around “red fruit,” “red seed,” or “fruit of the tree.” The final Hymmnos form must still be chosen according to the song’s dialect and syntax; this list is a semantic palette, not permission to glue the roots into an unattested new spelling.

Likewise, a line such as “graves try to rise to the heavens” may intentionally imply resurrection. Relevant attested concepts include:

- `katalfa`: gravestone, P483.
- `rifaiah`: revival/resurrection, P791.
- `rifaien`: resurrect/revive, Ancient Metafalss, P792.
- `faja`: advance/make progress, Kurt Ciel, P242, with a note that it applies to individuals or small groups.
- `ciel`: sky/world, Central, P95.

The metaphor should not be flattened into the direct resurrection verb if the concealed image is narratively valuable. Conversely, the image must not be presented as a literal translation if the Hymmnos actually says “revive.” Every song records both literal and poetic translations.

## Required lyric ledger

Every completed Hymmnos passage must include a private validation ledger in this form:

| Field | Required content |
|---|---|
| English intent | The plot meaning the song should communicate. |
| Hymmnos | Final spelling, punctuation, case, and line breaks. |
| Pronunciation | Lexicon pronunciation adapted only where singing requires an explicitly noted elision. |
| Literal parse | Word-by-word grammatical meaning without poetic smoothing. |
| Poetic translation | The player-facing interpretation. |
| Perspective | Singer, subject, listener, and who owns the Emotion Sound. |
| Execution status | Executable Song Magic, persistent block, non-invoked Hymmnos, or ordinary song. |
| Dialect | Dialect of every marked token and reason for mixing, if any. |
| Lexicon evidence | Headword, part of speech, meaning, note, and source paragraph for every token. |
| Proper nouns | Every campaign term intentionally left outside the dictionary. |
| Uncertainty | Any grammatical, semantic, pronunciation, or canon question that remains. |

## Validation gate

A lyric is not ready until all answers are “yes”:

- Does every non-proper token exist in the local lexicon?
- Does every token use an attested meaning and suitable part of speech?
- Were usage notes and false friends checked?
- Is the speaker’s Emotion Sound explicit or deliberately persistent for executable Standard Hymmnos?
- Is third-person perspective marked correctly?
- Is singular/plural being inferred only from context, not from invented morphology?
- Are dialect changes intentional and documented?
- Are Pastalie Emotion Verbs constructed and punctuated according to Pastalie grammar?
- Are literal and poetic translations both supplied?
- Are metaphors labeled as interpretation rather than dictionary meaning?
- Are proper nouns separated from Hymmnos words?
- Does the lyric avoid unresolved campaign facts unless the user has resolved them?
- Has the final text been re-audited after rhyme, meter, or pronunciation edits?

## Existing lyric reuse policy

When revising an existing campaign song:

1. Preserve its narrative job, emotional arc, key images, and relationship to its MP3.
2. Separate Hymmnos, Albhed, Common, Japanese, stage directions, pronunciation guides, and commentary.
3. Audit each intended Hymmnos token against the local lexicon.
4. Rebuild invalid syntax rather than patching isolated words into an English sentence frame.
5. Keep campaign proper nouns only when intentional.
6. Produce a before/after meaning map so no clue is accidentally lost.
7. Do not call a rewritten line “the same translation” if its literal imagery changed.

This protocol is intentionally conservative. Creative freedom belongs in the image, structure, voice, and contextual meaning; lexical and grammatical claims remain traceable.
