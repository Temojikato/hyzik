# Hyzik Software Backlog

Last updated: 2026-07-18

This is the persistent product backlog for ideas that must survive between software-development sessions. Add new ideas here as they arise. Nothing in this file should be treated as implemented merely because related code already exists.

## Status legend

- **Captured** — product intent is recorded but implementation has not been verified.
- **Discovery needed** — inspect current code/data before choosing an implementation.
- **Dependency** — another backlog item should be completed first.
- **Decision needed** — product behavior still needs a DM choice.

## Product principles established by these notes

- The admin portal must reveal no controls or routes to ordinary players.
- Hymmnos knowledge is player-specific and progressively earned through **Cyphers** rather than globally available. “Cypher” is the intentional campaign spelling and must not be corrected to “cipher.”
- The campaign's current song is shared live state, but automatic playback is for the DM/admin experience unless later expanded.
- Secret messages must be immediate but discreet.
- Hymmnos translations must always come from the campaign's canonical lexicon and validated song records; the application must not invent translations.
- Expensive generated media should always have a no-cost fallback.

---

## 1. Admin account, authorization, and portal

**Status:** Captured; discovery needed; prerequisite for items 3, 4, 5, and 6.

Create an admin portal that is available only after authentication as an authorized admin. Ordinary users must not see an admin link, route, navigation item, or admin data.

Required behavior:

- Establish an actual admin identity/role. Verify whether an admin account already exists before creating one.
- Enforce authorization in both the UI and Firebase security rules/backend. Hiding a button is not security.
- Prefer a Firebase custom claim or a protected server-owned role record; do not trust a role flag ordinary clients can edit.
- Provide a player overview tab showing every player and their current relevant state, including:
  - identity/display name;
  - online/last-seen state if available;
  - character stats;
  - current conditions/status effects;
  - health and other campaign resources already tracked by the sheet;
  - Reyvateil and progression information;
  - inventory or other private details where useful to the DM.
- Allow the admin to open a player's portal in a clearly marked **view-only impersonation/preview mode**.
- Preview mode must never run mutations, consume resources, unlock content, or accidentally submit actions as the player.
- Preserve an obvious exit control and persistent “Viewing as [player]” indicator while previewing.
- Keep an audit trail for sensitive DM actions where practical: Cypher grants, popup messages, and current-song changes.

Current-code observation:

- No application-level admin portal or role gate was found during the 2026-07-18 quick scan.
- Firebase Admin SDK scripts exist, but those are maintenance scripts rather than an admin user experience.
- Security prerequisite: audit `src/serviceAccountKey.json` and ensure privileged Firebase credentials can never be bundled into or served by the client. Rotate credentials if exposure is possible.

Open decisions:

- Can there be multiple admins, or exactly one DM account?
- Which player values may be changed from this screen versus inspected only?
- Should player preview reflect the exact responsive viewport of that player?

## 2. Hymmnos lexicon and translator application

**Status:** Captured; depends on the Cypher/unlock model in item 5.

Add a Hymmnos application to the player portal with two modes:

1. **Current Song** — the default mode when an active campaign song exists.
2. **Lexicon / Translator** — general lookup and translation using only knowledge the player has unlocked.

Required behavior:

- Use the canonical campaign lexicon as the source of truth.
- Model lexicon entries with stable IDs and fields for headword, pronunciation, part of speech, dialect, literal meanings, usage notes, and audio when available.
- Track unlocked knowledge per player, not only globally.
- Locked words must not leak their translation through search results, accessibility labels, HTML attributes, page source, API payloads, or client-side filtering of a fully downloaded secret lexicon.
- Search should work across only the meanings and forms that player is allowed to know.
- The translator should segment known song text and explain unlocked words without pretending that word substitution equals a complete grammatical translation.
- Validated full-line and poetic translations may be shown when that line/song translation has been explicitly unlocked.
- Unknown or locked words remain visually Hymmnos/unknown.
- Clicking an unlocked word opens its lexicon detail page.
- Keep room for grammar discoveries as separate unlockable knowledge: Emotion Sounds, `rre`, negation, dialects, compounds, server commands, and so forth.

Existing assets to reuse:

- Canonical source: `campaign files/[DM] Tower of Chaos/Lore/Hymmnos Lexicon.docx`.
- Searchable derived index: `campaign files/_reference/HYMMNOS_LEXICON_INDEX.json`.
- Validation rules: `campaign files/_reference/HYMMNOS_AUTHORING_PROTOCOL.md`.
- The application already bundles `src/hymmnos.ttf`.

Open decisions:

- Is translator input Hymmnos-to-Common only, or eventually Common-to-Hymmnos too?
- Does discovering a word unlock every occurrence immediately, including older songs and inscriptions?
- Are literal meaning, poetic meaning, pronunciation, and grammar separate levels of discovery?

## 3. Current-song control and player translator synchronization

**Status:** Captured; depends on items 1 and 2.

Add a current-song control to the admin portal. Changing it updates every player's translator application in real time.

Required behavior:

- Create a song catalog rather than storing only a loose title string.
- Each song record should support:
  - stable song ID;
  - title and campaign context;
  - canonical Hymmnos lyric lines;
  - pronunciation data;
  - literal and poetic translations;
  - word-token-to-lexicon-entry links;
  - reveal/unlock requirements;
  - YouTube URL from item 4;
  - optional artwork, duration, notes, and active/inactive status.
- Admin can select a song as currently playing or clear the current song.
- Store shared current-song state with a timestamp/revision so stale clients cannot overwrite a newer selection.
- Player translator applications listen for changes in real time.
- Opening the translator defaults to **Current Song** when one is active.
- A player may leave that view and use the general lexicon/translator without the app forcing them back on every live update.
- Provide a visible but subtle “Return to current song” action.
- The current-song transcript reveals only what that specific player has unlocked.

Open decisions:

- Should changing songs also grant any Cypher automatically?
- Do players see the song title before translating it?
- Should the app retain a player-visible history of previously heard songs?

## 4. YouTube song links and admin playback

**Status:** Captured; depends on items 1 and 3.

Allow the admin to attach a YouTube link to every song. Selecting the active song should also start that song for the DM inside the admin portal.

Required behavior:

- Validate and normalize supported YouTube URLs into a video ID.
- Show the linked video and playback controls in the admin portal.
- When the admin changes the current song, load and attempt to play its video automatically for the admin.
- Clearly show playback failures and provide a one-click play fallback because browser autoplay policies may block unmuted autoplay until the admin has interacted with the page.
- Changing the shared song must still succeed even if YouTube playback fails.
- Do not make player browsers play audio unless that is added as a separate future feature.
- Support “no video yet” without blocking the song record.
- Consider start-time/end-time fields for long uploads or compilations.

Open decisions:

- Should switching songs crossfade, stop immediately, or leave that entirely to YouTube?
- Should the admin portal remember volume and playback position?

## 5. Forty-plus Hymmnos Cyphers and progressive language unlocking

**Status:** Captured; foundational design needed before translator implementation.

Build a collectible Cypher system that gradually reveals Hymmnos. There must be **at least 40 Cyphers**; more are allowed so language discovery can remain slow across the campaign.

Required behavior:

- Use stable Cypher IDs and player-specific unlock records.
- A Cypher may unlock one or more of:
  - individual lexicon entries;
  - a semantic family;
  - pronunciation;
  - part of speech or dialect metadata;
  - a grammar rule;
  - a server-control command;
  - a specific lyric/inscription translation;
  - a compound or metaphor discovered in context.
- Avoid dividing all words into forty equal arbitrary buckets. Cyphers should feel like discoveries with coherent themes and useful partial knowledge.
- Allow more than forty Cyphers without a schema migration.
- Admin can grant/revoke Cyphers to one or multiple players.
- Granting a Cypher updates affected Hymmnos text immediately.
- Show the player what new knowledge was gained without revealing still-locked neighboring entries.
- Record source/context: item, floor, NPC, inscription, song, ritual, or manual DM grant.
- Prevent duplicate rewards from breaking progress.
- Always use **Cypher** in product copy, code-facing content names, documentation, and campaign UI. This spelling is intentional in context.

Reuse opportunity:

- Existing recipe and lore-tier unlock patterns can inform the data flow and UI, especially `unlockedRecipes` handling in `Home.tsx`, `CraftingModal.tsx`, `ReyvateilInfo.tsx`, and NPC `unlockedtier` fields.

Initial content-design task:

- Produce a Cypher map of at least 40 entries before implementation is considered complete.
- Ensure early Cyphers unlock enough repeated functional words to let players form hypotheses without making complete translation trivial.
- Reserve important grammar and dangerous executable vocabulary for deliberate discoveries.

## 6. Discreet real-time player messages

**Status:** Captured; depends on admin authorization.

Allow the admin to send a popup message to one player, several selected players, or all players. Delivery should feel private and incognito, not like an alarm.

Required behavior:

- Realtime delivery: once sent, the pending notice appears over the recipient's current screen without requiring navigation or refresh.
- No sound, vibration, flashing, screaming colors, or conspicuous animation.
- Default privacy shield: show a subtle neutral notice such as “Private message available” with an **Open when ready** button before revealing content.
- Do not show message text in browser notifications, document titles, toasts, or previews before acceptance.
- Once opened, display above existing UI in a readable modal/overlay.
- Support one or multiple explicitly selected recipients.
- Track message states separately per recipient: pending, revealed, acknowledged/dismissed, expired.
- Admin should see delivery/reveal status without learning anything from player interaction beyond what is necessary.
- Messages need timestamps and optional expiration.
- Consider a “hide immediately” control or keyboard shortcut after opening.
- Protect message reads/writes with Firebase rules so only the admin and intended recipient can access the content.

Open decisions:

- Are messages retained in a private inbox after dismissal or permanently destroyed?
- May players reply discreetly?
- Should the admin be able to schedule a message or trigger it from an in-game event?

## 7. UI/UX, architecture, themes, and optional Reyvateil image generation

**Status:** Captured; broad discovery/design project.

Perform a substantial redesign covering visual identity, navigation, responsive behavior, accessibility, code organization, reusable components, and coherent color schemes.

Required product direction:

- Preserve the occult-technological Hymmnos/Tower identity while improving legibility and consistency.
- Establish design tokens for color, spacing, type, elevation, motion, focus, success/warning/danger states, and Hymmnos reveal states.
- Separate player, admin, and view-only-preview shells cleanly.
- Audit large components and Firebase access patterns before restructuring.
- Make mobile/tablet play at the table a first-class use case.
- Treat accessibility and reduced-motion behavior as part of the redesign.

Optional Reyvateil image generator:

- During Reyvateil selection, allow a player to generate suitable portraits through the GPT Image API and choose a result.
- Keep all current/preselected images as a free default and fallback.
- Make generation explicitly opt-in so players who do not care do not incur cost.
- Call the image API from a protected backend/server function; never expose the API key to the browser.
- Use structured prompts derived from the chosen Reyvateil traits while preventing arbitrary prompt abuse.
- Define generation count, retry limit, moderation behavior, ownership/storage, deletion, and per-player cost limits.
- Cache/store selected outputs so the image is generated once rather than on every view.
- Provide a DM override for inappropriate or lore-breaking results.

Open decisions:

- Is image generation available once, several times, or through a campaign currency?
- Should generated portraits match one unified art direction?
- Is the redesign incremental or a deliberate application-shell rewrite?

## 8. Progressive translation of Hymmnos-font text

**Status:** Captured; depends on items 2 and 5; related to item 7.

Use the Hymmnos font more broadly where it sells the setting, but make every inscription participate in the Cypher system.

Required behavior:

- Represent Hymmnos inscriptions as structured tokens linked to lexicon entry IDs, not decorative unsearchable strings or baked text images wherever avoidable.
- Before discovery, render the intended Hymmnos glyph/font form.
- When the relevant Cypher is collected, reveal its translation in a clearly different but coherent color/style.
- Support partial translation when only some words are unlocked.
- Clicking an unlocked word opens the correct lexicon entry.
- Clicking a locked word may show a neutral “Not yet understood” state without leaking metadata.
- Preserve the original Hymmnos text alongside its translation so players can compare patterns.
- Define keyboard focus, screen-reader text, and touch targets for clickable words.
- For actual image assets containing text, create overlay/transcription metadata rather than relying on image recognition at runtime.
- Never use the Hymmnos font for untranslated English and imply that it is valid Hymmnos.

Content audit needed:

- Inventory every current use of `fontFamily="Hymmnos"` and determine whether it represents actual Hymmnos, decorative UI typography, or English rendered in the font.
- Decide which decorative uses remain aesthetic and which become translatable lore objects.

## 9. Per-word pronunciation audio

**Status:** Captured; depends on normalized lexicon records.

Add a **Play pronunciation** control to each lexicon entry.

Preferred approach:

- Pre-render audio in a controlled batch, potentially using ElevenLabs, rather than generating it live on every click.
- Store the audio asset URL and generation metadata on the lexicon entry.
- Normalize pronunciation guidance before paying to render the complete dictionary.
- Start with unlocked or frequently encountered words, then expand in batches.
- Use one canonical voice/pronunciation style unless dialect or speaker identity requires variants.
- Include a text pronunciation fallback when audio is absent.
- Lazy-load audio, cache it, prevent overlapping rapid playback, and support replay.
- Track ElevenLabs voice/model/settings so inconsistent batches can be identified and regenerated.
- Do not reveal audio for locked words unless pronunciation itself has been unlocked.

Open decisions:

- One neutral system voice or a Reyvateil songstress voice?
- Spoken pronunciation, lightly pitched pronunciation, or both?
- Are dialect variants separate recordings?

## 10. Item, inventory, and crafting coherence expansion

**Status:** Captured; high priority before the first session.

The current system is a promising foundation but needs enough breadth and logical closure that common play does not expose obvious missing objects—for example, having rope but no chain.

Required work:

- Inventory all current items, categories, recipes, crafting stations, currencies, components, and loot tables.
- Build a mundane-equipment coverage checklist: fasteners, containers, light, climbing, restraint, repair, travel, food preparation, shelter, medicine, writing, trade, tools, weapons, armor support, and common raw materials.
- Compare related item families for missing logical siblings: rope/chain/wire, sack/chest/crate, torch/lantern/oil, nail/screw/rivet, and similar sets.
- Ensure every recipe component refers to a real obtainable item ID.
- Ensure crafted outputs exist, have coherent categories, and can be used or sold.
- Ensure every essential item has at least one acquisition path: shop, craft, loot, forage, quest, or starting equipment.
- Check names, units, weights, values, rarity, descriptions, stack behavior, and synonyms for consistency.
- Separate mundane, campaign-specific, magical, crafting-only, quest, and placeholder items.
- Identify duplicate legacy data between `src/items.json` and `src/dataSets/items/` before adding more content.
- Add validation scripts/tests for duplicate IDs, missing recipe references, impossible recipes, orphaned items, invalid categories, and broken loot references.
- Run a “first-session survival” scenario audit to verify that plausible player plans have the objects they logically require.

Suggested deliverables:

1. Current-data audit report.
2. Canonical item schema and naming rules.
3. Missing mundane-item expansion.
4. Recipe dependency graph and automated validation.
5. First-session availability pass.

## 11. Hymmnos ability names, invocations, and Cypher translation

**Status:** Captured; depends on items 2, 5, 8, and 9; existing ability data requires migration.

Reyvateil and Song Magic abilities must exist in actual validated Hymmnos, not as English names merely rendered with the Hymmnos font. Players are expected to exclaim the Hymmnos invocation to activate the magic.

Required behavior:

- Give every applicable magical ability a canonical Hymmnos invocation.
- Prefer the ability's Hymmnos name itself as the spoken activation phrase wherever that produces a usable, grammatically valid invocation.
- When a name alone cannot correctly execute or express the magic, store a separate short activation phrase alongside the Hymmnos ability name.
- Validate every invocation against the campaign lexicon and `HYMMNOS_AUTHORING_PROTOCOL.md`; do not invent convenient pseudo-Hymmnos.
- Store structured ability-language fields rather than one display string, including:
  - stable ability ID;
  - canonical Hymmnos name;
  - canonical activation phrase, if different;
  - pronunciation for both;
  - lexicon-entry/token links;
  - literal parse and intended magical effect;
  - dialect and Emotion Sound requirements;
  - Cyphers required for translation;
  - translated display name and explanatory translation;
  - optional pronunciation-audio asset from item 9.
- In ability lists, show the canonical Hymmnos name as the primary identity.
- Automatically reveal the translated ability name when the player owns the relevant Cypher knowledge. Use the established translated-text color treatment from item 8.
- Without the relevant Cypher, keep the translation hidden; do not leak it through tooltips, accessibility labels, API payloads, icons, filenames, or client-side filtering.
- Opening `ReyvateilSkillModal` must always show:
  - the canonical Hymmnos ability name;
  - the exact words the player must exclaim;
  - a clear, readable pronunciation guide;
  - translated name/meaning only to the degree unlocked by that player's Cyphers;
  - the existing mechanical description, cost, cooldown, and activation control as permitted by the final reveal design.
- Pronunciation is operational information and must remain available in the ability modal even when the translation is locked, because the player needs to say the invocation aloud.
- Visually distinguish **what to say** from **what it means** so a player never accidentally reads the Common translation as the activation phrase.
- Support partial translation when a player knows only some invocation tokens.
- Clicking an unlocked Hymmnos token opens its lexicon entry; locked tokens use the neutral undiscovered state.
- The optional per-word audio controls from item 9 may appear beside invocation tokens, but audio is not required before the ability can be used.
- Ability activation in the app should not attempt microphone recognition by default. The spoken requirement is a table-play ritual unless a future feature explicitly adds speech verification.

Content and migration work:

- Inventory all current abilities in `src/reyvateils.json` and any Firebase ability records.
- Decide which abilities are executable Song Magic and whether any genuinely nonmagical abilities are exempt.
- Author and audit a Hymmnos name/invocation ledger for every applicable ability before hiding its existing English name.
- Migrate icons and cooldown keys away from mutable display names toward stable ability IDs so translation changes do not break storage paths or cooldown state.
- Audit current icon filenames and `alt` text because both may reveal locked English names.

Open decisions:

- Is the mechanical effect description always visible, progressively translated, or also concealed until Cyphers are found?
- Must a player say the invocation before pressing **Use**, or does pressing **Use** display a final pronunciation prompt first?
- Can discovering an ability itself grant pronunciation without granting its translation? Current direction says yes, but the exact Cypher/content model should encode that exception explicitly.
- Do evolved versions retain a root invocation and append Hymmnos parameters, or receive entirely new names?

---

## Recommended implementation sequence

This order minimizes rework while preserving the user's priorities:

1. Security and data discovery: authentication, Firebase rules, existing unlock systems, service credentials, and canonical schemas.
2. Admin role/account and protected admin shell.
3. Player overview and view-only player preview.
4. Hymmnos lexicon normalization plus the 40+ Cypher content map.
5. Per-player Cypher storage and unlock services.
6. Translator/lexicon UI and progressive Hymmnos rendering.
7. Ability-language schema, audited Hymmnos invocations, and ability-modal integration.
8. Song catalog, current-song state, player synchronization, and YouTube admin playback.
9. Discreet realtime messaging.
10. First-session item/crafting audit and expansion—this can run in parallel with UI feature work when development resumes.
11. Broader UI/UX and architecture redesign, informed by the completed feature shapes.
12. Optional paid media: Reyvateil image generation and pre-rendered pronunciation audio.

## Existing implementation anchors found during capture

- Authentication context: `src/contexts/AuthContext.tsx`
- Firebase setup: `src/Firebase.ts`
- Protected-route component: `src/components/PrivateRoute.tsx`
- Player data/UI: `src/components/Home.tsx`, `src/components/PlayerInfo.tsx`
- Recipe unlocks: `src/components/Home.tsx`, `src/components/CraftingModal.tsx`, `src/components/ReyvateilInfo.tsx`
- Ability modal and activation flow: `src/components/ReyvateilSkillModal.tsx`, `src/components/ReyvateilInfo.tsx`
- Current Reyvateil ability data: `src/reyvateils.json`, `src/types/Reyvateils.ts`
- Hymmnos font: `src/hymmnos.ttf`, registered in `src/index.css`
- Theme context: `src/contexts/ThemeContext.tsx`
- Item sources: `src/items.json`, `src/dataSets/items/`
- Canonical Hymmnos references: `campaign files/_reference/`

## Append new ideas below

Add dated notes here first if an idea does not yet fit a numbered section. Promote it into the backlog once its intended behavior is clear.

### 2026-07-19 — Authoritative combat profiles and bestiary completion

- The encounter builder must never invent, default, or ask for combat statistics. It only consumes authoritative database values.
- Define a canonical combat schema for every creature tier, including at minimum Max HP and Armor Class; initiative remains rolled/entered when combat begins.
- Audit every nested bestiary tier. Several construct tiers currently have empty `Stats` objects, while most other entries contain only ability scores and no HP/AC.
- Author balanced combat values from the creature lore, tier, abilities, and intended floor difficulty, then migrate them into Firestore and the repository’s canonical bestiary source together.
- Add persistent player `combatStats` records (current HP, Max HP, Armor Class) outside the encounter builder and populate them during the eventual character/combat setup flow.
- Add an automated completeness audit that blocks encounters and names every creature/player whose authoritative combat profile is missing or malformed.
