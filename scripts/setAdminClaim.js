/* Usage: node scripts/setAdminClaim.js --email you@example.com */
const admin = require('./firebaseAdmin');

const readArg = (name) => {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

const run = async () => {
  const email = readArg('email');
  const uid = readArg('uid');
  if (!email && !uid) throw new Error('Pass --email <address> or --uid <Firebase UID>.');
  const user = email ? await admin.auth().getUserByEmail(email) : await admin.auth().getUser(uid);
  await admin.auth().setCustomUserClaims(user.uid, { ...(user.customClaims || {}), admin: true });
  await admin.firestore().collection('users').doc(user.uid).set({ adminEnabledAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  console.log(`Admin access granted to ${user.email || user.uid}. Sign out and back in to refresh the claim.`);
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
