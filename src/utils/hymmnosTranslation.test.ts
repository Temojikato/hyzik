import { buildProgressiveTranslation } from './hymmnosTranslation';
import { PublicLexiconEntry, UnlockedLexiconEntry } from '../types/Campaign';

const entries: PublicLexiconEntry[] = [
  { id: 'fayra', headword: 'fayra', pronunciation: 'faira', partOfSpeech: 'n.', dialect: 'Central', cypherId: 'cypher-22' },
  { id: 'khal', headword: 'khal', pronunciation: 'karu', partOfSpeech: 'v.', dialect: 'Central', cypherId: 'cypher-33' },
];

test('a song translation reveals nothing when no Cyphers are unlocked', () => {
  expect(buildProgressiveTranslation('fayra khal', entries, new Map()).text).toBe('••• •••');
});

test('a song translation reveals only entries supplied by unlocked Cyphers', () => {
  const unlocked = new Map<string, UnlockedLexiconEntry>([
    ['fayra', { ...entries[0], meaning: 'Fire' }],
  ]);
  expect(buildProgressiveTranslation('fayra khal unknown', entries, unlocked)).toEqual({ text: 'Fire ••• •••', revealed: 1, total: 3 });
});
