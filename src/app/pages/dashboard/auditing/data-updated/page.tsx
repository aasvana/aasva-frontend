"use client";

import { PencilLine } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function DataUpdatedPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Updated Records"
      description="Edits and modifications to existing records."
      entries={entries.filter((entry) => entry.action === "updated")}
      icon={PencilLine}
      emptyTitle="No records updated"
      emptyDescription="Changes to existing records will appear here."
    />
  );
}
