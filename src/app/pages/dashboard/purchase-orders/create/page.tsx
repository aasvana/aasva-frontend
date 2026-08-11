"use client";

import { PurchaseOrderForm } from "@/modules/purchase-order";
import { usePosStore } from "@/modules/pos";
import { useHydrate } from "@/hooks/useHydrate";

export default function CreatePurchaseOrder() {
  useHydrate(usePosStore((s) => s.hydrate));

  return <PurchaseOrderForm mode="create" />;
}
