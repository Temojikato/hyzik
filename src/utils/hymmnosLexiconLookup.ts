import { PublicLexiconEntry } from '../types/Campaign';

export interface HymmnosLexiconLookup {
  exact: ReadonlyMap<string, PublicLexiconEntry>;
  folded: ReadonlyMap<string, PublicLexiconEntry[]>;
}

export interface ResolvedHymmnosToken {
  entry?: PublicLexiconEntry;
  visibleWord: string;
  trailingPunctuation: string;
}

export const hymmnosTokens = (text: string) => text.match(/[A-Za-z][A-Za-z0-9.'-]*/g) || [];

export const createHymmnosLexiconLookup = (entries: PublicLexiconEntry[]): HymmnosLexiconLookup => {
  const exact = new Map<string, PublicLexiconEntry>();
  const folded = new Map<string, PublicLexiconEntry[]>();
  entries.forEach((entry) => {
    if (!exact.has(entry.headword)) exact.set(entry.headword, entry);
    const key = entry.headword.toLowerCase();
    folded.set(key, [...(folded.get(key) || []), entry]);
  });
  return { exact, folded };
};

export const resolveHymmnosToken = (token: string, lookup: HymmnosLexiconLookup): ResolvedHymmnosToken => {
  const candidates: Array<{ word: string; punctuation: string }> = [{ word: token, punctuation: '' }];
  let word = token;
  let punctuation = '';
  while (/[.,!?;:]$/.test(word)) {
    punctuation = `${word.slice(-1)}${punctuation}`;
    word = word.slice(0, -1);
    candidates.push({ word, punctuation });
  }

  for (const candidate of candidates) {
    const entry = lookup.exact.get(candidate.word);
    if (entry) return { entry, visibleWord: candidate.word, trailingPunctuation: candidate.punctuation };
  }
  for (const candidate of candidates) {
    const entries = lookup.folded.get(candidate.word.toLowerCase()) || [];
    if (entries.length === 1) return { entry: entries[0], visibleWord: candidate.word, trailingPunctuation: candidate.punctuation };
  }
  return { visibleWord: candidates[candidates.length - 1]?.word || token, trailingPunctuation: candidates[candidates.length - 1]?.punctuation || '' };
};
