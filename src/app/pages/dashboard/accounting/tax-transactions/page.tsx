"use client";

import { useMemo } from "react";
import { invoiceSummaries, toNumber } from "@/modules/accounting/reporting";
import { billSummaries } from "@/modules/accounting/reporting";
import { useTaxStore } from "@/stores/taxStore";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/hooks/useClientReady";

type TaxTransactionRow = {
  id: string;
  date: string;
  ref: string;
  party: string;
  type: "sales" | "purchase";
  taxable: number;
  tax: number;
};

export default function TaxTransactionsPage() {
  const rates = useTaxStore((s) => s.rates);
  const purchaseRate = useMemo(() => {
    const matching = rates.filter(
      (r) => (r.type === "purchase" || r.type === "both") && r.status === "Active"
    );
    return toNumber((matching.find((r) => r.isDefault) ?? matching[0])?.rate, 0);
  }, [rates]);

  const rows = useMemo<TaxTransactionRow[]>(() => {
    const list: TaxTransactionRow[] = [];

    for (const inv of invoiceSummaries()) {
      if (inv.status === "cancelled") continue;
      list.push({
        id: `tax-inv-${inv.id}`,
        date: inv.date.slice(0, 10),
        ref: inv.no,
        party: inv.billTo,
        type: "sales",
        taxable: inv.total - inv.tax,
        tax: inv.tax,
      });
    }

    for (const bill of billSummaries()) {
      if (bill.status === "Cancelled") continue;
      const tax = bill.amount * (purchaseRate / (100 + purchaseRate));
      list.push({
        id: `tax-bill-${bill.id}`,
        date: bill.date,
        ref: bill.no,
        party: bill.vendor,
        type: "purchase",
        taxable: bill.amount - tax,
        tax,
      });
    }

    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [purchaseRate]);

  const outputTax = rows
    .filter((r) => r.type === "sales")
    .reduce((sum, r) => sum + r.tax, 0);
  const inputTax = rows
    .filter((r) => r.type === "purchase")
    .reduce((sum, r) => sum + r.tax, 0);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Tax Transactions</h1>
        <p className="text-sm text-gray-500">
          Tax charged on sales invoices and paid on purchase bills.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Output tax</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {outputTax.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Input tax</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {inputTax.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Transactions</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{rows.length}</p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Default rate</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {purchaseRate}%
          </p>
        </div>
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="overflow-hidden min-h-[300px]">
                {rows.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <p className="text-sm text-gray-500">
                      No taxable transactions yet.
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {["date", "ref", "party", "type", "taxable", "tax"].map(
                          (header, idx) => (
                            <th
                              key={idx}
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {rows.map((row) => (
                        <tr key={row.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {row.date}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {row.ref}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {row.party}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                row.type === "sales"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              )}
                            >
                              {row.type === "sales" ? "Sales" : "Purchase"}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {row.taxable.toFixed(2)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-neutral-200">
                            {row.tax.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
