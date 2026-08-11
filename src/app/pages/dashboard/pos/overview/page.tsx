"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, isToday } from "date-fns";
import {
  ArrowLeftRight,
  ArrowRight,
  CirclePlusIcon,
  PackageOpen,
  Printer,
  RefreshCw,
  ShoppingCartIcon,
  Store,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydrate } from "@/hooks/useHydrate";
import {
  OutletSwitcher,
  formatMoney,
  usePosStore,
} from "@/modules/pos";
import { useOutletStore } from "@/stores/outletStore";
import { usePosSettingsStore } from "@/stores/posSettingsStore";
import { cn } from "@/lib/utils";

function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: "default" | "amber" | "red";
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <div
          className={cn(
            "grid size-8 place-items-center rounded-full",
            tone === "amber" && "bg-amber-50 text-amber-600",
            tone === "red" && "bg-red-50 text-red-600",
            tone === "default" && "bg-emerald-50 text-emerald-600"
          )}
        >
          {icon}
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function PosOverviewPage() {
  useHydrate(usePosStore((s) => s.hydrate));
  const router = useRouter();

  const products = usePosStore((s) => s.products);
  const sales = usePosStore((s) => s.sales);
  const activeOutletId = useOutletStore((s) => s.activeOutletId);
  const outlets = useOutletStore((s) => s.outlets);
  const threshold = usePosSettingsStore((s) => s.settings.lowStockThreshold);

  const outlet = outlets.find((o) => o.id === activeOutletId);
  const outletName = outlet?.name ?? "Outlet";

  const outletProducts = useMemo(
    () => products.filter((p) => p.outletId === activeOutletId),
    [products, activeOutletId]
  );

  const stats = useMemo(() => {
    const units = outletProducts.reduce((sum, p) => sum + p.stock, 0);
    const low = outletProducts.filter(
      (p) => p.stock > 0 && p.stock <= threshold
    ).length;
    const out = outletProducts.filter((p) => p.stock <= 0).length;
    return { units, low, out };
  }, [outletProducts, threshold]);

  const outletSales = useMemo(
    () => sales.filter((sale) => sale.outletId === activeOutletId),
    [sales, activeOutletId]
  );

  const todaySales = useMemo(
    () =>
      outletSales.filter((sale) => isToday(new Date(sale.createdAt))),
    [outletSales]
  );

  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const recentSales = outletSales.slice(0, 5);

  const quickActions = [
    {
      label: "New Sale",
      description: "Open the register",
      icon: ShoppingCartIcon,
      onClick: () => router.push("/dashboard/pos/store"),
    },
    {
      label: "Add Product",
      description: "Create a new product",
      icon: CirclePlusIcon,
      onClick: () => router.push("/dashboard/pos/products/create"),
    },
    {
      label: "Stock Transfers",
      description: "Move stock between outlets",
      icon: ArrowLeftRight,
      onClick: () => router.push("/dashboard/pos/transfers"),
    },
    {
      label: "Print Labels",
      description: "Print product labels",
      icon: Printer,
      onClick: () => router.push("/dashboard/pos/products"),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Store Overview</h1>
          <p className="text-sm text-gray-500">
            {outletName} — a snapshot of your store.
          </p>
        </div>
        <OutletSwitcher />
      </div>

      {stats.low > 0 && (
        <Link
          href="/dashboard/pos/stock/low-stock"
          className="flex items-center justify-between gap-3 rounded-[20px] border border-amber-100 bg-amber-50/70 px-4 py-3 text-sm text-amber-800 transition-colors hover:bg-amber-50"
        >
          <span className="flex items-center gap-2">
            <Tag className="size-4" />
            {stats.low} product{stats.low === 1 ? " is" : "s"} running low on
            stock.
          </span>
          <ArrowRight className="size-4" />
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard
          label="Products"
          value={outletProducts.length}
          icon={<PackageOpen className="size-4" />}
        />
        <StatCard
          label="Units in stock"
          value={stats.units}
          icon={<Store className="size-4" />}
        />
        <StatCard
          label="Low stock"
          value={stats.low}
          icon={<Tag className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Out of stock"
          value={stats.out}
          icon={<RefreshCw className="size-4" />}
          tone="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">Today's sales</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {formatMoney(todayRevenue, outlet?.currency ?? "USD")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {todaySales.length} sale{todaySales.length === 1 ? "" : "s"} today
          </p>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => router.push("/dashboard/pos/sales")}
          >
            View sales history
          </Button>
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <p className="text-sm font-semibold text-gray-800">Recent sales</p>
          {recentSales.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <ShoppingCartIcon className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No sales yet at this outlet.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/pos/store")}
              >
                Start a sale
              </Button>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {recentSales.map((sale) => (
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

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="group flex cursor-pointer flex-col items-start gap-3 rounded-[20px] border border-gray-100 bg-white p-4 text-left shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
          >
            <action.icon className="size-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {action.label}
              </p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
