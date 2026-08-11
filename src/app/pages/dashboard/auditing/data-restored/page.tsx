"use client";

import { RotateCcw } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function DataRestoredPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Restored Records"
      description="Records brought back after being deleted."
      entries={entries.filter((entry) => entry.action === "restored")}
      icon={RotateCcw}
      emptyTitle="No records restored"
      emptyDescription="Restored records will appear here."
    />
  );
}
