import { assertEncounterParticipants, getEncounterParticipantIssues, serializeEncounterParticipants } from './encounter';

describe('serializeEncounterParticipants', () => {
  it('removes undefined optional fields before writing a Firestore array', () => {
    const [participant] = serializeEncounterParticipants([{
      id: 'player-a', sourceId: 'a', kind: 'player', name: 'Aster', hp: 10, maxHp: 10,
      initiative: undefined, armorClass: undefined, monsterTier: undefined, songHearing: undefined,
    }]);

    expect(participant).toEqual({
      id: 'player-a', sourceId: 'a', kind: 'player', name: 'Aster', hp: 10, maxHp: 10,
    });
    expect(Object.values(participant)).not.toContain(undefined);
  });

  it('preserves valid optional combat fields', () => {
    expect(serializeEncounterParticipants([{
      id: 'monster-a', sourceId: 'slime', kind: 'monster', name: 'Slime', hp: 20, maxHp: 20,
      initiative: 12, armorClass: 14, monsterTier: 'Greater', songHearing: 'audible', dead: false,
    }])[0]).toMatchObject({ initiative: 12, armorClass: 14, monsterTier: 'Greater', songHearing: 'audible', dead: false });
  });

  it('rejects missing required combat values with the combatant name', () => {
    const incomplete = [{
      id: 'monster-a', sourceId: 'construct', kind: 'monster' as const, name: 'V2-UNM0V3D', hp: 0, maxHp: 0,
    }];
    expect(getEncounterParticipantIssues(incomplete)).toEqual(['V2-UNM0V3D: Max HP, current HP, AC']);
    expect(() => assertEncounterParticipants(incomplete)).toThrow('V2-UNM0V3D');
  });

  it('allows zero current HP while saving an active battle', () => {
    expect(() => assertEncounterParticipants([{
      id: 'monster-a', sourceId: 'slime', kind: 'monster', name: 'Slime', hp: 0, maxHp: 20, armorClass: 12,
    }], true)).not.toThrow();
  });

  it('allows an unprotected player at zero HP to enter combat but still rejects a zero-HP monster', () => {
    expect(() => assertEncounterParticipants([{
      id: 'player-a', sourceId: 'a', kind: 'player', name: 'Aster', hp: 0, maxHp: 20, armorClass: 12,
    }])).not.toThrow();
    expect(() => assertEncounterParticipants([{
      id: 'monster-a', sourceId: 'slime', kind: 'monster', name: 'Slime', hp: 0, maxHp: 20, armorClass: 12,
    }])).toThrow('current HP');
  });
});
