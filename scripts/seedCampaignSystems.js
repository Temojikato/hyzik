const fs = require('fs');
const path = require('path');
const admin = require('./firebaseAdmin');

const root = path.resolve(__dirname, '..');
const source = JSON.parse(fs.readFileSync(path.join(root, 'campaign files', '_reference', 'HYMMNOS_LEXICON_INDEX.json'), 'utf8')).entries;
const publicEntries = JSON.parse(fs.readFileSync(path.join(root, 'src', 'generated', 'hymmnosPublicIndex.json'), 'utf8'));
const songs = JSON.parse(fs.readFileSync(path.join(root, 'src', 'generated', 'campaignSongs.json'), 'utf8'));
const { assignCypherId } = require('./hymmnosCypherAssignment');
const cypherTitles = [
  'Address','Being','Self','Other','Negation','Question','Desire','Fear','Joy','Sorrow','Trust','Betrayal',
  'Life','Death','Mind','Soul','Earth','Sky','Water','Fire','Wind','Light','Darkness','Time','Go','Return',
  'Rise','Fall','Join','Sever','Give','Take','Guard','Strike','Heal','Harm','Song','Word','Magic','Machine',
  'Memory','Dream','Truth','Falsehood','Beginning','Ending','Chaos','Hope',
];
const starterCypherIds = new Set(['cypher-01', 'cypher-02', 'cypher-03', 'cypher-38']);

const commitRows = async (rows) => {
  const db = admin.firestore();
  for (let start = 0; start < rows.length; start += 400) {
    const batch = db.batch();
    rows.slice(start, start + 400).forEach(({ ref, data }) => batch.set(ref, data, { merge: true }));
    await batch.commit();
    console.log(`Committed ${Math.min(start + 400, rows.length)}/${rows.length}`);
  }
};

const run = async () => {
  const db = admin.firestore();
  const lexiconRows = publicEntries.map((entry, index) => ({
    ref: db.collection('hymmnosLexicon').doc(entry.id),
    data: {
      ...entry,
      cypherId: assignCypherId(source[index]),
      meaning: source[index].meaning_e,
      notes: source[index].note || '',
      sourceParagraph: source[index].source_paragraph,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  }));
  const domains = ['Foundations', 'Emotion', 'World', 'Motion', 'Conflict', 'Creation'];
  const cypherRows = cypherTitles.map((title, index) => ({
    ref: db.collection('cyphers').doc(`cypher-${String(index + 1).padStart(2, '0')}`),
    data: { number: index + 1, title, domain: domains[Math.floor(index / 8)], description: `Reveals a related family of Hymmnos concepts: ${title.toLowerCase()}.`, starter: starterCypherIds.has(`cypher-${String(index + 1).padStart(2, '0')}`) },
  }));
  const songRows = songs.map((song) => ({ ref: db.collection('songs').doc(song.id), data: song }));
  await commitRows(lexiconRows);
  await commitRows(cypherRows);
  await commitRows(songRows);
  const current = await db.collection('campaign').doc('current').get();
  if (!current.exists && songs[0]) await db.collection('campaign').doc('current').set({ currentSongId: songs[0].id, currentSongTitle: songs[0].title });
  console.log(`Seeded ${lexiconRows.length} protected meanings, ${cypherRows.length} Cyphers, and ${songRows.length} songs.`);
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
