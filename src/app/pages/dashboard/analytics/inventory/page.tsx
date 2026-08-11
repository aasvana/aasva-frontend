"use client";

import { useMemo } from "react";
import {
  ArrowUpDown,
  Boxes,
  Package,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  KpiCard,
  ChartCard,
  BreakdownList,
  SimpleTable,
} from "@/components/analytics/ui";
import { AnalyticsBarChart } from "@/components/analytics/charts";
import {
  inventoryOverview,
  moneyCompact,
  num,
  stockByOutlet,
} from "@/modules/analytics/data";

export default function AnalyticsInventoryPage() {
  const inventory = useMemo(() => inventoryOverview(), []);
  const outlets = useMemo(() => stockByOutlet(), []);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">
          Inventory Analytics
        </h1>
        <p className="text-sm text-gray-500">
          Stock levels, movements and adjustments across outlets.
        </p>
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          label="Stock Value"
          value={moneyCompact(inventory.stockValue)}
          icon={Wallet}
          tone="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          label="Units in Stock"
          value={num(inventory.units)}
          icon={Boxes}
          tone="bg-sky-50 text-sky-700"
        />
        <KpiCard
          label="Adjustments"
          value={num(inventory.adjustments)}
          sub={`net ${inventory.netDelta >= 0 ? "+" : ""}${num(inventory.netDelta)} units`}
          icon={SlidersHorizontal}
          tone="bg-violet-50 text-violet-700"
        />
        <KpiCard
          label="Transfers"
          value={num(inventory.transfers)}
          icon={ArrowUpDown}
          tone="bg-amber-50 text-amber-700"
        />
        <KpiCard
          label="Avg Stock Value"
          value={moneyCompact(inventory.units ? inventory.stockValue / inventory.units : 0)}
          icon={Package}
          tone="bg-teal-50 text-teal-700"
        />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard
          title="Stock Movement"
          subtitle="Adjustments vs transfers, last 12 months"
          className="lg:col-span-2"
        >
          <AnalyticsBarChart
            data={inventory.monthly}
            xKey="label"
            series={[
              { key: "adjustments", name: "Adjustments", color: "#10b981" },
              { key: "transfers", name: "Transfers", color: "#0ea5e9" },
            ]}
            format={num}
          />
        </ChartCard>
        <ChartCard title="Stock by Outlet" subtitle="Share of total units">
          <BreakdownList
            items={outlets.map((o) => ({ label: o.name, value: o.units }))}
            format={num}
          />
        </ChartCard>
      </div>

      <div className="p-1.5">
        <ChartCard title="Outlets" subtitle="Products, units and value per outlet">
          <SimpleTable
            columns={["Outlet", "Products", "Units", "Value"]}
            rows={outlets.map((o) => [
              o.name,
              num(o.products),
              num(o.units),
              moneyCompact(o.value),
            ])}
          />
        </ChartCard>
      </div>

      <div className="p-1.5">
        <ChartCard title="Activity" subtitle="Monthly adjustments and transfers">
          <SimpleTable
            columns={["Month", "Adjustments", "Transfers"]}
            rows={inventory.monthly.map((m) => [
              m.label,
              num(m.adjustments),
              num(m.transfers),
            ])}
          />
        </ChartCard>
      </div>
    </div>
  );
}
