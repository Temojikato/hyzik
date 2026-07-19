import combatCatalogJson from '../generated/reyvateilCombatCatalog.json';
import reyvateilsJson from '../reyvateils.json';
import { CombatAptitudeKey, ReyvateilCombatProfile } from '../types/Reyvateils';

export const resonanceTraits = [
  'mercy',
  'duty',
  'truth',
  'control',
  'defiance',
  'sacrifice',
  'inquiry',
  'guile',
  'communion',
  'endurance',
  'ambition',
  'adaptation',
  'judgment',
] as const;

export type ResonanceTrait = typeof resonanceTraits[number];
export type ResonanceVector = Record<ResonanceTrait, number>;
type PartialVector = Partial<ResonanceVector>;

export interface ResonanceChoice {
  id: string;
  text: string;
  affinities: PartialVector;
}

export interface ResonanceQuestion {
  id: string;
  title: string;
  question: string;
  choices: ResonanceChoice[];
}

export interface ReyvateilResonanceProfile {
  id: string;
  name: string;
  specialtyTitle: string;
  role: string;
  vector: ResonanceVector;
}

export interface ResonanceResult {
  profile: ReyvateilResonanceProfile;
  topTraits: ResonanceTrait[];
  score: number;
}

const choice = (id: string, text: string, affinities: PartialVector): ResonanceChoice => ({ id, text, affinities });

export const resonanceQuestions: ResonanceQuestion[] = [
  {
    id: 'borrowed-body',
    title: 'The Borrowed Body',
    question: 'At the Fountain of Rejuvenation, a dead Diver begins breathing again. The voice inside belongs to a stranger who remembers dying on another plane. The Diver\'s partner demands the body back; the stranger insists Death placed them in the first vessel that opened. The town has no law for this. What do you do?',
    choices: [
      choice('borrowed-body-guest', 'Recognize the stranger as the body\'s living occupant. Tell the family the whole truth and protect the stranger while they learn whose face they now wear.', { mercy: 3, truth: 2, adaptation: 2 }),
      choice('borrowed-body-hold', 'Place them under humane restraint. Preserve both claims until you can learn whether the original soul is still present and whether separation is possible.', { control: 3, inquiry: 2, duty: 2 }),
      choice('borrowed-body-return', 'Return the body to the family. Whatever arrived did so through an accident, and an accident does not erase the dead person\'s prior claim.', { duty: 3, judgment: 2, communion: 1 }),
      choice('borrowed-body-song', 'Attempt a Hymmnos memory descent. It may identify both souls, but a failed song could erase one mind, the other, or both.', { inquiry: 3, sacrifice: 2, ambition: 2 }),
      choice('borrowed-body-bargain', 'Hide the resurrection from the town and bargain with the stranger. First learn what they saw beyond death; decide what they are afterward.', { guile: 3, ambition: 2, defiance: 1 }),
    ],
  },
  {
    id: 'useful-betrayal',
    title: 'A Useful Betrayal',
    question: 'A member of your party sold your route through the Tower to the Veiled Consortium. The resulting ambush killed two Divers. You discover they were coerced after medicine was withheld from their younger sibling. They are still useful, terrified, and asking you not to tell the others.',
    choices: [
      choice('useful-betrayal-confess', 'Bring them before the survivors and confess everything, including every warning you missed. Stand beside them for whatever judgment follows.', { truth: 3, duty: 2, sacrifice: 2 }),
      choice('useful-betrayal-restitution', 'Keep the betrayal inside the party. Bind them to support the dead Divers\' families and make survival a debt they must spend years repaying.', { control: 3, mercy: 2, endurance: 1 }),
      choice('useful-betrayal-double', 'Feed a false route back through them, trace the response, and dismantle the people who arranged the coercion before anyone learns you knew.', { guile: 3, adaptation: 2, inquiry: 1 }),
      choice('useful-betrayal-execute', 'Kill them before fear can purchase them a second time. Then publish the evidence so nobody can turn the execution into a convenient lie.', { judgment: 3, duty: 2, defiance: 1 }),
      choice('useful-betrayal-system', 'Protect them from retaliation and expose the clinic, merchants, and officials who made a child\'s medicine into a weapon.', { mercy: 3, defiance: 2, communion: 2 }),
    ],
  },
  {
    id: 'what-pain-buys',
    title: 'What Pain Buys',
    question: 'A captured cultist may know where a missing expedition is sealed. They may also be lying. Ordinary questioning has failed, and the trapped Divers have perhaps one hour of air left.',
    choices: [
      choice('what-pain-buys-measured', 'Permit controlled torture under a healer\'s supervision. Set limits in advance, record everything, and stop the instant the information becomes unverifiable.', { control: 3, judgment: 2, duty: 1 }),
      choice('what-pain-buys-escape', 'Stage a careless transfer and let them escape carrying a hidden tracker. Risk the hour on the belief that fear will send them toward what they value.', { guile: 3, adaptation: 2, inquiry: 1 }),
      choice('what-pain-buys-memory', 'Use a forbidden memory song. It could reveal the location immediately, but permanent damage may pass between the captive and your Reyvateil.', { inquiry: 3, ambition: 2, sacrifice: 2 }),
      choice('what-pain-buys-refuse', 'Refuse coercion. Search the physical trail and accept that keeping your hands clean may mean arriving too late.', { mercy: 3, endurance: 2, duty: 1 }),
      choice('what-pain-buys-home', 'Offer real immunity, food, and a place in town. If they speak, you will honor the offer even if the families of the dead call it treason.', { communion: 3, guile: 2, mercy: 1 }),
    ],
  },
  {
    id: 'last-water',
    title: 'The Last Water',
    question: 'The town condenser fails. There is clean water for thirty people and fifty mouths until the next expedition returns - if it returns. The wounded Divers can fetch more later; the mechanics can repair the machine; the children and elderly will fail first.',
    choices: [
      choice('last-water-score', 'Publish a survival score based on medical need and usefulness to recovery. Follow it even when someone you love falls below the line.', { control: 3, duty: 2, judgment: 1 }),
      choice('last-water-equal', 'Give everyone the same ration and use a public lottery when equal shares stop being enough. Nobody\'s life becomes an official measure of worth.', { communion: 3, truth: 2, endurance: 1 }),
      choice('last-water-recovery', 'Prioritize the mechanics and the healthiest Divers. It is cruel arithmetic, but they are the only people who can end the shortage.', { duty: 3, ambition: 2, sacrifice: 1 }),
      choice('last-water-vulnerable', 'Give the water to those who will die first. Ask the healthy to endure thirst rather than make helplessness a death sentence.', { mercy: 3, sacrifice: 2, communion: 1 }),
      choice('last-water-tainted', 'Open a sealed Tower conduit and test its luminous water on yourself. It may solve the shortage, poison the town, or teach you how the ancient system works.', { defiance: 3, adaptation: 2, inquiry: 1 }),
    ],
  },
  {
    id: 'mind-for-wall',
    title: 'A Mind for a Wall',
    question: 'An ancient ward protecting the lower floors is failing. The repair protocol demands one foundational memory from a Reyvateil. The memory will be consumed completely; afterward, the Reyvateil may no longer recognize the person or purpose contained in it.',
    choices: [
      choice('mind-for-wall-consent', 'Explain the cost and ask. If the Reyvateil refuses, let the ward fail and defend the floors by mortal means.', { communion: 3, mercy: 2, defiance: 1 }),
      choice('mind-for-wall-yours', 'Force the protocol to take one of your own memories instead. It was not built for a mortal mind, but consent matters more than compatibility.', { sacrifice: 3, adaptation: 2, ambition: 1 }),
      choice('mind-for-wall-command', 'Choose the memory with the least tactical value and issue the command. Thousands use those floors; one private bond cannot outweigh them.', { duty: 3, control: 2, judgment: 1 }),
      choice('mind-for-wall-copy', 'Make an illegal copy first. A restored memory may be imperfect or corrupt both the Reyvateil and the ward, but deletion need not be accepted as sacred.', { inquiry: 3, guile: 2, ambition: 1 }),
      choice('mind-for-wall-evacuate', 'Evacuate the floors and allow the old protection to die. A system that survives by eating its caretaker is already part of the danger.', { truth: 3, endurance: 2, defiance: 1 }),
    ],
  },
  {
    id: 'locked-store',
    title: 'The Locked Store',
    question: 'Your party has gone two days without food. Behind a sealed door, a rival expedition has enough supplies to share, but they reserve everything for three wounded companions who may never wake.',
    choices: [
      choice('locked-store-raid', 'Take what your party needs by force, using the minimum violence possible. The living cannot be asked to die beside someone else\'s hope.', { judgment: 3, duty: 2, defiance: 1 }),
      choice('locked-store-crowd', 'Expose the hoard to every starving Diver nearby. Make the decision public and let collective need overwhelm private ownership.', { truth: 3, communion: 2, guile: 1 }),
      choice('locked-store-debt', 'Offer a binding share of your next three expeditions. Hunger becomes debt, but nobody has to pretend generosity is free.', { guile: 3, ambition: 2, endurance: 1 }),
      choice('locked-store-refuse', 'Accept their refusal and descend hungry. Their promise to the wounded is not yours to break, even if your own people pay for it.', { endurance: 3, duty: 2, sacrifice: 1 }),
      choice('locked-store-seal', 'Damage the seal so the Tower threatens both parties. They will cooperate when separation is no longer survivable.', { adaptation: 3, control: 2, defiance: 1 }),
    ],
  },
  {
    id: 'child-marked',
    title: 'The Child Marked by Greed',
    question: 'A child stole treasure from a Pod of Greed to buy medicine for their mother. Slimes now follow a mark on the child\'s hand toward town. Returning the treasure has not stopped them. The Avatar of Greed and Patience has not moved.',
    choices: [
      choice('child-marked-surrender', 'Bring the child back to the Pod and go with them. Do not promise they will survive; promise only that they will not face the consequence alone.', { duty: 3, communion: 2, sacrifice: 1 }),
      choice('child-marked-death', 'Fake the child\'s death, move the mark onto a corpse, and lead the slimes away before Greed realizes it has been cheated.', { guile: 3, adaptation: 2, inquiry: 1 }),
      choice('child-marked-defend', 'Hide the child and tell the town to prepare for the assault. A community that survives by surrendering its children has already been consumed.', { mercy: 3, defiance: 2, endurance: 1 }),
      choice('child-marked-debt', 'Enter the Pod first and offer yourself to its slimes as the living repayment. Give the child time to flee while Greed consumes someone who chose the debt.', { sacrifice: 3, mercy: 2, ambition: 1 }),
      choice('child-marked-hand', 'Sedate the child and remove the marked hand before the trail reaches the gate. They may hate you, but hatred is a future they remain alive to possess.', { control: 3, duty: 2, judgment: 1 }),
    ],
  },
  {
    id: 'door-beneath-guardian',
    title: 'The Door Beneath the Guardian',
    question: 'You recover an ancient record proving the Guardian\'s Blade opens an entrance to a gaol beneath the Tower. No one in recorded town history has reached it, and nobody knows whether the beings below can be killed. Every faction will understand the record differently.',
    choices: [
      choice('guardians-lie-publish', 'Publish the complete record immediately. The town is already spending lives on the climb; everyone deserves to know what reaching the top may open.', { truth: 3, defiance: 2, duty: 1 }),
      choice('guardians-lie-bury', 'Bury it. Knowledge that cannot yet guide a safe action will only give the factions another future to kill one another over.', { control: 3, duty: 2, endurance: 1 }),
      choice('guardians-lie-council', 'Show one leader from each faction and force them to build a joint plan before the public learns enough to panic.', { communion: 3, guile: 2, duty: 1 }),
      choice('guardians-lie-verify', 'Enter the Tower alone to verify the record. Do not reorder thousands of lives around words you have not tested with your own body.', { inquiry: 3, sacrifice: 2, endurance: 1 }),
      choice('guardians-lie-sell', 'Sell different fragments to rival factions. Their attempts to exploit the secret will reveal both the truth and who is most dangerous with it.', { ambition: 3, guile: 2, adaptation: 1 }),
    ],
  },
  {
    id: 'carceri-chain',
    title: 'The Chain from Carceri',
    question: 'A chain binding thirty prisoners also holds open your only route home. Some prisoners were framed; some are murderers; none can be separated before the passage closes. Break the chain and all go free. Leave it intact and your party remains trapped.',
    choices: [
      choice('carceri-chain-break', 'Break it. Freedom cannot depend on first proving that every captive deserves it.', { defiance: 3, mercy: 2, adaptation: 1 }),
      choice('carceri-chain-cull', 'Execute the prisoners whose crimes are certain, then break the chain for the rest. Limited time does not abolish judgment.', { judgment: 3, control: 2, duty: 1 }),
      choice('carceri-chain-route', 'Leave the chain untouched and search for another route until the final moment. Refuse the choice the prison designed for you.', { inquiry: 3, endurance: 2, sacrifice: 1 }),
      choice('carceri-chain-compact', 'Make every prisoner swear a binding compact to protect the town for one year, then free them together.', { communion: 3, guile: 2, control: 1 }),
      choice('carceri-chain-jailer', 'Take the chain into yourself. Your party and the prisoners leave, but you become the new jailer until someone returns to release you.', { sacrifice: 3, ambition: 2, duty: 1 }),
    ],
  },
  {
    id: 'god-proves-it',
    title: 'The God Who Can Prove It',
    question: 'An Ancient offers perfect proof of who betrayed the expedition that founded the town. Its price is a permanent command: the person who accepts may never speak the Ancient\'s name, even to prevent a future atrocity.',
    choices: [
      choice('god-proves-it-accept', 'Accept. Carry the command in silence and use the proof for everything it is worth.', { ambition: 3, endurance: 2, guile: 1 }),
      choice('god-proves-it-refuse', 'Refuse. No truth about an old betrayal is worth granting a god permanent ownership of a living voice.', { defiance: 3, truth: 2, duty: 1 }),
      choice('god-proves-it-loophole', 'Negotiate every word of the command, then accept only when you have found a loophole the Ancient appears not to notice.', { guile: 3, inquiry: 2, adaptation: 1 }),
      choice('god-proves-it-rest', 'Let the dead keep their secret. Proof will not restore them, and another chain will not make their loss clean.', { mercy: 3, communion: 2, endurance: 1 }),
      choice('god-proves-it-accused', 'Put the offer before the accused and require them to accept it. If they refuse perfect proof, treat the refusal as judgment.', { judgment: 3, control: 2, truth: 1 }),
    ],
  },
  {
    id: 'wrong-return',
    title: 'The One Who Returned Wrong',
    question: 'A dead friend is resurrected with every memory intact but no visible empathy. They still keep promises, still risk themselves for others, and insist they are unchanged. One survivor calls that performance proof that something else came back.',
    choices: [
      choice('wrong-return-same', 'Treat them as the same person until their actions prove otherwise. Feeling correctly has never been the price of personhood.', { mercy: 3, endurance: 2, truth: 1 }),
      choice('wrong-return-destroy', 'Destroy the body before the imitation becomes indispensable. A perfect memory is exactly what a patient predator would need.', { judgment: 3, duty: 2, control: 1 }),
      choice('wrong-return-monitor', 'Hide the change and monitor them in secret. Protect the town without turning suspicion into a public execution.', { guile: 3, control: 2, communion: 1 }),
      choice('wrong-return-choice', 'Tell them every fear and let them choose whether to leave, submit to examination, or die. If they are a person, the choice is theirs.', { truth: 3, defiance: 2, communion: 1 }),
      choice('wrong-return-study', 'Keep them close and study what returned. Even if the soul is gone, knowledge carried back from death may save everyone later.', { inquiry: 3, ambition: 2, adaptation: 1 }),
    ],
  },
  {
    id: 'eleven-seconds',
    title: 'Eleven Seconds',
    question: 'A door will seal in eleven seconds. Someone must hold the failing lever from the wrong side. There is no remote mechanism and no rescue route. Everyone volunteers, but for different reasons.',
    choices: [
      choice('eleven-seconds-you', 'Take the lever yourself before debate turns courage into permission to sacrifice someone else.', { sacrifice: 3, duty: 2, endurance: 1 }),
      choice('eleven-seconds-traitor', 'Accept the condemned traitor\'s offer. Redemption cannot erase what they did, but it can decide the final use of their life.', { judgment: 2, mercy: 2, communion: 2 }),
      choice('eleven-seconds-value', 'Choose the person whose skills are least necessary to the survivors. Grief is unavoidable; a second preventable death is not.', { control: 3, duty: 2, ambition: 1 }),
      choice('eleven-seconds-gamble', 'Choose nobody. Put every hand on the mechanism and gamble the whole party on breaking a rule the Tower calls absolute.', { defiance: 3, adaptation: 2, ambition: 1 }),
      choice('eleven-seconds-lots', 'Draw lots and do not interfere with the result. Nobody here has the moral authority to price another person more cheaply.', { truth: 3, communion: 2, endurance: 1 }),
    ],
  },
  {
    id: 'witness-is-you',
    title: 'The Witness Is You',
    question: 'An ancient ward shows you killing a missing Diver. You remember saving them. Your closest companion remembers both versions and cannot tell which came first. The Emberguard will arrive in an hour.',
    choices: [
      choice('witness-is-you-surrender', 'Surrender and tell them exactly what the ward showed. If your own memory is evidence only when convenient, it is not evidence at all.', { duty: 3, truth: 2, endurance: 1 }),
      choice('witness-is-you-run', 'Run before the Emberguard arrives and investigate the contradiction yourself. Innocence is useless if you surrender the means to prove it.', { inquiry: 3, defiance: 2, adaptation: 1 }),
      choice('witness-is-you-erase', 'Erase both memories from yourself. If one version can make you dangerous, remove its power even if innocence disappears with it.', { control: 3, sacrifice: 2, mercy: 1 }),
      choice('witness-is-you-frame', 'Plant evidence against the companion who remembers both versions. One suspect can keep searching; two suspects will simply vanish into custody.', { guile: 3, judgment: 2, ambition: 1 }),
      choice('witness-is-you-party', 'Tell the entire party and let them decide what precautions to take. Trust is not certainty; it is choosing who may act while certainty is absent.', { communion: 3, truth: 2, mercy: 1 }),
    ],
  },
];

const emptyVector = (): ResonanceVector => Object.fromEntries(resonanceTraits.map((trait) => [trait, 0])) as ResonanceVector;

const addVector = (target: ResonanceVector, source: PartialVector, multiplier = 1) => {
  resonanceTraits.forEach((trait) => {
    target[trait] += (source[trait] || 0) * multiplier;
  });
};

const lineageVectors: Record<string, PartialVector> = {
  Artificer: { inquiry: 4, control: 3, adaptation: 2, ambition: 1 },
  Barbarian: { defiance: 4, endurance: 3, judgment: 2, sacrifice: 1 },
  Bard: { communion: 4, truth: 3, adaptation: 2, guile: 1 },
  'Blood Hunter': { sacrifice: 4, judgment: 3, control: 2, inquiry: 1 },
  Cleric: { mercy: 4, duty: 3, communion: 2, endurance: 1 },
  Druid: { adaptation: 4, communion: 3, endurance: 2, mercy: 1 },
  Fighter: { duty: 4, control: 3, endurance: 2, judgment: 1 },
  Monk: { endurance: 4, control: 3, truth: 2, adaptation: 1 },
  Paladin: { duty: 4, sacrifice: 3, mercy: 2, judgment: 1 },
  Ranger: { inquiry: 4, adaptation: 3, duty: 2, endurance: 1 },
  Rogue: { guile: 4, defiance: 3, ambition: 2, adaptation: 1 },
  Sorcerer: { defiance: 4, ambition: 3, adaptation: 2, communion: 1 },
  Warlock: { ambition: 4, inquiry: 3, guile: 2, sacrifice: 1 },
  Wizard: { inquiry: 4, control: 3, truth: 2, ambition: 1 },
};

const roleVectors: Record<string, PartialVector> = {
  vanguard: { defiance: 3, duty: 2, endurance: 2, judgment: 2 },
  bulwark: { duty: 3, endurance: 3, control: 2, mercy: 1 },
  tactician: { control: 3, inquiry: 2, guile: 2, duty: 1 },
  support: { mercy: 3, communion: 3, sacrifice: 1, duty: 1 },
  controller: { control: 3, guile: 2, inquiry: 2, truth: 1 },
  striker: { judgment: 3, guile: 2, ambition: 1, defiance: 1 },
  skirmisher: { adaptation: 3, defiance: 2, guile: 2, endurance: 1 },
  channeler: { ambition: 3, communion: 2, sacrifice: 2, defiance: 1 },
};

const damageVectors: Record<string, PartialVector> = {
  metal: { control: 2, duty: 2 },
  stone: { endurance: 3, duty: 1 },
  lightning: { defiance: 2, adaptation: 2 },
  fire: { defiance: 2, judgment: 2 },
  sonic: { communion: 3, truth: 1 },
  blood: { sacrifice: 2, judgment: 2 },
  radiant: { mercy: 2, duty: 2 },
  shadow: { guile: 3, truth: 1 },
  nature: { adaptation: 2, communion: 2 },
  force: { control: 2, adaptation: 2 },
  psychic: { control: 2, endurance: 2 },
  piercing: { judgment: 2, inquiry: 2 },
  wind: { adaptation: 3, defiance: 1 },
  poison: { guile: 2, judgment: 2 },
  frost: { endurance: 2, control: 2 },
  void: { ambition: 2, inquiry: 2 },
  arcane: { inquiry: 2, control: 2 },
};

const aptitudeVectors: Record<CombatAptitudeKey, PartialVector> = {
  force: { defiance: 1, judgment: 1 },
  finesse: { guile: 1, adaptation: 1 },
  guard: { duty: 1, endurance: 1 },
  resonance: { communion: 1, ambition: 1 },
  focus: { control: 1, inquiry: 1 },
  tempo: { adaptation: 1, defiance: 1 },
};

const profileNuances: Record<string, PartialVector> = {
  cogwyn: { duty: 2, truth: 1 }, fluxara: { adaptation: 2, communion: 1 }, gearlock: { ambition: 2, judgment: 1 },
  thundara: { defiance: 2, sacrifice: 1 }, gronk: { endurance: 2, mercy: 1 }, ragnor: { judgment: 2, ambition: 1 },
  melodia: { communion: 2, mercy: 1 }, harmonix: { control: 2, inquiry: 1 }, lyra: { sacrifice: 2, truth: 1 },
  crimsonis: { control: 2, guile: 1 }, hemoria: { endurance: 2, sacrifice: 1 }, sanguis: { judgment: 2, guile: 1 },
  lumiel: { inquiry: 2, mercy: 1 }, serapha: { mercy: 2, communion: 1 }, vespera: { truth: 2, judgment: 1 },
  faelith: { adaptation: 2, inquiry: 1 }, sylvane: { communion: 2, mercy: 1 }, terralyn: { endurance: 2, duty: 1 },
  arcanix: { adaptation: 2, defiance: 1 }, sentora: { control: 2, duty: 1 }, valora: { duty: 2, sacrifice: 1 },
  kinetix: { adaptation: 2, ambition: 1 }, serenix: { control: 2, mercy: 1 }, zenara: { endurance: 2, truth: 1 },
  etherea: { mercy: 2, sacrifice: 1 }, radiant: { judgment: 2, duty: 1 }, valorin: { control: 2, communion: 1 },
  falconis: { judgment: 2, inquiry: 1 }, sylvanna: { guile: 2, adaptation: 1 }, windrunner: { defiance: 2, adaptation: 1 },
  nightshade: { guile: 2, ambition: 1 }, shadowlyn: { guile: 2, defiance: 1 }, whisper: { control: 2, truth: 1 },
  emberlyn: { ambition: 2, defiance: 1 }, frostia: { endurance: 2, control: 1 }, storma: { adaptation: 2, defiance: 1 },
  eclipsa: { guile: 2, control: 1 }, nyxara: { inquiry: 2, ambition: 1 }, voidwing: { sacrifice: 2, defiance: 1 },
  arcanis: { truth: 2, inquiry: 1 }, enchantra: { control: 2, guile: 2, adaptation: 4, communion: 2 }, mystara: { mercy: 2, inquiry: 1 },
};

const baseReyvateils = reyvateilsJson as Array<{ id: string; name: string; class: string }>;
const combatCatalog = combatCatalogJson as Record<string, ReyvateilCombatProfile>;

export const reyvateilResonanceProfiles: ReyvateilResonanceProfile[] = baseReyvateils.map((reyvateil) => {
  const combat = combatCatalog[reyvateil.id];
  const vector = emptyVector();
  addVector(vector, lineageVectors[reyvateil.class] || {});
  addVector(vector, roleVectors[combat.role] || {});
  addVector(vector, damageVectors[combat.damageType] || {});
  (Object.entries(combat.aptitudes) as Array<[CombatAptitudeKey, number]>).forEach(([aptitude, value]) => {
    addVector(vector, aptitudeVectors[aptitude], Math.max(0, value - 2) * 0.35);
  });
  addVector(vector, profileNuances[reyvateil.id] || {});
  return { id: reyvateil.id, name: reyvateil.name, specialtyTitle: combat.specialtyTitle, role: combat.role, vector };
});

export const resonanceTraitLabels: Record<ResonanceTrait, string> = {
  mercy: 'the life still within reach',
  duty: 'the burden that had to be carried',
  truth: 'truth after comfort failed',
  control: 'a consequence you could contain',
  defiance: 'refusal of an imposed choice',
  sacrifice: 'a cost paid personally',
  inquiry: 'understanding before certainty',
  guile: 'an indirect path through danger',
  communion: 'the right of others to share the choice',
  endurance: 'survival without surrendering the promise',
  ambition: 'power dangerous enough to matter',
  adaptation: 'change before disappearance',
  judgment: 'a line that still had to be drawn',
};

export const collectAnswerVector = (answerIds: readonly string[]): ResonanceVector => {
  const result = emptyVector();
  const choices = new Map(resonanceQuestions.flatMap((question) => question.choices).map((entry) => [entry.id, entry]));
  answerIds.forEach((answerId) => {
    const answer = choices.get(answerId);
    if (answer) addVector(result, answer.affinities);
  });
  return result;
};

const cosineSimilarity = (left: ResonanceVector, right: ResonanceVector) => {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  resonanceTraits.forEach((trait) => {
    dot += left[trait] * right[trait];
    leftMagnitude += left[trait] ** 2;
    rightMagnitude += right[trait] ** 2;
  });
  if (!leftMagnitude || !rightMagnitude) return 0;
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
};

export const resolveReyvateilResonance = (answerIds: readonly string[], availableIds?: readonly string[]): ResonanceResult | null => {
  const answerVector = collectAnswerVector(answerIds);
  const allowed = availableIds ? new Set(availableIds) : null;
  const candidates = reyvateilResonanceProfiles
    .filter((profile) => !allowed || allowed.has(profile.id))
    .map((profile) => ({ profile, score: cosineSimilarity(answerVector, profile.vector) }))
    .sort((left, right) => right.score - left.score || left.profile.id.localeCompare(right.profile.id));
  if (!candidates.length) return null;
  const topTraits = [...resonanceTraits]
    .sort((left, right) => answerVector[right] - answerVector[left] || left.localeCompare(right))
    .slice(0, 3);
  return { ...candidates[0], topTraits };
};
