const test = require('node:test');
const assert = require('node:assert/strict');
const source = require('../campaign files/_reference/HYMMNOS_LEXICON_INDEX.json').entries;
const songs = require('../src/generated/campaignSongs.json');

test('wa is the single canonical Emotion Sound III entry, not a parsed lyric line', () => {
  const entries = source.filter((entry) => entry.headword === 'wa');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].part_of_speech, 'E.S. III');
  assert.equal(entries[0].meaning_e, "It doesn't matter—I will accept things the way they are now");
  assert.equal(source.filter((entry) => entry.part_of_speech === 'E.S. III').length, 1);
});

test('case-sensitive command tokens do not collide with lowercase nouns', () => {
  const floorFour = songs.find((song) => song.id === 'floor_04_the_song_is_executable');
  const command = floorFour?.lines.find((line) => line.hymmnos === 'DIA hynne.');
  assert.ok(command);
  assert.deepEqual(command.tokenIds, ['dia', 'hynne']);
  const meanings = source.filter((entry) => entry.headword === 'DIA' || entry.headword === 'dia');
  assert.deepEqual(meanings.map((entry) => [entry.headword, entry.meaning_e]), [
    ['DIA', 'Input (dialog)'],
    ['dia', 'King, throne, ruler'],
  ]);
});
