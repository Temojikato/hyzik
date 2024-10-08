// src/scripts/uploaditems.js

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

// Use absolute path to items.json
const itemsData = require(path.resolve(__dirname, '../items.json'));

const uploaditems = async () => {
  try {
    const batch = db.batch();

    itemsData.forEach((item) => {
      const itemRef = db.collection('items').doc(item.id);
      batch.set(itemRef, item);
    });

    await batch.commit();
    console.log('All item data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading item data:', error);
  }
};

uploaditems();
