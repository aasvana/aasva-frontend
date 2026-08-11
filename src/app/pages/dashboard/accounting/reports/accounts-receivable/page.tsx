"use client";

import { ReportCard } from "@/components/accounting/report-ui";
import {
  accountsReceivable,
  outstandingInvoices,
} from "@/modules/accounting/reporting";
import { useClientReady } from "@/hooks/useClientReady";

export default function AccountsReceivablePage() {
  const outstanding = outstandingInvoices();

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">
          Accounts Receivable
        </h1>
        <p className="text-sm text-gray-500">
          Money owed to you by customers on issued invoices.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total receivable</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {accountsReceivable().toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Open invoices</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {outstanding.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Avg per invoice</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {outstanding.length
              ? (accountsReceivable() / outstanding.length).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5">
        <ReportCard
          title="Open invoices"
          subtitle={`${outstanding.length} unpaid`}
        >
          {outstanding.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No outstanding invoices. All invoices are settled.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {outstanding.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {inv.no}
                    </p>
                    <p className="text-xs text-gray-400">
                      {inv.billTo} · {inv.status}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="text-sm font-medium text-gray-800">
                      {inv.balance.toFixed(2)}
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
