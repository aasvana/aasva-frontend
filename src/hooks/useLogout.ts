import { useAuthStore } from '@/stores/AuthStore';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const clearToken = useAuthStore((state) => state.clearToken);
  const router = useRouter();

  const logout = () => {
    clearToken();
    router.push('/login');
  };

  return logout;
};
