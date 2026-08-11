"use client";

import { Boxes } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import { AuditTable } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

const STOCK_CATEGORIES = ["Stock Adjustment", "Stock Transfer", "Product"];

export default function StockChangesPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <AuditTable
      title="Stock Changes"
      description="Adjustments, transfers and product stock-level updates."
      entries={entries.filter((entry) =>
        STOCK_CATEGORIES.includes(entry.category)
      )}
      icon={Boxes}
      emptyTitle="No stock changes"
      emptyDescription="Inventory activity will appear here."
    />
  );
}
