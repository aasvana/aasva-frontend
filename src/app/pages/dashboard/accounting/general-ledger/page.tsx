"use client";

import { useMemo, useState } from "react";
import { useChartOfAccountsStore } from "@/stores/chartOfAccountsStore";
import { useJournalStore } from "@/stores/journalStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toNumber } from "@/modules/accounting/reporting";
import { invoiceSummaries } from "@/modules/accounting/reporting";
import { billSummaries } from "@/modules/accounting/reporting";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/hooks/useClientReady";

type LedgerRow = {
  id: string;
  date: string;
  description: string;
  ref: string;
  debit: number;
  credit: number;
};

const toDate = (date: string) => (date ? new Date(date).toISOString().slice(0, 10) : "");

export default function GeneralLedgerPage() {
  const accounts = useChartOfAccountsStore((s) => s.accounts);
  const entries = useJournalStore((s) => s.entries);
  const [accountName, setAccountName] = useState("");

  const selected = accounts.find((a) => a.name === accountName);
  const opening = useMemo(() => toNumber(selected?.openingBalance, 0), [selected]);

  const rows = useMemo<LedgerRow[]>(() => {
    if (!selected) return [];
    const list: LedgerRow[] = [];

    for (const entry of entries) {
      if (entry.status !== "Posted") continue;
      for (const line of entry.lines) {
        if (line.accountName !== selected.name) continue;
        list.push({
          id: `${entry.id}-${line.id}`,
          date: entry.date,
          description: entry.description || "Journal entry",
          ref: entry.journalNo,
          debit: toNumber(line.debit),
          credit: toNumber(line.credit),
        });
      }
    }

    for (const inv of invoiceSummaries()) {
      const delta =
        (inv.status === "paid" || inv.status === "partially_paid" ? 0 : inv.total) -
        inv.paid;
      if (selected.name === "Accounts Receivable") {
        list.push({
          id: `inv-ar-${inv.id}`,
          date: inv.date.slice(0, 10),
          description: `Invoice ${inv.no} — ${inv.billTo}`,
          ref: inv.no,
          debit: delta > 0 ? delta : 0,
          credit: delta < 0 ? -delta : 0,
        });
      }
      if (selected.name === "Sales Revenue" && inv.status !== "cancelled") {
        list.push({
          id: `inv-rev-${inv.id}`,
          date: inv.date.slice(0, 10),
          description: `Sales revenue — ${inv.billTo}`,
          ref: inv.no,
          debit: 0,
          credit: inv.total,
        });
      }
    }

    for (const bill of billSummaries()) {
      if (bill.status === "Cancelled") continue;
      if (selected.name === "Accounts Payable") {
        list.push({
          id: `bill-ap-${bill.id}`,
          date: bill.date,
          description: `Bill ${bill.no} — ${bill.vendor}`,
          ref: bill.no,
          debit: 0,
          credit: bill.amount,
        });
      }
    }

    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [selected, entries]);

  const totalDebit = rows.reduce((sum, r) => sum + r.debit, 0);
  const totalCredit = rows.reduce((sum, r) => sum + r.credit, 0);
  const isDebitNormal = selected?.type === "asset" || selected?.type === "expense";
  const closing = isDebitNormal
    ? opening + totalDebit - totalCredit
    : opening + totalCredit - totalDebit;

  let running = opening;
  const runningRows = rows.map((row) => {
    running += isDebitNormal ? row.debit - row.credit : row.credit - row.debit;
    return { ...row, running };
  });

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3 p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">General Ledger</h1>
          <p className="text-sm text-gray-500">
            Every posting against a selected account, with a running balance.
          </p>
        </div>
        <div className="w-full max-w-xs">
          <Select value={accountName} onValueChange={setAccountName}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.name}>
                  {account.code} · {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selected ? (
        <div className="rounded-[20px] border border-gray-100 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          Select an account to view its ledger.
        </div>
      ) : (
        <div className="flex flex-col p-1.5">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
                <div className="grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-gray-400">Opening balance</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {opening.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total debits</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {totalDebit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total credits</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {totalCredit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Closing balance</p>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        closing < 0 ? "text-red-600" : "text-emerald-600"
                      )}
                    >
                      {closing.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden min-h-[300px]">
                  {rows.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                      <p className="text-sm text-gray-500">
                        No postings against this account yet.
                      </p>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 dark:bg-neutral-700">
                        <tr>
                          {["date", "ref", "description", "debit", "credit", "balance"].map(
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
                        {runningRows.map((row) => (
                          <tr key={row.id}>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                              {toDate(row.date)}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {row.ref}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                              {row.description}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {row.debit ? row.debit.toFixed(2) : "—"}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {row.credit ? row.credit.toFixed(2) : "—"}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              {row.running.toFixed(2)}
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
      )}
    </div>
  );
}
