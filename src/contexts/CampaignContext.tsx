import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import fallbackSongsJson from '../generated/campaignSongs.json';
import publicLexiconJson from '../generated/hymmnosPublicIndex.json';
import { useAuth } from './AuthContext';
import { subscribeCampaignState, subscribeSongs, subscribeUnlockedLexicon } from '../services/campaignService';
import { CampaignSong, CampaignState, PublicLexiconEntry, UnlockedLexiconEntry } from '../types/Campaign';

interface CampaignContextValue {
  campaignState: CampaignState;
  songs: CampaignSong[];
  currentSong: CampaignSong | null;
  publicLexicon: PublicLexiconEntry[];
  unlockedLexicon: Map<string, UnlockedLexiconEntry>;
  lexiconAvailable: boolean;
}

const fallbackSongs = fallbackSongsJson as CampaignSong[];
const publicLexicon = publicLexiconJson as PublicLexiconEntry[];

const CampaignContext = createContext<CampaignContextValue>({
  campaignState: {},
  songs: fallbackSongs,
  currentSong: fallbackSongs[0] || null,
  publicLexicon,
  unlockedLexicon: new Map(),
  lexiconAvailable: false,
});

export const useCampaign = () => useContext(CampaignContext);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, profile } = useAuth();
  const [campaignState, setCampaignState] = useState<CampaignState>({});
  const [remoteSongs, setRemoteSongs] = useState<CampaignSong[]>([]);
  const [unlockedEntries, setUnlockedEntries] = useState<UnlockedLexiconEntry[]>([]);
  const [lexiconAvailable, setLexiconAvailable] = useState(true);
  const unlockedCypherKey = (profile?.unlockedCyphers || []).join('|');

  useEffect(() => {
    if (!currentUser) return undefined;
    const unsubscribeState = subscribeCampaignState(setCampaignState, () => setCampaignState({}));
    const unsubscribeSongs = subscribeSongs(setRemoteSongs, () => setRemoteSongs([]));
    return () => { unsubscribeState(); unsubscribeSongs(); };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return undefined;
    setLexiconAvailable(true);
    return subscribeUnlockedLexicon(unlockedCypherKey ? unlockedCypherKey.split('|') : [], setUnlockedEntries, () => {
      setUnlockedEntries([]);
      setLexiconAvailable(false);
    });
  }, [currentUser, unlockedCypherKey]);

  const songs = useMemo(() => {
    if (!remoteSongs.length) return fallbackSongs;
    const remoteById = new Map(remoteSongs.map((song) => [song.id, song]));
    return fallbackSongs.map((song) => ({ ...song, ...remoteById.get(song.id) })).concat(
      remoteSongs.filter((song) => !fallbackSongs.some((fallback) => fallback.id === song.id)),
    );
  }, [remoteSongs]);

  const currentSong = useMemo(() => {
    if (campaignState.currentSongId) return songs.find((song) => song.id === campaignState.currentSongId) || null;
    return songs[0] || null;
  }, [campaignState.currentSongId, songs]);

  const unlockedLexicon = useMemo(() => new Map(unlockedEntries.map((entry) => [entry.id, entry])), [unlockedEntries]);

  return (
    <CampaignContext.Provider value={{ campaignState, songs, currentSong, publicLexicon, unlockedLexicon, lexiconAvailable }}>
      {children}
    </CampaignContext.Provider>
  );
};
