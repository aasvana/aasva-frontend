"use client";

import { Receipt } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function ExpenseChangesPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Expense Changes"
      description="Expenses, expense claims and vendor bills."
      entries={entries.filter((entry) => entry.category === "Expense")}
      icon={Receipt}
      emptyTitle="No expense changes"
      emptyDescription="Expense activity will appear here."
    />
  );
}
