const fs = require('fs');
const path = require('path');

const projectId = 'hyzik-5edfd';
const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
const databaseName = `projects/${projectId}/databases/(default)`;

const getCliAccessToken = async () => {
  const cliAuthPath = path.join(path.dirname(process.execPath), 'node_modules', 'firebase-tools', 'lib', 'auth.js');
  if (!fs.existsSync(cliAuthPath)) throw new Error('Firebase CLI auth module was not found beside the Node installation.');
  const cliAuth = require(cliAuthPath);
  const account = cliAuth.getGlobalDefaultAccount();
  const refreshToken = account?.tokens?.refresh_token;
  if (!refreshToken) throw new Error('Firebase CLI has no refresh token. Run firebase login --reauth.');
  return (await cliAuth.getAccessToken(refreshToken, [])).access_token;
};

const encodeValue = (value) => {
  if (value === null) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (value && typeof value === 'object') return { mapValue: { fields: encodeFields(value) } };
  throw new Error(`Cannot encode Firestore value of type ${typeof value}.`);
};

const encodeFields = (object) => Object.fromEntries(Object.entries(object)
  .filter(([, value]) => value !== undefined)
  .map(([key, value]) => [key, encodeValue(value)]));

const decodeValue = (value) => {
  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('timestampValue' in value) return value.timestampValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeValue);
  if ('mapValue' in value) return decodeFields(value.mapValue.fields || {});
  return undefined;
};

const decodeFields = (fields) => Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));

const request = async (url, options = {}) => {
  const token = await getCliAccessToken();
  const response = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) {
    const detail = await response.text();
    const error = new Error(`Firestore REST ${response.status}: ${detail}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const mergeDocument = async (collectionId, documentId, data) => {
  const url = `${baseUrl}/${encodeURIComponent(collectionId)}/${encodeURIComponent(documentId)}`;
  let existing = {};
  try {
    const document = await request(url);
    existing = decodeFields(document.fields || {});
  } catch (error) {
    if (error.status !== 404) throw error;
  }
  const merged = { ...existing, ...data };
  return request(url, { method: 'PATCH', body: JSON.stringify({ fields: encodeFields(merged) }) });
};

const listDocuments = async (collectionId) => {
  const documents = [];
  let pageToken = '';
  do {
    const url = new URL(`${baseUrl}/${encodeURIComponent(collectionId)}`);
    url.searchParams.set('pageSize', '300');
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const page = await request(url.toString());
    (page.documents || []).forEach((document) => documents.push({
      id: document.name.split('/').pop(),
      ...decodeFields(document.fields || {}),
    }));
    pageToken = page.nextPageToken || '';
  } while (pageToken);
  return documents;
};

const updateDocuments = async (collectionId, rows) => {
  for (let start = 0; start < rows.length; start += 400) {
    const page = rows.slice(start, start + 400);
    const writes = page.map(({ id, data }) => ({
      update: {
        name: `${databaseName}/documents/${collectionId}/${id}`,
        fields: encodeFields(data),
      },
      updateMask: { fieldPaths: Object.keys(data).filter((key) => data[key] !== undefined) },
    }));
    const result = await request(`https://firestore.googleapis.com/v1/${databaseName}/documents:batchWrite`, {
      method: 'POST',
      body: JSON.stringify({ writes }),
    });
    const failed = (result.status || []).find((status) => Number(status.code || 0) !== 0);
    if (failed) throw new Error(`Firestore batch write failed: ${failed.message || `status ${failed.code}`}`);
    console.log(`Updated ${Math.min(start + 400, rows.length)}/${rows.length} ${collectionId} documents.`);
  }
};

module.exports = { mergeDocument, listDocuments, updateDocuments };
