/*
  Examples:
    node scripts/renderHymmnosAudio.js --ids hymmnos,khal,fayra
    node scripts/renderHymmnosAudio.js --all --confirm-cost
*/
const fs = require('fs');
const path = require('path');
const admin = require('./firebaseAdmin');

const readArg = (name) => {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
};
const hasFlag = (name) => process.argv.includes(`--${name}`);

const run = async () => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
  if (!apiKey || !voiceId) throw new Error('Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID first.');
  const publicEntries = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'src', 'generated', 'hymmnosPublicIndex.json'), 'utf8'));
  const ids = (readArg('ids') || '').split(',').map((value) => value.trim()).filter(Boolean);
  if (hasFlag('all') && !hasFlag('confirm-cost')) throw new Error('--all requires --confirm-cost because it can render more than one thousand files.');
  if (!ids.length && !hasFlag('all')) throw new Error('Pass a comma-separated --ids list, or explicitly use --all --confirm-cost.');
  const selected = hasFlag('all') ? publicEntries : publicEntries.filter((entry) => ids.includes(entry.id));
  if (!selected.length) throw new Error('No lexicon entries matched the requested IDs.');

  const bucket = admin.storage().bucket();
  const db = admin.firestore();
  for (let index = 0; index < selected.length; index += 1) {
    const entry = selected[index];
    const romanized = entry.pronunciation.match(/\(([^)]+)\)/)?.[1] || entry.headword;
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text: romanized, model_id: modelId, voice_settings: { stability: 0.72, similarity_boost: 0.72, style: 0.15, use_speaker_boost: true } }),
    });
    if (!response.ok) throw new Error(`ElevenLabs failed for ${entry.id}: ${response.status} ${await response.text()}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const token = require('crypto').randomUUID();
    const objectPath = `hymmnos-audio/${entry.id}.mp3`;
    await bucket.file(objectPath).save(bytes, { contentType: 'audio/mpeg', metadata: { metadata: { firebaseStorageDownloadTokens: token, headword: entry.headword } } });
    const audioUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
    await db.collection('hymmnosLexicon').doc(entry.id).set({ audioUrl }, { merge: true });
    console.log(`${index + 1}/${selected.length}: ${entry.headword}`);
  }
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
