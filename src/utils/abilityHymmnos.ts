import publicLexiconJson from '../generated/hymmnosPublicIndex.json';
import { PublicLexiconEntry } from '../types/Campaign';
import { Ability } from '../types/Reyvateils';
import { createHymmnosLexiconLookup, resolveHymmnosToken } from './hymmnosLexiconLookup';

export interface AbilityInvocation {
  id: string;
  headword: string;
  pronunciation: string;
  cypherId: string;
  lexiconEntryId: string;
  parts: PublicLexiconEntry[];
}

const entries = publicLexiconJson as PublicLexiconEntry[];
const lexiconLookup = createHymmnosLexiconLookup(entries);

const coreRules: Array<[RegExp, string]> = [
  [/heal|cure|restore|mend|regenerat|health|reviv/i, 'y.y.'],
  [/protect|shield|guard|armor|barrier|ward|defen/i, 'khal'],
  [/fire|flame|blaze|burn|ember|inferno/i, 'fayra'],
  [/wind|\bair\b|gale|storm|flight|\bfly/i, 'fhyu'],
  [/\blight|radiant|\bsun|holy|shine/i, 'fhau'],
  [/\bdark|\bshadow|\bnight|\bvoid\b/i, 'dazua'],
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

// Every qualifier is a canonical dictionary word. Compounding these words
// gives related abilities distinct, contextual invocations without inventing
// vocabulary that players could not later unlock through Cyphers.
const qualifierRules: Array<[RegExp, string]> = [
  [/slash|strike|blows?|lash/i, 'zethpa'],
  [/rage/i, 'guwo'],
  [/nova|immolation/i, 'ruinie'],
  [/aura|presence/i, 'f.w.r.n'],
  [/encore/i, 'agan'],
  [/courage|inspir/i, 'granme'],
  [/narrative/i, 'akata'],
  [/unity/i, 'ture'],
  [/resistan/i, 'cecet'],
  [/immun/i, 'heetha'],
  [/breath/i, 'dilete'],
  [/scales?/i, 'k.v.r.'],
  [/\btime/i, 'tim'],
  [/judg|retribut/i, 'deata'],
  [/dive/i, 'poto'],
  [/fear/i, 'terrfa'],
  [/death|deadly/i, 'zodaw'],
  [/phase/i, 'sik'],
  [/\bstep/i, 'm.y.b.'],
  [/cloak/i, 'm.f.l.'],
  [/storm/i, 'quesa'],
  [/binding|\bnet\b/i, 'rinc'],
  [/weav/i, 'crushue'],
  [/barrier/i, 'cecet'],
  [/illusion|misdirection|look different/i, 'yurfe'],
  [/lightning|thunder|static|electric/i, 'quesa'],
  [/cloud/i, 'gauto'],
  [/story/i, 'akata'],
  [/memory|remembrance|remember|recall|histor/i, 'erphy'],
  [/echo|resonan/i, 'galado'],
  [/harmony|melod|tune|chorus|music|strings?|rhythm|ditty/i, 'hymmne'],
  [/sooth|calm|tranquil|mellow|relax|ease|peace/i, 'yosyua'],
  [/bond|\blink|tether/i, 'ture'],
  [/sight|\beye|gaze|glimpse|perception|radar|sense|detect|scan|notice|reveal|identify/i, 'eux'],
  [/sleep|weary|restful/i, 'nooge'],
  [/crystal|reflection|astral|\bstar|cosmic/i, 'lyuma'],
  [/aurora|colou?r/i, 'clalliss'],
  [/sterile|purif|clean|cleanse|germ|bacteria/i, 'valwa'],
  [/twilight|dusk|\bnight/i, 'vonn'],
  [/dream/i, 'revm'],
  [/moon|lunar/i, 'weak'],
  [/roots?|forest|grove/i, 'dorna'],
  [/seeds?|sprout/i, 'phira'],
  [/petal|flower/i, 'frawr'],
  [/plants?|verdant|flora|herbs?|moss|foliage|fungus|mushroom|pollen|spores?/i, 'plina'],
  [/wildlife|animals?|fauna|avian|birds?/i, 'fau'],
  [/gather|forag|harvest|scaveng|salvage|collect/i, 'syast'],
  [/stone|rock|boulder|mineral|\bore\b|geolog/i, 'ganna'],
  [/ground|earth|terrain|strata/i, 'doodu'],
  [/rain|drizzle|water|liquid|lake|sea|aquatic/i, 'jue'],
  [/fish/i, 'hasyu'],
  [/quiet|silent|hush|without sound|footsteps?/i, 'quive'],
  [/wings?|\bfly|flight|glide|leap|flutter|falling/i, 'fwal'],
  [/runes?|engrave|inscription|etch|letter|words?|language|tongues?/i, 'wart'],
  [/metal|iron|smith|forge|hammer|anvil/i, 'gigeadeth'],
  [/kinetic|force|energy|power|push/i, 'pauwel'],
  [/stasis|stable|upright/i, 'Ma'],
  [/diplomat|negotiat|social|\bspeak/i, 'pagle'],
  [/balance/i, 'yura'],
  [/holy|bless|benediction|sacred/i, 'omga'],
  [/\bhide|skin|pelt|tanning/i, 'shelle'],
  [/watch|vigil|scout/i, 's.l.y.'],
  [/trail|\bpath|direction|guide|mapping/i, 'm.y.b.'],
  [/arrows?|\bbow\b/i, 'arrya'],
  [/steal|thiev|pilfer/i, 'stelo'],
  [/poison|toxin|venom/i, 'kuhle'],
  [/fire|flame|ember|burn|\bheat|cook|kitchen|oven/i, 'rum'],
  [/wave|\bsound/i, 'ammue'],
  [/enchant|magic|spell|warlock/i, 'maya'],
  [/gear|machine|mechan|device|circuit|automat|malfunction|glitch/i, 'tictim'],
  [/wood|carpentry/i, 'dorn'],
  [/life|living|vital/i, 'manaf'],
  [/blood|crimson|bloody/i, 'prooth'],
  [/flesh|\bbody/i, 'corpu'],
  [/puppet|doll/i, 'gasar'],
  [/offer/i, 'dralee'],
  [/enemy|nemesis/i, 'gyaeje'],
  [/stop|halt/i, 'tarfe'],
  [/shield|protect|ward|preserv/i, 'cecet'],
  [/small|tiny/i, 'titilia'],
];

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const resolveParts = (headwords: string[]) => headwords.map((headword) => {
  const entry = resolveHymmnosToken(headword, lexiconLookup).entry;
  if (!entry) throw new Error(`Canonical Hymmnos index is missing “${headword}”.`);
  return entry;
});

const invocationFromParts = (ability: Ability, parts: PublicLexiconEntry[]): AbilityInvocation => {
  const resolvedParts = parts.length ? parts : resolveParts(['hymmnos']);
  const first = resolvedParts[0];
  if (!first) throw new Error('Canonical Hymmnos index is missing the hymmnos entry.');
  return {
    id: ability.id || slug(ability.name),
    headword: resolvedParts.map((entry) => entry.headword).join(' '),
    pronunciation: resolvedParts.map((entry) => entry.pronunciation).join(' · '),
    cypherId: first.cypherId,
    lexiconEntryId: first.id,
    parts: resolvedParts,
  };
};

export const getAbilitySpokenForm = (invocation: AbilityInvocation) => invocation.parts
  .map((entry) => entry.pronunciation.match(/\(([^)]+)\)/)?.[1] || entry.headword)
  .join(' ');

export const resolveAbilityInvocation = (ability: Ability): AbilityInvocation => {
  if (ability.hymmnos?.headword) {
    const registeredParts = resolveParts(ability.hymmnos.headword.trim().split(/\s+/));
    const registered = registeredParts[0];
    return {
      id: ability.id || slug(ability.name),
      headword: ability.hymmnos.headword,
      pronunciation: ability.hymmnos.pronunciation || registered?.pronunciation || ability.hymmnos.headword,
      cypherId: ability.hymmnos.cypherId || registered?.cypherId || 'cypher-37',
      lexiconEntryId: ability.hymmnos.lexiconEntryId || registered?.id || 'hymmnos',
      parts: registeredParts.length ? registeredParts : resolveParts(['hymmnos']),
    };
  }
  const haystack = `${ability.name} ${ability.description}`;
  const semanticHaystack = haystack.replace(/non[- ]magical/gi, '');
  const core = coreRules.find(([pattern]) => pattern.test(semanticHaystack))?.[1] || 'hymmnos';
  const qualifiers = qualifierRules
    .filter(([pattern, headword]) => headword.toLowerCase() !== core.toLowerCase() && pattern.test(semanticHaystack))
    .map(([, headword]) => headword)
    .filter((headword, index, all) => all.findIndex((item) => item.toLowerCase() === headword.toLowerCase()) === index)
    .slice(0, 2);
  return invocationFromParts(ability, resolveParts([core, ...qualifiers]));
};
