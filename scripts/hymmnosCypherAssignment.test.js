const test = require('node:test');
const assert = require('node:assert/strict');
const { assignCypherId } = require('./hymmnosCypherAssignment');

const entry = (headword, meaning_e) => ({ headword, meaning_e, part_of_speech: 'n.' });

test('semantic Cyphers match the concepts their titles promise', () => {
  assert.equal(assignCypherId(entry('revatail', 'Reyvateil; artificial life form')), 'cypher-02');
  assert.equal(assignCypherId(entry('irs', 'Exist; being')), 'cypher-02');
  assert.equal(assignCypherId(entry('noes', 'Oneself; one’s own')), 'cypher-03');
  assert.equal(assignCypherId(entry('wart', 'Word; language')), 'cypher-38');
  assert.equal(assignCypherId(entry('rinc', 'Connect; join; link')), 'cypher-29');
  assert.equal(assignCypherId(entry('hymmnos', 'Song; hymn; music')), 'cypher-37');
  assert.equal(assignCypherId(entry('x-chaos', 'Chaos; pandemonium')), 'cypher-47');
  assert.equal(assignCypherId(entry('ksyura', 'Destruction, ruin, collapse')), 'cypher-47');
  assert.equal(assignCypherId(entry('tussu', 'Change')), 'cypher-47');
  assert.equal(assignCypherId(entry('x-death', 'Death; mortality')), 'cypher-14');
});

test('unclassified vocabulary cannot leak through starter Cyphers', () => {
  const starterIds = new Set(['cypher-01', 'cypher-02', 'cypher-03', 'cypher-38']);
  for (let index = 0; index < 200; index += 1) {
    assert.equal(starterIds.has(assignCypherId(entry(`unknown-${index}`, `unclassified-${index}`))), false);
  }
});
