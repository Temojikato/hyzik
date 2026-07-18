import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  documentId,
  DocumentReference,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../Firebase';
import {
  CampaignSong,
  CampaignState,
  Encounter,
  EncounterMapFrame,
  EncounterParticipant,
  GrantDelivery,
  GrantKind,
  MessageStatus,
  PlayerProfile,
  PrivateMessage,
  UnlockedLexiconEntry,
} from '../types/Campaign';
import { assertEncounterParticipants, serializeEncounterParticipants } from '../utils/encounter';

export const subscribeCampaignState = (
  onValue: (state: CampaignState) => void,
  onError?: (error: Error) => void,
) => onSnapshot(doc(db, 'campaign', 'current'), (snapshot) => {
  onValue(snapshot.exists() ? (snapshot.data() as CampaignState) : {});
}, onError);

export const subscribeSongs = (
  onValue: (songs: CampaignSong[]) => void,
  onError?: (error: Error) => void,
) => onSnapshot(collection(db, 'songs'), (snapshot) => {
  onValue(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as CampaignSong)));
}, onError);

export const setCurrentSong = async (song: CampaignSong) => {
  await setDoc(doc(db, 'campaign', 'current'), {
    currentSongId: song.id,
    currentSongTitle: song.title,
    youtubeUrl: song.youtubeUrl || '',
    songLibraryInitialized: true,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const saveSong = async (song: CampaignSong) => {
  await setDoc(doc(db, 'songs', song.id), { ...song, updatedAt: serverTimestamp() }, { merge: true });
  await setDoc(doc(db, 'campaign', 'current'), { songLibraryInitialized: true, updatedAt: serverTimestamp() }, { merge: true });
};

export const deleteSong = async (songId: string) => {
  await deleteDoc(doc(db, 'songs', songId));
  const stateRef = doc(db, 'campaign', 'current');
  const state = await getDoc(stateRef);
  await setDoc(stateRef, {
    songLibraryInitialized: true,
    ...(state.data()?.currentSongId === songId ? { currentSongId: '', currentSongTitle: '', youtubeUrl: '' } : {}),
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const subscribePrivateMessages = (
  userId: string,
  onValue: (messages: PrivateMessage[]) => void,
  onError?: (error: Error) => void,
) => {
  const messagesQuery = query(
    collection(db, 'privateMessages'),
    where('recipientId', '==', userId),
  );
  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as PrivateMessage));
    messages.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    onValue(messages);
  }, onError);
};

export const updateMessageStatus = async (messageId: string, status: MessageStatus) => {
  const timestampField = status === 'accepted' ? 'acceptedAt' : status === 'read' ? 'readAt' : undefined;
  await updateDoc(doc(db, 'privateMessages', messageId), {
    status,
    ...(timestampField ? { [timestampField]: serverTimestamp() } : {}),
  });
};

export const discardPrivateMessage = async (messageId: string) => {
  await deleteDoc(doc(db, 'privateMessages', messageId));
};

export const sendPrivateMessages = async (
  senderId: string,
  recipientIds: string[],
  body: string,
  subject?: string,
) => {
  const batch = writeBatch(db);
  const groupId = crypto.randomUUID();
  recipientIds.forEach((recipientId) => {
    const messageRef = doc(collection(db, 'privateMessages'));
    batch.set(messageRef, {
      groupId,
      senderId,
      recipientId,
      body,
      subject: subject || '',
      status: 'waiting',
      createdAt: serverTimestamp(),
    });
  });
  await batch.commit();
  return groupId;
};

export const sendGrantDeliveries = async (input: {
  senderId: string;
  recipientIds: string[];
  kind: GrantKind;
  resourceId: string;
  label: string;
  amount?: number;
  conditionType?: string;
  conditionColor?: string;
}) => {
  const batch = writeBatch(db);
  const groupId = crypto.randomUUID();
  input.recipientIds.forEach((recipientId) => {
    const deliveryRef = doc(collection(db, 'grantDeliveries'));
    batch.set(deliveryRef, {
      groupId,
      senderId: input.senderId,
      recipientId,
      kind: input.kind,
      resourceId: input.resourceId,
      label: input.label,
      amount: Math.max(1, Math.floor(Number(input.amount || 1))),
      conditionType: input.conditionType || '',
      conditionColor: input.conditionColor || '',
      source: 'admin',
      status: 'waiting',
      audienceIds: [],
      createdAt: serverTimestamp(),
    });
  });
  await batch.commit();
  return groupId;
};

export const subscribeGrantDeliveries = (
  userId: string,
  onValue: (deliveries: GrantDelivery[]) => void,
  onError?: (error: Error) => void,
) => {
  const own = new Map<string, GrantDelivery>();
  const shared = new Map<string, GrantDelivery>();
  const publish = () => {
    const deliveries = Array.from(new Map([...own, ...shared]).values());
    deliveries.sort((a, b) => (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0));
    onValue(deliveries);
  };
  const ownUnsubscribe = onSnapshot(
    query(collection(db, 'grantDeliveries'), where('recipientId', '==', userId)),
    (snapshot) => {
      own.clear();
      snapshot.docs.forEach((entry) => own.set(entry.id, { id: entry.id, ...entry.data() } as GrantDelivery));
      publish();
    },
    onError,
  );
  const sharedUnsubscribe = onSnapshot(
    query(collection(db, 'grantDeliveries'), where('audienceIds', 'array-contains', userId)),
    (snapshot) => {
      shared.clear();
      snapshot.docs.forEach((entry) => shared.set(entry.id, { id: entry.id, ...entry.data() } as GrantDelivery));
      publish();
    },
    onError,
  );
  return () => { ownUnsubscribe(); sharedUnsubscribe(); };
};

export const listPlayers = async (): Promise<PlayerProfile[]> => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as PlayerProfile));
};

export const subscribePlayers = (
  onValue: (players: PlayerProfile[]) => void,
  onError?: (error: Error) => void,
) => onSnapshot(collection(db, 'users'), (snapshot) => {
  onValue(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as PlayerProfile)));
}, onError);

export const grantCyphers = async (userId: string, cypherIds: string[]) => {
  await updateDoc(doc(db, 'users', userId), { unlockedCyphers: cypherIds });
};

export const setPlayerActive = async (userId: string, active: boolean) => {
  await updateDoc(doc(db, 'users', userId), {
    active,
    ...(active ? { activatedAt: serverTimestamp() } : { pausedAt: serverTimestamp() }),
  });
};

export const updatePlayerName = async (userId: string, displayName: string) => {
  await updateDoc(doc(db, 'users', userId), { displayName: displayName.trim() });
};

export const setPlayersActive = async (userIds: string[], active: boolean) => {
  const batch = writeBatch(db);
  userIds.forEach((userId) => batch.update(doc(db, 'users', userId), {
    active,
    ...(active ? { activatedAt: serverTimestamp() } : { pausedAt: serverTimestamp() }),
  }));
  await batch.commit();
};

export const grantCondition = async (
  recipientIds: string[],
  condition: { name: string; type?: string; color?: string },
  amount: number,
) => runTransaction(db, async (transaction) => {
  const refs = recipientIds.map((id) => doc(db, 'users', id));
  const snapshots = await Promise.all(refs.map((ref) => transaction.get(ref)));
  snapshots.forEach((snapshot, index) => {
    const existing = (snapshot.data()?.conditions || []) as Array<string | { name: string; amount?: number; type?: string; color?: string }>;
    const normalized = existing.map((entry) => typeof entry === 'string' ? { name: entry, amount: 0 } : { ...entry });
    const match = normalized.find((entry) => entry.name.toLowerCase() === condition.name.toLowerCase());
    if (match) match.amount = Math.max(0, Number(match.amount || 0) + amount);
    else if (amount > 0) normalized.push({ ...condition, amount });
    transaction.update(refs[index], { conditions: normalized.filter((entry) => Number(entry.amount || 0) > 0) });
  });
});

export const grantItem = async (
  recipientIds: string[],
  itemRef: DocumentReference,
  quantity: number,
) => runTransaction(db, async (transaction) => {
  const refs = recipientIds.map((id) => doc(db, 'users', id));
  const snapshots = await Promise.all(refs.map((ref) => transaction.get(ref)));
  snapshots.forEach((snapshot, index) => {
    const inventory = [...(snapshot.data()?.inventory || [])] as Array<{ reference: DocumentReference; quantity: number }>;
    const match = inventory.find((entry) => entry.reference?.path === itemRef.path);
    if (match) match.quantity = Math.max(0, Number(match.quantity || 0) + quantity);
    else if (quantity > 0) inventory.push({ reference: itemRef, quantity });
    transaction.update(refs[index], { inventory: inventory.filter((entry) => entry.quantity > 0) });
  });
});

export const grantCypherToPlayers = async (recipientIds: string[], cypherId: string) => {
  const batch = writeBatch(db);
  recipientIds.forEach((id) => batch.update(doc(db, 'users', id), { unlockedCyphers: arrayUnion(cypherId) }));
  await batch.commit();
};

export const subscribeEncounter = (
  encounterId: string,
  onValue: (encounter: Encounter | null) => void,
  onError?: (error: Error) => void,
) => onSnapshot(doc(db, 'encounters', encounterId), (snapshot) => {
  onValue(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Encounter) : null);
}, onError);

export const startEncounter = async (input: {
  name: string;
  song?: CampaignSong;
  map?: EncounterMapFrame;
  participants: EncounterParticipant[];
}) => {
  assertEncounterParticipants(input.participants);
  const encounterRef = doc(collection(db, 'encounters'));
  const batch = writeBatch(db);
  const participants = serializeEncounterParticipants(input.participants);
  batch.set(encounterRef, {
    name: input.name,
    status: 'active',
    songId: input.song?.id || '',
    map: input.map || null,
    participants,
    createdAt: serverTimestamp(),
    startedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(doc(db, 'campaign', 'current'), {
    activeEncounterId: encounterRef.id,
    battleActive: true,
    timersPaused: true,
    timersPausedAt: serverTimestamp(),
    ...(input.song ? { currentSongId: input.song.id, currentSongTitle: input.song.title, youtubeUrl: input.song.youtubeUrl || '' } : {}),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  await batch.commit();
  return encounterRef.id;
};

export const updateEncounterParticipants = async (encounterId: string, participants: EncounterParticipant[]) => {
  assertEncounterParticipants(participants, true);
  await updateDoc(doc(db, 'encounters', encounterId), { participants: serializeEncounterParticipants(participants), updatedAt: serverTimestamp() });
};

export const endEncounter = async (encounterId: string) => {
  const batch = writeBatch(db);
  batch.update(doc(db, 'encounters', encounterId), { status: 'complete', endedAt: serverTimestamp(), updatedAt: serverTimestamp() });
  batch.set(doc(db, 'campaign', 'current'), {
    activeEncounterId: '', battleActive: false, timersPaused: false, timersResumedAt: serverTimestamp(), updatedAt: serverTimestamp(),
  }, { merge: true });
  await batch.commit();
};

export const subscribeUnlockedLexicon = (
  cypherIds: string[],
  onValue: (entries: UnlockedLexiconEntry[]) => void,
  onError?: (error: Error) => void,
) => {
  if (!cypherIds.length) {
    onValue([]);
    return () => undefined;
  }
  const chunks: string[][] = [];
  for (let index = 0; index < cypherIds.length; index += 10) chunks.push(cypherIds.slice(index, index + 10));
  const values = new Map<number, UnlockedLexiconEntry[]>();
  const publish = () => onValue(Array.from(values.values()).flat());
  const unsubscribes = chunks.map((chunk, index) => onSnapshot(
    query(collection(db, 'hymmnosLexicon'), where('cypherId', 'in', chunk)),
    (snapshot) => {
      values.set(index, snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as UnlockedLexiconEntry)));
      publish();
    },
    onError,
  ));
  return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
};

export const removeMessagesForTesting = async (ids: string[]) => {
  const batch = writeBatch(db);
  ids.forEach((id) => batch.delete(doc(db, 'privateMessages', id)));
  await batch.commit();
};

// Referenced by admin migration tooling to ensure IDs can be fetched without exposing meanings in the bundle.
export const fetchLexiconEntriesById = async (ids: string[]) => {
  if (!ids.length) return [];
  const snapshot = await getDocs(query(collection(db, 'hymmnosLexicon'), where(documentId(), 'in', ids.slice(0, 10))));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as UnlockedLexiconEntry));
};
