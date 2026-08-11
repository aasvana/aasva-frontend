"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const REQUEST_CATEGORIES = [
  "support",
  "feature",
  "feedback",
  "bug",
  "complaint",
  "announcement",
] as const;

export type RequestCategory = (typeof REQUEST_CATEGORIES)[number];

export const REQUEST_CATEGORY_LABELS: Record<RequestCategory, string> = {
  support: "Support",
  feature: "Feature Request",
  feedback: "Feedback",
  bug: "Bug Report",
  complaint: "Complaint",
  announcement: "Announcement",
};

export const REQUEST_STATUSES = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
  "Published",
  "Draft",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export type UserRequest = {
  id: string;
  refNo: string;
  category: RequestCategory;
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  priority: string;
  status: string;
  assignedTo: string;
  votes: string;
  targetRelease: string;
  createdAt: string;
  updatedAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysAgo = (d: number) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString().slice(0, 10);
};

const daysFromNow = (d: number) => {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString().slice(0, 10);
};

const seedRequests = (): UserRequest[] => [
  {
    id: newId(),
    refNo: "REQ-1001",
    category: "support",
    title: "Unable to print invoice PDF",
    description: "Invoice exports show a blank page in Safari.",
    requesterName: "Theo Nguyen",
    requesterEmail: "theo@example.com",
    priority: "High",
    status: "In Progress",
    assignedTo: "Priya S.",
    votes: "0",
    targetRelease: "",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: newId(),
    refNo: "REQ-1002",
    category: "feature",
    title: "Bulk invoice status update",
    description: "Allow marking multiple invoices as paid at once.",
    requesterName: "Alicia Reyes",
    requesterEmail: "alicia@example.com",
    priority: "Medium",
    status: "Open",
    assignedTo: "",
    votes: "34",
    targetRelease: "Q3",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: newId(),
    refNo: "REQ-1003",
    category: "feedback",
    title: "Loving the new dashboard",
    description: "The overview cards make it easy to scan the day.",
    requesterName: "Jane Cooper",
    requesterEmail: "jane@example.com",
    priority: "Low",
    status: "Resolved",
    assignedTo: "",
    votes: "12",
    targetRelease: "",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
  },
  {
    id: newId(),
    refNo: "REQ-1004",
    category: "bug",
    title: "Currency symbol misaligned",
    description: "Amount column shows currency symbol wrapped to next line.",
    requesterName: "Marcus Chen",
    requesterEmail: "marcus@example.com",
    priority: "Urgent",
    status: "In Progress",
    assignedTo: "Arjun K.",
    votes: "0",
    targetRelease: "",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(0),
  },
  {
    id: newId(),
    refNo: "REQ-1005",
    category: "complaint",
    title: "Double charge on renewal",
    description: "Customer was charged twice for the annual plan.",
    requesterName: "Sofia Rossi",
    requesterEmail: "sofia@example.com",
    priority: "Urgent",
    status: "Open",
    assignedTo: "Priya S.",
    votes: "0",
    targetRelease: "",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: newId(),
    refNo: "REQ-1006",
    category: "support",
    title: "Reset 2FA for account",
    description: "Lost access to authenticator app.",
    requesterName: "Haruto Tanaka",
    requesterEmail: "haruto@example.com",
    priority: "High",
    status: "Closed",
    assignedTo: "Arjun K.",
    votes: "0",
    targetRelease: "",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(3),
  },
  {
    id: newId(),
    refNo: "REQ-1007",
    category: "feature",
    title: "Dark mode support",
    description: "Add a dark theme across all modules.",
    requesterName: "Omar Hassan",
    requesterEmail: "omar@example.com",
    priority: "Medium",
    status: "Open",
    assignedTo: "",
    votes: "89",
    targetRelease: "Q4",
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
  {
    id: newId(),
    refNo: "REQ-1008",
    category: "feedback",
    title: "Faster load times noticed",
    description: "Pages feel snappier after the latest update.",
    requesterName: "Lena Fischer",
    requesterEmail: "lena@example.com",
    priority: "Low",
    status: "Resolved",
    assignedTo: "",
    votes: "5",
    targetRelease: "",
    createdAt: daysAgo(6),
    updatedAt: daysAgo(5),
  },
  {
    id: newId(),
    refNo: "REQ-1009",
    category: "bug",
    title: "Notifications not marking read",
    description: "Clicking a notification does not clear the badge.",
    requesterName: "Noah Schmidt",
    requesterEmail: "noah@example.com",
    priority: "High",
    status: "Open",
    assignedTo: "",
    votes: "0",
    targetRelease: "",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: newId(),
    refNo: "REQ-1010",
    category: "complaint",
    title: "Refund not processed",
    description: "Refund requested 10 days ago, still pending.",
    requesterName: "Emma Wilson",
    requesterEmail: "emma@example.com",
    priority: "High",
    status: "In Progress",
    assignedTo: "Priya S.",
    votes: "0",
    targetRelease: "",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: newId(),
    refNo: "REQ-1011",
    category: "announcement",
    title: "Scheduled maintenance Sunday",
    description: "Platform will be offline 2–4 AM for upgrades.",
    requesterName: "Admin",
    requesterEmail: "admin@xmerge.app",
    priority: "Low",
    status: "Published",
    assignedTo: "",
    votes: "0",
    targetRelease: daysFromNow(3),
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: newId(),
    refNo: "REQ-1012",
    category: "announcement",
    title: "New delivery module is live",
    description: "Introducing dispatch, zones and delivery partners.",
    requesterName: "Admin",
    requesterEmail: "admin@xmerge.app",
    priority: "Low",
    status: "Published",
    assignedTo: "",
    votes: "0",
    targetRelease: daysAgo(0),
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
];

type UserRequestState = {
  requests: UserRequest[];
  addRequest: (data: Omit<UserRequest, "id">) => void;
  updateRequest: (id: string, data: Omit<UserRequest, "id">) => void;
  deleteRequest: (id: string) => void;
  resetRequests: () => void;
};

export const useUserRequestStore = create<UserRequestState>()(
  persist(
    (set) => ({
      requests: seedRequests(),

      addRequest: (data) =>
        set((state) => {
          const now = new Date().toISOString().slice(0, 10);
          const { refNo, createdAt, updatedAt, ...rest } = data;
          return {
            requests: [
              {
                id: newId(),
                refNo: refNo?.trim() || `REQ-${1000 + state.requests.length + 1}`,
                createdAt: createdAt || now,
                updatedAt: updatedAt || now,
                ...rest,
              },
              ...state.requests,
            ],
          };
        }),

      updateRequest: (id, data) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  ...data,
                  updatedAt: new Date().toISOString().slice(0, 10),
                }
              : r
          ),
        })),

      deleteRequest: (id) =>
        set((state) => ({
          requests: state.requests.filter((r) => r.id !== id),
        })),

      resetRequests: () => set({ requests: seedRequests() }),
    }),
    {
      name: "xmerge_user_requests",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
