// src/scripts/uploadAllItems.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Path to your service account key file
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'hyzik-5edfd',
});

const db = admin.firestore();

// Directory where your separate JSON files are stored
const directoryPath = path.resolve(__dirname, '../dataSets/items');

// Read all files in the directory ending with .json
const jsonFiles = fs.readdirSync(directoryPath).filter(file => file.endsWith('.json'));

async function uploadItems() {
  try {
    // Loop over each JSON file in the directory
    for (const file of jsonFiles) {
      const filePath = path.join(directoryPath, file);
      console.log(`Reading file: ${filePath}`);
      
      // Read and parse the JSON file (assumed to be an array of items)
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const itemData = JSON.parse(fileContent);
      
      // Loop over each item in the file and upload it
      for (const item of itemData) {
        // Use item.name as the document id; change as needed
        const docRef = db.collection('items').doc(item.name);
        await docRef.set(item, { merge: true });
        console.log(`Uploaded item "${item.name}" from file "${file}" to Firestore.`);
      }
    }
  } catch (error) {
    console.error('Error uploading item data:', error);
  }
}

uploadItems();
