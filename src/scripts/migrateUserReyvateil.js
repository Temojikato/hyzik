// migrateUserReyvateils.js

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Update the path

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const migrateUserReyvateils = async () => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const batch = db.batch();

    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      if (userData.reyvateil) {
        const reyvateilId = userData.reyvateil.id;
        const reyvateilLevel = userData.reyvateil.level || 1; // Default to level 1 if not present

        // Update user document
        batch.update(userDoc.ref, {
          reyvateilId,
          reyvateilLevel,
        });

        // Optionally, remove the embedded Reyvateil object
        batch.update(userDoc.ref, {
          reyvateil: admin.firestore.FieldValue.delete(),
        });
      }
    });

    await batch.commit();
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

migrateUserReyvateils();
