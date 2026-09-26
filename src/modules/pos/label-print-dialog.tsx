"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCompanySettings } from "@/lib/company-query";
import { useOutletStore } from "@/stores/outletStore";
import { usePosSettingsStore } from "@/stores/posSettingsStore";
import { PosProduct } from "./schema";
import { ProductLabel, printProductLabels } from "./product-label";

export function LabelPrintDialog({
  product,
  open,
  onOpenChange,
}: {
  product: PosProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { company } = useCompanySettings();
  const businessName = company?.name ?? "";
  const outlets = useOutletStore((s) => s.outlets);
  const defaultCopies = usePosSettingsStore(
    (s) => s.settings.defaultLabelCopies
  );
  const [copies, setCopies] = useState(1);

  useEffect(() => {
    if (open) setCopies(defaultCopies);
  }, [open, defaultCopies]);

  const currency =
    outlets.find((o) => o.id === product?.outletId)?.currency ?? "USD";

  const handlePrint = () => {
    if (!product) return;
    printProductLabels({ product, copies, businessName, currency });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Print Label</SheetTitle>
          <SheetDescription>
            Preview and print a price label for this product.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 overflow-y-auto px-4">
          {product && (
            <div className="flex justify-center rounded-2xl border border-gray-100 bg-white p-5">
              <ProductLabel
                product={product}
                businessName={businessName}
                currency={currency}
              />
            </div>
          )}

          <div className="grid gap-1.5">
            <p className="text-sm font-medium text-gray-800">Copies</p>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={copies <= 1}
                onClick={() => setCopies((c) => Math.max(1, c - 1))}
              >
                <Minus />
              </Button>
              <span className="w-12 text-center text-lg font-semibold tabular-nums">
                {copies}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={copies >= 50}
                onClick={() => setCopies((c) => Math.min(50, c + 1))}
              >
                <Plus />
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button onClick={handlePrint} disabled={!product}>
            <Printer /> Print Label
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
