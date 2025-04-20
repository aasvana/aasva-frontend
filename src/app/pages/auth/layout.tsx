'use client';
import AuthFooter from '@/components/generic/auth/footer';
import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {

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
