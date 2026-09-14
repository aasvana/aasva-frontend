'use client';
import { AppSidebar } from '@/components/app-sidebar';
import AuthFooter from '@/components/generic/auth/footer';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getNextOnboardingRoute, getPageKeyFromPath, ALL_MODULE_TITLES } from '@/helpers/pageAccess';
import { useSessionRestore } from '@/hooks/useSessionRestore';
import { useAuthStore } from '@/stores/AuthStore';
import { usePageAccessStore } from '@/stores/pageAccessStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ReactNode } from 'react';
import api from '@/lib/api.utils';

interface AuthLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const access = usePageAccessStore((state) => state.access);
  const role = useAuthStore((state) => state.role);
  const modules = useAuthStore((state) => state.modules);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const lastUserId = useAuthStore((state) => state.lastUserId);
  const { restoring } = useSessionRestore();

  useEffect(() => {
    if (token && !user) {
      api
        .get('/auth/me')
        .then((res) => useAuthStore.getState().setUser(res.data))
        .catch(() => {});
    }
  }, [token, user]);

  useEffect(() => {
    if (restoring) return;

    if (!token) {
      router.replace(
        user || lastUserId || role || modules.length > 0 ? '/login' : '/'
      );
      return;
    }

    const isSystemAdmin = user?.roles?.some((r) => r.name === 'systemadmin') ?? false;
    if (isSystemAdmin && role !== 'systemadmin') {
      useAuthStore.setState({
        role: 'systemadmin',
        modules: ALL_MODULE_TITLES,
        profileType: user?.detail?.details?.profileTypeId ?? null,
      });
      return;
    }

    if (!role || modules.length === 0) {
      router.replace(getNextOnboardingRoute());
      return;
    }

    if (pathname === '/dashboard' || pathname === '/dashboard/settings') return;

    const key = getPageKeyFromPath(pathname);
    if (key && access[key] === false) {
      router.replace('/dashboard');
    }
  }, [pathname, access, router, role, modules, token, user, lastUserId, restoring]);

  if (restoring) {
    return null;
  }

  if (!role || modules.length === 0) {
    return null;
  }

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
