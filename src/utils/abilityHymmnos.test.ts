import { resolveAbilityInvocation } from './abilityHymmnos';

describe('ability Hymmnos resolver', () => {
  it('maps common effect families to registered canonical words', () => {
    expect(resolveAbilityInvocation({ name: 'Flame Lance', description: 'Burn a target', cooldown: 10, icon: '' }).headword).toBe('fayra');
    expect(resolveAbilityInvocation({ name: 'Guardian Wall', description: 'Protect an ally', cooldown: 10, icon: '' }).headword).toBe('khal');
    expect(resolveAbilityInvocation({ name: 'Restoring Touch', description: 'Heal a wound', cooldown: 10, icon: '' }).headword).toBe('y.y.');
  });

  it('falls back to a real lexicon entry instead of inventing a word', () => {
    const invocation = resolveAbilityInvocation({ name: 'Unclassified Effect', description: 'An unusual power', cooldown: 10, icon: '' });
    expect(invocation.headword).toBe('hymmnos');
    expect(invocation.pronunciation).toBeTruthy();
    expect(invocation.lexiconEntryId).toBeTruthy();
  });
});
