const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const getCredential = () => {
  const configured = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const legacy = path.resolve(__dirname, '..', 'src', 'serviceAccountKey.json');
  if (process.env.HYZIK_USE_APPLICATION_DEFAULT === 'true') {
    console.warn('Using Google application-default credentials.');
    return admin.credential.applicationDefault();
  }
  const credentialPath = configured ? path.resolve(configured) : legacy;
  if (!fs.existsSync(credentialPath)) {
    throw new Error('Set GOOGLE_APPLICATION_CREDENTIALS to a Firebase service-account JSON file.');
  }
  if (!configured) console.warn('Using the legacy local service-account path. Move it outside src and set GOOGLE_APPLICATION_CREDENTIALS.');
  return admin.credential.cert(JSON.parse(fs.readFileSync(credentialPath, 'utf8')));
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: getCredential(),
    projectId: 'hyzik-5edfd',
    storageBucket: 'hyzik-5edfd.appspot.com',
  });
}

module.exports = admin;
