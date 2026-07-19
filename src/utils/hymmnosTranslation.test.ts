import { buildProgressiveTranslation } from './hymmnosTranslation';
import { PublicLexiconEntry, UnlockedLexiconEntry } from '../types/Campaign';

const entries: PublicLexiconEntry[] = [
  { id: 'fayra', headword: 'fayra', pronunciation: 'faira', partOfSpeech: 'n.', dialect: 'Central', cypherId: 'cypher-22' },
  { id: 'khal', headword: 'khal', pronunciation: 'karu', partOfSpeech: 'v.', dialect: 'Central', cypherId: 'cypher-33' },
  { id: 'dia-command', headword: 'DIA', pronunciation: 'dia', partOfSpeech: 'Com.', dialect: '-', cypherId: 'cypher-40' },
  { id: 'dia-noun', headword: 'dia', pronunciation: 'dia', partOfSpeech: 'n.', dialect: 'Central', cypherId: 'cypher-02' },
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

test('lookup respects meaningful case and sentence punctuation', () => {
  const unlocked = new Map<string, UnlockedLexiconEntry>([
    ['fayra', { ...entries[0], meaning: 'Fire' }],
    ['dia-command', { ...entries[2], meaning: 'Input (dialog)' }],
    ['dia-noun', { ...entries[3], meaning: 'King, throne, ruler' }],
  ]);
  expect(buildProgressiveTranslation('DIA dia fayra.', entries, unlocked)).toEqual({
    text: 'Input (dialog) King, throne, ruler Fire',
    revealed: 3,
    total: 3,
  });
});

test('registered proper names remain visible without pretending to be vocabulary', () => {
  expect(buildProgressiveTranslation('Venestria.', entries, new Map())).toEqual({ text: 'Venestria', revealed: 0, total: 0 });
});
