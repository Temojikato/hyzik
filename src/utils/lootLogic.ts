import { httpsCallable } from "firebase/functions";
import { functions } from "../Firebase";
import { Item } from "../types/Reyvateils";


export interface LootEntry {
  itemName: string;
  itemChance: number;
  quantity?: string; // e.g. "5" or "1-100"
}

export interface RolledLoot {
  itemName: string;
  quantity: number;
}

function parseQuantity(qty?: string): number {
  if (!qty) return 1; // default quantity is 1 if not provided
  const parts = qty.split("-");
  if (parts.length > 1) {
    // It's a range: roll a random integer between min and max (inclusive)
    const min = parseInt(parts[0], 10);
    const max = parseInt(parts[1], 10);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
    // Fixed quantity
    return parseInt(qty, 10) || 1;
  }
}

export function rollLoot(loot: LootEntry[]): RolledLoot[] {
  const guaranteedItems: RolledLoot[] = [];
  const rollCandidates: { item: string; chance: number; quantity?: string }[] = [];

  loot.forEach(entry => {
    if (entry.itemChance === 100) {
      // Guaranteed loot – include quantity parsed
      guaranteedItems.push({
        itemName: entry.itemName,
        quantity: parseQuantity(entry.quantity)
      });
    } else {
      rollCandidates.push({
        item: entry.itemName,
        chance: entry.itemChance,
        quantity: entry.quantity
      });
    }
  });

  let extraDrop: RolledLoot | null = null;
  if (rollCandidates.length > 0) {
    const totalWeight = rollCandidates.reduce((sum, candidate) => sum + candidate.chance, 0);
    const randomRoll = Math.random() * totalWeight;
    let cumulative = 0;
    for (const candidate of rollCandidates) {
      cumulative += candidate.chance;
      if (randomRoll < cumulative) {
        extraDrop = {
          itemName: candidate.item,
          quantity: parseQuantity(candidate.quantity)
        };
        break;
      }
    }
  }

  return extraDrop ? [...guaranteedItems, extraDrop] : guaranteedItems;
}

export async function addLootToInventory(
  lootItems: RolledLoot[],
  currentUser: { uid: string },
  toast: (options: any) => void,
  setInventory: (newInv: Item[]) => void,
  inventory: Item[]
): Promise<void> {
  try {
    const filteredLootItems = lootItems.filter(l => l.itemName.toLowerCase() !== "nothing");
    if (!filteredLootItems.length) {
      toast({ title: 'Loot Contained Nothing', description: 'The loot contained nothing useful.', status: 'info', duration: 3000, isClosable: true });
      return;
    }
    const result = await httpsCallable<{ items: Array<{ itemId: string; amount: number }> }, { count: number }>(functions, 'publishLoot')({
      items: filteredLootItems.map((entry) => ({ itemId: entry.itemName, amount: entry.quantity })),
    });
    void currentUser;
    void setInventory;
    void inventory;
    if (result.data.count !== 0) {
      const lootDescriptions = filteredLootItems
        .map(l => `${l.itemName} (x${l.quantity})`)
        .join(", ");
      toast({
        title: 'Loot discovered',
        description: `${lootDescriptions}. Choose Take or Show the group in the discovery popup.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (error: any) {
    console.error('Failed to add loot to inventory:', error);
    toast({
      title: 'Error',
      description: `Failed to add loot: ${error.message}`,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }
}
