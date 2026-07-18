import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type DismissEntry = {
  id: symbol;
  dismiss: () => void;
};

type BackNavigationContextValue = {
  registerDismissible: (id: symbol, dismiss: () => void) => () => void;
};

const BackNavigationContext = createContext<BackNavigationContextValue | null>(null);

const isGuardedPage = (pathname: string) =>
  pathname === '/' ||
  pathname === '/select-reyvateil' ||
  pathname === '/admin' ||
  pathname.startsWith('/admin/players/');

const guardCurrentHistoryEntry = () => {
  const state = window.history.state || {};
  if (state.__hyzikBackGuard === window.location.pathname) return;

  window.history.pushState(
    { ...state, __hyzikBackGuard: window.location.pathname },
    '',
    window.location.href,
  );
};

/**
 * Keeps the Android/iOS browser Back action inside the app. Open surfaces are
 * dismissed from newest to oldest; secondary protected pages then return Home.
 */
export const BackNavigationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dismissStack = useRef<DismissEntry[]>([]);

  const registerDismissible = useCallback((id: symbol, dismiss: () => void) => {
    dismissStack.current = dismissStack.current.filter((entry) => entry.id !== id);
    dismissStack.current.push({ id, dismiss });

    return () => {
      dismissStack.current = dismissStack.current.filter((entry) => entry.id !== id);
    };
  }, []);

  useEffect(() => {
    if (isGuardedPage(location.pathname)) guardCurrentHistoryEntry();
  }, [location.pathname]);

  useEffect(() => {
    const handleBack = () => {
      const pathname = window.location.pathname;
      if (!isGuardedPage(pathname)) return;

      const top = dismissStack.current.pop();
      if (top) {
        top.dismiss();
        guardCurrentHistoryEntry();
        return;
      }

      if (pathname === '/') {
        guardCurrentHistoryEntry();
        return;
      }

      navigate('/', { replace: true });
    };

    window.addEventListener('popstate', handleBack);
    return () => window.removeEventListener('popstate', handleBack);
  }, [navigate]);

  const value = useMemo(() => ({ registerDismissible }), [registerDismissible]);

  return (
    <BackNavigationContext.Provider value={value}>
      {children}
    </BackNavigationContext.Provider>
  );
};

/** Registers an open modal, drawer, or nested detail view for mobile Back. */
export const useBackDismiss = (isOpen: boolean, onClose: () => void) => {
  const context = useContext(BackNavigationContext);
  const id = useRef(Symbol('back-dismissible'));
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || !context) return;
    return context.registerDismissible(id.current, () => closeRef.current());
  }, [context, isOpen]);
};
