import { doc, runTransaction } from "firebase/firestore";
import { db } from "../Firebase";
import { LootEntry } from "../types/BestiaryTypes";
import { Item } from "../types/Reyvateils";

export function rollLoot(loot: LootEntry[]): string[] {
  const guaranteedItems: string[] = [];
  const rollCandidates: { item: string; chance: number }[] = [];

  loot.forEach(entry => {
    if (entry.itemChance === 100) {
      guaranteedItems.push(entry.itemName);
    } else {
      rollCandidates.push({ item: entry.itemName, chance: entry.itemChance });
    }
  });

  let extraDrop: string | null = null;
  if (rollCandidates.length > 0) {
    // Sum the chance values of the non-guaranteed items.
    const totalWeight = rollCandidates.reduce((sum, candidate) => sum + candidate.chance, 0);
    // Generate a random number between 0 and totalWeight.
    const randomRoll = Math.random() * totalWeight;
    let cumulative = 0;
    for (const candidate of rollCandidates) {
      cumulative += candidate.chance;
      if (randomRoll < cumulative) {
        extraDrop = candidate.item;
        break;
      }
    }
  }

  if (extraDrop) {
    return [...guaranteedItems, extraDrop];
  } else {
    return guaranteedItems;
  }
}


export async function addLootToInventory(
  lootItems: string[],
  currentUser: { uid: string },
  toast: (options: any) => void,
  setInventory: (newInv: any[]) => void,
  inventory: any[]
): Promise<void> {
  try {
    const userRef = doc(db, 'users', currentUser.uid);
    // Clone your local inventory array.
    let newInventory = [...inventory];
    
    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) {
        throw new Error('User data not found.');
      }
      
      // For each loot item, update the inventory.
      for (const itemName of lootItems) {
        // Get a reference to the item document. We assume the document id is the same as the item name.
        const itemRef = doc(db, 'items', itemName);
        const itemSnap = await transaction.get(itemRef);
        if (!itemSnap.exists()) {
          console.warn(`Item "${itemName}" not found in items collection.`);
          continue;
        }
        // Check if the item already exists in the inventory.
        const existingItemIndex = newInventory.findIndex(
          (item) => item.reference.id === itemName
        );
        if (existingItemIndex !== -1) {
          // Increase quantity by 1.
          newInventory[existingItemIndex].quantity += 1;
        } else {
          // Otherwise, add the new item with quantity 1.
          newInventory.push({ ...itemSnap.data() as Item, reference: itemRef, quantity: 1 });
        }
      }
      
      // Update the user's inventory in Firestore.
      transaction.update(userRef, {
        inventory: newInventory.map((item) => ({
          reference: item.reference,
          quantity: item.quantity,
        })),
      });
    });
    
    // Update local inventory state.
    setInventory(newInventory);
    toast({
      title: 'Loot Added',
      description: `Added: ${lootItems.join(', ')}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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