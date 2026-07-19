const catalog = require('./bestiaryCatalog');

const run = async () => {
  const useFirebaseCli = process.env.HYZIK_USE_FIREBASE_CLI === 'true';
  const admin = useFirebaseCli ? null : require('./firebaseAdmin');
  const db = admin?.firestore();
  const rest = useFirebaseCli ? require('./firebaseCliFirestore') : null;
  if (useFirebaseCli) console.warn('Using the current Firebase CLI session without copying its token into the project.');
  for (const [categoryId, data] of Object.entries(catalog)) {
    if (categoryId === 'descriptions') continue;
    if (rest) await rest.mergeDocument('bestiary', categoryId, data);
    else await db.collection('bestiary').doc(categoryId).set(data, { merge: true });
    const speciesCount = Object.keys(data).filter((key) => key !== 'description').length;
    console.log(`Seeded bestiary/${categoryId}: ${speciesCount} species.`);
  }
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
