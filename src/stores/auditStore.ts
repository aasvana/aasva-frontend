"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const AUDIT_ACTIONS = [
  "created",
  "updated",
  "deleted",
  "restored",
  "posted",
  "approved",
  "rejected",
  "accepted",
  "converted",
  "sent",
  "paid",
  "revoked",
  "login",
  "logout",
  "failed_login",
  "exported",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const AUDIT_MODULES = ["Finance", "Inventory", "Security", "Sales", "System", "Delivery"] as const;

export type AuditModule = (typeof AUDIT_MODULES)[number];

export const AUDIT_CATEGORIES = [
  "Invoice",
  "Payment",
  "Expense",
  "Accounting",
  "Estimate",
  "Approval",
  "Stock Adjustment",
  "Stock Transfer",
  "Product",
  "Customer",
  "Login",
  "Export",
  "Delivery",
  "Request",
] as const;

export type AuditCategory = (typeof AUDIT_CATEGORIES)[number];

export type AuditSeverity = "info" | "warning" | "critical";

export type AuditLogEntry = {
  id: string;
  action: AuditAction;
  module: AuditModule;
  category: AuditCategory;
  entity: string;
  ref: string;
  actor: string;
  timestamp: string;
  details: string;
  severity: AuditSeverity;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const hoursAgo = (h: number) => new Date(Date.now() - h * 36e5).toISOString();

const seedEntries = (): AuditLogEntry[] => {
  const entries: Omit<AuditLogEntry, "id">[] = [
    // Sales
    {
      action: "created",
      module: "Sales",
      category: "Estimate",
      entity: "Estimate",
      ref: "EST-2001",
      actor: "Admin",
      timestamp: hoursAgo(26),
      details: "Created estimate EST-2001 for Apex Travel Co. ($780.00).",
      severity: "info",
    },
    {
      action: "accepted",
      module: "Sales",
      category: "Estimate",
      entity: "Estimate",
      ref: "EST-2001",
      actor: "Client Portal",
      timestamp: hoursAgo(25),
      details: "Estimate EST-2001 accepted by the client.",
      severity: "info",
    },
    {
      action: "converted",
      module: "Sales",
      category: "Invoice",
      entity: "Estimate",
      ref: "EST-2001",
      actor: "Admin",
      timestamp: hoursAgo(24),
      details: "Converted accepted estimate EST-2001 into invoice INV-1024.",
      severity: "info",
    },
    {
      action: "updated",
      module: "Sales",
      category: "Customer",
      entity: "Customer",
      ref: "CUS-0012",
      actor: "Admin",
      timestamp: hoursAgo(84),
      details: "Updated contact details for Globex Ltd.",
      severity: "info",
    },
    {
      action: "deleted",
      module: "Sales",
      category: "Invoice",
      entity: "Invoice",
      ref: "INV-0998",
      actor: "Admin",
      timestamp: hoursAgo(150),
      details: "Deleted draft invoice INV-0998 from the list.",
      severity: "critical",
    },

    // Invoices
    {
      action: "created",
      module: "Finance",
      category: "Invoice",
      entity: "Invoice",
      ref: "INV-1024",
      actor: "Admin",
      timestamp: hoursAgo(24),
      details: "Created invoice INV-1024 for Apex Travel Co. ($1,250.00).",
      severity: "info",
    },
    {
      action: "sent",
      module: "Finance",
      category: "Invoice",
      entity: "Invoice",
      ref: "INV-1021",
      actor: "Admin",
      timestamp: hoursAgo(27),
      details: "Invoice INV-1021 emailed to the customer.",
      severity: "info",
    },
    {
      action: "updated",
      module: "Finance",
      category: "Invoice",
      entity: "Invoice",
      ref: "INV-1019",
      actor: "Admin",
      timestamp: hoursAgo(53),
      details: "Updated payment terms on invoice INV-1019.",
      severity: "info",
    },
    {
      action: "paid",
      module: "Finance",
      category: "Invoice",
      entity: "Invoice",
      ref: "INV-1015",
      actor: "System",
      timestamp: hoursAgo(73),
      details: "Payment received; invoice INV-1015 marked as paid.",
      severity: "info",
    },

    // Payments
    {
      action: "created",
      module: "Finance",
      category: "Payment",
      entity: "Receipt",
      ref: "RCPT-1008",
      actor: "Admin",
      timestamp: hoursAgo(30),
      details: "Recorded customer receipt RCPT-1008 for $850.00.",
      severity: "info",
    },
    {
      action: "created",
      module: "Finance",
      category: "Payment",
      entity: "Bank Transaction",
      ref: "BT-2210",
      actor: "System",
      timestamp: hoursAgo(31),
      details: "Imported bank transaction BT-2210 ($1,200.00 inflow).",
      severity: "info",
    },
    {
      action: "updated",
      module: "Finance",
      category: "Payment",
      entity: "Supplier Payment",
      ref: "PY-1012",
      actor: "Admin",
      timestamp: hoursAgo(50),
      details: "Changed payment mode on PY-1012 to bank transfer.",
      severity: "info",
    },
    {
      action: "approved",
      module: "Finance",
      category: "Payment",
      entity: "Credit Note",
      ref: "CN-1004",
      actor: "Admin",
      timestamp: hoursAgo(96),
      details: "Approved credit note CN-1004 for $145.00.",
      severity: "warning",
    },

    // Expenses
    {
      action: "created",
      module: "Finance",
      category: "Expense",
      entity: "Expense",
      ref: "EXP-0302",
      actor: "Admin",
      timestamp: hoursAgo(20),
      details: "Logged office supplies expense of $98.50.",
      severity: "info",
    },
    {
      action: "updated",
      module: "Finance",
      category: "Expense",
      entity: "Expense Claim",
      ref: "EC-1011",
      actor: "Admin",
      timestamp: hoursAgo(75),
      details: "Marked expense claim EC-1011 as reimbursed.",
      severity: "info",
    },
    {
      action: "approved",
      module: "Finance",
      category: "Expense",
      entity: "Bill",
      ref: "BILL-1003",
      actor: "Admin",
      timestamp: hoursAgo(120),
      details: "Approved bill BILL-1003 for $312.00.",
      severity: "info",
    },
    {
      action: "rejected",
      module: "Finance",
      category: "Expense",
      entity: "Expense Claim",
      ref: "EC-1009",
      actor: "Admin",
      timestamp: hoursAgo(108),
      details: "Rejected expense claim EC-1009 — receipts missing.",
      severity: "warning",
    },

    // Accounting
    {
      action: "posted",
      module: "Finance",
      category: "Accounting",
      entity: "Journal Entry",
      ref: "JE-1042",
      actor: "Admin",
      timestamp: hoursAgo(17),
      details: "Posted journal entry JE-1042 (depreciation adjustment).",
      severity: "info",
    },
    {
      action: "created",
      module: "Finance",
      category: "Accounting",
      entity: "Chart of Accounts",
      ref: "ACC-1100",
      actor: "Admin",
      timestamp: hoursAgo(50),
      details: "Added account 1100 Cash on Hand.",
      severity: "info",
    },
    {
      action: "updated",
      module: "Finance",
      category: "Accounting",
      entity: "Tax Rate",
      ref: "VAT 15%",
      actor: "Admin",
      timestamp: hoursAgo(99),
      details: "Updated the VAT tax rate to 15%.",
      severity: "warning",
    },
    {
      action: "exported",
      module: "Finance",
      category: "Accounting",
      entity: "Tax Return",
      ref: "Q1 Tax Return",
      actor: "Admin",
      timestamp: hoursAgo(145),
      details: "Exported the Q1 tax return report.",
      severity: "info",
    },

    // Inventory
    {
      action: "created",
      module: "Inventory",
      category: "Stock Adjustment",
      entity: "Stock Adjustment",
      ref: "ADJ-5001",
      actor: "Admin",
      timestamp: hoursAgo(14),
      details: "Adjusted +24 units of Espresso Beans (restock).",
      severity: "info",
    },
    {
      action: "created",
      module: "Inventory",
      category: "Stock Transfer",
      entity: "Stock Transfer",
      ref: "TRF-3004",
      actor: "Admin",
      timestamp: hoursAgo(32),
      details: "Transferred 12 units of Roast Coffee from Main to Downtown.",
      severity: "info",
    },
    {
      action: "updated",
      module: "Inventory",
      category: "Product",
      entity: "Product",
      ref: "SKU-8842",
      actor: "Admin",
      timestamp: hoursAgo(56),
      details: "Updated stock level for Cold Brew Can.",
      severity: "info",
    },
    {
      action: "updated",
      module: "Inventory",
      category: "Stock Adjustment",
      entity: "Stock Adjustment",
      ref: "ADJ-4998",
      actor: "Admin",
      timestamp: hoursAgo(120),
      details: "Corrected damaged-stock adjustment (−3 units).",
      severity: "warning",
    },
    {
      action: "deleted",
      module: "Inventory",
      category: "Stock Transfer",
      entity: "Stock Transfer",
      ref: "TRF-3001",
      actor: "Admin",
      timestamp: hoursAgo(168),
      details: "Reversed an erroneous stock transfer TRF-3001.",
      severity: "critical",
    },

    // Security
    {
      action: "login",
      module: "Security",
      category: "Login",
      entity: "Session",
      ref: "SES-9001",
      actor: "Admin",
      timestamp: hoursAgo(2),
      details: "Signed in from Chrome on macOS.",
      severity: "info",
    },
    {
      action: "failed_login",
      module: "Security",
      category: "Login",
      entity: "Login",
      ref: "—",
      actor: "admin",
      timestamp: hoursAgo(3),
      details: "Failed login attempt — invalid password.",
      severity: "critical",
    },
    {
      action: "failed_login",
      module: "Security",
      category: "Login",
      entity: "Login",
      ref: "—",
      actor: "unknown",
      timestamp: hoursAgo(5),
      details: "Failed login attempt — account not found.",
      severity: "critical",
    },
    {
      action: "login",
      module: "Security",
      category: "Login",
      entity: "Session",
      ref: "SES-9002",
      actor: "Admin",
      timestamp: hoursAgo(22),
      details: "Signed in from Firefox on Windows.",
      severity: "info",
    },
    {
      action: "revoked",
      module: "Security",
      category: "Login",
      entity: "Session",
      ref: "SES-8990",
      actor: "Admin",
      timestamp: hoursAgo(40),
      details: "Revoked an active session on another device.",
      severity: "warning",
    },

    // Approvals
    {
      action: "approved",
      module: "Finance",
      category: "Approval",
      entity: "Purchase Order",
      ref: "PO-2010",
      actor: "Admin",
      timestamp: hoursAgo(29),
      details: "Approved purchase order PO-2010.",
      severity: "info",
    },
    {
      action: "approved",
      module: "Finance",
      category: "Approval",
      entity: "Refund",
      ref: "REF-0007",
      actor: "Admin",
      timestamp: hoursAgo(50),
      details: "Approved customer refund REF-0007.",
      severity: "info",
    },
    {
      action: "rejected",
      module: "Finance",
      category: "Approval",
      entity: "Expense Claim",
      ref: "EC-1009",
      actor: "Admin",
      timestamp: hoursAgo(108),
      details: "Rejected expense claim EC-1009 in review.",
      severity: "warning",
    },

    // Exports
    {
      action: "exported",
      module: "System",
      category: "Export",
      entity: "Export",
      ref: "Audit Report",
      actor: "Admin",
      timestamp: hoursAgo(9),
      details: "Exported the full audit trail to CSV.",
      severity: "info",
    },
    {
      action: "exported",
      module: "System",
      category: "Export",
      entity: "Export",
      ref: "Login Report",
      actor: "Admin",
      timestamp: hoursAgo(65),
      details: "Exported the login history report.",
      severity: "info",
    },
  ];

  return entries.map((entry) => ({ ...entry, id: newId() }));
};

type AuditLogState = {
  entries: AuditLogEntry[];
  addEntry: (data: Omit<AuditLogEntry, "id">) => void;
  clearEntries: () => void;
  resetEntries: () => void;
};

export const useAuditLogStore = create<AuditLogState>()(
  persist(
    (set) => ({
      entries: seedEntries(),

      addEntry: (data) =>
        set((state) => ({
          entries: [{ ...data, id: newId() }, ...state.entries],
        })),

      clearEntries: () => set({ entries: [] }),

      resetEntries: () => set({ entries: seedEntries() }),
    }),
    {
      name: "xmerge_audit_log",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
