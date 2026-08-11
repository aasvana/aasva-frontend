"use client";

import { useMemo } from "react";
import {
  Boxes,
  Package,
  Receipt,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import { KpiCard, ChartCard, TopList, SimpleTable } from "@/components/analytics/ui";
import {
  AnalyticsAreaChart,
  AnalyticsDonutChart,
} from "@/components/analytics/charts";
import {
  customerOverview,
  deliveryOverview,
  money,
  moneyCompact,
  monthlyRevenue,
  num,
  productOverview,
  recentInvoices,
  salesByStatus,
  salesOverview,
  topCustomersBySpend,
  topProductsByRevenue,
} from "@/modules/analytics/data";

export default function AnalyticsOverviewPage() {
  const sales = useMemo(() => salesOverview(), []);
  const customers = useMemo(() => customerOverview(), []);
  const products = useMemo(() => productOverview(), []);
  const delivery = useMemo(() => deliveryOverview(), []);
  const monthly = useMemo(() => monthlyRevenue(), []);
  const status = useMemo(() => salesByStatus(), []);
  const topProducts = useMemo(() => topProductsByRevenue(6), []);
  const topCustomers = useMemo(() => topCustomersBySpend(6), []);
  const invoices = useMemo(() => recentInvoices(6), []);

  const ready = useClientReady();
  if (!ready) return null;

  const trend = monthly.map((m) => ({
    label: m.label,
    revenue: m.invoices + m.pos,
  }));
  const statusPie = status.map((s) => ({ label: s.label, value: s.count }));

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Analytics</h1>
        <p className="text-sm text-gray-500">
          A high-level view of your entire workspace performance.
        </p>
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Total Revenue"
          value={moneyCompact(sales.revenue + sales.posRevenue)}
          sub={`${num(sales.invoiceCount)} invoices · ${num(sales.posCount)} POS`}
          icon={TrendingUp}
          tone="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          label="Invoices"
          value={num(sales.invoiceCount)}
          sub={money(sales.received)}
          icon={Receipt}
          tone="bg-sky-50 text-sky-700"
        />
        <KpiCard
          label="Customers"
          value={num(customers.total)}
          sub={`${num(customers.newThisMonth)} new this month`}
          icon={Users}
          tone="bg-violet-50 text-violet-700"
        />
        <KpiCard
          label="Products"
          value={num(products.total)}
          sub={`${num(products.lowStock)} low on stock`}
          icon={Package}
          tone="bg-amber-50 text-amber-700"
        />
        <KpiCard
          label="Stock Value"
          value={moneyCompact(products.stockValue)}
          sub={`${num(products.totalStock)} units`}
          icon={Boxes}
          tone="bg-teal-50 text-teal-700"
        />
        <KpiCard
          label="Deliveries"
          value={num(delivery.total)}
          sub={`${num(delivery.delivered)} delivered`}
          icon={Truck}
          tone="bg-rose-50 text-rose-700"
        />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard
          title="Revenue Trend"
          subtitle="Invoices + point of sale, last 12 months"
          className="lg:col-span-2"
        >
          <AnalyticsAreaChart
            data={trend}
            xKey="label"
            series={[{ key: "revenue", name: "Revenue", color: "#10b981" }]}
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
        <ChartCard title="Top Customers" subtitle="By lifetime spend">
          <TopList
            items={topCustomers.map((c) => ({
              label: c.label,
              subtitle: `${num(c.orders)} orders`,
              value: c.spend,
            }))}
            format={moneyCompact}
          />
        </ChartCard>
      </div>

      <div className="p-1.5">
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
