import combatCatalogJson from '../generated/reyvateilCombatCatalog.json';
import {
  resonanceQuestions,
  resonanceTraits,
  reyvateilResonanceProfiles,
  resolveReyvateilResonance,
} from './reyvateilResonanceQuiz';

describe('Reyvateil resonance trial', () => {
  it('presents a complete, non-class-labeled sequence of hard choices', () => {
    expect(resonanceQuestions).toHaveLength(13);
    const optionIds = new Set<string>();
    resonanceQuestions.forEach((question) => {
      expect(question.title).toBeTruthy();
      expect(question.question.length).toBeGreaterThan(120);
      expect(question.choices).toHaveLength(5);
      question.choices.forEach((choice) => {
        expect(optionIds.has(choice.id)).toBe(false);
        optionIds.add(choice.id);
        expect(choice.text.length).toBeGreaterThan(70);
        expect(Object.keys(choice.affinities).length).toBeGreaterThanOrEqual(3);
      });
    });

    const visibleCopy = resonanceQuestions
      .flatMap((question) => [question.title, question.question, ...question.choices.map((choice) => choice.text)])
      .join(' ')
      .toLowerCase();
    ['artificer', 'barbarian', 'bard', 'blood hunter', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard']
      .forEach((legacyClass) => expect(visibleCopy).not.toMatch(new RegExp(`\\b${legacyClass}\\b`)));
  });

  it('covers every resonance pressure and all forty-two combat identities', () => {
    const coveredTraits = new Set(resonanceQuestions.flatMap((question) => question.choices.flatMap((choice) => Object.keys(choice.affinities))));
    resonanceTraits.forEach((trait) => expect(coveredTraits.has(trait)).toBe(true));
    expect(reyvateilResonanceProfiles).toHaveLength(42);
    expect(new Set(reyvateilResonanceProfiles.map((profile) => profile.id))).toEqual(new Set(Object.keys(combatCatalogJson)));
    expect(new Set(reyvateilResonanceProfiles.map((profile) => JSON.stringify(profile.vector))).size).toBe(42);
  });

  it('resolves complete answer patterns deterministically across a broad result pool', () => {
    let state = 0x5eed1234;
    const next = () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state;
    };
    const outcomes = new Set<string>();
    let resolvedCount = 0;
    for (let run = 0; run < 25000; run += 1) {
      const answers = resonanceQuestions.map((question) => question.choices[next() % question.choices.length].id);
      const result = resolveReyvateilResonance(answers);
      if (result) {
        resolvedCount += 1;
        outcomes.add(result.profile.id);
      }
    }
    expect(resolvedCount).toBe(25000);
    const missingProfiles = reyvateilResonanceProfiles.map((profile) => profile.id).filter((id) => !outcomes.has(id));
    expect(missingProfiles).toEqual([]);
  });
});
