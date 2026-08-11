"use client";

import { BookOpen } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function AccountingChangesPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Accounting Changes"
      description="Journal entries, chart of accounts, tax rates and returns."
      entries={entries.filter((entry) => entry.category === "Accounting")}
      icon={BookOpen}
      emptyTitle="No accounting changes"
      emptyDescription="Accounting activity will appear here."
    />
  );
}
