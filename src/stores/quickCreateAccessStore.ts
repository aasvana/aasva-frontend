import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ALL_ROLES, type UserRole } from "@/constants/roles";

export type QuickCreateAction = "invoice" | "confirmation-voucher";

export const QUICK_CREATE_ACTIONS: {
  id: QuickCreateAction;
  label: string;
  href: string;
}[] = [
  { id: "invoice", label: "Create Invoice", href: "/dashboard/invoices/create" },
  {
    id: "confirmation-voucher",
    label: "Create Confirmation Voucher",
    href: "/dashboard/confirmation-vouchers/create",
  },
];

type QuickCreateAccess = Record<UserRole, Record<QuickCreateAction, boolean>>;

const createDefaults = (): QuickCreateAccess =>
  Object.fromEntries(
    ALL_ROLES.map((role) => [
      role,
      { invoice: role === "travel-agent", "confirmation-voucher": role === "travel-agent" },
    ])
  ) as QuickCreateAccess;

type QuickCreateAccessState = {
  access: QuickCreateAccess;
  setAccess: (role: UserRole, action: QuickCreateAction, enabled: boolean) => void;
  resetAccess: () => void;
};

export const useQuickCreateAccessStore = create<QuickCreateAccessState>()(
  persist(
    (set) => ({
      access: createDefaults(),
      setAccess: (role, action, enabled) =>
        set((state) => ({
          access: {
            ...state.access,
            [role]: { ...state.access[role], [action]: enabled },
          },
        })),
      resetAccess: () => set({ access: createDefaults() }),
    }),
    { name: "xmerge_quick_create_access" }
  )
);
