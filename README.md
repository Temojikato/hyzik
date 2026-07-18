# Hyzik — Omnia campaign portal

The player sheet, Tower references, maps, timers, conditions, inventory, crafting, Reyvateil systems, and campaign control surface for the Omnia campaign.

See the [persistent software backlog](./SOFTWARE_BACKLOG.md) for the original requirements and acceptance notes.

## Local development

```powershell
npm install
npm start
```

`npm run build` produces the Firebase Hosting bundle. The application uses Firebase Authentication, Firestore, Storage, Hosting, and an optional Cloud Function for protected portrait generation.

## Campaign setup

These are intentional administrative operations; they are not run from a browser:

```powershell
# Rebuild the public, meaning-free lexicon and Hymmnos song catalog.
npm run content:build

# Upload protected lexicon meanings, all 48 Cyphers, and campaign songs.
npm run content:seed

# Grant the first admin account. Sign out and back in afterward.
npm run admin:grant -- --email your-admin@example.com

# Verify that every item and recipe is coherent.
npm run validate:items

# Upload the validated item and crafting catalog.
npm run content:items
```

Set `GOOGLE_APPLICATION_CREDENTIALS` to a Firebase service-account JSON stored outside this repository. A workstation with Google application-default credentials may instead set `HYZIK_USE_APPLICATION_DEFAULT=true`. The historical `src/serviceAccountKey.json` must be rotated and removed from Git history; it is now ignored so it cannot be bundled or recommitted.

## Hymmnos privacy model

The React bundle contains only headwords, pronunciation, grammar metadata, Cypher IDs, and the campaign's Hymmnos lyric packets. English meanings are seeded to the protected `hymmnosLexicon` Firestore collection. Security rules allow players to read only entries covered by their unlocked Cyphers. Admin custom claims are authoritative.

Pronunciation uses a stored audio URL when available and a clearly labelled device-voice fallback otherwise. To pre-render selected words through ElevenLabs:

```powershell
npm run audio:hymmnos -- --ids hymmnos,khal,fayra
```

Set `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` first. Rendering the entire lexicon requires the explicit `--all --confirm-cost` flags.

## Optional GPT portrait generation

The OpenAI key is a Firebase Functions secret and is never exposed to React. The callable function requires Firebase Authentication, enforces a per-player monthly limit, stores results in Firebase Storage, and leaves all supplied portraits available as a no-cost fallback.

```powershell
firebase functions:secrets:set OPENAI_API_KEY
cd functions
npm install
cd ..
$env:REACT_APP_ENABLE_IMAGE_GENERATION='true'
firebase deploy --only functions,hosting
```

The backend uses `gpt-image-2` through the Images API. Without the secret and client feature flag, the image-generation control is visibly unavailable and the original portrait workflow is unchanged.

## Deployment

```powershell
npm run build
firebase deploy --only firestore:rules,storage,functions,hosting
```

Deploying just `hosting` is safe when the backend secret has not been configured, but the new admin, translator, messages, and Cypher features need the included Firestore rules and seeded campaign documents for their complete behavior.
