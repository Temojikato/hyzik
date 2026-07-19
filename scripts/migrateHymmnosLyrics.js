/* eslint-disable no-console */
const songs = require('../src/generated/campaignSongs.json');
const { updateDocuments } = require('./firebaseCliFirestore');

if (process.env.HYZIK_USE_FIREBASE_CLI !== 'true') {
  throw new Error('Set HYZIK_USE_FIREBASE_CLI=true to acknowledge the live Firestore migration.');
}

updateDocuments('songs', songs.map((song) => ({ id: song.id, data: song })))
  .then(() => console.log(`Migrated ${songs.length} case-sensitive Hymmnos song catalogs.`))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
