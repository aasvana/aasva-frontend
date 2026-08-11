"use client";

import { FileText } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function InvoiceChangesPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Invoice Changes"
      description="Every event touching invoices, from creation to payment."
      entries={entries.filter((entry) => entry.category === "Invoice")}
      icon={FileText}
      emptyTitle="No invoice changes"
      emptyDescription="Invoice activity will appear here."
    />
  );
}
