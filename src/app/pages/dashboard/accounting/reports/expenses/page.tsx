"use client";

import { MoneyRow, ReportCard, SectionTitle } from "@/components/accounting/report-ui";
import { useAccountingStore } from "@/stores/accountingStore";
import { useBillStore } from "@/stores/billStore";
import { useExpenseClaimStore } from "@/stores/expenseClaimStore";
import { toNumber, expensesTotal } from "@/modules/accounting/reporting";
import { useClientReady } from "@/hooks/useClientReady";

type CategoryTotal = { category: string; amount: number };

function mergeRows(rows: { category: string; amount: number }[]): CategoryTotal[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const key = row.category.trim() || "Uncategorised";
    map.set(key, (map.get(key) ?? 0) + row.amount);
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export default function ExpenseReportPage() {
  const entries = useAccountingStore((s) => s.entries);
  const bills = useBillStore((s) => s.bills);
  const claims = useExpenseClaimStore((s) => s.claims);

  const byCategory = mergeRows([
    ...entries
      .filter((e) => e.type === "expense")
      .map((e) => ({ category: e.category ?? "", amount: toNumber(e.amount) })),
    ...bills
      .filter((b) => b.status !== "Cancelled")
      .map((b) => ({ category: b.category, amount: toNumber(b.amount) })),
    ...claims
      .filter((c) => c.status === "Approved" || c.status === "Reimbursed")
      .map((c) => ({ category: c.category, amount: toNumber(c.amount) })),
  ]);

  const expenseRows = entries.filter((e) => e.type === "expense");

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Expense Report</h1>
        <p className="text-sm text-gray-500">
          Spending across expenses, bills and claims, grouped by category.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-3">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total expenses</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {expensesTotal().toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Categories</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {byCategory.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Expense entries</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {expenseRows.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5 lg:grid-cols-2">
        <ReportCard title="By category">
          {byCategory.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No expenses recorded yet.
            </p>
          ) : (
            byCategory.map((row) => (
              <MoneyRow key={row.category} label={row.category} amount={row.amount} />
            ))
          )}
        </ReportCard>

        <ReportCard title="Expense entries">
          <SectionTitle>Recent direct expenses</SectionTitle>
          {expenseRows.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No direct expenses yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {expenseRows.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {expense.no}
                    </p>
                    <p className="text-xs text-gray-400">
                      {expense.party} · {expense.category || "Uncategorised"}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {expense.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ReportCard>
      </div>
    </div>
  );
}
