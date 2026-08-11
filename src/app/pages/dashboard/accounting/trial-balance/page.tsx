"use client";

import { useMemo } from "react";
import {
  ACCOUNT_TYPE_LABELS,
  useChartOfAccountsStore,
} from "@/stores/chartOfAccountsStore";
import { coaBalances, trialBalanceRows } from "@/modules/accounting/reporting";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/hooks/useClientReady";

export default function TrialBalancePage() {
  const rows = useMemo(() => trialBalanceRows(), []);
  const hasAccounts = useChartOfAccountsStore((s) => s.accounts.length > 0);

  const ready = useClientReady();
  if (!ready) return null;

  const totalDebit = rows.reduce(
    (sum, r) => sum + (r.type === "asset" || r.type === "expense" ? r.balance : 0),
    0
  );
  const totalCredit = rows.reduce(
    (sum, r) => sum + (r.type === "liability" || r.type === "equity" || r.type === "income" ? r.balance : 0),
    0
  );
  const balanced = Math.abs(totalDebit - totalCredit) < 0.001;

  const coaAccounts = coaBalances();

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Trial Balance</h1>
        <p className="text-sm text-gray-500">
          Debits and credits across the chart of accounts.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-3">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total debits</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {totalDebit.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total credits</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {totalCredit.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Status</p>
          <p
            className={cn(
              "mt-1 text-2xl font-bold",
              balanced ? "text-emerald-600" : "text-red-600"
            )}
          >
            {balanced ? "Balanced" : "Out of balance"}
          </p>
        </div>
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="overflow-hidden min-h-[300px]">
                {!hasAccounts ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <p className="text-sm text-gray-500">
                      Add accounts to your chart of accounts first.
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {["code", "account", "type", "debit", "credit"].map(
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
                      {coaAccounts.map((account) => {
                        const debit =
                          account.type === "asset" || account.type === "expense"
                            ? account.balance
                            : 0;
                        const credit =
                          account.type === "liability" ||
                          account.type === "equity" ||
                          account.type === "income"
                            ? account.balance
                            : 0;
                        return (
                          <tr key={account.code}>
                            <td className="px-6 py-2.5 whitespace-nowrap font-mono text-xs text-gray-500">
                              {account.code}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {account.name}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500">
                              {ACCOUNT_TYPE_LABELS[account.type]}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {debit ? debit.toFixed(2) : "—"}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {credit ? credit.toFixed(2) : "—"}
                            </td>
                          </tr>
                        );
                      })}
                      {rows.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-10 text-center text-sm text-gray-500"
                          >
                            No account activity yet. Post journal entries to see
                            the trial balance fill in.
                          </td>
                        </tr>
                      )}
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-gray-800">
                          Total
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-800">
                          {totalDebit.toFixed(2)}
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-800">
                          {totalCredit.toFixed(2)}
                        </td>
                      </tr>
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
