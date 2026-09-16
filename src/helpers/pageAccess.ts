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

export const isSubscriptionActive = (): boolean => {
  const { subscription, role, user } = useAuthStore.getState();

  const systemAdmin =
    role === "systemadmin" ||
    user?.roles?.some((r: any) => r.name === "systemadmin") ||
    false;
  if (systemAdmin) return true;

  if (!subscription) return true;

  if (subscription.status === "active") return true;

  if (
    subscription.status === "trial" &&
    subscription.paidUntil &&
    new Date(subscription.paidUntil).getTime() >= Date.now()
  ) {
    return true;
  }

  return false;
};

export const getSubscriptionExpiryLabel = (): string | null => {
  const { subscription } = useAuthStore.getState();
  if (!subscription?.paidUntil) return null;
  return new Date(subscription.paidUntil).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const isModuleAllowedForUser = (
  title: string,
  role: UserRole | null,
  user?: Record<string, any> | null
): boolean => {
  if (!isModuleEnabled(title)) return false;

  const systemAdmin = role === "systemadmin" &&
    (user?.roles?.some((r: any) => r.name === "systemadmin") ?? false);
  const superAdmin = user?.roles?.some((r: any) => r.name === "superadmin") ?? false;
  if (systemAdmin || superAdmin) return true;

  const assignedModules = Array.isArray(user?.modules) ? user.modules : [];
  if (assignedModules.length > 0) return assignedModules.includes(title);

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

  const systemAdmin = role === "systemadmin" &&
    (user?.roles?.some((r: { name: string }) => r.name === "systemadmin") ?? false);
  const superAdmin = user?.roles?.some((r: { name: string }) => r.name === "superadmin") ?? false;
  if (systemAdmin || superAdmin) return true;

  const key = getPageKeyFromPath(pathname);
  if (key && !isPageEnabled(key)) return false;

  const explicitModules = Array.isArray(user?.modules) ? user.modules : [];
  if (explicitModules.length > 0) {
    const moduleEntry = Object.entries(MODULE_PAGE_KEY).find(
      ([, pageKey]) => pageKey === key
    );
    if (moduleEntry && explicitModules.includes(moduleEntry[0])) return true;
    if (moduleEntry && !explicitModules.includes(moduleEntry[0])) return false;
  }

  const moduleEntry = Object.entries(MODULE_PAGE_KEY).find(
    ([, pageKey]) => pageKey === key
  );

  if (moduleEntry) {
    const [moduleTitle] = moduleEntry;
    const assignedModules = Array.isArray(user?.modules) ? user.modules : [];
    if (assignedModules.length > 0) return assignedModules.includes(moduleTitle);
    const allowedRoles = MODULE_ACCESS[moduleTitle];
    if (allowedRoles && role && !allowedRoles.includes(role)) return false;
  }

  return true;
};

export const getDefaultModulesForRole = (role: UserRole): string[] =>
  (ROLE_MODULES[role] ?? []).filter((title) => isModuleEnabled(title));

const getBackendRole = (user: ReturnType<typeof useAuthStore.getState>): UserRole | null => {
  const normalizeRole = (value: string): string =>
    value.trim().toLowerCase().replace(/[_\s]+/g, '-');
  const assignedRole = user.user?.assignedRole
    ? normalizeRole(user.user.assignedRole)
    : null;
  if (assignedRole && assignedRole in ROLE_MODULES) {
    return assignedRole as UserRole;
  }

  const profileTypeKey = user.user?.profileType?.key
    ? normalizeRole(user.user.profileType.key)
    : null;
  if (profileTypeKey && profileTypeKey in ROLE_MODULES) {
    return profileTypeKey as UserRole;
  }

  const roleName = user.user?.roles?.find((assigned) => {
    const normalized = normalizeRole(assigned.name);
    return normalized in ROLE_MODULES;
  })?.name;
  return roleName ? (normalizeRole(roleName) as UserRole) : null;
};

const getRoleFromModules = (modules: string[]): UserRole | null => {
  if (modules.some((module) => module.toLowerCase() === 'travel')) {
    return 'travel-agent';
  }
  if (modules.includes('Healthcare')) return 'healthcare-admin';
  if (modules.includes('Delivery')) return 'delivery-partner';
  if (modules.includes('Store')) return 'store-manager';
  return null;
};

export const getNextOnboardingRoute = (): string => {
  const access = usePageAccessStore.getState().access;
  const authState = useAuthStore.getState();
  const { role, modules, user, companyComplete } = authState;

  const backendModules = (user?.modules ?? []).filter((title) =>
    isModuleEnabled(title)
  );
  const backendRole = getBackendRole(authState) ?? getRoleFromModules(backendModules);

  const systemAdmin =
    user?.roles?.some((r) => r.name === 'systemadmin') ?? false;

  if (systemAdmin) {
    useAuthStore.setState({ companyComplete: true });
    const backendProfileKey =
      user?.detail?.details?.profileTypeId as string | undefined;
    if (role !== 'systemadmin' || modules.length === 0) {
      useAuthStore.setState({
        role: 'systemadmin',
        modules:
          backendModules.length > 0 ? backendModules : ALL_MODULE_TITLES,
        profileType: (backendProfileKey as string) ?? null,
      });
    }
    return '/dashboard';
  }

  const companyPage = access["company-onboarding"] ?? true;
  if (companyPage && !companyComplete) return "/onboarding/company";

  const rolePage = access["role-onboarding"] ?? true;

  if (!role) {
    if (backendRole) {
      useAuthStore.setState({
        role: backendRole,
        profileType: user?.profileType?.key ?? backendRole,
        modules:
          backendModules.length > 0
            ? backendModules
            : getDefaultModulesForRole(backendRole),
      });
      return "/dashboard";
    }
    if (rolePage) return "/onboarding/role";
    return "/dashboard";
  }

  if (modules.length === 0) {
    useAuthStore.setState({
      modules:
        backendModules.length > 0
          ? backendModules
          : getDefaultModulesForRole(role),
    });
  }
  return "/dashboard";
};
