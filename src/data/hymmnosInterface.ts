export interface HymmnosInterfacePhrase {
  hymmnos: string;
  translation: string;
}

export const UI_HYMMNOS = {
  reyvateilLinkEstablished: { hymmnos: 'revatail rinc irs', translation: 'Reyvateil link established' },
  class: { hymmnos: 'qyon', translation: 'Class' },
  features: { hymmnos: 'colmask', translation: 'Features' },
  hunger: { hymmnos: 'dsier', translation: 'Hunger' },
  abilities: { hymmnos: 'pawr', translation: 'Abilities' },
  feed: { hymmnos: 'accrroad eta', translation: 'Feed' },
  ritual: { hymmnos: 'piterne', translation: 'Ritual' },
  socialProfile: { hymmnos: 'an colmask', translation: 'Social profile' },
  combatProfile: { hymmnos: 'velsog colmask', translation: 'Combat profile' },
  techniques: { hymmnos: 'exec pawr', translation: 'Techniques' },
  songs: { hymmnos: 'hymmnos', translation: 'Songs' },
  inheritedTechniques: { hymmnos: 'pawr oz revatail', translation: 'Inherited techniques' },
  universalActions: { hymmnos: 'exec an', translation: 'Universal actions' },
  songRepertoire: { hymmnos: 'hymmnos colmask', translation: 'Song repertoire' },
  growth: { hymmnos: 'faja hao', translation: 'Growth and progression' },
  combatRules: { hymmnos: 'wart oz velsog', translation: 'Combat rules' },
  sharedPerformance: { hymmnos: 'hymmnos an', translation: 'Shared performance channel' },
  playerState: { hymmnos: 'colmask oz noes', translation: 'Player state' },
  conditions: { hymmnos: 'urdm en zuieg', translation: 'Conditions & influence' },
  residentCodex: { hymmnos: 'memora oz plargamera', translation: 'Resident Codex' },
  bestiary: { hymmnos: 'memora oz bister', translation: 'Bestiary' },
  maps: { hymmnos: 'gkgula eux', translation: 'Maps' },
  inventory: { hymmnos: 'ptrapica', translation: 'Inventory' },
  translator: { hymmnos: 'wart anturn', translation: 'Translator' },
  functions: { hymmnos: 'exec', translation: 'Functions' },
  logout: { hymmnos: 'sik', translation: 'Log out' },
  towerLink: { hymmnos: 'tonelico rinc', translation: 'Tower link' },
  receiving: { hymmnos: 'drone', translation: 'Receiving' },
} as const satisfies Record<string, HymmnosInterfacePhrase>;

const classPhrases: Record<string, string> = {
  barbarian: 'ganna wase',
  bard: 'hymmnos akata',
  cleric: 'enne swant',
  druid: 'manaf plina',
  fighter: 'velsog zethpa',
  monk: 'quive noes',
  paladin: 'guard omga',
  ranger: 'gkgula eux',
  rogue: 'dazua stelo',
  sorcerer: 'sosar pawr',
  warlock: 'maya ture',
  wizard: 'wart sosar',
  artificer: 'gyen tictim',
  'blood hunter': 'prooth gyaeje',
};

const featureRules: Array<[RegExp, string]> = [
  [/mechan|gear|circuit|clockwork/i, 'tictim'],
  [/metal|iron|steel/i, 'gigeadeth'],
  [/sturdy|stone|rock|earth|crystal/i, 'ganna'],
  [/storm|electric|lightning|thunder/i, 'quesa'],
  [/fire|fiery|ember|blaz|cinder|furnace/i, 'rum'],
  [/music|musical|resonan|harmon|harp|string|sound|canticle/i, 'hymmnos'],
  [/radiant|light|glow|shining|halo|aurora/i, 'fhau'],
  [/dark|shadow|twilight|night|smoky|umbral|nocturn/i, 'dazua'],
  [/leaf|vine|floral|moss|green|verdant|bloom|thorn/i, 'plina'],
  [/armor|protect|ward|custodian|bastion/i, 'guard'],
  [/energy|kinetic|force|velocity|dynamic/i, 'pauwel'],
  [/calm|serene|graceful|stillwater/i, 'yosyua'],
  [/swift|aerodynamic|gale|wind|flowing/i, 'fhyu'],
  [/falcon|bird|talon/i, 'fau'],
  [/stealth|muted|hush|silken|infiltrat/i, 'quive'],
  [/ice|icy|frost|rime/i, 'colga'],
  [/star|celestial|aether|eclipse/i, 'lyuma'],
  [/rune|glyph|sigil|symbol|script|etch/i, 'wart'],
  [/magic|arcane|mystic|enchant|occult/i, 'maya'],
  [/blood|sanguine|crimson|vein/i, 'prooth'],
  [/life|vital/i, 'manaf'],
  [/sharp|blade|lancer|ravager/i, 'viega'],
  [/color|iridescent|pastel/i, 'clalliss'],
  [/wing/i, 'fwal'],
];

const damagePhrases: Record<string, string> = {
  lightning: 'quesa', stone: 'ganna', fire: 'rum', sonic: 'ammue', radiant: 'fhau',
  shadow: 'dazua', nature: 'plina', metal: 'gigeadeth', force: 'pauwel', psychic: 'eje',
  wind: 'fhyu', piercing: 'viega', poison: 'kuhle', frost: 'colga', void: 'dazua',
  arcane: 'maya', blood: 'prooth',
};

const rolePhrases: Record<string, string> = {
  vanguard: 'faja', bulwark: 'guard', support: 'swant', controller: 'tictim',
  tactician: 'eje', channeler: 'exec', skirmisher: 'velsog', striker: 'zethpa',
};

const uniqueWords = (words: string[]) => words.filter((word, index) => words.findIndex((candidate) => candidate.toLowerCase() === word.toLowerCase()) === index);

export const classHymmnosPhrase = (className: string): HymmnosInterfacePhrase => ({
  hymmnos: classPhrases[className.trim().toLowerCase()] || 'qyon colmask',
  translation: className,
});

export const descriptionHymmnosPhrase = (description: string): HymmnosInterfacePhrase => {
  const words = uniqueWords(featureRules.filter(([pattern]) => pattern.test(description)).map(([, word]) => word));
  return { hymmnos: (words.length ? words : ['colmask']).slice(0, 4).join(' '), translation: description };
};

export const reyvateilIdentityPhrase = (name: string, level: number): HymmnosInterfacePhrase => ({
  hymmnos: `revatail ${name} hao ${Math.max(1, Math.floor(level || 1))}`,
  translation: `${name} · Level ${Math.max(1, Math.floor(level || 1))}`,
});

export const combatIdentityPhrase = (specialtyTitle: string, damageType: string, role: string): HymmnosInterfacePhrase => ({
  hymmnos: uniqueWords([damagePhrases[damageType] || 'pawr', rolePhrases[role] || 'velsog']).join(' '),
  translation: specialtyTitle,
});

export const combatDescriptionPhrase = (reyvateilName: string, damageType: string, role: string): HymmnosInterfacePhrase => ({
  hymmnos: `revatail ${reyvateilName} ${damagePhrases[damageType] || 'pawr'} ${rolePhrases[role] || 'velsog'}`,
  translation: `${reyvateilName} translates ${damageType} through a ${role} combat doctrine.`,
});
