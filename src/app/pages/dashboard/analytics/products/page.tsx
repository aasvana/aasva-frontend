"use client";

import { useMemo } from "react";
import { AlertTriangle, Boxes, Package, Tag, Wallet } from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import { KpiCard, ChartCard, TopList, SimpleTable } from "@/components/analytics/ui";
import { AnalyticsDonutChart } from "@/components/analytics/charts";
import {
  lowStockProducts,
  money,
  moneyCompact,
  num,
  productOverview,
  productsByCategory,
  topProductsByRevenue,
} from "@/modules/analytics/data";

export default function AnalyticsProductsPage() {
  const products = useMemo(() => productOverview(), []);
  const byCategory = useMemo(() => productsByCategory(), []);
  const top = useMemo(() => topProductsByRevenue(8), []);
  const lowStock = useMemo(() => lowStockProducts(8), []);

  const ready = useClientReady();
  if (!ready) return null;

  const categoryPie = byCategory.map((c) => ({
    label: c.label,
    value: c.count,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">
          Product Analytics
        </h1>
        <p className="text-sm text-gray-500">
          Catalogue performance, pricing and best sellers.
        </p>
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          label="Products"
          value={num(products.total)}
          icon={Package}
          tone="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          label="Stock Units"
          value={num(products.totalStock)}
          icon={Boxes}
          tone="bg-sky-50 text-sky-700"
        />
        <KpiCard
          label="Stock Value"
          value={moneyCompact(products.stockValue)}
          icon={Wallet}
          tone="bg-violet-50 text-violet-700"
        />
        <KpiCard
          label="Avg Price"
          value={money(products.avgPrice)}
          icon={Tag}
          tone="bg-amber-50 text-amber-700"
        />
        <KpiCard
          label="Low Stock"
          value={num(products.lowStock)}
          sub="at or below 5 units"
          icon={AlertTriangle}
          tone="bg-rose-50 text-rose-700"
        />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard title="Top Products" subtitle="By revenue from sales and invoices">
          <TopList
            items={top.map((p) => ({
              label: p.label,
              subtitle: `${num(Math.round(p.qty))} units sold`,
              value: p.revenue,
            }))}
            format={moneyCompact}
          />
        </ChartCard>
        <ChartCard title="Products by Category" subtitle="Share of catalogue">
          <AnalyticsDonutChart data={categoryPie} format={num} />
        </ChartCard>
        <ChartCard title="Category Stock Value">
          <SimpleTable
            columns={["Category", "Items", "Units", "Value"]}
            rows={byCategory.map((c) => [
              c.label,
              num(c.count),
              num(c.units),
              money(c.value),
            ])}
          />
        </ChartCard>
      </div>

      <div className="p-1.5">
        <ChartCard title="Low Stock Alerts" subtitle="Products at or below 5 units">
          <SimpleTable
            columns={["Product", "SKU", "Category", "Stock", "Value"]}
            rows={lowStock.map((p) => [
              p.label,
              p.sku,
              p.category,
              num(p.stock),
              money(p.value),
            ])}
          />
        </ChartCard>
      </div>
    </div>
  );
}
