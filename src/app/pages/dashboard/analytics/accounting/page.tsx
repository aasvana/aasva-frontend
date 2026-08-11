"use client";

import { useMemo } from "react";
import {
  Banknote,
  Landmark,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  KpiCard,
  ChartCard,
  BreakdownList,
} from "@/components/analytics/ui";
import { AnalyticsAreaChart, AnalyticsDonutChart } from "@/components/analytics/charts";
import {
  financeOverview,
  moneyCompact,
  num,
} from "@/modules/analytics/data";

export default function AnalyticsAccountingPage() {
  const finance = useMemo(() => financeOverview(), []);

  const ready = useClientReady();
  if (!ready) return null;

  const billPie = finance.billsByStatus.map((b) => ({
    label: b.label,
    value: b.value,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">
          Accounting Analytics
        </h1>
        <p className="text-sm text-gray-500">
          Revenue, expenses, payables and cash position.
        </p>
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Revenue"
          value={moneyCompact(finance.revenue)}
          icon={TrendingUp}
          tone="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          label="Received"
          value={moneyCompact(finance.received)}
          sub={`open ${moneyCompact(finance.receivables)}`}
          icon={Wallet}
          tone="bg-sky-50 text-sky-700"
        />
        <KpiCard
          label="Expenses"
          value={moneyCompact(finance.expenses)}
          icon={TrendingDown}
          tone="bg-amber-50 text-amber-700"
        />
        <KpiCard
          label="Payables"
          value={moneyCompact(finance.payables)}
          sub="unpaid bills"
          icon={Banknote}
          tone="bg-rose-50 text-rose-700"
        />
        <KpiCard
          label="Net"
          value={moneyCompact(finance.net)}
          sub="revenue − expenses"
          icon={Receipt}
          tone="bg-violet-50 text-violet-700"
        />
        <KpiCard
          label="Cash Position"
          value={moneyCompact(finance.bank + finance.cash)}
          sub={`${moneyCompact(finance.bank)} bank · ${moneyCompact(finance.cash)} cash`}
          icon={Landmark}
          tone="bg-teal-50 text-teal-700"
        />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard
          title="Cash Flow"
          subtitle="Income vs expenses, last 12 months"
          className="lg:col-span-2"
        >
          <AnalyticsAreaChart
            data={finance.monthly}
            xKey="label"
            series={[
              { key: "income", name: "Income", color: "#10b981" },
              { key: "expenses", name: "Expenses", color: "#f59e0b" },
            ]}
            format={moneyCompact}
          />
        </ChartCard>
        <ChartCard title="Bills by Status">
          <AnalyticsDonutChart data={billPie} format={num} />
        </ChartCard>
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-2">
        <ChartCard title="Income vs Expenses" subtitle="Monthly comparison">
          <BreakdownList
            items={finance.monthly.map((m) => ({
              label: m.label,
              value: m.income - m.expenses,
            }))}
            format={moneyCompact}
          />
        </ChartCard>
        <ChartCard title="Bills Breakdown" subtitle="Count by status">
          <BreakdownList items={finance.billsByStatus} format={num} />
        </ChartCard>
      </div>
    </div>
  );
}
