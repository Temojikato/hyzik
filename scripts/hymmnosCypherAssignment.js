const crypto = require('crypto');

// Cyphers describe semantic families. The old catalog assigned entries by
// their row number, which made a Cypher's title unrelated to the words it
// revealed. Rules are deliberately ordered from specific lore concepts to
// broad grammatical families.
const semanticRules = [
  [47, /\bchaos\b|pandemonium/i],
  [14, /\bdeath\b|\bdead\b|\bdie\b|dying|corpse|fatal|mortality/i],
  // Reyvateil is an interface identity before it is a lore concept. Keeping
  // the canonical headword in Being makes the portal legible at first link.
  [2, /reyvateil|artificial life form/i],
  [13, /\blife\b|living|alive|vital|birth|reincarnat/i],
  [15, /\bmind\b|thought|intellect|conscious|reason|mental/i],
  [16, /\bsoul\b|spirit|ghost/i],
  [41, /memory|remembrance|remember|recall|history/i],
  [42, /dream|sleep|nightmare/i],
  [43, /truth|true|reality|fact/i],
  [44, /false|lie|deceit|illusion|fake/i],
  [45, /begin|start|origin|first|dawn/i],
  [46, /\bend\b|ending|finish|final|terminate/i],
  [48, /hope|wish|salvation|future/i],
  [37, /\bsong\b|hymn|music|melody|sing|voice|chorus/i],
  [38, /\bword\b|language|speak|say|tell|listen|grammar|letter|script|sentence/i],
  [39, /magic|magical|spell|sorcery|supernatural|mana/i],
  [40, /machine|mechan|device|gear|computer|server|program|execute|control|operate/i],
  [17, /\bearth\b|ground|soil|stone|rock|mountain|mineral/i],
  [18, /\bsky\b|heaven|cloud|star|moon|sun|celestial/i],
  [19, /\bwater\b|sea|ocean|river|rain|liquid|ice|frost/i],
  [20, /\bfire\b|flame|burn|heat|ember/i],
  [21, /\bwind\b|\bair\b|gale|breeze|storm/i],
  [22, /\blight\b|bright|shine|radiant|glow/i],
  [23, /dark|darkness|shadow|night|void/i],
  [24, /\btime\b|moment|etern|past|present|hour|day/i],
  [25, /\bgo\b|advance|progress|forward|depart|travel|walk|run|move/i],
  [26, /return|come back|restore|again|repeat/i],
  [27, /\brise\b|ascend|above|upward|high-ranking/i],
  [28, /\bfall\b|descend|below|downward/i],
  [29, /join|connect|bind|bond|together|unite|fuse|link/i],
  [30, /sever|separate|divide|apart|break|cut off/i],
  [31, /\bgive\b|grant|send|bestow|offer|present/i],
  [32, /\btake\b|receive|steal|rob|obtain|acquire/i],
  [33, /guard|protect|defend|shield|barrier|shelter|safety/i],
  [34, /strike|attack|weapon|battle|combat|fight|war|slash|pierce/i],
  [35, /heal|cure|mend|recover|rescue|help/i],
  [36, /harm|hurt|wound|damage|pain|poison|destroy|ruin/i],
  [7, /desire|want|crave|hunger|appetite|longing/i],
  [8, /fear|afraid|terror|dread|anxiety/i],
  [9, /\bjoy\b|happy|happiness|delight|smile|pleasure/i],
  [10, /sorrow|sad|grief|mourning|cry|tear|lonely/i],
  [11, /trust|believe|faith|rely|loyal/i],
  [12, /betray|traitor|treason|abandon|forsake/i],
  [5, /negat|\bnot\b|\bno\b|never|nothing|without|deny/i],
  [6, /question|ask|why|what|which|who|where|when|how/i],
  [3, /oneself|myself|yourself|\bself\b|one's own|\bI\b|\bme\b|\bmy\b/i],
  [4, /\bother\b|another|friend|companion|partner|enemy|they|them|their|person/i],
  [1, /address|name|call|greet|listener|recipient/i],
  [2, /exist|being|creature|form|shape|state|kind|type|role|job|work|reyvateil|human/i],
];

const fallbackCypher = (entry) => {
  const seed = `${entry.headword}\u0000${entry.meaning_e || ''}\u0000${entry.part_of_speech || ''}`;
  const value = crypto.createHash('sha256').update(seed).digest().readUInt32BE(0);
  // Unclassified and unknown words never land in the four starter Cyphers.
  const available = Array.from({ length: 44 }, (_, index) => index + 5).filter((number) => number !== 38);
  return available[value % available.length];
};

const assignCypherNumber = (entry) => {
  // Hymmnos has no literal word for the cosmological proper noun Chaos.
  // These two canonical nouns are deliberately grouped here as its recurring
  // campaign imagery (destruction/ruin/collapse and change), never as direct
  // translations of Chaos.
  if (/^(ksyura|tussu)$/i.test(String(entry.headword || ''))) return 47;
  const meaning = String(entry.meaning_e || '');
  return semanticRules.find(([, pattern]) => pattern.test(meaning))?.[0] || fallbackCypher(entry);
};

const assignCypherId = (entry) => `cypher-${String(assignCypherNumber(entry)).padStart(2, '0')}`;

module.exports = { assignCypherId, assignCypherNumber, semanticRules };
