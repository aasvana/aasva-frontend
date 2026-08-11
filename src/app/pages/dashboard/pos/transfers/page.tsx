"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowLeftRight, CirclePlusIcon, EllipsisVertical, Trash2 } from "lucide-react";
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
import { usePosStore } from "@/modules/pos";
import { useOutletStore } from "@/stores/outletStore";
import { useStockTransferStore } from "@/stores/stockTransferStore";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";

export default function StockTransfersPage() {
  useHydrate(usePosStore((s) => s.hydrate));

  const products = usePosStore((s) => s.products);
  const updateProductById = usePosStore((s) => s.updateProductById);
  const addProduct = usePosStore((s) => s.addProduct);
  const outlets = useOutletStore((s) => s.outlets);
  const activeOutletId = useOutletStore((s) => s.activeOutletId);
  const transfers = useStockTransferStore((s) => s.transfers);
  const addTransfer = useStockTransferStore((s) => s.addTransfer);
  const deleteTransfer = useStockTransferStore((s) => s.deleteTransfer);

  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [fromOutletId, setFromOutletId] = useState(activeOutletId);
  const [toOutletId, setToOutletId] = useState("");
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");

  const sourceProducts = useMemo(
    () => products.filter((p) => p.outletId === fromOutletId),
    [products, fromOutletId]
  );

  const targetOutlets = useMemo(
    () => outlets.filter((o) => o.id !== fromOutletId),
    [outlets, fromOutletId]
  );

  const origin = products.find((p) => p.id === productId);

  const totals = useMemo(() => {
    const out = transfers
      .filter((t) => t.fromOutletId === activeOutletId)
      .reduce((sum, t) => sum + t.qty, 0);
    const inUnits = transfers
      .filter((t) => t.toOutletId === activeOutletId)
      .reduce((sum, t) => sum + t.qty, 0);
    return { out, in: inUnits };
  }, [transfers, activeOutletId]);

  const handleOpen = () => {
    setFromOutletId(activeOutletId);
    setToOutletId(outlets.find((o) => o.id !== activeOutletId)?.id ?? "");
    setProductId("");
    setQty("");
    setNote("");
    setOpen(true);
  };

  const handleSave = () => {
    const qtyNum = Number(qty);
    if (!origin) {
      toast.error("Select a product to transfer.");
      return;
    }
    if (!targetOutlets.some((o) => o.id === toOutletId)) {
      toast.error("Select a destination outlet.");
      return;
    }
    if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
      toast.error("Quantity must be a whole number greater than 0.");
      return;
    }
    if (origin.stock < qtyNum) {
      toast.error(
        `Only ${origin.stock} units of ${origin.name} are available to transfer.`
      );
      return;
    }

    const fromOutlet = outlets.find((o) => o.id === fromOutletId);
    const toOutlet = outlets.find((o) => o.id === toOutletId);

    const destProduct = products.find(
      (p) =>
        p.outletId === toOutletId &&
        p.sku === origin.sku &&
        p.name.toLowerCase() === origin.name.toLowerCase()
    );

    if (destProduct) {
      const { id, ...rest } = destProduct;
      updateProductById(id, { ...rest, stock: destProduct.stock + qtyNum });
    } else {
      const { id: _id, ...rest } = origin;
      addProduct({ ...rest, outletId: toOutletId, stock: qtyNum });
    }

    const { id, ...originRest } = origin;
    updateProductById(id, { ...originRest, stock: origin.stock - qtyNum });

    addTransfer({
      productId: origin.id,
      productName: origin.name,
      sku: origin.sku,
      fromOutletId,
      fromOutletName: fromOutlet?.name ?? "Outlet",
      toOutletId,
      toOutletName: toOutlet?.name ?? "Outlet",
      qty: qtyNum,
      note: note.trim(),
    });
    notify({
      type: "info",
      category: "inventory",
      title: "Stock transferred",
      message: `${qtyNum} × ${origin.name} moved to ${toOutlet?.name ?? "another outlet"}.`,
      link: "/dashboard/pos/transfers",
    });
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Stock Transfers</h1>
          <p className="text-sm text-gray-500">
            Move stock between your outlets.
          </p>
        </div>
        <Button onClick={handleOpen}>
          <CirclePlusIcon /> New Transfer
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Transfers</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {transfers.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Sent from outlet</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{totals.out}</p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Received here</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {totals.in}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Products moved</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {transfers.reduce((sum, t) => sum + t.qty, 0)}
          </p>
        </div>
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="overflow-hidden min-h-[350px]">
                {transfers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[350px] text-center">
                    <ArrowLeftRight className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No transfers yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Move stock between outlets to rebalance your inventory.
                    </p>
                    <Button onClick={handleOpen}>
                      <CirclePlusIcon /> New Transfer
                    </Button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "date",
                          "product",
                          "from",
                          "to",
                          "qty",
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
                      {transfers.map((transfer) => (
                        <tr key={transfer.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(transfer.createdAt), "dd-MM-yyyy")}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {transfer.productName}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {transfer.fromOutletName}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {transfer.toOutletName}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-neutral-200">
                            {transfer.qty}
                          </td>
                          <td className="px-6 py-2.5 max-w-[200px] truncate text-sm text-gray-600 dark:text-neutral-300">
                            {transfer.note || "—"}
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
                                        "Delete this transfer record? Stock counts will not change."
                                      )
                                    ) {
                                      deleteTransfer(transfer.id);
                                      toast.success("Transfer deleted.");
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
            <SheetTitle>New Stock Transfer</SheetTitle>
            <SheetDescription>
              Move units of a product from one outlet to another.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 overflow-y-auto px-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>From outlet</Label>
                <Select
                  value={fromOutletId}
                  onValueChange={(v) => {
                    setFromOutletId(v);
                    setProductId("");
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {outlets.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>To outlet</Label>
                <Select value={toOutletId} onValueChange={setToOutletId}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select outlet" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetOutlets.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {sourceProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.stock} in stock)
                    </SelectItem>
                  ))}
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

            <div className="grid gap-1.5">
              <Label>Note</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note..."
              />
            </div>

            {origin && (
              <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
                <ArrowLeftRight className="size-4 shrink-0 text-gray-400" />
                {origin.stock} units available to move
              </div>
            )}
          </div>
          <SheetFooter>
            <Button onClick={handleSave}>Transfer Stock</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
