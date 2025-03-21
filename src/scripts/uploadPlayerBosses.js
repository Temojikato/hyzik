const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'hyzik-5edfd',
});

const db = admin.firestore();
const playerBossesData = require(path.resolve(__dirname, '../dataSets/player_bosses.js'));

async function uploadPlayerBosses() {
  try {
    for (const bossName in playerBossesData) {
      if (Object.prototype.hasOwnProperty.call(playerBossesData, bossName)) {
        const docId = bossName.trim().toLowerCase().replace(/\s+/g, '-');
        const bossDocRef = db.collection('playerBosses').doc(docId);
        await bossDocRef.set(playerBossesData[bossName], { merge: true });
        console.log(`Successfully uploaded "${bossName}" to playerBosses/${docId}`);
      }
    }
  } catch (error) {
    console.error('Error uploading player boss data:', error);
  }
}

uploadPlayerBosses();
