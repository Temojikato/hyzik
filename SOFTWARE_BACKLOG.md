# Hyzik Software Backlog

Last updated: 2026-10-22

This is the persistent product backlog for ideas that must survive between software-development sessions. Add new ideas here as they arise. Nothing in this file should be treated as implemented merely because related code already exists.

## Working scope: one trusted group of six (2026-10-22)

This is a private campaign tool for one DM and five trusted friends, not a public product. This section supersedes stricter security or infrastructure requirements in the original capture below.

- Keep the existing login, one DM role, basic Firebase ownership rules, and DM-only shared campaign controls. Do not build a general role/permission system.
- Restrict access to the six campaign accounts with a simple server-controlled allowlist. Implementation is pending identification of the six account IDs; do not guess them, lock out existing users, or treat arbitrary signed-in accounts as campaign members.
- Trust players to edit their sheets, inventory, stats, and resources. Do not add server validation solely to prevent cheating.
- Locked lore and translations need normal UI hiding. Deliberate inspection with browser developer tools is outside scope. Existing working server-side filtering can remain; do not rewrite it merely to remove protection.
- Hide DM navigation from players and retain the simple admin check. Route names do not need to be secret.
- Keep private messages discreet and recipient-scoped. Keep player preview view-only to prevent accidental actions.
- Keep encounter history and useful loot/economy records for play and recovery. Comprehensive security audits, access telemetry, and logging every DM action are out of scope.
- Never put service-account credentials or paid API keys in the client or Git. Keep a basic spending cap for optional paid generation.
- Use backend functions for secrets, shared-state consistency, and reliability. Do not move ordinary trusted-player actions to a backend solely for anti-cheating.
- Do not add enterprise security reviews, elaborate abuse systems, multi-campaign infrastructure, or ongoing security chores without a concrete need.

### Current implementation and next work

The working branch is `codex/full-backlog-rebuild`; `master` predates the July 2026 rebuild. The original Captured statuses below describe historical requirements, not a reliable list of missing features. Code inspection found implementations for the admin portal, player preview, 48 Cyphers, translator, song control/playback, private messages, combat, economy, campaign modes, and bestiary discovery. Deployment and seeded Firebase data remain unverified.

Priority order:
1. External follow-up when Firebase access is available: verify the historically committed key was revoked and identify the six accounts before adding membership restrictions. The shared admin helper and NPC uploader no longer load the legacy credential path. Do not block independent campaign work on these external checks.
2. Verify the deployed app and campaign data against the working branch.
3. Continue the NPC content review using [the generated audit](docs/CAMPAIGN_CONTENT_AUDIT.md). Structural checks pass for 118 NPCs across nine datasets; 30 town locations now link to their authored workplaces. Verify the 126 named Firebase portraits and review lore/discovery tiers in play. All 118 fallback image URLs are placeholders; this does not establish that the primary portrait files are absent.
4. Complete and review map content. Exploration data currently covers the Town and Tower Floor 1; the battle-map display exists, but a full map/content redo is not complete.
5. Finish unique creature combat profiles (the Avatar of Greed and Patience still has unknown stats) and playtest the expanded bestiary and first-session encounters.
6. Check first-session item availability, crafting, loot, and discovery flows.
7. Revisit remaining UI polish and optional media only after table-play needs are covered.

### Work log

- 2026-10-22: Adopted trusted-group scope; replaced security-first implementation priorities with campaign readiness.
- 2026-10-22: Started credential cleanup: administrative scripts must use explicitly configured credentials or application-default credentials; the removed `src/serviceAccountKey.json` is no longer an automatic fallback.
- 2026-10-22: Completed the first NPC/map implementation pass: fixed coordinate parsing for all 37 town building polygons, linked 30 town locations to filtered Resident Codex views, corrected two building labels, preserved stable NPC IDs, fixed stale portrait requests, added local missing-art fallbacks, corrected gallery opening to the selected slide, and improved NPC detail layout on phones.
- 2026-10-22: Added `audit:campaign`, `test:campaign-content`, and the checked `content:npcs` upload command. Updated the NPC uploader to use the shared credential setup and return a failing exit status on upload errors. No upload or deployment was performed.
- 2026-10-22: Verification for this pass: production build and TypeScript check passed; 42 React/unit tests and five content/geometry tests passed. Corrected an old encounter-test expectation from AC to the current Defence terminology. Existing build warnings remain.
- Pending: verify old key revocation and deployment; confirm six account IDs before membership restrictions.
- 2026-10-22: Fixed the reported player-map pinch issue by updating react-zoom-pan-pinch from 3.6.1 to 3.7.0 (the old version mistakes a quickly added second finger for a double-tap). Map modals allow pinch gestures, map surfaces reserve touch input, and overview zoom/reset controls now work outside fullscreen. Mobile Chromium verification reproduced scale remaining at 1 before the fix and reaching 2.6 after it on both overview and district maps; zoom/reset buttons and location taps also passed. Deployed to Firebase Hosting (hyzik-5edfd.web.app); verified the live entry point serves main.82655bc7.js, matching the tested production build.

---

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
- Keep useful campaign history where it supports play or recovery; comprehensive DM-action audit trails are not required.

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
- Hide locked translations in the normal player UI, including search and accessibility text. Preventing deliberate developer-tool inspection is outside this group's scope.
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
- Without the relevant Cypher, hide translations in normal UI, tooltips, and accessibility labels. Anti-inspection protections for payloads and filenames are not required.
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
- Keep visible labels and accessible text consistent with the intended reveal state; renaming assets solely to prevent deliberate inspection is not required.

Open decisions:

- Is the mechanical effect description always visible, progressively translated, or also concealed until Cyphers are found?
- Must a player say the invocation before pressing **Use**, or does pressing **Use** display a final pronunciation prompt first?
- Can discovering an ability itself grant pronunciation without granting its translation? Current direction says yes, but the exact Cypher/content model should encode that exception explicitly.
- Do evolved versions retain a root invocation and append Hymmnos parameters, or receive entirely new names?

---

## Recommended implementation sequence

Use the current priority order in **Working scope: one trusted group of six** above. The original security-first sequence is retired. Preserve working features and prioritize NPCs, maps, unique encounters, and first-session usability.

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
