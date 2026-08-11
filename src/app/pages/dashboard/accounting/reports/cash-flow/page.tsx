"use client";

import { MoneyRow, ReportCard } from "@/components/accounting/report-ui";
import {
  bankCashBalance,
  cashFlowStatement,
} from "@/modules/accounting/reporting";
import { useClientReady } from "@/hooks/useClientReady";

export default function CashFlowReportPage() {
  const sections = cashFlowStatement();
  const netChange = sections.reduce((sum, s) => sum + s.total, 0);
  const opening = bankCashBalance() - netChange;

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Cash Flow</h1>
        <p className="text-sm text-gray-500">
          Movement of cash across operating, investing and financing activities.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Opening balance</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {opening.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Net change</p>
          <p
            className={`mt-1 text-2xl font-bold ${
              netChange >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {netChange.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Closing balance</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {bankCashBalance().toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Operating cash</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {sections[0].total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5">
        {sections.map((section) => (
          <ReportCard key={section.title} title={section.title}>
            {section.rows.map((row) => (
              <MoneyRow
                key={row.label}
                label={row.label}
                amount={row.amount}
                negative={row.amount < 0}
              />
            ))}
            <MoneyRow label={`Net ${section.title.toLowerCase()}`} amount={section.total} emphasized negative={section.total < 0} />
          </ReportCard>
        ))}
      </div>
    </div>
  );
}
