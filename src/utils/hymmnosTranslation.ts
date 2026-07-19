import { PublicLexiconEntry, UnlockedLexiconEntry } from '../types/Campaign';
import { createHymmnosLexiconLookup, hymmnosTokens, resolveHymmnosToken } from './hymmnosLexiconLookup';

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
  const lookup = createHymmnosLexiconLookup(publicLexicon);
  const words = hymmnosTokens(hymmnos);
  let revealed = 0;
  let total = 0;
  const translated = words.map((word) => {
    const { entry, visibleWord } = resolveHymmnosToken(word, lookup);
    if (!entry && /^[A-Z][a-z]+$/.test(visibleWord)) return visibleWord;
    total += 1;
    const unlocked = entry ? unlockedLexicon.get(entry.id) : undefined;
    if (!unlocked?.meaning) return '•••';
    revealed += 1;
    return unlocked.meaning;
  });
  return { text: translated.join(' ') || '•••', revealed, total };
};
