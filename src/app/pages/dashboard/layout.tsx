'use client';
import { AppSidebar } from '@/components/app-sidebar';
import AuthFooter from '@/components/generic/auth/footer';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/AuthStore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: AuthLayoutProps) => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  return (
    <SidebarProvider
    style={
      {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties
    }
  >
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {children}
          </div>
        </div>
      </div>
      <AuthFooter />
    </SidebarInset>
  </SidebarProvider>
  );
};

export default DashboardLayout;
