"use client";

import { useMemo } from "react";
import {
  Banknote,
  CheckCircle2,
  FileText,
  ReceiptText,
  TrendingDown,
} from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  KpiCard,
  ChartCard,
  SimpleTable,
} from "@/components/analytics/ui";
import { AnalyticsAreaChart, AnalyticsDonutChart } from "@/components/analytics/charts";
import {
  expenseOverview,
  money,
  moneyCompact,
  num,
  recentExpenseClaims,
} from "@/modules/analytics/data";

export default function AnalyticsExpensesPage() {
  const expenses = useMemo(() => expenseOverview(), []);
  const claims = useMemo(() => recentExpenseClaims(8), []);

  const ready = useClientReady();
  if (!ready) return null;

  const categoryPie = expenses.byCategory.map((c) => ({
    label: c.label,
    value: c.value,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">
          Expense Analytics
        </h1>
        <p className="text-sm text-gray-500">
          Spending across entries, claims and bills.
        </p>
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          label="Total Expenses"
          value={moneyCompact(expenses.total)}
          icon={TrendingDown}
          tone="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          label="This Month"
          value={moneyCompact(expenses.thisMonth)}
          icon={ReceiptText}
          tone="bg-sky-50 text-sky-700"
        />
        <KpiCard
          label="Records"
          value={num(expenses.records)}
          sub="entries + claims + bills"
          icon={FileText}
          tone="bg-violet-50 text-violet-700"
        />
        <KpiCard
          label="Approved Claims"
          value={moneyCompact(expenses.claimed)}
          icon={CheckCircle2}
          tone="bg-amber-50 text-amber-700"
        />
        <KpiCard
          label="Avg / Month"
          value={moneyCompact(
            expenses.monthly.length
              ? expenses.total / expenses.monthly.length
              : 0
          )}
          icon={Banknote}
          tone="bg-rose-50 text-rose-700"
        />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard
          title="Spending Trend"
          subtitle="Expenses, last 12 months"
          className="lg:col-span-2"
        >
          <AnalyticsAreaChart
            data={expenses.monthly}
            xKey="label"
            series={[{ key: "value", name: "Expenses", color: "#f59e0b" }]}
            format={moneyCompact}
          />
        </ChartCard>
        <ChartCard title="Spend by Category">
          <AnalyticsDonutChart data={categoryPie} format={moneyCompact} />
        </ChartCard>
      </div>

      <div className="p-1.5">
        <ChartCard title="Recent Expense Claims" subtitle="Latest reimbursement requests">
          <SimpleTable
            columns={["Claim", "Employee", "Category", "Status", "Amount"]}
            rows={claims.map((c) => [
              c.label,
              c.party,
              c.category,
              c.status,
              money(c.amount),
            ])}
          />
        </ChartCard>
      </div>
    </div>
  );
}
