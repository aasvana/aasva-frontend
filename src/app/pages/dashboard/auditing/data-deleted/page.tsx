"use client";

import { Trash2 } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function DataDeletedPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Deleted Records"
      description="Records removed from the workspace."
      entries={entries.filter((entry) => entry.action === "deleted")}
      icon={Trash2}
      emptyTitle="No records deleted"
      emptyDescription="Deleted records will appear here for accountability."
    />
  );
}
