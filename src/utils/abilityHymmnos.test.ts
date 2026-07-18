import reyvateilsJson from '../reyvateils.json';
import { Reyvateil } from '../types/Reyvateils';
import { getAbilitySpokenForm, resolveAbilityInvocation } from './abilityHymmnos';

describe('ability Hymmnos resolver', () => {
  it('maps common effect families to registered canonical words', () => {
    expect(resolveAbilityInvocation({ name: 'Flame Lance', description: 'Burn a target', cooldown: 10, icon: '' }).headword).toBe('fayra rum');
    expect(resolveAbilityInvocation({ name: 'Guardian Wall', description: 'Protect an ally', cooldown: 10, icon: '' }).headword).toBe('khal cecet');
    expect(resolveAbilityInvocation({ name: 'Restoring Touch', description: 'Heal a wound', cooldown: 10, icon: '' }).headword).toBe('y.y.');
  });

  it('falls back to a real lexicon entry instead of inventing a word', () => {
    const invocation = resolveAbilityInvocation({ name: 'Unclassified Effect', description: 'An unusual occurrence', cooldown: 10, icon: '' });
    expect(invocation.headword).toBe('hymmnos');
    expect(invocation.pronunciation).toBeTruthy();
    expect(invocation.lexiconEntryId).toBeTruthy();
  });

  it('gives every base and evolution ability a unique invocation within its visible set', () => {
    const reyvateils = reyvateilsJson as unknown as Reyvateil[];
    const collisions: string[] = [];
    reyvateils.forEach((reyvateil) => {
      const abilitySets = [
        reyvateil.abilities,
        ...reyvateil.evolutionOptions.map((option) => option.enhancedAbilities),
      ];
      abilitySets.forEach((abilities, setIndex) => {
        const names = abilities.map((ability) => ability.name.toLowerCase());
        const invocations = abilities.map((ability) => {
          const invocation = resolveAbilityInvocation(ability);
          expect(invocation.parts).toHaveLength(invocation.headword.split(/\s+/).length);
          return invocation.headword.toLowerCase();
        });
        if (new Set(names).size !== names.length) collisions.push(`${reyvateil.name} set ${setIndex}: duplicate English name`);
        const duplicateInvocations = [...new Set(invocations.filter((invocation, index) => invocations.indexOf(invocation) !== index))];
        duplicateInvocations.forEach((invocation) => {
          const duplicateNames = abilities.filter((_, index) => invocations[index] === invocation).map((ability) => ability.name);
          collisions.push(`${reyvateil.name} set ${setIndex}: ${invocation} => ${duplicateNames.join(' | ')}`);
        });
      });
    });
    expect(collisions).toEqual([]);
  });

  it('uses canonical spoken pronunciation instead of written orthography', () => {
    const invocation = resolveAbilityInvocation({
      name: 'Nighttime Lift',
      description: 'Grow shadowy wings that fly without sound.',
      cooldown: 10,
      icon: '',
    });
    expect(invocation.headword).toContain('fhyu');
    expect(getAbilitySpokenForm(invocation)).toContain('hyuf');
    expect(getAbilitySpokenForm(invocation)).not.toContain('fhyu');
  });

  it('keeps Shadowlyn dark abilities semantically distinct', () => {
    const shadowlyn = (reyvateilsJson as unknown as Reyvateil[]).find((reyvateil) => reyvateil.id === 'shadowlyn');
    const darksight = shadowlyn?.abilities.find((ability) => ability.name === 'Darksight');
    const foragingFlicker = shadowlyn?.abilities.find((ability) => ability.name === 'Foraging Flicker');
    expect(darksight && resolveAbilityInvocation(darksight).headword).toBe('dazua eux');
    expect(foragingFlicker && resolveAbilityInvocation(foragingFlicker).headword).toBe('dazua yurfe fau');
  });
});
