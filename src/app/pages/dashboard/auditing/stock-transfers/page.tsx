"use client";

import { ArrowLeftRight } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function StockTransfersPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Stock Transfers"
      description="Movement of stock between outlets and locations."
      entries={entries.filter((entry) => entry.category === "Stock Transfer")}
      icon={ArrowLeftRight}
      emptyTitle="No stock transfers"
      emptyDescription="Stock transfers will appear here."
    />
  );
}
