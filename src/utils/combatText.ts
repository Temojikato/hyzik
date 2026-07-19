import { PlayerCombatProfile } from '../types/Campaign';
import { CombatAptitudeKey } from '../types/Reyvateils';

const aptitudeLabels: Record<CombatAptitudeKey, string> = {
  force: 'Force', finesse: 'Finesse', guard: 'Guard', resonance: 'Resonance', focus: 'Focus', tempo: 'Tempo',
};

export const signedCombatValue = (value: number) => `${value >= 0 ? '+' : ''}${value}`;

export const resolveCombatText = (
  description: string,
  combat: Pick<PlayerCombatProfile, 'aptitudes' | 'derived'>,
) => {
  let resolved = description
    .replace(/Technique attack(?!\s*\()/g, `Technique attack (${signedCombatValue(combat.derived.techniqueAttack)})`)
    .replace(/Song attack(?!\s*\()/g, `Song attack (${signedCombatValue(combat.derived.songAttack)})`)
    .replace(/your Save Difficulty(?!\s*\()/gi, `your Save Difficulty (${combat.derived.saveDifficulty})`)
    .replace(/Defen[cs]e equal to yours/gi, `Defence ${combat.derived.defense}`);

  (Object.keys(aptitudeLabels) as CombatAptitudeKey[]).forEach((key) => {
    const label = aptitudeLabels[key];
    const value = combat.aptitudes[key];
    resolved = resolved
      .replace(new RegExp(`\\+\\s*${label}\\b`, 'g'), `+ ${value}`)
      .replace(new RegExp(`\\+${label}\\b`, 'g'), `+${value}`)
      .replace(new RegExp(`by ${label}\\b`, 'g'), `by ${value} (${label})`)
      .replace(new RegExp(`equal to ${label}\\b`, 'g'), `equal to ${value} (${label})`)
      .replace(new RegExp(`deal ${label} ([a-z]+) damage`, 'g'), `deal ${value} $1 damage`)
      .replace(new RegExp(`takes ${label} ([a-z]+) damage`, 'g'), `takes ${value} $1 damage`)
      .replace(new RegExp(`take ${label} ([a-z]+) damage`, 'g'), `take ${value} $1 damage`)
      .replace(new RegExp(`gain (\\d+) ${label}\\b`, 'g'), (_, amount) => `gain +${amount} ${label} (${value} becomes ${value + Number(amount)})`)
      .replace(new RegExp(`using your ${label} bonus`, 'g'), `using your ${label} bonus (${signedCombatValue(value)})`)
      .replace(new RegExp(`advantage on your next ${label} test`, 'g'), `advantage on your next ${label} (${signedCombatValue(value)}) test`);
  });

  return resolved;
};

export const resolveStrikeText = (combat: Pick<PlayerCombatProfile, 'aptitudes' | 'derived'>) => {
  const force = combat.aptitudes.force;
  const finesse = combat.aptitudes.finesse;
  return `Make a melee attack against the target's Defence using Force (${signedCombatValue(force)}) or Finesse (${signedCombatValue(finesse)}). On a hit, deal 1d6 + ${force} damage with Force, or 1d6 + ${finesse} with Finesse.`;
};

export const resolveBraceText = (combat: Pick<PlayerCombatProfile, 'aptitudes' | 'derived'>) => (
  `Gain +2 Defence (${combat.derived.defense} becomes ${combat.derived.defense + 2}) and attacks against you have disadvantage until the start of your next turn.`
);
