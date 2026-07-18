import { PublicLexiconEntry, UnlockedLexiconEntry } from '../types/Campaign';

export interface ProgressiveTranslation {
  text: string;
  revealed: number;
  total: number;
}

export const buildProgressiveTranslation = (
  hymmnos: string,
  publicLexicon: PublicLexiconEntry[],
  unlockedLexicon: ReadonlyMap<string, UnlockedLexiconEntry>,
): ProgressiveTranslation => {
  const lookup = new Map<string, PublicLexiconEntry>();
  publicLexicon.forEach((entry) => {
    const key = entry.headword.toLowerCase();
    if (!lookup.has(key)) lookup.set(key, entry);
  });
  const words = hymmnos.match(/[A-Za-z][A-Za-z0-9.'-]*/g) || [];
  let revealed = 0;
  const translated = words.map((word) => {
    const entry = lookup.get(word.toLowerCase());
    const unlocked = entry ? unlockedLexicon.get(entry.id) : undefined;
    if (!unlocked?.meaning) return '•••';
    revealed += 1;
    return unlocked.meaning;
  });
  return { text: translated.join(' ') || '•••', revealed, total: words.length };
};
