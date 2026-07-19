/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { listDocuments, updateDocuments } = require('./firebaseCliFirestore');
const { assignCypherId } = require('./hymmnosCypherAssignment');

if (process.env.HYZIK_USE_FIREBASE_CLI !== 'true') {
  throw new Error('Set HYZIK_USE_FIREBASE_CLI=true to acknowledge the live Firestore migration.');
}

const root = path.resolve(__dirname, '..');
const source = JSON.parse(fs.readFileSync(path.join(root, 'campaign files', '_reference', 'HYMMNOS_LEXICON_INDEX.json'), 'utf8')).entries;
const publicEntries = JSON.parse(fs.readFileSync(path.join(root, 'src', 'generated', 'hymmnosPublicIndex.json'), 'utf8'));
const starterCyphers = ['cypher-01', 'cypher-02', 'cypher-03', 'cypher-38'];

const run = async () => {
  if (source.length !== publicEntries.length) throw new Error('Source and public lexicon lengths differ. Run npm run content:build first.');

  await updateDocuments('hymmnosLexicon', publicEntries.map((entry, index) => ({
    id: entry.id,
    data: { cypherId: assignCypherId(source[index]) },
  })));

  const users = await listDocuments('users');
  await updateDocuments('users', users.map((user) => ({
    id: user.id,
    data: { unlockedCyphers: [...new Set([...(user.unlockedCyphers || []), ...starterCyphers])] },
  })));

  await updateDocuments('cyphers', starterCyphers.map((id) => ({ id, data: { starter: true } })));
  console.log(`Migrated ${publicEntries.length} Hymmnos entries and granted ${starterCyphers.length} starter Cyphers to ${users.length} players.`);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
