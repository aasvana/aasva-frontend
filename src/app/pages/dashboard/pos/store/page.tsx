"use client";

import { useHydrate } from "@/hooks/useHydrate";
import { PosTerminal, usePosStore } from "@/modules/pos";

export default function PosStorePage() {
  useHydrate(usePosStore((s) => s.hydrate));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Store</h1>
        <p className="text-sm text-gray-500">
          Add products to the cart and complete sales to generate invoices.
        </p>
      </div>
      <PosTerminal />
    </div>
  );
}
