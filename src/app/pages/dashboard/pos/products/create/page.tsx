"use client";

import { ProductCreateForm } from "@/modules/pos";
import { usePosStore } from "@/modules/pos";
import { useHydrate } from "@/hooks/useHydrate";

export default function CreateProductPage() {
  useHydrate(usePosStore((s) => s.hydrate));

  return <ProductCreateForm />;
}
