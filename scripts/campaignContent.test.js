const { test } = require('node:test');
const assert = require('node:assert/strict');
const { auditCampaignContent, loadMaps, loadNPCs } = require('./auditCampaignContent');

const maps = loadMaps();

test('map coordinates accept comma lists, SVG pairs, and mixed whitespace', () => {
  for (const input of ['0,0,10,0,10,10', '0,0 10,0 10,10', ' 0,0\n10,0\t10,10 ']) {
    // Convert cross-context arrays to ordinary arrays for strict comparison.
    assert.deepEqual(JSON.parse(JSON.stringify(maps.parseCoordsToPolygon(input))), [[0, 0], [10, 0], [10, 10]]);
  }
});

test('invalid geometry is rejected rather than producing NaN coordinates', () => {
  for (const input of ['', '0,0 1,1', '0,0 10,0 10', '0,0 nope,0 10,10', '0,0 Infinity,0 10,10']) {
    assert.throws(() => maps.parseCoordsToPolygon(input), /finite coordinate pairs/);
  }
});

test('the authored NPCs, map polygons, and workplace links are coherent', () => {
  const result = auditCampaignContent(loadNPCs(), maps.mapData);
  assert.deepEqual(result.errors, []);
  assert.ok(result.stats.npcs > 0);
  assert.ok(result.stats.linkedLocations > 0);
});

test('duplicate NPCs and broken workplace links cannot silently pass the audit', () => {
  const entry = { name: 'Test resident', source: 'fixture', npc: {
    id: 'resident', basicInfo: { name: 'Test resident', family: [] },
    categories: { families: [], workplace: ['The Clinic'], faction: [] },
    lore: { history: { title: 'History', level1: 'Known history.', unlockedtier: 1 } },
  } };
  const fixtureMaps = [{ id: 'town', name: 'Town', floors: [{ id: 'floor', name: 'Floor', areas: [{
    id: 'area', name: 'Area', polygon: [[0, 0], [10, 0], [10, 10]], regions: [{
      id: 'building', name: 'Building', polygon: [[0, 0], [1, 0], [1, 1]], npcWorkplace: 'Missing workplace',
    }],
  }] }] }];
  const result = auditCampaignContent([entry, entry], fixtureMaps);
  assert.ok(result.errors.some(error => error.includes('duplicate NPC ID')));
  assert.ok(result.errors.some(error => error.includes('duplicate display name')));
  assert.ok(result.errors.some(error => error.includes('does not exist')));
});

test('missing portraits warn without blocking otherwise usable campaign content', () => {
  const entries = loadNPCs();
  const result = auditCampaignContent(entries, maps.mapData);
  assert.ok(result.warnings.some(warning => warning.includes('fallback URLs are placeholders')));
  assert.deepEqual(result.errors, []);
});
