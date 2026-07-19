import { EncounterParticipant } from '../types/Campaign';

export const getEncounterParticipantIssues = (
  participants: EncounterParticipant[],
  allowZeroHp = false,
): string[] => participants.flatMap((participant) => {
  const missing: string[] = [];
  if (!Number.isFinite(participant.maxHp) || participant.maxHp <= 0) missing.push('Max HP');
  const zeroHpIsValid = allowZeroHp || participant.kind === 'player';
  if (!Number.isFinite(participant.hp) || (zeroHpIsValid ? participant.hp < 0 : participant.hp <= 0)) missing.push('current HP');
  if (!Number.isFinite(participant.armorClass) || Number(participant.armorClass) <= 0) missing.push('AC');
  return missing.length ? [`${participant.name}: ${missing.join(', ')}`] : [];
});

export const assertEncounterParticipants = (participants: EncounterParticipant[], allowZeroHp = false) => {
  const issues = getEncounterParticipantIssues(participants, allowZeroHp);
  if (issues.length) throw new Error(`Missing authoritative combat data — ${issues.join('; ')}`);
};

export const serializeEncounterParticipants = (participants: EncounterParticipant[]): EncounterParticipant[] => participants.map((participant) => ({
  id: participant.id,
  sourceId: participant.sourceId,
  kind: participant.kind,
  name: participant.name,
  hp: participant.hp,
  maxHp: participant.maxHp,
  ...(Number.isFinite(participant.initiative) ? { initiative: participant.initiative } : {}),
  ...(Number.isFinite(participant.armorClass) ? { armorClass: participant.armorClass } : {}),
  ...(participant.monsterTier ? { monsterTier: participant.monsterTier } : {}),
  ...(participant.songHearing ? { songHearing: participant.songHearing } : {}),
  ...(participant.dead !== undefined ? { dead: participant.dead } : {}),
  ...(participant.turnResources ? { turnResources: participant.turnResources } : {}),
}));
