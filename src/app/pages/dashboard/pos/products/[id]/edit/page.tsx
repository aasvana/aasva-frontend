"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProduct, PosProduct, ProductCreateForm } from "@/modules/pos";
import { usePosStore } from "@/modules/pos";
import { useHydrate } from "@/hooks/useHydrate";

export default function EditProductPage() {
  useHydrate(usePosStore((s) => s.hydrate));

  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<PosProduct | undefined>(undefined);

  useEffect(() => {
    if (params?.id) {
      setProduct(getProduct(params.id));
    }
  }, [params?.id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Loading product...
      </div>
    );
  }

  return <ProductCreateForm product={product} />;
}
