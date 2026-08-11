"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CURRENCIES } from "@/modules/invoice";

export type Outlet = {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  isDefault: boolean;
};

export const DEFAULT_OUTLET_ID = "outlet_main";

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `outlet_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const defaultOutlet = (): Outlet => ({
  id: DEFAULT_OUTLET_ID,
  name: "Main Outlet",
  code: "MAIN",
  address: "",
  phone: "",
  email: "",
  currency: CURRENCIES[0]?.value ?? "USD",
  isDefault: true,
});

type OutletState = {
  outlets: Outlet[];
  activeOutletId: string;
  addOutlet: (data: Omit<Outlet, "id">) => void;
  updateOutlet: (id: string, data: Omit<Outlet, "id">) => void;
  deleteOutlet: (id: string) => void;
  setActiveOutlet: (id: string) => void;
  setDefaultOutlet: (id: string) => void;
  resetOutlets: () => void;
};

export const useOutletStore = create<OutletState>()(
  persist(
    (set, get) => ({
      outlets: [defaultOutlet()],
      activeOutletId: DEFAULT_OUTLET_ID,

      addOutlet: (data) =>
        set((state) => {
          const outlets = [
            ...state.outlets,
            { id: newId(), ...data, isDefault: state.outlets.length === 0 },
          ];
          return {
            outlets,
            activeOutletId: state.outlets.length === 0 ? outlets[0].id : state.activeOutletId,
          };
        }),

      updateOutlet: (id, data) =>
        set((state) => {
          const outlets = state.outlets.map((outlet) => {
            if (outlet.id === id) {
              return { ...outlet, ...data };
            }
            if (data.isDefault) {
              return { ...outlet, isDefault: false };
            }
            return outlet;
          });
          const anyDefault = outlets.some((o) => o.isDefault);
          if (!anyDefault && outlets.length > 0) {
            outlets[0].isDefault = true;
          }
          return { outlets };
        }),

      deleteOutlet: (id) => {
        const state = get();
        const remaining = state.outlets.filter((o) => o.id !== id);
        if (remaining.length === 0) {
          const fresh = defaultOutlet();
          set({ outlets: [fresh], activeOutletId: fresh.id });
          return;
        }
        const activeOutletId =
          state.activeOutletId === id ? remaining[0].id : state.activeOutletId;
        set({ outlets: remaining, activeOutletId });
      },

      setActiveOutlet: (id) => set({ activeOutletId: id }),

      setDefaultOutlet: (id) =>
        set((state) => ({
          outlets: state.outlets.map((o) => ({
            ...o,
            isDefault: o.id === id,
          })),
          activeOutletId: id,
        })),

      resetOutlets: () =>
        set({ outlets: [defaultOutlet()], activeOutletId: DEFAULT_OUTLET_ID }),
    }),
    {
      name: "xmerge_outlets",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
