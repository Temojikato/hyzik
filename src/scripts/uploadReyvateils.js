// src/scripts/uploadReyvateils.js

const admin = require('firebase-admin');
const path = require('path');

// Replace with the correct path to your service account key
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'hyzik-5edfd',
});

// Initialize Firestore
const db = admin.firestore();

// Use absolute path to reyvateils.json
const reyvateilsData = require(path.resolve(__dirname, '../reyvateils.json'));

const uploadReyvateils = async () => {
  try {
    const batch = db.batch();

    reyvateilsData.forEach((reyvateil) => {
      const reyvateilRef = db.collection('reyvateils').doc(reyvateil.id);
      batch.set(reyvateilRef, reyvateil);
    });

    await batch.commit();
    console.log('All Reyvateil data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading Reyvateil data:', error);
  }
};

uploadReyvateils();
