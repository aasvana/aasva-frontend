"use client";

import { PlusCircle } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function DataCreatedPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Created Records"
      description="New records added across the workspace."
      entries={entries.filter((entry) => entry.action === "created")}
      icon={PlusCircle}
      emptyTitle="No records created"
      emptyDescription="Newly created records will appear here."
    />
  );
}
