// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { IdTokenResult, User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { PlayerProfile } from '../types/Campaign';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  claims: IdTokenResult['claims'] | null;
  profile: PlayerProfile | null;
  refreshClaims: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  isAdmin: false,
  claims: null,
  profile: null,
  refreshClaims: async () => undefined,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [claims, setClaims] = useState<IdTokenResult['claims'] | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  const refreshClaims = async () => {
    if (!auth.currentUser) {
      setClaims(null);
      return;
    }
    const token = await auth.currentUser.getIdTokenResult(true);
    setClaims(token.claims);
  };

  useEffect(() => {
    let unsubscribeProfile: () => void = () => {};
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribeProfile();
      setCurrentUser(user);
      setProfile(null);
      if (user) {
        const token = await user.getIdTokenResult();
        setClaims(token.claims);
        unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
          setProfile(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as PlayerProfile) : null);
        });
      } else {
        setClaims(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribeProfile();
    };
  }, []);

  const value = {
    currentUser,
    loading,
    isAdmin: claims?.admin === true,
    claims,
    profile,
    refreshClaims,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
