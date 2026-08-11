"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CirclePlusIcon,
  EllipsisVertical,
  PackageOpen,
  Pencil,
  Printer,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

function getStockStatus(stock: number, threshold: number): StockStatus {
  if (stock <= 0) return "out-of-stock";
  if (stock <= threshold) return "low-stock";
  return "in-stock";
}

const statusStyles: Record<StockStatus, { label: string; className: string }> = {
  "in-stock": {
    label: "In Stock",
    className: "bg-emerald-50 text-emerald-700",
  },
  "low-stock": {
    label: "Low Stock",
    className: "bg-amber-50 text-amber-700",
  },
  "out-of-stock": {
    label: "Out of Stock",
    className: "bg-red-50 text-red-700",
  },
};

export default function PosStockPage() {
  useHydrate(usePosStore((s) => s.hydrate));
  const router = useRouter();

  const products = usePosStore((s) => s.products);
  const activeOutletId = useOutletStore((s) => s.activeOutletId);
  const threshold = usePosSettingsStore((s) => s.settings.lowStockThreshold);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [printProduct, setPrintProduct] = useState<PosProduct | null>(null);

  const outletProducts = useMemo(
    () => products.filter((p) => p.outletId === activeOutletId),
    [products, activeOutletId]
  );

  const categories = useMemo(
    () => Array.from(new Set(outletProducts.map((p) => p.category))),
    [outletProducts]
  );

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return outletProducts.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(query)
    );
  }, [outletProducts, searchTerm, category]);

  const stats = useMemo(() => {
    const units = outletProducts.reduce((sum, p) => sum + p.stock, 0);
    const low = outletProducts.filter(
      (p) => getStockStatus(p.stock, threshold) === "low-stock"
    ).length;
    const out = outletProducts.filter(
      (p) => getStockStatus(p.stock, threshold) === "out-of-stock"
    ).length;
    return { units, low, out };
  }, [outletProducts, threshold]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategory("all");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Stock Overview</h1>
          <p className="text-sm text-gray-500">
            Monitor and manage the stock levels for this outlet.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OutletSwitcher />
          <Button asChild>
            <Link href="/dashboard/pos/products/create">
              <CirclePlusIcon /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        {[
          { label: "Products", value: outletProducts.length },
          { label: "Units in stock", value: stats.units },
          { label: "Low stock", value: stats.low },
          { label: "Out of stock", value: stats.out },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="py-3 px-4 flex flex-row justify-between gap-3">
                <div className="relative w-lg max-w-sm">
                  <label className="sr-only">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search stock..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
                  >
                    <option value="all">All categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={resetFilters}
                  >
                    <RefreshCw />
                  </Button>
                </div>
              </div>
              <div className="overflow-hidden min-h-[400px]">
                {outletProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[400px] text-center">
                    <PackageOpen className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No products yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Add your first product to start tracking stock.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/pos/products/create">
                        <CirclePlusIcon /> Add Product
                      </Link>
                    </Button>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[400px] text-center">
                    <p className="text-lg font-medium text-gray-800">
                      No stock matches your search.
                    </p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search or category filter.
                    </p>
                    <Button variant="outline" onClick={resetFilters}>
                      <RefreshCw /> Clear filters
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
                      {filtered.map((product) => {
                        const status = getStockStatus(product.stock, threshold);
                        const statusStyle = statusStyles[status];
                        return (
                          <tr key={product.id}>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {product.name}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                              {product.category}
                              {product.subcategory && (
                                <span className="text-gray-400">
                                  {" "}
                                  · {product.subcategory}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {formatMoney(product.price, "USD")}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {product.stock}
                              <span className="text-xs font-normal text-gray-400">
                                {" "}
                                ({formatMoney(product.price * product.stock, "USD")})
                              </span>
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                  statusStyle.className
                                )}
                              >
                                {statusStyle.label}
                              </span>
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <EllipsisVertical />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="left" align="start">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/pos/products/${product.id}/edit`
                                      )
                                    }
                                  >
                                    <Pencil /> Adjust Stock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setPrintProduct(product)}
                                  >
                                    <Printer /> Print Label
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
