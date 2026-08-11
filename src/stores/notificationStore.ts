"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type NotificationType = "success" | "info" | "warning" | "error";

export type NotificationCategory =
  | "system"
  | "invoice"
  | "sales"
  | "inventory"
  | "customer"
  | "travel";

export type AppNotification = {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  customer?: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

const MAX_NOTIFICATIONS = 200;

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

type NotificationState = {
  notifications: AppNotification[];
  addNotification: (
    data: Omit<AppNotification, "id" | "read" | "createdAt">
  ) => AppNotification;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (data) => {
        const notification: AppNotification = {
          ...data,
          id: newId(),
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(
            0,
            MAX_NOTIFICATIONS
          ),
        }));
        return notification;
      },

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markUnread: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: false } : n
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: "xmerge_notifications",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
