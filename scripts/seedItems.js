const fs = require('fs');
const path = require('path');
const admin = require('./firebaseAdmin');
const { config, deriveItemEconomy, normalizeEconomy } = require('../functions-admin/economy');

const run = async () => {
  const directory = path.resolve(__dirname, '..', 'src', 'dataSets', 'items');
  const files = fs.readdirSync(directory).filter((name) => name.endsWith('.json')).sort();
  const items = files.flatMap((file) => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')));
  const db = admin.firestore();
  for (let start = 0; start < items.length; start += 400) {
    const batch = db.batch();
    items.slice(start, start + 400).forEach((item) => batch.set(db.collection('items').doc(item.name), {
      ...item,
      ...deriveItemEconomy(item),
      economyVersion: config.version,
    }, { merge: true }));
    await batch.commit();
  }
  const users = await db.collection('users').get();
  let migratedCurrency = 0;
  for (const user of users.docs) {
    const data = user.data();
    const inventory = Array.isArray(data.inventory) ? data.inventory : [];
    let nuggetQuantity = 0;
    const retained = [];
    inventory.forEach((entry) => {
      const itemName = entry.reference?.id || String(entry.reference?.path || '').split('/').pop();
      if (itemName === 'Gold Coin' || itemName === 'Gold Nugget') nuggetQuantity += Math.max(0, Math.floor(Number(entry.quantity || 0)));
      else retained.push(entry);
    });
    if (nuggetQuantity) retained.push({ reference: db.collection('items').doc('Gold Nugget'), quantity: nuggetQuantity });
    const hadCoins = inventory.some((entry) => (entry.reference?.id || '').toLowerCase() === 'gold coin');
    await user.ref.set({ economy: normalizeEconomy(data.economy), ...(hadCoins ? { inventory: retained } : {}) }, { merge: true });
    if (hadCoins) {
      migratedCurrency += 1;
      await db.collection('economyTransactions').add({
        kind: 'currency-migration', playerId: user.id, playerName: data.displayName || data.email || user.id,
        itemId: 'Gold Nugget', itemName: 'Gold Nugget', quantity: nuggetQuantity, favorDelta: 0,
        note: 'Legacy Gold Coins were reclassified one-for-one as raw Gold Nuggets. No currency value was preserved.',
        createdAt: admin.firestore.FieldValue.serverTimestamp(), createdAtMs: Date.now(),
      });
    }
  }
  await db.collection('items').doc('Gold Coin').delete();
  console.log(`Seeded ${items.length} validated items from ${files.length} catalogs; initialized ${users.size} player economies; migrated ${migratedCurrency} coin inventories.`);
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
