"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type LoginEvent = {
  id: string;
  username: string;
  type: "login" | "logout";
  status: "success" | "failed";
  ip: string;
  device: string;
  browser: string;
  location: string;
  timestamp: string;
  reason?: string;
};

export type SessionStatus = "active" | "expired" | "revoked";

export type SessionRecord = {
  id: string;
  username: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  startedAt: string;
  lastActive: string;
  status: SessionStatus;
};

const newId = (prefix: string) =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const hoursAgo = (h: number) => new Date(Date.now() - h * 36e5).toISOString();

const seedLoginEvents = (): LoginEvent[] => [
  {
    id: newId("evt"),
    username: "Admin",
    type: "login",
    status: "success",
    ip: "192.168.1.10",
    device: "macOS",
    browser: "Chrome",
    location: "New York, US",
    timestamp: hoursAgo(2),
  },
  {
    id: newId("evt"),
    username: "Admin",
    type: "logout",
    status: "success",
    ip: "192.168.1.10",
    device: "macOS",
    browser: "Chrome",
    location: "New York, US",
    timestamp: hoursAgo(1),
  },
  {
    id: newId("evt"),
    username: "admin",
    type: "login",
    status: "failed",
    ip: "203.0.113.42",
    device: "Windows",
    browser: "Chrome",
    location: "Singapore",
    timestamp: hoursAgo(3),
    reason: "Invalid password",
  },
  {
    id: newId("evt"),
    username: "unknown",
    type: "login",
    status: "failed",
    ip: "198.51.100.7",
    device: "Linux",
    browser: "Firefox",
    location: "Berlin, DE",
    timestamp: hoursAgo(5),
    reason: "Account not found",
  },
  {
    id: newId("evt"),
    username: "Admin",
    type: "login",
    status: "success",
    ip: "192.168.1.22",
    device: "Windows",
    browser: "Firefox",
    location: "London, UK",
    timestamp: hoursAgo(22),
  },
  {
    id: newId("evt"),
    username: "Sarah Chen",
    type: "login",
    status: "success",
    ip: "10.0.0.15",
    device: "iOS",
    browser: "Safari",
    location: "Singapore",
    timestamp: hoursAgo(30),
  },
  {
    id: newId("evt"),
    username: "sarah.chen",
    type: "login",
    status: "failed",
    ip: "10.0.0.15",
    device: "iOS",
    browser: "Safari",
    location: "Singapore",
    timestamp: hoursAgo(29),
    reason: "Wrong password",
  },
  {
    id: newId("evt"),
    username: "Admin",
    type: "login",
    status: "success",
    ip: "172.16.0.8",
    device: "Windows",
    browser: "Chrome",
    location: "Austin, US",
    timestamp: hoursAgo(52),
  },
  {
    id: newId("evt"),
    username: "admin",
    type: "login",
    status: "failed",
    ip: "172.16.0.8",
    device: "Windows",
    browser: "Chrome",
    location: "Austin, US",
    timestamp: hoursAgo(51),
    reason: "Expired password",
  },
  {
    id: newId("evt"),
    username: "Sarah Chen",
    type: "login",
    status: "success",
    ip: "10.0.0.30",
    device: "Android",
    browser: "Chrome",
    location: "Tokyo, JP",
    timestamp: hoursAgo(100),
  },
];

const seedSessions = (): SessionRecord[] => [
  {
    id: newId("ses"),
    username: "Admin",
    device: "macOS",
    browser: "Chrome",
    ip: "192.168.1.10",
    location: "New York, US",
    startedAt: hoursAgo(2),
    lastActive: hoursAgo(0),
    status: "active",
  },
  {
    id: newId("ses"),
    username: "Sarah Chen",
    device: "iOS",
    browser: "Safari",
    ip: "10.0.0.15",
    location: "Singapore",
    startedAt: hoursAgo(30),
    lastActive: hoursAgo(2),
    status: "active",
  },
  {
    id: newId("ses"),
    username: "Admin",
    device: "Windows",
    browser: "Firefox",
    ip: "192.168.1.22",
    location: "London, UK",
    startedAt: hoursAgo(22),
    lastActive: hoursAgo(6),
    status: "active",
  },
  {
    id: newId("ses"),
    username: "Admin",
    device: "Windows",
    browser: "Chrome",
    ip: "172.16.0.8",
    location: "Austin, US",
    startedAt: hoursAgo(720),
    lastActive: hoursAgo(240),
    status: "expired",
  },
  {
    id: newId("ses"),
    username: "Admin",
    device: "Windows",
    browser: "Edge",
    ip: "172.16.0.9",
    location: "Berlin, DE",
    startedAt: hoursAgo(480),
    lastActive: hoursAgo(360),
    status: "revoked",
  },
  {
    id: newId("ses"),
    username: "Sarah Chen",
    device: "Android",
    browser: "Chrome",
    ip: "10.0.0.30",
    location: "Tokyo, JP",
    startedAt: hoursAgo(288),
    lastActive: hoursAgo(144),
    status: "expired",
  },
];

type SecurityState = {
  loginEvents: LoginEvent[];
  sessions: SessionRecord[];
  addLoginEvent: (data: Omit<LoginEvent, "id">) => void;
  addSession: (data: Omit<SessionRecord, "id">) => void;
  updateSession: (id: string, patch: Partial<SessionRecord>) => void;
  revokeSession: (id: string) => void;
  clearLoginEvents: () => void;
  clearSessions: () => void;
};

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set) => ({
      loginEvents: seedLoginEvents(),
      sessions: seedSessions(),

      addLoginEvent: (data) =>
        set((state) => ({
          loginEvents: [{ ...data, id: newId("evt") }, ...state.loginEvents],
        })),

      addSession: (data) =>
        set((state) => ({
          sessions: [{ ...data, id: newId("ses") }, ...state.sessions],
        })),

      updateSession: (id, patch) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, ...patch } : session
          ),
        })),

      revokeSession: (id) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, status: "revoked" as const } : session
          ),
        })),

      clearLoginEvents: () => set({ loginEvents: [] }),

      clearSessions: () => set({ sessions: [] }),
    }),
    {
      name: "xmerge_security",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
