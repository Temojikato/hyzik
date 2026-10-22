const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function loadMaps() {
  // Use the project's compiler so this command also works on Node without native TS support.
  const ts = require('typescript');
  const filename = path.join(root, 'src/mapdata.ts');
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, { module, exports: module.exports }, { filename });
  return module.exports;
}

function loadNPCs() {
  const directory = path.join(root, 'src/dataSets');
  return fs.readdirSync(directory).filter(file => /^npcs_.*\.js$/.test(file)).sort()
    .flatMap(file => Object.entries(require(path.join(directory, file)))
      .map(([name, npc]) => ({ name, npc, source: file })));
}

function auditCampaignContent(entries, maps) {
  const errors = [];
  const warnings = [];
  const ids = new Set();
  const names = new Set();
  const workplaces = new Set();
  let portraitFiles = 0;
  let placeholderUrls = 0;
  for (const { name, npc, source } of entries) {
    const label = `${source}/${name}`;
    if (!npc.id || ids.has(npc.id)) errors.push(`${label}: missing or duplicate NPC ID ${npc.id || '(empty)'}.`);
    ids.add(npc.id);
    if (!npc.basicInfo?.name || names.has(npc.basicInfo.name)) errors.push(`${label}: missing or duplicate display name.`);
    names.add(npc.basicInfo?.name);
    if (!Array.isArray(npc.basicInfo?.family)) errors.push(`${label}: family must be a list.`);
    for (const category of ['families', 'workplace', 'faction']) {
      if (npc.categories?.[category] !== undefined && !Array.isArray(npc.categories[category])) {
        errors.push(`${label}: ${category} category must be a list when provided.`);
      }
    }
    for (const workplace of npc.categories?.workplace || []) workplaces.add(workplace);
    if (!npc.lore || !Object.keys(npc.lore).length) warnings.push(`${label}: no authored lore.`);
    for (const [field, lore] of Object.entries(npc.lore || {})) {
      const levels = Object.keys(lore).filter(key => /^level\d+$/.test(key)).map(key => Number(key.slice(5)));
      if (!lore.title || !levels.length) errors.push(`${label}/${field}: missing title or lore levels.`);
      if (!Number.isInteger(lore.unlockedtier) || lore.unlockedtier < 0 || lore.unlockedtier > Math.max(...levels)) {
        errors.push(`${label}/${field}: invalid unlocked tier.`);
      }
    }
    if (/example\.com|via\.placeholder\.com|placehold\.co/i.test(npc.imageUrl || '')) placeholderUrls += 1;
    if (!npc.imageFiles?.length) warnings.push(`${label}: no named portrait files; uses fallback art.`);
    for (const image of npc.imageFiles || []) {
      portraitFiles += 1;
      if (!image.filename?.trim()) errors.push(`${label}: empty portrait filename.`);
    }
  }
  if (placeholderUrls) warnings.push(`${placeholderUrls} NPC fallback URLs are placeholders; named Firebase portrait files still need a live asset check.`);

  const linkedWorkplaces = new Set();
  const unlinkedLocations = [];
  const mapIds = new Set();
  let floors = 0;
  let areas = 0;
  let regions = 0;
  let linkedLocations = 0;
  function checkId(id, label) {
    if (!id || mapIds.has(id)) errors.push(`${label}: missing or duplicate map ID.`);
    mapIds.add(id);
  }
  for (const category of maps) {
    checkId(category.id, category.name);
    for (const floor of category.floors) {
      floors += 1;
      checkId(floor.id, floor.name);
      for (const area of floor.areas) {
        areas += 1;
        regions += area.regions.length;
        for (const location of [area, ...area.regions]) {
          const label = `${floor.name}/${location.name}`;
          checkId(location.id, label);
          const polygon = location.polygon;
          if (!Array.isArray(polygon) || polygon.length < 3 ||
            polygon.some(point => !Array.isArray(point) || point.length !== 2 || point.some(value => !Number.isFinite(value)))) {
            errors.push(`${label}: polygon needs at least three finite coordinate pairs.`);
          } else if (new Set(polygon.map(point => point[0])).size < 2 || new Set(polygon.map(point => point[1])).size < 2) {
            errors.push(`${label}: polygon has no width or height.`);
          }
          if (location.npcWorkplace) {
            linkedLocations += 1;
            if (!workplaces.has(location.npcWorkplace)) errors.push(`${label}: NPC workplace "${location.npcWorkplace}" does not exist.`);
            linkedWorkplaces.add(location.npcWorkplace);
          } else if (category.id === 'town' && location !== area) {
            unlinkedLocations.push(`${location.name} (${location.id})`);
          }
        }
      }
    }
  }
  const unmappedWorkplaces = [...workplaces].filter(workplace => !linkedWorkplaces.has(workplace)).sort();
  return {
    errors, warnings, unlinkedLocations, unmappedWorkplaces,
    stats: { npcs: entries.length, portraitFiles, placeholderUrls, floors, areas, regions, linkedLocations },
  };
}

function formatReport(result, entries) {
  const { stats } = result;
  const sources = [...new Set(entries.map(entry => entry.source))];
  return [
    '# Campaign content audit', '',
    'Regenerate with `npm run audit:campaign -- --report`. This checks repository content, not the deployed app or Firebase assets.', '',
    '| Content | Count |', '| --- | ---: |',
    `| NPCs | ${stats.npcs} |`, `| Named portrait files | ${stats.portraitFiles} |`,
    `| Placeholder fallback URLs | ${stats.placeholderUrls} |`,
    `| Map floors | ${stats.floors} |`, `| Map areas | ${stats.areas} |`,
    `| Map regions | ${stats.regions} |`, `| Locations linked to NPC workplaces | ${stats.linkedLocations} |`, '',
    '## NPC datasets', '',
    ...sources.map(source => `- ${source}: ${entries.filter(entry => entry.source === source).length} NPCs`), '',
    '## Validation errors', '', ...(result.errors.length ? result.errors.map(error => `- ${error}`) : ['None.']), '',
    '## Warnings', '', ...(result.warnings.length ? result.warnings.map(warning => `- ${warning}`) : ['None.']), '',
    '## Town locations without authored resident links', '',
    ...result.unlinkedLocations.map(name => `- ${name}`), '',
    'These locations have no confirmed workplace mapping; do not invent residents to fill them.', '',
    '## NPC workplaces without a map link', '',
    ...result.unmappedWorkplaces.map(name => `- ${name}`), '',
    'A workplace can be unmapped intentionally (for example, a roaming Diver). Review these against campaign notes.', '',
    '## Remaining campaign work', '',
    '- Verify named NPC portrait files and floor images in Firebase; placeholder fallback URLs do not prove the primary portraits are missing.',
    '- Review NPC lore and discovery tiers with the DM; structural validation does not establish narrative completeness.',
    '- Exploration maps currently cover the Town and Tower Floor 1. Further floors still need authored geometry and content.',
    '- Only two town buildings currently have authored image galleries.',
    '- Review unique monster profiles, including the Avatar of Greed and Patience, then playtest first-session encounters.',
    '- Verify the deployed branch, seeded data, and a complete player/DM session before calling these systems ready.', '',
  ].join('\n');
}

if (require.main === module) {
  const entries = loadNPCs();
  const result = auditCampaignContent(entries, loadMaps().mapData);
  console.log(JSON.stringify(result.stats, null, 2));
  for (const warning of result.warnings) console.warn('Warning:', warning);
  for (const error of result.errors) console.error('Error:', error);
  if (process.argv.includes('--report')) {
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs/CAMPAIGN_CONTENT_AUDIT.md'), formatReport(result, entries));
    console.log('Wrote docs/CAMPAIGN_CONTENT_AUDIT.md');
  }
  if (result.errors.length) process.exitCode = 1;
  else console.log('NPC and map content checks passed.');
}

module.exports = { auditCampaignContent, loadMaps, loadNPCs, formatReport };
