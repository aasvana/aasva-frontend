"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTenantStorage, registerTenantScopedStore } from "@/lib/tenant-storage";

export type Agent = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  place: string;
  notes: string;
};

export const SEED_AGENTS: Agent[] = [
  {
    id: "agt_sekhar",
    name: "Sekhar Rao",
    company: "VR Holidays",
    phone: "+91 98450 11223",
    email: "sekhar@vrholidays.in",
    place: "Hyderabad",
    notes: "Preferred partner for Maldives packages.",
  },
  {
    id: "agt_fatima",
    name: "Fatima Noor",
    company: "Travico Travels",
    phone: "+971 55 123 8899",
    email: "fatima@travico.ae",
    place: "Dubai",
    notes: "Corporate desk — net 15 billing.",
  },
  {
    id: "agt_clara",
    name: "Clara Dubois",
    company: "Voyage Lumière",
    phone: "+33 1 44 55 0198",
    email: "clara@voyagelumiere.fr",
    place: "Paris",
    notes: "Handles Europe FITs and group tours.",
  },
];

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `agnt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

type AgentState = {
  agents: Agent[];
  addAgent: (data: Omit<Agent, "id">) => void;
  updateAgent: (id: string, data: Omit<Agent, "id">) => void;
  deleteAgent: (id: string) => void;
  resetAgents: () => void;
};

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      agents: SEED_AGENTS,

      addAgent: (data) =>
        set((state) => ({
          agents: [...state.agents, { id: newId(), ...data }],
        })),

      updateAgent: (id, data) =>
        set((state) => ({
          agents: state.agents.map((agent) =>
            agent.id === id ? { ...agent, ...data } : agent
          ),
        })),

      deleteAgent: (id) =>
        set((state) => ({
          agents: state.agents.filter((agent) => agent.id !== id),
        })),

      resetAgents: () => set({ agents: SEED_AGENTS }),
    }),
    {
      name: "xmerge_agents",
      storage: createJSONStorage(() => createTenantStorage()),
    }
  )
);

registerTenantScopedStore(() => {
  void useAgentStore.persist.rehydrate();
});
