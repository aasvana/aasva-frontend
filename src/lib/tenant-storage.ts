import type { StateStorage } from "zustand/middleware";

const NO_TENANT_SCOPE = "no-tenant";

let activeTenantId: string | null = null;

const rehydrators = new Set<() => void>();

export const getActiveTenantId = (): string | null => activeTenantId;

export const tenantStorageKey = (name: string): string =>
  `${name}:${activeTenantId ?? NO_TENANT_SCOPE}`;

export const registerTenantScopedStore = (rehydrate: () => void): void => {
  rehydrators.add(rehydrate);
};

export const rehydrateTenantScopedStores = (): void => {
  for (const rehydrate of rehydrators) {
    try {
      rehydrate();
    } catch {
      continue;
    }
  }
};

export const setActiveTenantId = (tenantId: string | null): void => {
  const next = tenantId ?? null;
  if (next === activeTenantId) return;
  activeTenantId = next;
  rehydrateTenantScopedStores();
};

const findMigratable = (candidates: string[]): string | null => {
  for (const key of candidates) {
    const value = window.localStorage.getItem(key);
    if (value !== null) return value;
  }
  return null;
};

export const createTenantStorage = (legacyNames: string[] = []): StateStorage => ({
  getItem: (name) => {
    if (typeof window === "undefined") return null;

    const scoped = tenantStorageKey(name);
    const existing = window.localStorage.getItem(scoped);
    if (existing !== null) return existing;

    if (activeTenantId === null) return null;

    const noTenantKey = `${name}:${NO_TENANT_SCOPE}`;
    const legacyScopedKeys = legacyNames.map(
      (legacy) => `${legacy}:${activeTenantId}`
    );

    const adopted = findMigratable([
      noTenantKey,
      ...legacyScopedKeys,
      name,
      ...legacyNames,
    ]);
    if (adopted === null) return null;

    window.localStorage.setItem(scoped, adopted);
    for (const key of [noTenantKey, ...legacyScopedKeys, name, ...legacyNames]) {
      window.localStorage.removeItem(key);
    }
    return adopted;
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(tenantStorageKey(name), value);
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(tenantStorageKey(name));
    window.localStorage.removeItem(name);
  },
});
