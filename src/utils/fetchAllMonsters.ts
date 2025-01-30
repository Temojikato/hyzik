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


    for (const [speciesName, speciesData] of Object.entries(data)) {

      const speciesObj: MonsterSpecies = {
        categoryId,
        name: speciesName,
        locked: (speciesData as any).Locked,
        loreLocked: (speciesData as any).LoreLocked,
        Lore: (speciesData as any).Lore,
        Tiers: (speciesData as any).Tiers
      };
      result.push(speciesObj);
    }
  }

  return result;
}


export async function fetchAllCategories(): Promise<MonsterCategory[]> {
  const categories: MonsterCategory[] = [];

  const categoriesSnap = await getDocs(collection(db, 'bestiary'));
  for (const categoryDoc of categoriesSnap.docs) {
    const categoryId = categoryDoc.id; // e.g., "slime"
    const data = categoryDoc.data();

    // Assuming each category document has a 'description' field
    const categoryObj: MonsterCategory = {
      id: categoryId,
      name: capitalizeFirstLetter(categoryId), // Optional: Modify as needed
      description: data.description || 'No description available.',
    };

    categories.push(categoryObj);
  }

  return categories;
}

export interface MonsterCategory {
  id: string; // Category ID (e.g., "slime")
  name: string; // Display name (e.g., "Slime")
  description: string; // Description of the category
  // Add more fields if necessary
}


function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}