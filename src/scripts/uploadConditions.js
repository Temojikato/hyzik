// src/scripts/uploadConditions.js

const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'hyzik-5edfd',
});

const db = admin.firestore();

// conditionData is an array of condition objects
const conditionData = require(path.resolve(__dirname, '../conditions.js'));

async function uploadConditions() {
  try {
    for (const condition of conditionData) {
      // condition.name is the doc name
      const docRef = db.collection('conditionDefinitions').doc(condition.name);

      await docRef.set(condition, { merge: true });

      console.log(`Uploaded condition "${condition.name}" to conditionDefinitions!`);
    }
  } catch (error) {
    console.error('Error uploading Condition data:', error);
  }
}

uploadConditions();
