import { CYPHERS } from './data/cyphers';

test('ships forty-eight uniquely addressable Cyphers', () => {
  expect(CYPHERS).toHaveLength(48);
  expect(new Set(CYPHERS.map((cypher) => cypher.id)).size).toBe(48);
});
