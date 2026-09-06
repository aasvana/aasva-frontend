'use client';

import { API_BASE_URL, API_KEY } from '@/constants';
import { useAuthStore, storeHydrated } from '@/stores/AuthStore';
import axios from 'axios';
import { useEffect, useState } from 'react';

type SessionState = 'restoring' | 'dead' | 'alive';

let sessionState: SessionState = 'dead';
let attempted = false;
const listeners = new Set<(state: SessionState) => void>();

const setSessionState = (state: SessionState): void => {
  sessionState = state;
  listeners.forEach((listener) => listener(state));
};

export const getSessionState = (): SessionState => sessionState;

const beginRestore = (): void => {
  if (attempted) return;
  if (!storeHydrated) {
    requestAnimationFrame(beginRestore);
    return;
  }
  attempted = true;

  const { token, refreshToken } = useAuthStore.getState();
  if (token || !refreshToken) {
    setSessionState(token ? 'alive' : 'dead');
    return;
  }

  setSessionState('restoring');
  void (async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
        }
      );

      const { accessToken, refreshToken: nextRefreshToken, user } = res.data;
      useAuthStore.getState().restoreAuth(accessToken, nextRefreshToken, user);
      setSessionState('alive');
    } catch {
      useAuthStore.getState().clearAuth();
      setSessionState('dead');
      window.location.href = '/login';
    }
  })();
};

export const useSessionRestore = (): { restoring: boolean } => {
  const [localSessionState, setLocalSessionState] =
    useState<SessionState>(sessionState);

  const [restoring, setRestoring] = useState(() => {
    const hasRefreshToken =
      typeof window !== 'undefined' &&
      !!useAuthStore.getState().refreshToken;
    return !storeHydrated || hasRefreshToken;
  });

  useEffect(() => {
    beginRestore();

    const listener = (state: SessionState) => {
      setLocalSessionState(state);
      setRestoring(state === 'restoring');
    };
    listeners.add(listener);
    setLocalSessionState(sessionState);
    setRestoring(sessionState === 'restoring');

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { restoring: localSessionState === 'restoring' || restoring };
};