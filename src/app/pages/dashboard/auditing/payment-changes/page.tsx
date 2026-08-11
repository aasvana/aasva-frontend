"use client";

import { Banknote } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function PaymentChangesPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Payment Changes"
      description="Receipts, supplier payments, bank transactions and credit notes."
      entries={entries.filter((entry) => entry.category === "Payment")}
      icon={Banknote}
      emptyTitle="No payment changes"
      emptyDescription="Payment activity will appear here."
    />
  );
}
