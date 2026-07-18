import {
  collection,
  doc,
  documentId,
  getDocs,
  onSnapshot,
  query,
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
  MessageStatus,
  PlayerProfile,
  PrivateMessage,
  UnlockedLexiconEntry,
} from '../types/Campaign';

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
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const saveSong = async (song: CampaignSong) => {
  await setDoc(doc(db, 'songs', song.id), { ...song, updatedAt: serverTimestamp() }, { merge: true });
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
