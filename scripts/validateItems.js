const fs = require('fs');
const path = require('path');

const directory = path.resolve(__dirname, '..', 'src', 'dataSets', 'items');
const files = fs.readdirSync(directory).filter((name) => name.endsWith('.json')).sort();
const rows = files.flatMap((file) => {
  const data = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'));
  if (!Array.isArray(data)) throw new Error(`${file} must contain an array.`);
  return data.map((item) => ({ ...item, _file: file }));
});
const byName = new Map();
const byId = new Map();
const errors = [];
for (const item of rows) {
  if (!item.id || !item.name || !item.description || !item.category || !Array.isArray(item.recipe)) errors.push(`${item._file}: invalid schema for ${item.name || item.id || 'unknown item'}`);
  if (byName.has(item.name)) errors.push(`Duplicate item name: ${item.name} (${byName.get(item.name)._file}, ${item._file})`);
  else byName.set(item.name, item);
  if (byId.has(item.id)) errors.push(`Duplicate item id: ${item.id} (${byId.get(item.id)._file}, ${item._file})`);
  else byId.set(item.id, item);
}
const missing = new Map();
for (const item of rows) {
  for (const ingredient of item.recipe) {
    const name = typeof ingredient === 'string' ? ingredient : ingredient?.itemId;
    if (name && !byName.has(name) && !byId.has(name)) {
      if (!missing.has(name)) missing.set(name, []);
      missing.get(name).push(item.name);
    }
  }
}
const visit = (name, pathNames = []) => {
  if (pathNames.includes(name)) { errors.push(`Circular recipe: ${[...pathNames, name].join(' -> ')}`); return; }
  const item = byName.get(name) || byId.get(name);
  if (!item) return;
  item.recipe.forEach((ingredient) => visit(typeof ingredient === 'string' ? ingredient : ingredient.itemId, [...pathNames, name]));
};
rows.forEach((item) => visit(item.name));

console.log(`Validated ${rows.length} items across ${files.length} catalogs.`);
if (missing.size) {
  console.log(`Missing recipe ingredients (${missing.size}):`);
  for (const [name, consumers] of [...missing].sort(([a], [b]) => a.localeCompare(b))) console.log(`- ${name}: ${consumers.slice(0, 6).join(', ')}${consumers.length > 6 ? '…' : ''}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else if (missing.size) {
  process.exitCode = 2;
} else {
  console.log('All recipes resolve to known items; no duplicate names or cycles found.');
}
