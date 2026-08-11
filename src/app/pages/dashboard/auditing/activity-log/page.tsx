"use client";

import { Activity } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function ActivityLogPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Activity Log"
      description="Every event recorded across the workspace, newest first."
      entries={entries}
      icon={Activity}
      emptyTitle="No activity yet"
      emptyDescription="Events will appear here as you create, update and delete records."
    />
  );
}
