import publicLexiconJson from '../generated/hymmnosPublicIndex.json';
import { PublicLexiconEntry } from '../types/Campaign';
import { Ability } from '../types/Reyvateils';

export interface AbilityInvocation {
  id: string;
  headword: string;
  pronunciation: string;
  cypherId: string;
  lexiconEntryId: string;
}

const entries = publicLexiconJson as PublicLexiconEntry[];
const byHeadword = new Map(entries.map((entry) => [entry.headword.toLowerCase(), entry]));

const rules: Array<[RegExp, string]> = [
  [/heal|cure|restore|mend|regenerat|health|reviv/i, 'y.y.'],
  [/protect|shield|guard|armor|barrier|ward|defen/i, 'khal'],
  [/fire|flame|blaze|burn|ember|inferno/i, 'fayra'],
  [/wind|air|gale|storm|flight|fly/i, 'fhyu'],
  [/light|radiant|sun|holy|shine/i, 'fhau'],
  [/dark|shadow|night|void/i, 'dazua'],
  [/bind|chain|link|connect|tether/i, 'rinc'],
  [/craft|create|forge|shape|construct|summon/i, 'gyen'],
  [/heart|mind|thought|emotion|charm|psychic/i, 'eje'],
  [/soul|spirit|ghost/i, 'spheala'],
  [/song|music|voice|melod|reson|sound/i, 'hymmnos'],
  [/magic|spell|arcane|mana/i, 'maya'],
  [/cut|slash|blade|sever/i, 'zethpa'],
  [/give|send|grant/i, 'accrroad'],
  [/trust|believe|faith/i, 'shyfac'],
  [/save|rescue|salvation/i, 'swant'],
];

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const resolveAbilityInvocation = (ability: Ability): AbilityInvocation => {
  if (ability.hymmnos?.headword) {
    const registered = byHeadword.get(ability.hymmnos.headword.toLowerCase());
    return {
      id: ability.id || slug(ability.name),
      headword: ability.hymmnos.headword,
      pronunciation: ability.hymmnos.pronunciation || registered?.pronunciation || ability.hymmnos.headword,
      cypherId: ability.hymmnos.cypherId || registered?.cypherId || 'cypher-37',
      lexiconEntryId: ability.hymmnos.lexiconEntryId || registered?.id || 'hymmnos',
    };
  }
  const haystack = `${ability.name} ${ability.description}`;
  const headword = rules.find(([pattern]) => pattern.test(haystack))?.[1] || 'hymmnos';
  const entry = byHeadword.get(headword.toLowerCase()) || byHeadword.get('hymmnos');
  if (!entry) throw new Error('Canonical Hymmnos index is missing the hymmnos entry.');
  return { id: ability.id || slug(ability.name), headword: entry.headword, pronunciation: entry.pronunciation, cypherId: entry.cypherId, lexiconEntryId: entry.id };
};
