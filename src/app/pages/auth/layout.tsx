'use client';
import AuthFooter from '@/components/generic/auth/footer';
import { useAuthStore } from '@/stores/AuthStore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProps) => {

   const token = useAuthStore((state) => state.token);
    const router = useRouter();
  
    useEffect(() => {
      if (token) {
        router.push('/dashboard');
      }
    }, [token, router]);

  return (
    <div className='min-h-screen flex flex-col bg-primary-100'>
      <main className='flex flex-1 w-full items-center justify-center'>
        {children}
      </main>
      <AuthFooter />
    </div>
  );
};

export default AuthLayout;
