// src/scripts/uploadNPCs.js
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'hyzik-5edfd',  // Use your actual project id here
});

const db = admin.firestore();

// Import all NPC data files
const npcsMarket = require(path.resolve(__dirname, '../dataSets/npcs_market.js'));
const npcsResidential = require(path.resolve(__dirname, '../dataSets/npcs_residential.js'));
const npcsGuild = require(path.resolve(__dirname, '../dataSets/npcs_guild.js'));
const npcsArtisan = require(path.resolve(__dirname, '../dataSets/npcs_artisan.js'));
const npcsCentral = require(path.resolve(__dirname, '../dataSets/npcs_central.js'));
const npcsUtility = require(path.resolve(__dirname, '../dataSets/npcs_utility.js'));
const npcsHealing = require(path.resolve(__dirname, '../dataSets/npcs_healing.js'));
const npcsMisc = require(path.resolve(__dirname, '../dataSets/npcs_misc.js'));
const npcsDivers = require(path.resolve(__dirname, '../dataSets/npcs_divers.js')); // You will create this file

// Merge all NPC data into a single object
const mergedNPCData = {
  ...npcsMarket,
  ...npcsResidential,
  ...npcsGuild,
  ...npcsArtisan,
  ...npcsCentral,
  ...npcsUtility,
  ...npcsHealing,
  ...npcsMisc,
  ...npcsDivers
};

async function uploadNPCs() {
  try {
    // Store the merged NPC data under "residentCodex" collection, document "NPCs"
    const npcDocRef = db.collection('residentCodex').doc('NPCs');
    await npcDocRef.set(mergedNPCData, { merge: true });
    console.log('Successfully uploaded merged NPC data to residentCodex/NPCs!');
  } catch (error) {
    console.error('Error uploading NPC data:', error);
  }
}

uploadNPCs();
