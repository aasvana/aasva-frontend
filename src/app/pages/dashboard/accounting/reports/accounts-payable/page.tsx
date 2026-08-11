"use client";

import { ReportCard } from "@/components/accounting/report-ui";
import {
  accountsPayable,
  outstandingBills,
} from "@/modules/accounting/reporting";
import { useClientReady } from "@/hooks/useClientReady";

export default function AccountsPayablePage() {
  const outstanding = outstandingBills();

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">
          Accounts Payable
        </h1>
        <p className="text-sm text-gray-500">
          Money you owe to suppliers on received bills.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-3">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total payable</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {accountsPayable().toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Open bills</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {outstanding.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Avg per bill</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {outstanding.length
              ? (accountsPayable() / outstanding.length).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5">
        <ReportCard title="Open bills" subtitle={`${outstanding.length} unpaid`}>
          {outstanding.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No unpaid bills. All bills are settled.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {outstanding.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {bill.no}
                    </p>
                    <p className="text-xs text-gray-400">
                      {bill.vendor} · {bill.category || "Uncategorised"}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="text-sm font-medium text-gray-800">
                      {bill.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ReportCard>
      </div>
    </div>
  );
}
