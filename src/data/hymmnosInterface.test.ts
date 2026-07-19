import publicLexiconJson from '../generated/hymmnosPublicIndex.json';
import { PublicLexiconEntry } from '../types/Campaign';
import { UI_HYMMNOS, classHymmnosPhrase, combatIdentityPhrase, descriptionHymmnosPhrase } from './hymmnosInterface';

const entries = publicLexiconJson as PublicLexiconEntry[];
const words = new Set(entries.map((entry) => entry.headword.toLowerCase()));
const assertRegistered = (phrase: string) => (phrase.match(/[A-Za-z][A-Za-z0-9.'-]*/g) || [])
  .filter((word) => !/^[A-Z][a-z]+$/.test(word))
  .forEach((word) => expect(words.has(word.toLowerCase())).toBe(true));

test('every fixed interface label uses registered Hymmnos vocabulary', () => {
  Object.values(UI_HYMMNOS).forEach((phrase) => assertRegistered(phrase.hymmnos));
});

test('generated class, description, and combat identity phrases stay in the lexicon', () => {
  ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer', 'Blood Hunter']
    .forEach((value) => assertRegistered(classHymmnosPhrase(value).hymmnos));
  assertRegistered(descriptionHymmnosPhrase('Sturdy, gear-laden wings with intricate mechanical designs.').hymmnos);
  assertRegistered(combatIdentityPhrase('Malfunction Artillerist', 'metal', 'striker').hymmnos);
});
