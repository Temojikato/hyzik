import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import fallbackSongsJson from '../generated/campaignSongs.json';
import publicLexiconJson from '../generated/hymmnosPublicIndex.json';
import { useAuth } from './AuthContext';
import { subscribeCampaignState, subscribeSongs, subscribeUnlockedLexicon } from '../services/campaignService';
import { CampaignSong, CampaignState, PublicLexiconEntry, UnlockedLexiconEntry } from '../types/Campaign';
import { clearAllCooldowns, shiftAllCooldowns } from '../CooldownUtils';

interface CampaignContextValue {
  campaignState: CampaignState;
  songs: CampaignSong[];
  currentSong: CampaignSong | null;
  publicLexicon: PublicLexiconEntry[];
  unlockedLexicon: Map<string, UnlockedLexiconEntry>;
  lexiconAvailable: boolean;
  timersRunning: boolean;
  timerEpoch: number;
  timerClockReady: boolean;
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
  timersRunning: false,
  timerEpoch: 0,
  timerClockReady: false,
});

export const useCampaign = () => useContext(CampaignContext);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, profile } = useAuth();
  const [campaignState, setCampaignState] = useState<CampaignState>({});
  const [remoteSongs, setRemoteSongs] = useState<CampaignSong[]>([]);
  const [unlockedEntries, setUnlockedEntries] = useState<UnlockedLexiconEntry[]>([]);
  const [lexiconAvailable, setLexiconAvailable] = useState(true);
  const [campaignReady, setCampaignReady] = useState(false);
  const [timerEpoch, setTimerEpoch] = useState(0);
  const [timerClockReady, setTimerClockReady] = useState(false);
  const unlockedCypherKey = (profile?.unlockedCyphers || []).join('|');

  useEffect(() => {
    if (!currentUser) return undefined;
    const unsubscribeState = subscribeCampaignState((state) => { setCampaignState(state); setCampaignReady(true); }, () => { setCampaignState({}); setCampaignReady(true); });
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
    if (campaignState.songLibraryInitialized) return remoteSongs;
    if (!remoteSongs.length) return fallbackSongs;
    const remoteById = new Map(remoteSongs.map((song) => [song.id, song]));
    return fallbackSongs.map((song) => ({ ...song, ...remoteById.get(song.id) })).concat(
      remoteSongs.filter((song) => !fallbackSongs.some((fallback) => fallback.id === song.id)),
    );
  }, [campaignState.songLibraryInitialized, remoteSongs]);

  const currentSong = useMemo(() => {
    if (campaignState.currentSongId) return songs.find((song) => song.id === campaignState.currentSongId) || null;
    return songs[0] || null;
  }, [campaignState.currentSongId, songs]);

  const unlockedLexicon = useMemo(() => new Map(unlockedEntries.map((entry) => [entry.id, entry])), [unlockedEntries]);
  const shouldRunTimers = Boolean(profile && campaignReady && profile.active !== false && !campaignState.timersPaused && !campaignState.battleActive);
  const timersRunning = shouldRunTimers && timerClockReady;

  useEffect(() => {
    if (!currentUser || !profile) return;
    const version = Math.max(0, Number(profile.dailyResetVersion || 0));
    const key = `omnia-daily-reset-version-${currentUser.uid}`;
    const applied = Math.max(0, Number(localStorage.getItem(key) || 0));
    if (version > applied) {
      clearAllCooldowns();
      localStorage.setItem(key, String(version));
      setTimerEpoch((value) => value + 1);
    }
  }, [currentUser, profile]);

  useEffect(() => {
    if (!currentUser || !profile || !campaignReady) { setTimerClockReady(false); return; }
    const key = `omnia-timers-paused-at-${currentUser.uid}`;
    const syncKey = `omnia-timers-synced-at-${currentUser.uid}`;
    const pausedAt = Number(localStorage.getItem(key) || 0);
    if (!shouldRunTimers) {
      if (!pausedAt) {
        const remotePause = (campaignState.timersPaused || campaignState.battleActive
          ? campaignState.timersPausedAt?.toMillis?.()
          : profile.pausedAt?.toMillis?.()) || Date.now();
        localStorage.setItem(key, String(remotePause));
      }
      setTimerClockReady(true);
      return;
    }
    if (pausedAt) {
      shiftAllCooldowns(Math.max(0, Date.now() - pausedAt));
      localStorage.removeItem(key);
      localStorage.setItem(syncKey, String(Date.now()));
      setTimerEpoch((value) => value + 1);
    } else {
      const lastSync = Number(localStorage.getItem(syncKey) || 0);
      const candidates = [
        { pause: profile.pausedAt?.toMillis?.() || 0, resume: profile.activatedAt?.toMillis?.() || 0 },
        { pause: campaignState.timersPausedAt?.toMillis?.() || 0, resume: campaignState.timersResumedAt?.toMillis?.() || 0 },
      ].filter((entry) => entry.pause > 0 && entry.resume > entry.pause && entry.resume > lastSync);
      const latest = candidates.sort((a, b) => b.resume - a.resume)[0];
      if (latest) {
        shiftAllCooldowns(latest.resume - latest.pause);
        localStorage.setItem(syncKey, String(latest.resume));
        setTimerEpoch((value) => value + 1);
      }
    }
    setTimerClockReady(true);
  }, [campaignReady, campaignState.battleActive, campaignState.timersPaused, campaignState.timersPausedAt, campaignState.timersResumedAt, currentUser, profile, shouldRunTimers]);

  return (
    <CampaignContext.Provider value={{ campaignState, songs, currentSong, publicLexicon, unlockedLexicon, lexiconAvailable, timersRunning, timerEpoch, timerClockReady }}>
      {children}
    </CampaignContext.Provider>
  );
};
