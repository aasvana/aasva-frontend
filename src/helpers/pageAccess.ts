import { MODULE_PAGE_KEY, PATH_ACCESS_PREFIXES } from "@/constants/pages";
import type { PageAccessKey } from "@/constants/pages";
import { MODULE_ACCESS, ROLE_MODULES } from "@/constants/roles";
import type { UserRole } from "@/constants/roles";
import { useAuthStore } from "@/stores/AuthStore";
import { usePageAccessStore } from "@/stores/pageAccessStore";

const ALWAYS_ENABLED_PATHS: ReadonlySet<string> = new Set([
  "/dashboard/settings",
]);

const ALL_MODULE_TITLES = Object.keys(MODULE_PAGE_KEY);
const TRIAL_DURATION_DAYS = 90;
const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

export { ALL_MODULE_TITLES, TRIAL_DURATION_DAYS };

export const isSystemAdmin = (): boolean => {
  const user = useAuthStore.getState().user;
  return user?.roles?.some((r) => r.name === 'systemadmin') ?? false;
};

export const getUserTrialStartDate = (user?: Record<string, any> | null): number => {
  if (user && typeof user.createdAt === "string") {
    const parsed = new Date(user.createdAt).getTime();
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("aasva_trial_start_date");
    if (stored) {
      const parsedStored = parseInt(stored, 10);
      if (!isNaN(parsedStored) && parsedStored > 0) return parsedStored;
    }
    const now = Date.now();
    localStorage.setItem("aasva_trial_start_date", now.toString());
    return now;
  }
  return Date.now();
};

export const isUserInTrialPeriod = (user?: Record<string, any> | null): boolean => {
  const startDate = getUserTrialStartDate(user);
  return Date.now() - startDate < TRIAL_DURATION_MS;
};

export const getTrialRemainingDays = (user?: Record<string, any> | null): number => {
  const startDate = getUserTrialStartDate(user);
  const elapsedMs = Date.now() - startDate;
  const remainingMs = TRIAL_DURATION_MS - elapsedMs;
  if (remainingMs <= 0) return 0;
  return Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
};

export const isPageEnabled = (key: PageAccessKey): boolean =>
  usePageAccessStore.getState().access[key] ?? true;

export const isModuleEnabled = (title: string): boolean => {
  const key = MODULE_PAGE_KEY[title];
  return key ? isPageEnabled(key) : true;
};

export const isModuleAllowedForUser = (
  title: string,
  role: UserRole | null,
  user?: Record<string, any> | null
): boolean => {
  if (!isModuleEnabled(title)) return false;

  const systemAdmin = role === "systemadmin" || (user?.roles?.some((r: any) => r.name === "systemadmin") ?? false);
  const superAdmin = user?.roles?.some((r: any) => r.name === "superadmin") ?? false;
  if (systemAdmin || superAdmin) return true;

  if (isUserInTrialPeriod(user)) return true;

  const allowedRoles = MODULE_ACCESS[title];
  if (allowedRoles && role && !allowedRoles.includes(role)) return false;

  return true;
};

export const getPageKeyFromPath = (pathname: string): PageAccessKey | null => {
  if (ALWAYS_ENABLED_PATHS.has(pathname)) return null;
  const match = PATH_ACCESS_PREFIXES.find(({ prefix }) =>
    pathname.startsWith(prefix)
  );
  return match ? match.key : null;
};

export const isPathAllowedForUser = (
  pathname: string,
  role: UserRole | null,
  user?: Record<string, any> | null
): boolean => {
  if (ALWAYS_ENABLED_PATHS.has(pathname) || pathname === "/dashboard") return true;

  const systemAdmin = role === "systemadmin" || (user?.roles?.some((r: { name: string }) => r.name === "systemadmin") ?? false);
  const superAdmin = user?.roles?.some((r: { name: string }) => r.name === "superadmin") ?? false;
  if (systemAdmin || superAdmin) return true;

  const key = getPageKeyFromPath(pathname);
  if (key && !isPageEnabled(key)) return false;

  if (isUserInTrialPeriod(user)) return true;

  const moduleEntry = Object.entries(MODULE_PAGE_KEY).find(
    ([, pageKey]) => pageKey === key
  );

  if (moduleEntry) {
    const [moduleTitle] = moduleEntry;
    const allowedRoles = MODULE_ACCESS[moduleTitle];
    if (allowedRoles && role && !allowedRoles.includes(role)) return false;
  }

  return true;
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
