import { CypherDefinition } from '../types/Campaign';

const domains = [
  ['Foundations', '#8B7CF6'],
  ['Emotion', '#C779D0'],
  ['World', '#45B7A8'],
  ['Motion', '#4B9FE1'],
  ['Conflict', '#E36A7C'],
  ['Creation', '#D9A441'],
] as const;

const titles = [
  'Address', 'Being', 'Self', 'Other', 'Negation', 'Question', 'Desire', 'Fear',
  'Joy', 'Sorrow', 'Trust', 'Betrayal', 'Life', 'Death', 'Mind', 'Soul',
  'Earth', 'Sky', 'Water', 'Fire', 'Wind', 'Light', 'Darkness', 'Time',
  'Go', 'Return', 'Rise', 'Fall', 'Join', 'Sever', 'Give', 'Take',
  'Guard', 'Strike', 'Heal', 'Harm', 'Song', 'Word', 'Magic', 'Machine',
  'Memory', 'Dream', 'Truth', 'Falsehood', 'Beginning', 'Ending', 'Chaos', 'Hope',
];

export const CYPHERS: CypherDefinition[] = titles.map((title, index) => {
  const domain = domains[Math.floor(index / 8)];
  return {
    id: `cypher-${String(index + 1).padStart(2, '0')}`,
    number: index + 1,
    title,
    domain: domain[0],
    color: domain[1],
    description: `Reveals a related family of Hymmnos concepts: ${title.toLowerCase()}.`,
  };
});

export const cypherForIndex = (index: number) => CYPHERS[index % CYPHERS.length].id;
