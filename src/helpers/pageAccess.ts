import { MODULE_PAGE_KEY, PATH_ACCESS_PREFIXES } from "@/constants/pages";
import type { PageAccessKey } from "@/constants/pages";
import { ROLE_MODULES } from "@/constants/roles";
import type { UserRole } from "@/constants/roles";
import { useAuthStore } from "@/stores/AuthStore";
import { usePageAccessStore } from "@/stores/pageAccessStore";

const ALWAYS_ENABLED_PATHS: ReadonlySet<string> = new Set([
  "/dashboard/settings",
]);

const ALL_MODULE_TITLES = Object.keys(MODULE_PAGE_KEY);

export { ALL_MODULE_TITLES };

export const isSystemAdmin = (): boolean => {
  const user = useAuthStore.getState().user;
  return user?.roles?.some((r) => r.name === 'systemadmin') ?? false;
};

export const getPageKeyFromPath = (pathname: string): PageAccessKey | null => {
  if (ALWAYS_ENABLED_PATHS.has(pathname)) return null;
  const match = PATH_ACCESS_PREFIXES.find(({ prefix }) =>
    pathname.startsWith(prefix)
  );
  return match ? match.key : null;
};

export const isPageEnabled = (key: PageAccessKey): boolean =>
  usePageAccessStore.getState().access[key] ?? true;

export const isModuleEnabled = (title: string): boolean => {
  const key = MODULE_PAGE_KEY[title];
  return key ? isPageEnabled(key) : true;
};

export const getNextOnboardingRoute = (): string => {
  const access = usePageAccessStore.getState().access;
  const authState = useAuthStore.getState();
  const { role, modules, user } = authState;

  const systemAdmin = user?.roles?.some((r) => r.name === 'systemadmin') ?? false;

  if (systemAdmin) {
    const backendProfileKey = user?.detail?.details?.profileTypeId as string | undefined;
    if (role !== 'systemadmin' || modules.length === 0) {
      useAuthStore.setState({
        role: 'systemadmin',
        modules: ALL_MODULE_TITLES,
        profileType: (backendProfileKey as string) ?? null,
      });
    }
    return '/dashboard';
  }

  const rolePage = access["role-onboarding"] ?? true;
  const modulePage = access["module-onboarding"] ?? true;

  if (!role) {
    const backendProfileKey = user?.detail?.details?.profileTypeId as string | undefined;
    if (backendProfileKey && ROLE_MODULES[backendProfileKey as UserRole]) {
      useAuthStore.setState({
        role: backendProfileKey as UserRole,
        profileType: backendProfileKey,
        modules: (ROLE_MODULES[backendProfileKey as UserRole] ?? []).filter((title: string) =>
          isModuleEnabled(title)
        ),
      });
      if (modulePage) return "/onboarding/module";
      return "/dashboard";
    }
    if (rolePage) return "/onboarding/role";
    if (modulePage) return "/onboarding/module";
    return "/dashboard";
  }

  if (modulePage && modules.length === 0) return "/onboarding/module";
  return "/dashboard";
};
