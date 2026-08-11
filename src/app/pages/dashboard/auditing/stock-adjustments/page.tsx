"use client";

import { SlidersHorizontal } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function StockAdjustmentsPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Stock Adjustments"
      description="Manual corrections to stock levels and their reasons."
      entries={entries.filter(
        (entry) => entry.category === "Stock Adjustment"
      )}
      icon={SlidersHorizontal}
      emptyTitle="No stock adjustments"
      emptyDescription="Stock adjustments will appear here."
    />
  );
}
