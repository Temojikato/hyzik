# FLOOR II — Seven Sins Beneath the Machine

Status: Eleven Music v2 six-minute exploration-ambience draft, lexically audited 2026-07-18.

## Narrative function

- Tutorial lesson: the Seven Sins—greed, envy, lust, wrath, pride, gluttony, and sloth.
- Threat model: Floor 1's danger attacked the containment field; Floor 2's danger whispers inside it.
- Musical role: quiet, menacing exploration ambience with brief temptations instead of loud breaches.
- Diegetic vocal source: one synthetic Reyvateil-like system voice split into seven subtly altered shadows.
- Thesis: ancient technology can protect a room, but cannot prevent sin from entering a heart.

## Required generation method

Do **not** submit the entire sparse lyric block as one six-minute generation. In simple generation mode, Eleven Music uses the amount of lyric text together with the total duration to infer vocal structure; with only nine short lines, it may repeat an early line as a refrain for the rest of the track.

Use this workflow:

1. Generate the six-minute foundation with the music prompt below, but add `Instrumental only. No voices or lyrics.` and leave the custom lyric field empty.
2. Open **Edit Song** and divide/add short sections at the vocal positions below.
3. Put exactly one Hymmnos line in each Sin section and the two diagnostic lines in the final vocal section.
4. Give each one-line vocal section about 6-8 seconds and the two-line diagnosis about 12-16 seconds. Mark every surrounding section instrumental.
5. Regenerate the edited composition. Do not use the combined lyric block as a whole-song lyric field.

| Approximate position | Section type | Text |
|---:|---|---|
| 0:00-0:45 | Instrumental | Threshold |
| 0:45-0:53 | Vocal | Greed line only |
| 0:53-1:20 | Instrumental | Greed aftermath |
| 1:20-1:28 | Vocal | Envy line only |
| 1:28-1:55 | Instrumental | Envy aftermath |
| 1:55-2:03 | Vocal | Lust line only |
| 2:03-2:30 | Instrumental | Lust aftermath |
| 2:30-2:38 | Vocal | Wrath line only |
| 2:38-3:05 | Instrumental | Wrath aftermath |
| 3:05-3:13 | Vocal | Pride line only |
| 3:13-3:40 | Instrumental | Pride aftermath |
| 3:40-3:48 | Vocal | Gluttony line only |
| 3:48-4:15 | Instrumental | Gluttony aftermath |
| 4:15-4:23 | Vocal | Sloth line only |
| 4:23-5:25 | Instrumental | Sloth aftermath and Seven Shadows |
| 5:25-5:41 | Vocal | Two diagnosis lines only |
| 5:41-6:00 | Instrumental | Coherent loop ending |

The combined lyrics later in this document remain the linguistic master copy and audit record, not the recommended one-shot input format.

## Recommended one-shot generation

The reliable one-shot compromise is one contiguous vocal passage near the end. Do not request scattered shadows, whispers, breaths, humming, choirs, or non-lexical vowels: those directions can cause the model to preserve a vocal layer while replacing the intended words with an extended vowel.

Use the music prompt below and paste only the plain lyric lines from **One-shot custom lyrics**. Do not add section headers or performance directions to the lyric field.

## Music prompt — under 4,000 characters

```text
Create a six-minute quiet, menacing dark science-fantasy dungeon ambience titled “Floor II — Seven Sins Beneath the Machine.” This protected tutorial floor teaches the Seven Sins. Danger does not attack from outside; it lurks inside desire and resembles the listener’s own thoughts.

Use 60 BPM, restrained 4/4, and C-sharp Phrygian. Build an ancient technological bed from low sine drones, dim glass harmonics, distant relay ticks, prepared-piano taps, narrow metallic resonance, and a barely audible two-note machine pulse. Keep it sparse, shadowy, close, and quietly predatory. Use subtle glitching, clipped reverb tails, microtonal beating, phase errors, and small dropouts. Avoid large crescendos.

VOCAL RULE: The track is completely instrumental from 0:00 until 4:45. Before 4:45 use no voice or voice-like sample. At 4:45, deliver the supplied lines exactly once in written order. Lines 1-7 are seven different close-miked voices whisper-speaking one line each as an intelligible incantation, not singing a melody. Give every Sin a clearly different identity: 1 low feminine and possessive; 2 thin feminine and resentful; 3 intimate androgynous; 4 clipped low masculine; 5 high regal synthetic; 6 deep doubled and hungry; 7 exhausted and fading. Keep these whispers dry, consonant-rich, short, and almost spoken. Do not sustain vowels, hum, sigh, harmonize, chant, or add background voices. Lines 8-9 switch to the original bright artificial female-coded virtual songstress, who sings only those two system-diagnosis lines on a narrow, cold three-note melody. Do not repeat, extend, echo, omit, reorder, reprise, or convert any line into a hook. Add no words. Finish by 5:35. From 5:35 to 6:00 all voices stop and never return.

0:00–0:45 — THRESHOLD. Quiet machinery and the slow pulse suggest something following just outside sight.

0:45–1:20 — GREED, INSTRUMENTAL. Tiny gold-like chimes accumulate; every new tone refuses to decay until the system coldly removes most of them.

1:20–1:55 — ENVY, INSTRUMENTAL. A sharper copy of the main instrumental tone gradually steals and replaces its original notes.

1:55–2:30 — LUST, INSTRUMENTAL. Warm close harmonics and a slow chromatic pull become attractive, then reveal an inhuman pitch wobble.

2:30–3:05 — WRATH, INSTRUMENTAL. Compressed low-frequency pressure, clipped impacts, and a pulse trying to accelerate; never become combat music.

3:05–3:40 — PRIDE, INSTRUMENTAL. A false radiant chord rises above everything, sounds superior and hollow, then collapses into one thin tone.

3:40–4:15 — GLUTTONY, INSTRUMENTAL. Low pulses consume existing sounds one layer at a time, leaving the sound field nearly empty.

4:15–4:45 — SLOTH, INSTRUMENTAL. The clock slows, attacks soften, and reverbs stretch until the music almost stops.

4:45–5:35 — VOCAL PROCESSION. The seven motifs return quietly. Seven distinct voices whisper-speak lines 1-7, one voice and one line per Sin. Then the artificial system songstress sings lines 8-9 as a cold diagnosis. Keep the transition obvious.

5:35–6:00 — CONTAINMENT. All vocals stop. The ancient pulse restores technical coherence, but traces of the seven instrumental motifs remain. End near the opening texture for looping.

No heroic melody, lush orchestra, pop chorus, EDM, trailer brass, jump scares, loud climax, repetitive ostinato, random language, or any vocals outside the single defined passage.
```

## One-shot custom lyrics

Paste these lines exactly, with no headers or directions:

```text
Rrha touwaka erra syast kiala.
Was guwo ra jass kiala oz yor.
Rrha paks erra jass yor.
Was guwo ra ruinie jenega.
Rrha zweie erra chs hao.
Was paks ra eta omni.
Ma num ra slep.

Ma ki wa knawa rre gauv enter corle.
Was granme ra hymme guard roon.
```

## Translation ledger

| Sin/function | Hymmnos | Conservative literal meaning | Contextual reading |
|---|---|---|---|
| Greed | `Rrha touwaka erra syast kiala.` | In trance-like wishing that I want eternally, I gather gold. | Accumulation becomes its own endless purpose. |
| Envy | `Was guwo ra jass kiala oz yor.` | In intense resentment that I want continued, I seek/wish for the gold of you. | I want what belongs to you because it is yours. |
| Lust | `Rrha paks erra jass yor.` | In trance-like excitement that I want eternally, I seek/wish for you. | Attraction becomes possession. |
| Wrath | `Was guwo ra ruinie jenega.` | In intense anger that I want continued, I destroy a rival. | The obstacle must be annihilated. |
| Pride | `Rrha zweie erra chs hao.` | In trance-like determination that I want eternally, I become superior. | Superiority becomes identity. |
| Gluttony | `Was paks ra eta omni.` | In intense excitement that I want continued, I eat everything. | Consumption recognizes no sufficiency. |
| Sloth | `Ma num ra slep.` | In a stable state of emotional emptiness that I want continued, I sleep. | Withdrawal and inaction become a chosen equilibrium. |
| Diagnosis | `Ma ki wa knawa rre gauv enter corle.` | In stable focus that I accept, I know sin enters the heart. | Technology detects the real breach but cannot close it. |
| Containment | `Was granme ra hymme guard roon.` | In intense protectiveness that I want continued, I sing protection through the room. | The system can secure the floor, not its occupants’ desires. |

## Pronunciation

```text
Rolled-rra tuwaka erra shast kiala.
Was guuo ra jas kiala oz yoa.
Rolled-rra paks erra jas yoa.
Was guuo ra ruinie jenega.
Rolled-rra tsuvaie erra chis hao.
Was paks ra eeta omni.
Ma nam ra slep.
Ma ki wa noowa rolled-rre gauv enter korle.
Was granme ra hyum guard ruun.
```

The canonical lyric spelling remains the Hymmnos block; this is only a delivery guide.

## Validation notes

- Every non-metadata token occurs in the campaign lexicon.
- All words are Central Standard Note or dialect-unmarked.
- No direct lexicon entries exist for greed, envy, lust, wrath, pride, gluttony, or sloth as a complete set. Each Sin is therefore expressed through an attested action and its Emotion Sound rather than an invented label.
- `gauv` directly means sin/blame. It is used only in the system diagnosis.
- The song uses executable Standard Hymmnos. The seven shadows and the system voice own their respective Emotion Sounds.
- `rre` correctly marks `gauv` as the external subject in “sin enters the heart.”
