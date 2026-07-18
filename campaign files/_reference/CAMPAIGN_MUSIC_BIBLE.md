# Song & Chaos — Campaign Music Bible

Status: working reference, compiled 2026-07-18. This guide summarizes the project; it does not replace the source lore. If the user corrects a fact, the user’s correction becomes authoritative.

## Source authority

Use sources by domain rather than treating every file as equally canonical.

1. World cosmology: `campaign files/Omnia_ The Greater Player Compendium.pdf`.
2. Local campaign reality: `Lore/Pandemonium.docx`, `Lore/The Town.docx`, and `Lore/The Tower.docx`.
3. Reyvateil design: `Lore/Reyvateil System.docx`, `Lore/Reyvateil Components List.xlsx`, and the current `src/reyvateils.json` implementation.
4. Hymmnos vocabulary: `Lore/Hymmnos Lexicon.docx` is the canonical local dictionary.
5. Current playable names and details: the `src/dataSets/`, `src/mapdata.ts`, and related player-sheet data show what is implemented, but may contain typos or older variants.
6. Assignments, `Todo list.docx`, and `Music/Lyrics of Songs.docx` are drafts and creative intent. Do not promote their wording to canon when it conflicts with the sources above.

Any lyric that depends on a conflict listed at the end of this guide must either avoid the disputed fact or ask the user to resolve it.

## Omnia: the large-scale frame

Omnia is a single closed world. Gods, mortals, monsters, planes, and stories all exist inside it. Its metaphysical form is a ring of planes surrounding a core called Chaos. Chaos is acknowledged but not explained or categorized. The Astral surrounds the planes as finite, looping, edgeless warped space.

Reality also has four layers everywhere:

- Material: ordinary embodied life, politics, blood, steel, and magic.
- Feywild: emotion, myth, beauty, appetite, symbolism, and excess.
- Shadowfell: loss, erosion, fear, forgetting, and the thinning of meaning.
- Ethereal: the between-space through which souls and magic pass.

The planes are arranged by the assumptions they impose on mortal existence:

- High/Brightward: Celestia, Bytopia, Arcadia, with Elysium as the High–Wild threshold. These privilege legibility, structure, purpose, contribution, or archetypal destiny.
- Wild: Beastlands, Arborea, and Ysgard, with Limbo as the Wild–Dark threshold. These privilege instinct, emotion, experience, struggle, and actively maintained identity.
- Dark: Pandemonium, the Abyss, and Carceri, with Hades as the Dark–Metal threshold. These privilege survival, erosion, confinement, adaptation, and attrition.
- Metal/Ironward: Gehenna, the Nine Hells, and Acheron, with Mechanus as the High–Metal threshold. These privilege systems, contracts, consequence, and function.

Gods are real but limited and bound to planes/domains. Mortals matter because they can adapt, travel, defy gods, and change systems. Death now usually allows souls to persist; rebirth, binding, loss, and resurrection are all possible, but resurrection normally has consequences.

Sources: Omnia compendium, pp. 1–8.

## Pandemonium and the campaign enclave

Pandemonium is the Dark Plane closest to raw Chaos. At the world level it is described as having no native peoples: mortals are thrown into it, and stable cultures do not normally form. Exposure produces trauma and survival adaptations rather than a Pandemonium ancestry.

The local campaign document divides Pandemonium into four known underground layers beneath an uninhabitable storm-wracked surface:

- Pandesmos: outermost rock and elemental storms.
- Cocytus: cold, ice, and subterranean refuge.
- Phlegethon: lava and extreme heat.
- Agathion: innermost known layer, ancient secrets, labyrinthine caves, and fortified gaols.

Mellifluous is a sealed inner region of Phlegethon reached from Cocytus and rumored to offer both escape from the noise and access to forgotten magic. Its lower outskirts contain the Intransigent Caves, whose local laws, deities, and natural rules change whenever new rules come into being. Empifalante is an ancient, sealed gaol in Agathion containing entities that could not be destroyed or may one day be useful.

The town and Tower appear to be an exceptional enclave in which ordinary Pandemonium rules do not always apply. This explains some—but not all—tension between the world primer’s “no native peoples” rule and the town’s births, long-lived institutions, and hereditary Alroen family. Treat the exception as plausible, not fully resolved.

Sources: `Lore/Pandemonium.docx`; `Lore/The Town.docx`, P6; Omnia compendium, pp. 6 and 13–14.

## The town

The town is enclosed by immovable, indestructible bedrock that forms its sky and boundaries. The stone reflects an infinite-looking sky and a day/night cycle; clouds move across the ceiling and vertical walls, but rain does not fall. The settlement is modest and takes about thirty minutes to cross at its longest distance.

Survival is inseparable from the Tower:

- Roughly half the population are Divers.
- The Tower supplies food, textiles, water, soil, seeds, building material, magical components, and other necessities.
- Expeditions cause heavy death and psychological trauma; many Divers pause or retire.
- Personal pots, Verdant Circle communal gardens, fungi, preservation, alchemy, and magic stretch recovered supplies but do not remove dependence on the Tower.
- When population falls below a threshold, portals associated with Pandemonium and Chaos pull unsuspecting newcomers from elsewhere in Omnia—and sometimes beyond it—into town.

The Guild controls Tower-related activity but does not govern the town. It registers Divers, issues indestructible rank-tags, assigns Reyvateil, forms parties, and assigns an Alroen guide. Alroen are non-magical members of a single hereditary line; they guide parties and secretly monitor them for the Guild.

The Mayor is the town’s highest civil authority, treated almost like royalty. A council, courts, economic and welfare bodies, emergency response, and the Basilic police support town governance. The Basilic’s central law forbids physical or mental harm to townsfolk but does not itself forbid property theft. Their serpent-like equipment and poisoned darts make them both protectors and a source of menace.

The town’s essential emotional contradiction is that community is warm because isolation and death are constant. Festivals, taverns, art, worship, and gardens are not tonal breaks from the darkness; they are survival mechanisms.

Sources: `Lore/The Town.docx`, P3–P195.

## Town soundscape anchors

- Market District: trade calls, metalwork, glass, alchemy, paper, appraisal, hunger, haggling, and resource anxiety.
- Residential District: inns, nightly performance, storytelling, drinking, rumors, exhausted Divers, and temporary warmth.
- Guild District: the Diver’s Guildhall, Reyvateil Sanctuary, Alroen Lodge, and Hall of Records. This is the setting’s strongest institutional music zone: registration, memory, ritual, grief, and Song Magic meet here.
- Artisan Quarter: forge rhythm, clockwork, enchantment, glass resonance, and the friction between making and scarcity.
- Central Plaza: Town Hall, Basilica of Harmony, and Basilic Headquarters—ceremony, public faith, law, propaganda, and political tension.
- Medical Ward: the Healing Hand, Mending Mind, and Cremia’s Salvation—bodily repair, trauma care, memory, and the cost of survival.
- Tower Entrance and Guardian’s Chamber: preparation, dread, tags, the Fountain of Rejuvenation, the Guardian statue, and the threshold between town life and lethal uncertainty.

Sources: `Lore/Town services & map details.docx`; `Lore/Town NPCs.docx`; `src/mapdata.ts`.

## The Tower of Chaos

The Tower nearly reaches the town’s artificial sky. It changes unpredictably: it may remain stable for weeks or transform overnight. Treasure, resources, trials, and dangers are effectively inexhaustible.

Its stated upper structure contains forty ascending floors associated with the Guardian’s Chamber. A Guardian’s Blade used on the Guardian statue reveals a hidden gaol beneath the Tower. The source calls the Guardian’s Chamber both the culmination after forty floors and the Tower’s first chamber, and it describes the hidden gaol as both ten and one hundred descending floors. No lyric should fix this geography until it is resolved.

The Guardian’s Chamber contains:

- A statue labeled “The Guardian — mortal protector and chains to all evil.”
- The Fountain of Rejuvenation, which heals physical injuries.
- Benches and tables for party preparation.
- 666 indestructible entry necklaces/tags that return after seven untouched days when lost in the Tower.

The deeper divine structure contains twenty-one recurring chaotic deities:

- Seven Sins: conceptual gods that require mortal bodies.
- Seven Virtues: physical beings manifested from humanity’s collective will.
- Seven Ancients: unstable gods of abstract concepts whose domains can change with existence.

The Deities of Chaos use Albhed, a substitution cipher of Common. Hymmnos belongs instead to Reyvateil, ancient Tower control, ritual, constructs, and Song Magic. Do not collapse the two languages into one voice.

Recurring Tower music functions are concrete:

- Sanctuary Hymmnos creates rooms that are safe while the song continues.
- Constructs are powered and behaviorally shaped by local Hymmnos; disrupting the song can disable them and may destabilize the room.
- Stranded Reyvateil can be corrupted when they cannot reach sanctuary or return to a dead Diver’s necklace.
- Song and ritual allow Reyvateil to assimilate offered “data” into new forms and powers.
- Sound, memory, emotion, darkness, and even abstract concepts can become ecological forces through slimes and other Tower phenomena.

Sources: `Lore/The Tower.docx`, P1–P349; `Lore/The Town.docx`, P103–P122.

## Faction tensions useful for songs

The town contains fifteen factions. Their political meaning matters more than their listed D&D alignments.

- Order of Valor: heroic legacy, discipline, protection, training, relics, and the danger of institutional mythmaking.
- Cult of the Chaotic Tower: worships the Tower as divine change; uses Hymmnos chants, sacrifices, unstable artifacts, and ritualized chaos.
- Tower’s Resisters: want the Tower destroyed or sealed, even though the town depends on it.
- Revered Keepers: worship Reyvateil as divine intermediaries; protect them, but may conceal unethical strengthening rituals or seek control.
- Tower’s Liberators: want to stabilize and harness chaos for prosperity; innovation shades into forbidden experimentation.
- Silent Shadows: espionage, information control, faction manipulation, and possible service to a hidden patron.
- Guardians of Equilibrium: mediate order and chaos, while possibly manipulating events according to their own hidden definition of balance.
- Shadowbinders: curses, binding, forbidden ascension, and soul harvesting.
- Artisan’s Alliance: craft, innovation, tradition, public works, hidden technologies, and possible industrial espionage.
- Veiled Consortium: market manipulation, information brokerage, hidden vaults, and political puppetry.
- Free Spirits: art, autonomy, performance, and resistance to control. Its detailed source file contains obvious copied Artisan material, so only its core identity is stable.
- Shadow Syndicate: disciplined organized crime, smuggling, extortion, rare-resource control, and forbidden magic.
- Veil of Serenity: counseling, meditation, trauma recovery, restorative ritual, and protective enchantments.
- Emberguard: defense, training, rapid response, advanced weapon development, and internal surveillance.
- Verdant Circle: scarce nature, sustainable resource use, restoration, hidden sanctuaries, and ancient nature magic.

The central campaign argument is not simply order versus chaos. It is who has the right to define safety, use the Tower, control knowledge, spend lives, and transform dependence into power.

Sources: `Lore/The Town.docx`, P8–P38; all documents under `Lore/Factions/`.

## Reyvateil and Song Magic

Reyvateil are one-to-three-foot spirit familiars assigned to Divers. They are usually humanoid and fairy-like, but may include traits of dragons, wolves, spiders, and other creatures; rare non-humanoid forms exist. They came from another plane through the old Hero and are now integral to the Tower’s ecosystem.

Song Magic is not ornamental. Hymmnos is an ancient, code-like language that can be sung, etched into objects, or magiscripted into the air. It operates independently of ordinary Pandemonium and Chaos rules and can alter the environment.

Evolution rituals normally involve song, materials, and sacrifice. The offering’s “data” is assimilated into new songs, powers, or physical forms, while its original material body is disintegrated. This makes every upgrade song a transformation scene and a moral event, not merely a level-up jingle.

The system contains forty-two base Reyvateil across fourteen classes:

| Class | Base Reyvateil |
|---|---|
| Barbarian | Thundara, Gronk, Ragnor |
| Bard | Melodia, Harmonix, Lyra |
| Cleric | Serapha, Lumiel, Vespera |
| Druid | Sylvane, Faelith, Terralyn |
| Fighter | Valora, Arcanix, Sentora |
| Monk | Zenara, Kinetix, Serenix |
| Paladin | Radiant, Valorin, Etherea |
| Ranger | Sylvanna, Windrunner, Falconis |
| Rogue | Shadowlyn, Whisper, Nightshade |
| Sorcerer | Emberlyn, Frostia, Storma |
| Warlock | Nyxara, Voidwing, Eclipsa |
| Wizard | Arcanis, Mystara, Enchantra |
| Artificer | Cogwyn, Fluxara, Gearlock |
| Blood Hunter | Crimsonis, Hemoria, Sanguis |

The component list explicitly includes Celestial, Healing, Sanctus, Fortitude, Wind, Mystara, Enchantra, Gearmaster, Emberlord, Shadowflame, Void Binder, Darkstar, Beacon, Fluxara, Gearlock, Divine, Battle, Luminary, Sylvan, Verdant, Iron, Tempest, Stealth, and Poison Hymmnos chants or hymns. Songs can therefore be diegetic inventory, ritual keys, upgrades, defenses, and quest objects.

Sources: `Lore/The Town.docx`, P90 and P103–P122; `Lore/Reyvateil System.docx`, P1–P169; `Lore/Reyvateil Components List.xlsx`, rows 64–91; `src/reyvateils.json`.

## Existing music corpus

These tracks are references, not a mandate to copy their lyric grammar.

| File | Duration | Existing role |
|---|---:|---|
| `Echoes of Song.mp3` | 6:22 | Battle cue; linked to Biggie’s construct/monster assignment. |
| `Echoes of Chaos - TBD.mp3` | 7:31 | Daan’s location/NPC/monster assignment; lonely, ominous Tower narrative. Lyrics are in Albhed, not Hymmnos. |
| `EXEC_Nuifrawr.mp3` | 7:16 | Jim’s NPC theme; current draft tells of a corrupted Reyvateil haunting the night and taking souls. |
| `EXEC_g.v.w.mp3` | 6:19 | Thomas’s “Depths of the Tower”/chimera assignment; draft centers a being locked beneath the Tower and heroes climbing toward hidden truth. |
| `Corrupted Rest.mp3` | 5:58 | No lyric section found; likely corrupted rest/sanctuary ambience. Treat exact narrative function as unconfirmed. |
| `Reyvateil Sanctuary.mp3` | 7:36 | No lyric section found; likely sanctuary ambience. Treat exact narrative function as unconfirmed. |

Other lyric drafts:

- `Balduo Cest`: shadow knowledge, magic absorption, hidden lore, and Orionyx/the Dark Truth.
- `EXEC_yanje_zayea`: cryptic Hymmnos draft without an English gloss.
- `The Door`: a Diver broken by hallucination, bodily loss, and the God of Grafting, then transformed into a living door that warns others away.

The draft songs repeatedly use echoes, whispers, shadow, hidden truth, sacrifice, lost heroes, corrupted Reyvateil, ascending Divers, denied identity, and voices trapped in structures. These are established campaign motifs even when the individual Hymmnos lines require rewriting.

Source: `Lore/Music/Lyrics of Songs.docx`; MP3 file metadata.

## Stable musical motifs

- Echo versus silence: memory and warning fighting erosion.
- Song versus noise: structured meaning inside Pandemonium’s cacophony.
- Ascent versus burial: Divers climb while gods, secrets, and prior failures wait below.
- Sanctuary versus dependency: safety lasts only while the correct song continues.
- Gift versus consumption: the Tower sustains the town by consuming lives, and Reyvateil growth consumes offerings.
- Identity versus transformation: reincarnating gods, transported strangers, corrupted familiars, adaptive slimes, chimeras, and living constructs.
- Hope as a scarce resource: hope should feel costly, fragile, and deliberately maintained—not absent.
- Public harmony versus private coercion: factions use faith, care, markets, law, and art to protect people and to control them.
- The false sky: beauty and routine projected onto an indestructible prison ceiling.

## Campaign sonic grammar

User direction established 2026-07-18:

- The campaign's general vocal identity is a synthetic, hyper-articulated virtual songster or songstress associated with Reyvateil: bright artificial formants, impossible breath control, layered precision, and an intentionally non-natural edge. Female-coded voices are the baseline reference, not a requirement; singers may have any gender and some cues may have no lead singer.
- Production should not sound perfectly polished or naturally stable. Glitches, buffer-like repetition, clipped tails, pitch drift, phase errors, microtonal friction, corrupted vocal grains, and brief discordance are part of the campaign language.
- Ancient technological order is represented by phase-locked pulses, repeatable tonal lattices, clean resonances, exact timing, and Hymmnos that performs a concrete function.
- Chaos is not merely louder music. It violates tuning, meter, spatial placement, causality, and vocal identity. Each incursion should damage a different musical rule so repeated attacks do not become a predictable sound effect.
- Coherence is imposed by technology and Song Magic. A restoration should sound like forced resynchronization, not like a naturally comforting harmonic resolution.
- Exploration ambience should use vocals sparingly. Short executable Hymmnos packets, distant synthetic vowels, and machine-choir fragments can establish the campaign identity without demanding attention throughout a session.
- Six minutes is the working target for session ambience. Long cues should evolve in waves, avoid identical verse/chorus repetition, and offer clean technological plateaus that can later be crossfaded with instrumental versions.
- Do not place a very short lyric payload into a single six-minute generation and expect timestamp instructions to enforce sparse vocals. Eleven Music uses lyric quantity together with track length to infer vocal structure and may turn one line into a repeated refrain. For long ambience, generate the instrumental foundation first, then add short lyric-bearing sections in the editor or use a composition plan. Keep all other sections explicitly instrumental.
- When a one-shot generation is preferred, group sparse lyrics into two or three conventional multi-line vocal passages (`Verse`, `Bridge`, `Final Verse`) separated by explicitly bracketed instrumental breaks. State that every line is sung once in written order and that no line may become a chorus, hook, chant, reprise, or loop. This sacrifices exact line-by-line timestamps but is less likely to strand the model on one short line.
- Eleven Music does not reliably perform multi-character voice switching, scattered whispers, spoken acting, or sparse micro-vocals inside an ordinary one-shot ambience generation. Default floor cues to one vocal identity and no more than one contiguous lyric passage. Reserve complex vocal staging for bosses or other encounters important enough to justify sectional editing and repeated generation.

## Tutorial-floor musical architecture

The first five Tower floors remain comparatively protected by ancient technology and function as tutorial floors. Each floor should teach one survival lesson through both play and music. The protection makes these floors survivable, not safe.

- Floor 1 lesson: danger. Musical order is repeatedly assaulted by Chaos and forcibly restored by the ancient containment system. Each breach must demonstrate that a calm room can still contain harm.
- Floor 2 lesson: the Seven Sins. The threat is quieter and more internal than Floor 1: greed, envy, lust, wrath, pride, gluttony, and sloth appear as lurking impulses inside a technologically protected space. The system can protect the room, but cannot prevent sin from entering a person's heart.
- Floor 3 lesson: trust nothing—not oneself, a friend, an enemy, or a stranger. Music acts as an unreliable narrator: threatening cues can precede safety, comforting cues can precede corruption, and apparent evidence contradicts itself. Chaos presides over truth and betrayal equally; it is not reducible to a force that merely lies.
- Floor 4 lesson: Hymmnos is executable coded Song Magic. The floor's song is itself a compiler-like tutorial: attested server commands and executable Hymmnos cause audible environmental state changes, while Standard Hymmnos explanation lines state that words become magic, feelings enter Song, Song executes magical power, and feelings transform the result. Players may recognize the cause-and-effect before they can translate the lesson.
- Floor 5 has no discrete lesson. It is the end of the protected tutorial: the ancient system releases the party like a fledgling forced to discover flight while falling. Its music is a sad goodbye, an insufficient good-luck charm, a damaged recapitulation of Floors 1–4, the beginning of the end, and the final boundary beyond which ancient protection cannot follow. It should be substantially glitchier and stranger than the preceding floors while remaining quiet enough for exploration.

## Facts that must remain unresolved

1. Guardian/gaol geography: `The Tower.docx` says forty floors culminate in the Guardian’s Chamber in P6, calls it the first chamber in P8, then says the hidden gaol has ten descending floors in P6 and one hundred in P10.
2. Pandemonium births: the Omnia primer says Pandemonium has no native peoples and no one is born there; the town document describes ordinary births, hereditary Alroen, and an enduring local society. The town may be a Tower-created exception, but the mechanism is not explicit.
3. Fountain/tag consequence: the Tower source says losing a necklace also destroys the Fountain of Rejuvenation because the fountain conceals the entrance beneath. The exact timing, scope, and reversibility are unclear.
4. Free Spirits details: much of its faction file is copied from the Artisan’s Alliance and should not be used beyond the faction’s core identity without confirmation.
5. Shadow Syndicate rivals: its faction file lists “The Shadow Syndicate” as its own rival, probably a copy or naming error.
6. NPC/shop spellings: Marlow/Marlowe, Endless Emporium/Emporeum, Arcane Antiques/Antique, and similar variants appear across documents and code. Use document-canon spelling unless a current-song brief says the implementation spelling is intentional.
7. Corrupted Rest and Reyvateil Sanctuary: the MP3s have no associated lyric brief in `Lyrics of Songs.docx`; their precise story functions are not established.

## Song brief checklist

Before writing any new track, record:

- Diegetic singer and listener.
- Location, time, and campaign reveal level.
- Whether the song is executable Song Magic, ordinary Hymmnos singing, Albhed, Common, or a deliberate mixture.
- The singer’s emotional state and desired continuation/cessation.
- Exact magical function, if any.
- Factional and divine viewpoint.
- Which facts may be revealed to players now.
- Literal narrative truth versus metaphor or deliberate misdirection.
- Musical role: exploration, sanctuary, battle, ritual, character theme, faction anthem, boss phase, lament, or title card.
- Hymmnos validation record described in `HYMMNOS_AUTHORING_PROTOCOL.md`.
