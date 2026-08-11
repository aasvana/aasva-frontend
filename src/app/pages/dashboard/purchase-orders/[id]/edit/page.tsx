"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getPurchaseOrder,
  SavedPurchaseOrder,
  mergePurchaseOrderDefaults,
} from "@/modules/purchase-order";
import { PurchaseOrderForm } from "@/modules/purchase-order";
import { usePosStore } from "@/modules/pos";
import { useHydrate } from "@/hooks/useHydrate";

export default function EditPurchaseOrder() {
  useHydrate(usePosStore((s) => s.hydrate));

  const params = useParams<{ id: string }>();
  const [purchaseOrder, setPurchaseOrder] = useState<
    SavedPurchaseOrder | undefined
  >(undefined);

  useEffect(() => {
    if (params?.id) {
      setPurchaseOrder(getPurchaseOrder(params.id));
    }
  }, [params?.id]);

  if (!purchaseOrder) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Loading purchase order...
      </div>
    );
  }

  return (
    <PurchaseOrderForm
      mode="edit"
      existingId={purchaseOrder.id}
      defaultValues={mergePurchaseOrderDefaults(purchaseOrder.data)}
    />
  );
}
