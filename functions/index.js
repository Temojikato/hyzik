const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const crypto = require('crypto');

initializeApp();
const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY');

const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';

exports.generateReyvateilPortrait = onCall({
  region: 'europe-west1',
  secrets: [OPENAI_API_KEY],
  timeoutSeconds: 120,
  memory: '1GiB',
  cors: true,
}, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in before generating a portrait.');
  const reyvateilName = clean(request.data?.reyvateilName, 80);
  const reyvateilClass = clean(request.data?.reyvateilClass, 80);
  const direction = clean(request.data?.direction, 500);
  if (!reyvateilName || !reyvateilClass) throw new HttpsError('invalid-argument', 'A Reyvateil name and class are required.');

  const db = getFirestore();
  const usageRef = db.collection('imageGenerationUsage').doc(request.auth.uid);
  const month = new Date().toISOString().slice(0, 7);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(usageRef);
    const data = snapshot.data() || {};
    const count = data.month === month ? Number(data.count || 0) : 0;
    if (count >= 12) throw new HttpsError('resource-exhausted', 'Monthly portrait limit reached. Existing portraits remain available.');
    transaction.set(usageRef, { month, count: count + 1, lastGeneratedAt: FieldValue.serverTimestamp() }, { merge: true });
  });

  const prompt = [
    'Create a square character portrait for a dark science-fantasy tabletop campaign set in Omnia.',
    `The character is the Reyvateil ${reyvateilName}, class archetype: ${reyvateilClass}.`,
    'Visual language: ancient song-magic technology, delicate circuit-like glyphs, eerie tower ambience, elegant fantasy clothing, readable silhouette.',
    'Single character, three-quarter portrait, centered, no text, no logo, no frame, no photoreal celebrity likeness.',
    direction ? `Player art direction: ${direction}` : '',
  ].filter(Boolean).join(' ');

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY.value()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-2', prompt, size: '1024x1024', quality: 'low', output_format: 'webp', n: 1 }),
  });
  if (!response.ok) {
    const details = await response.text();
    console.error('OpenAI image generation failed', response.status, details);
    throw new HttpsError('internal', 'Portrait generation failed. Choose a supplied portrait and try again later.');
  }
  const result = await response.json();
  const encoded = result.data?.[0]?.b64_json;
  if (!encoded) throw new HttpsError('internal', 'The image service returned no portrait.');

  const id = crypto.randomUUID();
  const token = crypto.randomUUID();
  const objectPath = `generated-reyvateils/${request.auth.uid}/${id}.webp`;
  const bucket = getStorage().bucket();
  await bucket.file(objectPath).save(Buffer.from(encoded, 'base64'), {
    contentType: 'image/webp',
    metadata: { metadata: { firebaseStorageDownloadTokens: token, ownerId: request.auth.uid, reyvateilName } },
  });
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
  return { id, url };
});
