"use client";

import { ReportCard } from "@/components/accounting/report-ui";
import {
  billSummaries,
  billExpenses,
  accountsPayable,
  outstandingBills,
} from "@/modules/accounting/reporting";
import { useClientReady } from "@/hooks/useClientReady";

export default function PurchaseReportPage() {
  const bills = billSummaries();
  const outstanding = outstandingBills();

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Purchase Report</h1>
        <p className="text-sm text-gray-500">
          Purchases, bills and supplier payment obligations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total purchases</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {billExpenses().toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Bills</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{bills.length}</p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Paid</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {bills
              .filter((b) => b.status === "Paid")
              .reduce((sum, b) => sum + b.amount, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Payable</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {accountsPayable().toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5">
        <ReportCard title="Bill activity" subtitle={`${bills.length} bills`}>
          {bills.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No bills yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {bill.no}
                    </p>
                    <p className="text-xs text-gray-400">
                      {bill.vendor} · {bill.category || "Uncategorised"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-xs text-gray-400 sm:inline">
                      {bill.status}
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {bill.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ReportCard>

        {outstanding.length > 0 && (
          <ReportCard
            title="Outstanding bills"
            subtitle={`${outstanding.length} unpaid bills`}
          >
            {outstanding.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">
                  {bill.no} · {bill.vendor}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {bill.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </ReportCard>
        )}
      </div>
    </div>
  );
}
