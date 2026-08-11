"use client";

import { useMemo } from "react";
import { IndianRupee, Receipt, ShoppingCart, TrendingUp, Wallet } from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import { KpiCard, ChartCard, TopList, SimpleTable } from "@/components/analytics/ui";
import {
  AnalyticsAreaChart,
  AnalyticsDonutChart,
} from "@/components/analytics/charts";
import {
  money,
  moneyCompact,
  monthlyRevenue,
  num,
  recentInvoices,
  salesByStatus,
  salesOverview,
  topProductsByRevenue,
} from "@/modules/analytics/data";

export default function AnalyticsSalesPage() {
  const sales = useMemo(() => salesOverview(), []);
  const monthly = useMemo(() => monthlyRevenue(), []);
  const status = useMemo(() => salesByStatus(), []);
  const topProducts = useMemo(() => topProductsByRevenue(8), []);
  const invoices = useMemo(() => recentInvoices(8), []);

  const ready = useClientReady();
  if (!ready) return null;

  const statusPie = status.map((s) => ({ label: s.label, value: s.count }));

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Sales Analytics</h1>
        <p className="text-sm text-gray-500">
          Revenue, invoices and point-of-sale performance.
        </p>
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Total Revenue"
          value={moneyCompact(sales.revenue)}
          icon={TrendingUp}
          tone="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          label="Received"
          value={moneyCompact(sales.received)}
          sub="paid against invoices"
          icon={Wallet}
          tone="bg-sky-50 text-sky-700"
        />
        <KpiCard
          label="Open Balance"
          value={moneyCompact(sales.openBalance)}
          sub="still to collect"
          icon={IndianRupee}
          tone="bg-amber-50 text-amber-700"
        />
        <KpiCard
          label="Invoices"
          value={num(sales.invoiceCount)}
          sub={`avg ${money(sales.avgInvoice)}`}
          icon={Receipt}
          tone="bg-violet-50 text-violet-700"
        />
        <KpiCard
          label="POS Sales"
          value={num(sales.posCount)}
          sub={moneyCompact(sales.posRevenue)}
          icon={ShoppingCart}
          tone="bg-teal-50 text-teal-700"
        />
        <KpiCard
          label="Combined"
          value={moneyCompact(sales.revenue + sales.posRevenue)}
          sub="invoices + POS"
          icon={TrendingUp}
          tone="bg-rose-50 text-rose-700"
        />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard
          title="Revenue Trend"
          subtitle="Invoices vs point of sale, last 12 months"
          className="lg:col-span-2"
        >
          <AnalyticsAreaChart
            data={monthly}
            xKey="label"
            series={[
              { key: "invoices", name: "Invoices", color: "#10b981" },
              { key: "pos", name: "POS", color: "#0ea5e9" },
            ]}
            format={moneyCompact}
          />
        </ChartCard>
        <ChartCard title="Invoices by Status">
          <AnalyticsDonutChart data={statusPie} />
        </ChartCard>
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-2">
        <ChartCard title="Top Products" subtitle="By revenue from sales and invoices">
          <TopList
            items={topProducts.map((p) => ({
              label: p.label,
              subtitle: `${num(Math.round(p.qty))} units sold`,
              value: p.revenue,
            }))}
            format={moneyCompact}
          />
        </ChartCard>
        <ChartCard title="Recent Invoices" subtitle="Latest documents created">
          <SimpleTable
            columns={["Invoice", "Customer", "Status", "Amount"]}
            rows={invoices.map((inv) => [
              inv.label,
              inv.party,
              inv.status,
              money(inv.amount),
            ])}
          />
        </ChartCard>
      </div>
    </div>
  );
}
