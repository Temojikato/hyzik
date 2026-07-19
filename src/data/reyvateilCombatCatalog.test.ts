import catalogJson from '../generated/reyvateilCombatCatalog.json';
import { ReyvateilCombatProfile } from '../types/Reyvateils';
import { resolveAbilityInvocation } from '../utils/abilityHymmnos';

const catalog = catalogJson as Record<string, ReyvateilCombatProfile>;

describe('Reyvateil combat catalog', () => {
  it('gives all forty-two Reyvateils complete, distinct identity pools', () => {
    expect(Object.keys(catalog)).toHaveLength(42);
    Object.values(catalog).forEach((profile) => {
      expect(profile.specialtyTitle).toBeTruthy();
      expect(Object.keys(profile.aptitudes)).toEqual(['force', 'finesse', 'guard', 'resonance', 'focus', 'tempo']);
      expect(profile.combatAbilities).toHaveLength(10);
      expect(profile.socialAbilities).toHaveLength(10);
      expect(new Set(profile.combatAbilities.map((ability) => ability.id)).size).toBe(10);
      expect(new Set(profile.socialAbilities.map((ability) => ability.id)).size).toBe(10);
      expect(profile.derived.maxHp).toBeGreaterThan(0);
      expect(profile.derived.defense).toBeGreaterThan(0);
    });
    expect(new Set(Object.values(catalog).map((profile) => profile.specialtyTitle)).size).toBe(42);
  });

  it('uses only resolvable, unique canonical Hymmnos invocations per combat pool', () => {
    Object.values(catalog).forEach((profile) => {
      const invocations = profile.combatAbilities.map((ability) => resolveAbilityInvocation({ ...ability, cooldown: 0, icon: '' }).headword);
      expect(new Set(invocations).size).toBe(10);
    });
  });

  it('keeps every inherited draw viable through universal actions and five unique techniques', () => {
    Object.values(catalog).forEach((profile) => {
      const sample = profile.combatAbilities.slice(0, 5);
      expect(sample).toHaveLength(5);
      expect(sample.some((ability) => ability.actionType !== 'passive')).toBe(true);
    });
  });
});

