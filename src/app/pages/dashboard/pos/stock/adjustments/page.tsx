"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowDownUp, CirclePlusIcon, EllipsisVertical, PackagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useHydrate } from "@/hooks/useHydrate";
import { OutletSwitcher, usePosStore } from "@/modules/pos";
import { useOutletStore } from "@/stores/outletStore";
import {
  ADJUSTMENT_REASONS,
  useStockAdjustmentStore,
} from "@/stores/stockAdjustmentStore";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";

export default function StockAdjustmentsPage() {
  useHydrate(usePosStore((s) => s.hydrate));

  const products = usePosStore((s) => s.products);
  const updateProductById = usePosStore((s) => s.updateProductById);
  const activeOutletId = useOutletStore((s) => s.activeOutletId);
  const outlets = useOutletStore((s) => s.outlets);
  const adjustments = useStockAdjustmentStore((s) => s.adjustments);
  const addAdjustment = useStockAdjustmentStore((s) => s.addAdjustment);
  const deleteAdjustment = useStockAdjustmentStore((s) => s.deleteAdjustment);

  const outlet = outlets.find((o) => o.id === activeOutletId);

  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [direction, setDirection] = useState<"in" | "out">("in");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState<string>(ADJUSTMENT_REASONS[0]);
  const [note, setNote] = useState("");

  const outletProducts = useMemo(
    () => products.filter((p) => p.outletId === activeOutletId),
    [products, activeOutletId]
  );

  const outletAdjustments = useMemo(
    () => adjustments.filter((a) => a.outletId === activeOutletId),
    [adjustments, activeOutletId]
  );

  const totals = useMemo(() => {
    const unitsIn = outletAdjustments
      .filter((a) => a.delta > 0)
      .reduce((sum, a) => sum + a.delta, 0);
    const unitsOut = outletAdjustments
      .filter((a) => a.delta < 0)
      .reduce((sum, a) => sum + Math.abs(a.delta), 0);
    return { unitsIn, unitsOut };
  }, [outletAdjustments]);

  const selectedProduct = products.find((p) => p.id === productId);

  const resetForm = () => {
    setProductId("");
    setDirection("in");
    setQty("");
    setReason(ADJUSTMENT_REASONS[0]);
    setNote("");
  };

  const handleSave = () => {
    const product = selectedProduct;
    const qtyNum = Number(qty);
    if (!product) {
      toast.error("Select a product to adjust.");
      return;
    }
    if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
      toast.error("Quantity must be a whole number greater than 0.");
      return;
    }
    const finalQty = direction === "in" ? qtyNum : -qtyNum;
    if (finalQty < 0 && product.stock + finalQty < 0) {
      toast.error(
        `Only ${product.stock} units of ${product.name} are in stock.`
      );
      return;
    }

    const { id, ...rest } = product;
    updateProductById(id, { ...rest, stock: product.stock + finalQty });
    addAdjustment({
      productId: id,
      productName: product.name,
      outletId: activeOutletId,
      outletName: outlet?.name ?? "Outlet",
      delta: finalQty,
      reason,
      note: note.trim(),
    });
    notify({
      type: finalQty > 0 ? "success" : "info",
      category: "inventory",
      title: "Stock adjusted",
      message: `${finalQty > 0 ? "+" : ""}${finalQty} ${product.name} (${
        direction === "in" ? "added" : "removed"
      })`,
      link: "/dashboard/pos/stock",
    });
    setOpen(false);
    resetForm();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Stock Adjustments
          </h1>
          <p className="text-sm text-gray-500">
            Record manual changes to stock for this outlet.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OutletSwitcher />
          <Button onClick={() => setOpen(true)}>
            <CirclePlusIcon /> Add Adjustment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Adjustments</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {outletAdjustments.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Units added</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            +{totals.unitsIn}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Units removed</p>
          <p className="mt-1 text-2xl font-bold text-red-500">
            -{totals.unitsOut}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Products</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {outletProducts.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="overflow-hidden min-h-[350px]">
                {outletAdjustments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[350px] text-center">
                    <ArrowDownUp className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No adjustments yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Record stock corrections like restocks, damages, or recounts.
                    </p>
                    <Button onClick={() => setOpen(true)}>
                      <CirclePlusIcon /> Add Adjustment
                    </Button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "date",
                          "product",
                          "type",
                          "qty",
                          "reason",
                          "note",
                          "Action",
                        ].map((header, idx) => (
                          <th
                            key={idx}
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {outletAdjustments.map((adjustment) => (
                        <tr key={adjustment.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500">
                            {format(
                              new Date(adjustment.createdAt),
                              "dd-MM-yyyy"
                            )}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {adjustment.productName}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                adjustment.delta > 0
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-600"
                              )}
                            >
                              {adjustment.delta > 0 ? "In" : "Out"}
                            </span>
                          </td>
                          <td
                            className={cn(
                              "px-6 py-2.5 whitespace-nowrap text-sm font-semibold",
                              adjustment.delta > 0
                                ? "text-emerald-600"
                                : "text-red-500"
                            )}
                          >
                            {adjustment.delta > 0 ? "+" : ""}
                            {adjustment.delta}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {adjustment.reason}
                          </td>
                          <td className="px-6 py-2.5 max-w-[200px] truncate text-sm text-gray-600 dark:text-neutral-300">
                            {adjustment.note || "—"}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <EllipsisVertical />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side="left" align="start">
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Delete this adjustment record?"
                                      )
                                    ) {
                                      deleteAdjustment(adjustment.id);
                                      toast.success("Adjustment deleted.");
                                    }
                                  }}
                                >
                                  <Trash2 /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Stock Adjustment</SheetTitle>
            <SheetDescription>
              Update the stock count for a product in {outlet?.name ?? "this outlet"}.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 overflow-y-auto px-4">
            <div className="grid gap-1.5">
              <Label>Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {outletProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.stock} in stock)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Type</Label>
                <Select
                  value={direction}
                  onValueChange={(v) => setDirection(v as "in" | "out")}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Stock In</SelectItem>
                    <SelectItem value="out">Stock Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>Reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADJUSTMENT_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Note</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note..."
              />
            </div>

            {selectedProduct && (
              <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
                <PackagePlus className="size-4 shrink-0 text-gray-400" />
                {selectedProduct.name} will go from {selectedProduct.stock} to{" "}
                <span className="font-semibold text-gray-900">
                  {Math.max(
                    0,
                    selectedProduct.stock +
                      (direction === "in" ? Number(qty) || 0 : -(Number(qty) || 0))
                  )}
                </span>{" "}
                units
              </div>
            )}
          </div>
          <SheetFooter>
            <Button onClick={handleSave}>Save Adjustment</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
