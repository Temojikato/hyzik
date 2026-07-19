import { resolveBraceText, resolveCombatText, resolveStrikeText } from './combatText';

const combat = {
  aptitudes: { force: 4, finesse: 3, guard: 5, resonance: 2, focus: 3, tempo: 2 },
  derived: { maxHp: 36, defense: 18, initiative: 2, techniqueAttack: 6, songAttack: 4, saveDifficulty: 13, movement: 6 },
};

test('resolves player-owned aptitude formulas to their actual values', () => {
  expect(resolveCombatText('After an enemy misses you, deal 1d10 + Finesse metal damage.', combat))
    .toBe('After an enemy misses you, deal 1d10 + 3 metal damage.');
  expect(resolveCombatText('Reduce it by Guard and make a Technique attack against Defence.', combat))
    .toBe('Reduce it by 5 (Guard) and make a Technique attack (+6) against Defence.');
  expect(resolveCombatText('Gain temporary HP equal to Focus, then deal Resonance metal damage.', combat))
    .toBe('Gain temporary HP equal to 3 (Focus), then deal 2 metal damage.');
});

test('renders universal actions without hidden arithmetic or Guard tests', () => {
  expect(resolveStrikeText(combat)).toContain('Force (+4) or Finesse (+3)');
  expect(resolveStrikeText(combat)).toContain('1d6 + 4');
  expect(resolveBraceText(combat)).toContain('18 becomes 20');
  expect(resolveBraceText(combat)).not.toMatch(/Guard test/i);
});
