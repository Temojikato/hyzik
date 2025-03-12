// src/utils/fetchAllNPCs.ts
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { NPC } from '../types/ResidentCodexTypes';

export async function fetchAllNPCs(): Promise<NPC[]> {
  const result: NPC[] = [];

  // Fetch all documents from the 'residentCodex' collection
  const npcSnap = await getDocs(collection(db, 'residentCodex'));
  // Each document in 'residentCodex' is expected to contain an object 
  // where keys are NPC names and values are their data.
  for (const npcDoc of npcSnap.docs) {
    const data = npcDoc.data(); // e.g., { "Elara Moonshadow": { ... }, "Thorn Silvertongue": { ... } }
    for (const [npcName, npcData] of Object.entries(data)) {
      const npcObj: NPC = {
        id: npcName,
        // We no longer store a simple string in basicInfo; expect an object.
        basicInfo: (npcData as any).basicInfo,
        imageUrl: (npcData as any).imageUrl,
        imageFiles: (npcData as any).imageFiles,
        categories: (npcData as any).categories, // e.g. { families: [...], workplace: [...], faction: [...] }
        lore: (npcData as any).lore, // structured lore with multiple levels and unlockedtier per field
        locked: (npcData as any).locked || false,
        categoryLocks: (npcData as any).categoryLocks
      };
      result.push(npcObj);
    }
  }
  return result;
}

export async function getNPCByName(name: string): Promise<NPC | null> {
  try {
    const npcs = await fetchAllNPCs();
    const searchLower = name.toLowerCase();
    // Look inside basicInfo.name for a match
    const matches = npcs.filter(npc =>
      (npc.basicInfo as any).name.toLowerCase().includes(searchLower)
    );
    if (matches.length === 1) {
      return matches[0];
    } else if (matches.length > 1) {
      const exactMatch = matches.find(npc => (npc.basicInfo as any).name.toLowerCase() === searchLower);
      return exactMatch || matches[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error in getNPCByName:", error);
    return null;
  }
}

// Optional helper to capitalize names if needed
function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
