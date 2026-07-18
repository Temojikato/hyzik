import { doc } from 'firebase/firestore';
import { db } from '../Firebase';
import { Item } from '../types/Reyvateils';

export const serializeInventory = (items: Item[]) => items
  .map((item) => ({ reference: doc(db, 'items', item.id), quantity: Math.max(0, item.quantity || 0) }))
  .filter((item) => item.quantity > 0);
