// src/scripts/uploadrituals.js

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

// Use absolute path to rituals.json
const ritualsData = require(path.resolve(__dirname, '../rituals.json'));

const uploadRituals = async () => {
  try {
    const batch = db.batch();

    const ritualRef = db.collection('rituals').doc('evolution');

    // Wrap the array in an object
    const data = { rituals: ritualsData };

    batch.set(ritualRef, data);

    await batch.commit();
    console.log('All ritual data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading ritual data:', error);
  }
};

uploadRituals();
