"use client";

import { MoneyRow, ReportCard } from "@/components/accounting/report-ui";
import {
  invoiceSummaries,
  salesRevenue,
  accountsReceivable,
  invoiceCount,
  outstandingInvoices,
} from "@/modules/accounting/reporting";
import { INVOICE_STATUS_LABELS } from "@/modules/invoice";
import { useClientReady } from "@/hooks/useClientReady";

export default function SalesReportPage() {
  const invoices = invoiceSummaries();
  const outstanding = outstandingInvoices();
  const collected = invoices.reduce((sum, i) => sum + i.paid, 0);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Sales Report</h1>
        <p className="text-sm text-gray-500">
          Sales activity, collections and outstanding balances.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total sales</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {salesRevenue().toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Invoices</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {invoiceCount()}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Collected</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {collected.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Outstanding</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {accountsReceivable().toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5">
        <ReportCard title="Invoice activity" subtitle={`${invoices.length} invoices`}>
          {invoices.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No invoices yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {inv.no}
                    </p>
                    <p className="text-xs text-gray-400">{inv.billTo}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-xs text-gray-400 sm:inline">
                      {INVOICE_STATUS_LABELS[inv.status as keyof typeof INVOICE_STATUS_LABELS] ?? inv.status}
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {inv.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ReportCard>

        {outstanding.length > 0 && (
          <ReportCard
            title="Outstanding balances"
            subtitle={`${outstanding.length} unpaid invoices`}
          >
            {outstanding.map((inv) => (
              <MoneyRow
                key={inv.id}
                label={`${inv.no} · ${inv.billTo}`}
                amount={inv.balance}
              />
            ))}
          </ReportCard>
        )}
      </div>
    </div>
  );
}
