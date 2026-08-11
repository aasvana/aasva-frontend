"use client";

import { useMemo } from "react";
import { Combobox } from "@/components/ui/combobox";
import { useOutletStore } from "@/stores/outletStore";
import { PosProduct, formatMoney, usePosStore } from "./index";

export function PosProductPicker({
  onSelect,
  excludeIds = [],
  placeholder = "Add from products...",
}: {
  onSelect: (product: PosProduct) => void;
  excludeIds?: string[];
  placeholder?: string;
}) {
  const products = usePosStore((s) => s.products);
  const activeOutletId = useOutletStore((s) => s.activeOutletId);

  const options = useMemo(
    () =>
      products
        .filter(
          (product) =>
            product.outletId === activeOutletId &&
            !excludeIds.includes(product.id)
        )
        .map((product) => ({
          value: product.id,
          label: `${product.name} · ${formatMoney(product.price, "USD")}`,
        })),
    [products, activeOutletId, excludeIds]
  );

  return (
    <Combobox
      options={options}
      placeholder={
        options.length === 0 ? "No products available" : placeholder
      }
      onChange={(value) => {
        const product = products.find((p) => p.id === value);
        if (product) onSelect(product);
      }}
    />
  );
}
