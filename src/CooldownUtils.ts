// src/utils/cooldownUtils.ts

export const COOLDOWN_PREFIX = 'cooldown_';

/**
 * Sets the cooldown end time for a specific ability.
 * @param abilityName - The name of the ability.
 * @param endTime - The timestamp (in milliseconds) when the cooldown ends.
 */
export const setCooldown = (abilityName: string, endTime: number) => {
  localStorage.setItem(`${COOLDOWN_PREFIX}${abilityName}`, endTime.toString());
};

/**
 * Retrieves the cooldown end time for a specific ability.
 * @param abilityName - The name of the ability.
 * @returns The cooldown end time in milliseconds or null if not set.
 */
export const getCooldown = (abilityName: string): number | null => {
  const cooldown = localStorage.getItem(`${COOLDOWN_PREFIX}${abilityName}`);
  if (cooldown) {
    return parseInt(cooldown, 10);
  }
  return null;
};

/**
 * Clears the cooldown for a specific ability.
 * @param abilityName - The name of the ability.
 */
export const clearCooldown = (abilityName: string) => {
  localStorage.removeItem(`${COOLDOWN_PREFIX}${abilityName}`);
};

/**
 * Retrieves all active cooldowns.
 * @returns A record mapping ability names to their cooldown end times.
 */
export const getAllCooldowns = (): Record<string, number> => {
  const cooldowns: Record<string, number> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(COOLDOWN_PREFIX)) {
      const abilityName = key.replace(COOLDOWN_PREFIX, '');
      const endTime = parseInt(localStorage.getItem(key) || '0', 10);
      cooldowns[abilityName] = endTime;
    }
  }
  return cooldowns;
};
