const fs = require('fs');
const path = require('path');
const admin = require('./firebaseAdmin');

const run = async () => {
  const directory = path.resolve(__dirname, '..', 'src', 'dataSets', 'items');
  const files = fs.readdirSync(directory).filter((name) => name.endsWith('.json')).sort();
  const items = files.flatMap((file) => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')));
  const db = admin.firestore();
  for (let start = 0; start < items.length; start += 400) {
    const batch = db.batch();
    items.slice(start, start + 400).forEach((item) => batch.set(db.collection('items').doc(item.name), item, { merge: true }));
    await batch.commit();
  }
  console.log(`Seeded ${items.length} validated items from ${files.length} catalogs.`);
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
