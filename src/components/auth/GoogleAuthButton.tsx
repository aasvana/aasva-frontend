'use client';
import { useAuthStore } from '@/stores/AuthStore';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import authConfig from '@/config/auth.json';
import api from '@/lib/api.utils';

type OAuthFlow = 'popup' | 'redirect';

function getOAuthFlow(): OAuthFlow {
  const envOverride = process.env.NEXT_PUBLIC_OAUTH_FLOW;
  if (envOverride === 'popup' || envOverride === 'redirect') {
    return envOverride;
  }
  if (authConfig.oauthFlow === 'popup' || authConfig.oauthFlow === 'redirect') {
    return authConfig.oauthFlow;
  }
  return 'redirect';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300/api';

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512">
      <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z" />
      <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z" />
      <path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z" />
      <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z" />
      <path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z" />
      <path fill="#eb4132" d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z" />
    </svg>
  );
}

export default function GoogleAuthButton() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const popupRef = useRef<Window | null>(null);
  const flow = getOAuthFlow();

  useEffect(() => {
    if (flow !== 'popup') return;

    async function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'oauth-success') {
        const { accessToken, refreshToken, user } = event.data;
        if (accessToken && refreshToken) {
          setAuth(accessToken, refreshToken, user ?? null);
          try {
            const meRes = await api.get('/auth/me');
            useAuthStore.getState().setUser(meRes.data);
          } catch {
            // Best-effort profile fetch; session is still valid without it.
          }
          toast.success('Signed in with Google successfully!');
          window.location.href = '/dashboard';
        }
      }
      if (event.data?.type === 'oauth-error') {
        toast.error(event.data.message || 'Google sign-in failed.');
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [flow, setAuth]);

  function handleClick() {
    const url = `${API_URL}/auth/google?flow=${flow}`;

    if (flow === 'popup') {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      popupRef.current = window.open(
        url,
        'google-oauth',
        `width=${width},height=${height},left=${left},top=${top}`,
      );
    } else {
      window.location.href = url;
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold rounded border border-slate-300 bg-white hover:bg-slate-50 cursor-pointer focus:outline-none"
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
}
