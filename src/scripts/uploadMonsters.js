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

// Import the Slime data (the object above)
const slimeData = require(path.resolve(__dirname, '../slimes.js'));
// or if you have slimeData.json, use: require('../slimeData.json')

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

uploadSlimes();
