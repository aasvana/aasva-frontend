import { MODULE_PAGE_KEY, PATH_ACCESS_PREFIXES } from "@/constants/pages";
import type { PageAccessKey } from "@/constants/pages";
import { useAuthStore } from "@/stores/AuthStore";
import { usePageAccessStore } from "@/stores/pageAccessStore";

const ALWAYS_ENABLED_PATHS: ReadonlySet<string> = new Set([
  "/dashboard/settings",
]);

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
  const { role, modules } = useAuthStore.getState();

  const rolePage = access["role-onboarding"] ?? true;
  const modulePage = access["module-onboarding"] ?? true;

  if (!role) {
    if (rolePage) return "/onboarding/role";
    if (modulePage) return "/onboarding/module";
    return "/dashboard";
  }

  if (modulePage && modules.length === 0) return "/onboarding/module";
  return "/dashboard";
};
