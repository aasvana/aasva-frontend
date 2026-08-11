"use client";

import { MoneyRow, ReportCard, SectionTitle } from "@/components/accounting/report-ui";
import { profitAndLoss, salesRevenue, creditNotesTotal, expensesTotal } from "@/modules/accounting/reporting";
import { useClientReady } from "@/hooks/useClientReady";

export default function ProfitLossReportPage() {
  const { revenue, refunds, expenses, net } = profitAndLoss();
  const grossProfit = revenue - refunds;

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Profit & Loss</h1>
        <p className="text-sm text-gray-500">
          Revenue, expenses and net profit for the period.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {salesRevenue().toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Expenses</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {expensesTotal().toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Refunds</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {creditNotesTotal().toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Net profit</p>
          <p className={`mt-1 text-2xl font-bold ${net >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {net.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5 lg:grid-cols-2">
        <ReportCard title="Revenue">
          <SectionTitle>Income</SectionTitle>
          <MoneyRow label="Sales revenue" amount={revenue} />
          <MoneyRow label="Total revenue" amount={revenue} emphasized />
          <SectionTitle>Less refunds</SectionTitle>
          <MoneyRow label="Credit notes" amount={refunds} negative />
          <MoneyRow label="Gross profit" amount={grossProfit} emphasized />
        </ReportCard>

        <ReportCard title="Expenses">
          <SectionTitle>Operating costs</SectionTitle>
          <MoneyRow label="Direct expenses" amount={expenses} />
          <MoneyRow label="Total expenses" amount={expenses} emphasized />
          <SectionTitle>Net result</SectionTitle>
          <MoneyRow label="Net profit" amount={net} emphasized negative={net < 0} />
        </ReportCard>
      </div>
    </div>
  );
}
