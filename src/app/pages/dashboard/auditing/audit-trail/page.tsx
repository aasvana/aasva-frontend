"use client";

import { ScrollText } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function AuditTrailPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Audit Trail"
      description="An immutable-style record of changes with severity levels."
      entries={entries}
      icon={ScrollText}
      defaultSeverity="all"
      emptyTitle="No audit records"
      emptyDescription="Changes to records will be captured here for compliance."
    />
  );
}
