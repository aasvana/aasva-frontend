"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTenantStorage, registerTenantScopedStore } from "@/lib/tenant-storage";

export const APPROVAL_STATUSES = ["Pending", "Approved", "Rejected"] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export type ApprovalRecord = {
  id: string;
  documentType: string;
  documentNo: string;
  submittedBy: string;
  submittedAt: string;
  amount: string;
  reviewer: string;
  status: ApprovalStatus;
  reviewedAt: string;
  comment: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `appr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);

const seedApprovals = (): ApprovalRecord[] => [
  {
    id: newId(),
    documentType: "Bill",
    documentNo: "BILL-1003",
    submittedBy: "Admin",
    submittedAt: daysAgo(6),
    amount: "312.00",
    reviewer: "Sarah Chen",
    status: "Approved",
    reviewedAt: daysAgo(5),
    comment: "Utilities invoice verified.",
  },
  {
    id: newId(),
    documentType: "Expense Claim",
    documentNo: "EC-1011",
    submittedBy: "Admin",
    submittedAt: daysAgo(4),
    amount: "145.20",
    reviewer: "Sarah Chen",
    status: "Approved",
    reviewedAt: daysAgo(3),
    comment: "Receipts verified.",
  },
  {
    id: newId(),
    documentType: "Purchase Order",
    documentNo: "PO-2010",
    submittedBy: "Sarah Chen",
    submittedAt: daysAgo(2),
    amount: "2400.00",
    reviewer: "Admin",
    status: "Approved",
    reviewedAt: daysAgo(1),
    comment: "Within budget.",
  },
  {
    id: newId(),
    documentType: "Expense Claim",
    documentNo: "EC-1009",
    submittedBy: "James Doe",
    submittedAt: daysAgo(7),
    amount: "87.00",
    reviewer: "Sarah Chen",
    status: "Rejected",
    reviewedAt: daysAgo(5),
    comment: "Missing receipts — resubmit with documentation.",
  },
  {
    id: newId(),
    documentType: "Journal Entry",
    documentNo: "JE-1045",
    submittedBy: "Admin",
    submittedAt: daysAgo(1),
    amount: "0.00",
    reviewer: "Sarah Chen",
    status: "Pending",
    reviewedAt: "",
    comment: "",
  },
  {
    id: newId(),
    documentType: "Bill",
    documentNo: "BILL-1007",
    submittedBy: "Sarah Chen",
    submittedAt: daysAgo(0),
    amount: "1150.00",
    reviewer: "Admin",
    status: "Pending",
    reviewedAt: "",
    comment: "Awaiting PO match.",
  },
  {
    id: newId(),
    documentType: "Refund",
    documentNo: "REF-0007",
    submittedBy: "James Doe",
    submittedAt: daysAgo(2),
    amount: "96.50",
    reviewer: "Admin",
    status: "Pending",
    reviewedAt: "",
    comment: "",
  },
];

type ApprovalState = {
  approvals: ApprovalRecord[];
  addApproval: (data: Omit<ApprovalRecord, "id">) => void;
  updateApproval: (id: string, data: Omit<ApprovalRecord, "id">) => void;
  deleteApproval: (id: string) => void;
  resetApprovals: () => void;
};

export const useApprovalStore = create<ApprovalState>()(
  persist(
    (set) => ({
      approvals: seedApprovals(),

      addApproval: (data) =>
        set((state) => ({
          approvals: [{ ...data, id: newId() }, ...state.approvals],
        })),

      updateApproval: (id, data) =>
        set((state) => ({
          approvals: state.approvals.map((approval) =>
            approval.id === id ? { ...approval, ...data } : approval
          ),
        })),

      deleteApproval: (id) =>
        set((state) => ({
          approvals: state.approvals.filter((approval) => approval.id !== id),
        })),

      resetApprovals: () => set({ approvals: seedApprovals() }),
    }),
    {
      name: "xmerge_approvals",
      storage: createJSONStorage(() => createTenantStorage()),
    }
  )
);

registerTenantScopedStore(() => {
  void useApprovalStore.persist.rehydrate();
});
