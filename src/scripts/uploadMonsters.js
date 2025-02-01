// src/scripts/uploadMonsters.js
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'hyzik-5edfd',
});

// Firestore instance
const db = admin.firestore();

const slimeData = require(path.resolve(__dirname, '../dataSets/slimes.js'));
const constructData = require(path.resolve(__dirname, '../dataSets/constructs.js'));
const avatarData = require(path.resolve(__dirname, '../dataSets/avatars.js'));
const reyvateilData = require(path.resolve(__dirname, '../dataSets/reyvateils.js'));

async function uploadSlimes() {
  try {
    // We'll store this under: bestiary / Slime (doc)
    const slimeDocRef = db.collection('bestiary').doc('Slime');

    // 'set' to replace or 'merge: true' to partially merge
    await slimeDocRef.set(slimeData, { merge: true });

    console.log('Successfully uploaded Slime data to bestiary/Slime!');
  } catch (error) {
    console.error('Error uploading Slime data:', error);
  }
}

async function uploadConstructs() {
  try {
    // We'll store this under: bestiary / Slime (doc)
    const constructDocRef = db.collection('bestiary').doc('Construct');

    // 'set' to replace or 'merge: true' to partially merge
    await constructDocRef.set(constructData, { merge: true });

    console.log('Successfully uploaded Construct data to bestiary/Construct!');
  } catch (error) {
    console.error('Error uploading Construct data:', error);
  }
}

async function uploadAvatars() {
  try {
    // We'll store this under: bestiary / Slime (doc)
    const avatarDocRef = db.collection('bestiary').doc('Avatar');

    // 'set' to replace or 'merge: true' to partially merge
    await avatarDocRef.set(avatarData, { merge: true });

    console.log('Successfully uploaded Construct data to bestiary/Avatar!');
  } catch (error) {
    console.error('Error uploading Avatar data:', error);
  }
}
async function uploadReyvateils() {
  try {
    // We'll store this under: bestiary / Slime (doc)
    const reyvateilDocRef = db.collection('bestiary').doc('Reyvateil');

    // 'set' to replace or 'merge: true' to partially merge
    await reyvateilDocRef.set(reyvateilData, { merge: true });

    console.log('Successfully uploaded Reyvateil data to bestiary/Reyvateil!');
  } catch (error) {
    console.error('Error uploading Reyvateil data:', error);
  }
}

uploadSlimes();
uploadConstructs();
uploadAvatars();
uploadReyvateils();