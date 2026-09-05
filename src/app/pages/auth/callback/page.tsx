'use client';
import { useAuthStore } from '@/stores/AuthStore';
import { getNextOnboardingRoute } from '@/helpers/pageAccess';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api.utils';

export default function AuthCallbackPage() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');
      const error = params.get('error');

      if (error) {
        if (window.opener) {
          window.opener.postMessage(
            { type: 'oauth-error', message: 'Google sign-in failed.' },
            window.location.origin,
          );
          window.close();
        } else {
          toast.error('Google sign-in failed. Please try again.');
          router.push('/login');
        }
        return;
      }

      async function handleSuccess(
        token: string,
        refresh: string,
      ): Promise<void> {
        setAuth(token, refresh, null);
        try {
          const meRes = await api.get('/auth/me');
          useAuthStore.getState().setUser(meRes.data);
        } catch {
          // Best-effort profile fetch; session is still valid without it.
        }
      }

      if (accessToken && refreshToken) {
        if (window.opener) {
          window.opener.postMessage(
          {
            type: 'oauth-success',
            accessToken,
            refreshToken,
          },
          window.location.origin,
        );
        window.close();
      } else {
        await handleSuccess(accessToken, refreshToken);
        toast.success('Signed in with Google successfully!');
        window.history.replaceState({}, '', getNextOnboardingRoute());
        router.push(getNextOnboardingRoute());
      }
    } else {
      if (window.opener) {
        window.opener.postMessage(
          { type: 'oauth-error', message: 'Invalid authentication response.' },
          window.location.origin,
        );
        window.close();
      } else {
        toast.error('Invalid authentication response.');
        router.push('/login');
      }
    }
    })();
  }, [setAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500">Signing you in...</p>
    </div>
  );
}
