const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const getCredential = () => {
  const configured = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (process.env.HYZIK_USE_APPLICATION_DEFAULT === 'true') {
    console.warn('Using Google application-default credentials.');
    return admin.credential.applicationDefault();
  }
  if (!configured) {
    throw new Error('Set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON outside the repository, or set HYZIK_USE_APPLICATION_DEFAULT=true.');
  }
  const credentialPath = path.resolve(configured);
  if (!fs.existsSync(credentialPath)) {
    throw new Error('Set GOOGLE_APPLICATION_CREDENTIALS to a Firebase service-account JSON file.');
  }
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
