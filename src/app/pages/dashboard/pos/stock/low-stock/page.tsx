"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDownUp, CirclePlusIcon, PackageOpen, Printer, RefreshCw, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydrate } from "@/hooks/useHydrate";
import {
  LabelPrintDialog,
  OutletSwitcher,
  PosProduct,
  formatMoney,
  usePosStore,
} from "@/modules/pos";
import { useOutletStore } from "@/stores/outletStore";
import { usePosSettingsStore } from "@/stores/posSettingsStore";
import { cn } from "@/lib/utils";

export default function LowStockPage() {
  useHydrate(usePosStore((s) => s.hydrate));
  const router = useRouter();

  const products = usePosStore((s) => s.products);
  const activeOutletId = useOutletStore((s) => s.activeOutletId);
  const outlets = useOutletStore((s) => s.outlets);
  const threshold = usePosSettingsStore((s) => s.settings.lowStockThreshold);

  const [searchTerm, setSearchTerm] = useState("");
  const [printProduct, setPrintProduct] = useState<PosProduct | null>(null);

  const outlet = outlets.find((o) => o.id === activeOutletId);

  const outletProducts = useMemo(
    () => products.filter((p) => p.outletId === activeOutletId),
    [products, activeOutletId]
  );

  const lowStock = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return outletProducts
      .filter(
        (p) =>
          p.stock <= threshold &&
          `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(query)
      )
      .sort((a, b) => a.stock - b.stock);
  }, [outletProducts, searchTerm, threshold]);

  const stats = useMemo(() => {
    const low = lowStock.filter((p) => p.stock > 0).length;
    const out = lowStock.filter((p) => p.stock <= 0).length;
    return { low, out };
  }, [lowStock]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Low Stock</h1>
          <p className="text-sm text-gray-500">
            Products at or below the threshold (
            {threshold} units) at {outlet?.name ?? "this outlet"}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OutletSwitcher />
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/pos/stock/adjustments")}
          >
            <ArrowDownUp /> Adjust Stock
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Products</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {outletProducts.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Low stock</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{stats.low}</p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Out of stock</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{stats.out}</p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Threshold</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{threshold}</p>
        </div>
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="py-3 px-4 flex flex-row justify-between">
                <div className="relative w-lg max-w-sm">
                  <label className="sr-only">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search low stock products..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setSearchTerm("")}
                >
                  <RefreshCw />
                </Button>
              </div>
              <div className="overflow-hidden min-h-[350px]">
                {lowStock.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[350px] text-center">
                    <PackageOpen className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      All stocked up
                    </p>
                    <p className="text-sm text-gray-500">
                      No products are running low at this outlet.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/pos/products">
                        <CirclePlusIcon /> Add Product
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "product",
                          "category",
                          "price",
                          "stock",
                          "status",
                          "value",
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
                      {lowStock.map((product) => {
                        const out = product.stock <= 0;
                        return (
                          <tr key={product.id}>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {product.name}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                              {product.category}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {formatMoney(
                                product.price,
                                outlet?.currency ?? "USD"
                              )}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              {product.stock}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                  out
                                    ? "bg-red-50 text-red-600"
                                    : "bg-amber-50 text-amber-700"
                                )}
                              >
                                {out ? "Out of stock" : "Low stock"}
                              </span>
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                              {formatMoney(
                                product.price * product.stock,
                                outlet?.currency ?? "USD"
                              )}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(
                                      "/dashboard/pos/stock/adjustments"
                                    )
                                  }
                                >
                                  <Tag className="size-3.5" /> Adjust
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setPrintProduct(product)}
                                >
                                  <Printer className="size-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <LabelPrintDialog
        product={printProduct}
        open={Boolean(printProduct)}
        onOpenChange={(open) => {
          if (!open) setPrintProduct(null);
        }}
      />
    </div>
  );
}
