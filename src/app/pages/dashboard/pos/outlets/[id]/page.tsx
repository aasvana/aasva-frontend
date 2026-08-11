"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { PackageOpen, Pencil, Settings2, ShoppingCartIcon, Store, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydrate } from "@/hooks/useHydrate";
import { formatMoney, usePosStore } from "@/modules/pos";
import { useOutletStore } from "@/stores/outletStore";
import { usePosSettingsStore } from "@/stores/posSettingsStore";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";

export default function OutletDetailsPage() {
  useHydrate(usePosStore((s) => s.hydrate));
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const products = usePosStore((s) => s.products);
  const sales = usePosStore((s) => s.sales);
  const outlets = useOutletStore((s) => s.outlets);
  const activeOutletId = useOutletStore((s) => s.activeOutletId);
  const setActiveOutlet = useOutletStore((s) => s.setActiveOutlet);
  const setDefaultOutlet = useOutletStore((s) => s.setDefaultOutlet);
  const threshold = usePosSettingsStore((s) => s.settings.lowStockThreshold);

  const outlet = outlets.find((o) => o.id === params?.id);
  const isActive = outlet?.id === activeOutletId;

  const outletProducts = useMemo(
    () => products.filter((p) => p.outletId === outlet?.id),
    [products, outlet?.id]
  );

  const stats = useMemo(() => {
    const units = outletProducts.reduce((sum, p) => sum + p.stock, 0);
    const low = outletProducts.filter(
      (p) => p.stock > 0 && p.stock <= threshold
    ).length;
    return { units, low };
  }, [outletProducts, threshold]);

  const outletSales = useMemo(
    () => sales.filter((s) => s.outletId === outlet?.id),
    [sales, outlet?.id]
  );

  const revenue = outletSales.reduce((sum, s) => sum + s.total, 0);

  if (!outlet) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Store className="size-10 text-gray-300" />
        <p className="text-lg font-medium text-gray-800">Outlet not found</p>
        <p className="text-sm text-gray-500">
          It may have been deleted or the link is incorrect.
        </p>
        <Button asChild>
          <Link href="/dashboard/pos/outlets">View all outlets</Link>
        </Button>
      </div>
    );
  }

  const currency = outlet.currency ?? "USD";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-800">{outlet.name}</h1>
            {outlet.isDefault && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                Default
              </span>
            )}
            {isActive && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                Active
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {outlet.code && <span className="font-medium">{outlet.code}</span>}
            {outlet.code && outlet.address && " · "}
            {outlet.address || "No address set"}
            {outlet.phone && (
              <span className="text-gray-400"> · {outlet.phone}</span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isActive && (
            <Button
              variant="outline"
              onClick={() => {
                setActiveOutlet(outlet.id);
                notify({
                  type: "info",
                  category: "system",
                  title: "Active outlet changed",
                  message: `You are now working in ${outlet.name}.`,
                });
              }}
            >
              <Store /> Set as active
            </Button>
          )}
          {!outlet.isDefault && (
            <Button
              variant="outline"
              onClick={() => {
                setDefaultOutlet(outlet.id);
                notify({
                  type: "success",
                  category: "system",
                  title: "Default outlet updated",
                  message: `${outlet.name} is now the default outlet.`,
                });
              }}
            >
              <Tag /> Make default
            </Button>
          )}
          <Button asChild>
            <Link href="/dashboard/pos/outlets">
              <Settings2 /> Manage outlets
            </Link>
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
          <p className="text-xs font-medium text-gray-500">Units in stock</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.units}</p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Low stock</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.low}</p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total revenue</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatMoney(revenue, currency)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Products</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/pos/products")}
            >
              <Pencil /> View all
            </Button>
          </div>
          {outletProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <PackageOpen className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No products at this outlet.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/pos/products/create")}
              >
                Add product
              </Button>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {outletProducts.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {product.category}
                      {product.subcategory ? ` · ${product.subcategory}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        product.stock <= 0
                          ? "bg-red-50 text-red-700"
                          : product.stock <= threshold
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                      )}
                    >
                      {product.stock} left
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatMoney(product.price, currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Recent sales</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/pos/sales")}
            >
              <Pencil /> View all
            </Button>
          </div>
          {outletSales.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <ShoppingCartIcon className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No sales at this outlet yet.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {outletSales.slice(0, 6).map((sale) => (
                <button
                  key={sale.id}
                  type="button"
                  onClick={() =>
                    router.push(`/dashboard/invoices/${sale.invoiceId}/view`)
                  }
                  className="flex w-full cursor-pointer items-center justify-between gap-3 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {sale.customerName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(sale.createdAt), "dd MMM, h:mm a")}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-gray-900">
                    {formatMoney(sale.total, sale.currency)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
