import catalogJson from '../generated/reyvateilCombatCatalog.json';
import { ReyvateilCombatProfile } from '../types/Reyvateils';
import { resolveAbilityInvocation } from '../utils/abilityHymmnos';
import { combatDamageTypeIds } from './combatDamageTypes';

const catalog = catalogJson as Record<string, ReyvateilCombatProfile>;

describe('Reyvateil combat catalog', () => {
  it('gives all forty-two Reyvateils complete, distinct identity pools', () => {
    expect(Object.keys(catalog)).toHaveLength(42);
    Object.values(catalog).forEach((profile) => {
      expect(profile.specialtyTitle).toBeTruthy();
      expect(Object.keys(profile.aptitudes)).toEqual(['force', 'finesse', 'guard', 'resonance', 'focus', 'tempo']);
      expect(profile.combatAbilities).toHaveLength(10);
      expect([4, 6]).toContain(profile.combatSongs.length);
      expect(profile.socialAbilities).toHaveLength(10);
      expect(new Set(profile.combatAbilities.map((ability) => ability.id)).size).toBe(10);
      expect(new Set(profile.socialAbilities.map((ability) => ability.id)).size).toBe(10);
      expect(new Set(profile.combatSongs.map((song) => song.id)).size).toBe(profile.combatSongs.length);
      expect(profile.derived.maxHp).toBeGreaterThan(0);
      expect(profile.derived.defense).toBeGreaterThan(0);
    });
    expect(new Set(Object.values(catalog).map((profile) => profile.specialtyTitle)).size).toBe(42);
  });

  it('uses the canonical damage registry and contains no undefined Guard-test language', () => {
    Object.values(catalog).forEach((profile) => {
      expect(combatDamageTypeIds).toContain(profile.damageType);
      expect(profile.combatAbilities.every((ability) => combatDamageTypeIds.includes(ability.damageType))).toBe(true);
      expect(profile.combatSongs.every((song) => combatDamageTypeIds.includes(song.damageType))).toBe(true);
      expect([...profile.combatAbilities, ...profile.combatSongs].map((ability) => ability.description).join(' ')).not.toMatch(/Guard tests?/i);
    });
  });

  it('gives every Reyvateil a level-gated Song progression with only one or two starting Songs', () => {
    Object.values(catalog).forEach((profile) => {
      const startingSongs = profile.combatSongs.filter((song) => song.levelRequired === 1);
      expect(startingSongs.length).toBeGreaterThanOrEqual(1);
      expect(startingSongs.length).toBeLessThanOrEqual(2);
      expect(profile.combatSongs.some((song) => song.levelRequired > 1)).toBe(true);
      expect(profile.combatSongs.some((song) => song.songForm === 'verse')).toBe(true);
      expect(profile.combatSongs.some((song) => song.songForm === 'canticle')).toBe(true);
      expect(profile.growth.songCapacity).toBe(profile.combatSongs.length);
    });
  });

  it('uses only resolvable, unique canonical Hymmnos invocations per combat pool', () => {
    Object.values(catalog).forEach((profile) => {
      const invocations = profile.combatAbilities.map((ability) => resolveAbilityInvocation({ ...ability, cooldown: 0, icon: '' }).headword);
      expect(new Set(invocations).size).toBe(10);
      const songInvocations = profile.combatSongs.map((ability) => resolveAbilityInvocation({ ...ability, cooldown: 0, icon: '' }).headword);
      expect(new Set(songInvocations).size).toBe(profile.combatSongs.length);
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
