import { useAuthStore } from '@/stores/AuthStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api.utils';

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors - clear local state regardless
    }
    clearAuth();
    router.replace('/');
  };

  return logout;
};
