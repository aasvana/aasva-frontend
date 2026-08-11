'use client';
import { AppSidebar } from '@/components/app-sidebar';
import AuthFooter from '@/components/generic/auth/footer';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
// import { useHydrated } from '@/hooks/useHydrated';
// import { useAuthStore } from '@/stores/AuthStore';
// import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: AuthLayoutProps) => {

  // const router = useRouter();
  // const hydrated = useHydrated();
  // const token = useAuthStore((state) => state.token);

  // useEffect(() => {
  //   if (hydrated && !token) {
  //     router.replace('/login');
  //   }
  // }, [hydrated, token, router]);

  // if (!hydrated) return null;
  

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-6 lg:px-8">
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
