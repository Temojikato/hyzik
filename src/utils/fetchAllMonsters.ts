// src/utils/fetchAllMonsters.ts
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { MonsterSpecies } from '../types/BestiaryTypes';

export async function fetchAllMonstersFromNestedDocs(): Promise<MonsterSpecies[]> {
  const result: MonsterSpecies[] = [];

  const categoriesSnap = await getDocs(collection(db, 'bestiary'));
  // Each doc in 'bestiary' is a category doc (e.g. Slime, Construct)
  for (const categoryDoc of categoriesSnap.docs) {
    const categoryId = categoryDoc.id; // e.g. "Slime"
    const data = categoryDoc.data();   // an object with speciesName => speciesData

    // data might look like:
    // {
    //   "Fire Slime": { locked: false, loreLocked: true, Lore: {...}, Tiers: {...} },
    //   "Earth Slime": { ... }
    // }

    // Now we iterate over each speciesName in this doc
    for (const [speciesName, speciesData] of Object.entries(data)) {
      // speciesName is "Fire Slime", speciesData is { locked: false, loreLocked: true, ... }
      // Convert to MonsterSpecies
      const speciesObj: MonsterSpecies = {
        categoryId,
        name: speciesName,
        locked: (speciesData as any).locked,
        loreLocked: (speciesData as any).loreLocked,
        Lore: (speciesData as any).Lore,
        Tiers: (speciesData as any).Tiers
      };
      result.push(speciesObj);
    }
  }

  return result;
}
