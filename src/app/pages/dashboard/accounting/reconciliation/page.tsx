"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, CirclePlusIcon, Scale } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccountStore } from "@/stores/accountStore";
import { useBankTransactionStore } from "@/stores/bankTransactionStore";
import { toNumber } from "@/modules/accounting/reporting";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/hooks/useClientReady";

export default function ReconciliationPage() {
  const router = useRouter();
  const transactions = useBankTransactionStore((s) => s.transactions);
  const setReconciled = useBankTransactionStore((s) => s.setReconciled);
  const accounts = useAccountStore((s) => s.accounts);

  const [accountFilter, setAccountFilter] = useState("all");

  const filtered = useMemo(
    () =>
      accountFilter === "all"
        ? transactions
        : transactions.filter((t) => t.accountName === accountFilter),
    [transactions, accountFilter]
  );

  const ready = useClientReady();
  if (!ready) return null;

  const reconciled = filtered.filter((t) => t.reconciled);
  const unreconciled = filtered.filter((t) => !t.reconciled);
  const unreconciledAmount = unreconciled.reduce(
    (sum, t) =>
      sum + (t.type === "inflow" ? toNumber(t.amount) : -toNumber(t.amount)),
    0
  );

  const toggle = (id: string, value: boolean) => {
    setReconciled(id, value);
    toast.success(value ? "Transaction reconciled." : "Marked as unreconciled.");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Reconciliation</h1>
          <p className="text-sm text-gray-500">
            Match bank and cash transactions against your statements.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/bank-transactions")}>
          <CirclePlusIcon /> Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total transactions</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {filtered.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500">Reconciled</p>
            <BadgeCheck className="size-4 text-emerald-500" />
          </div>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {reconciled.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500">Unreconciled</p>
            <Scale className="size-4 text-amber-500" />
          </div>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {unreconciled.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Unreconciled amount</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {unreconciledAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="py-3 px-4">
                <Select
                  value={accountFilter}
                  onValueChange={setAccountFilter}
                >
                  <SelectTrigger className="w-full max-w-xs bg-white">
                    <SelectValue placeholder="All accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All accounts</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.name}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="overflow-hidden min-h-[300px]">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[300px] text-center">
                    <Scale className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No transactions to reconcile
                    </p>
                    <p className="text-sm text-gray-500">
                      Add bank or cash transactions to start reconciling.
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "date",
                          "account",
                          "description",
                          "amount",
                          "status",
                          "action",
                        ].map((header, idx) => (
                          <th
                            key={idx}
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {filtered.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {transaction.date}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {transaction.accountName}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {transaction.description}
                          </td>
                          <td
                            className={cn(
                              "px-6 py-2.5 whitespace-nowrap text-sm font-medium",
                              transaction.type === "inflow"
                                ? "text-emerald-600"
                                : "text-gray-800"
                            )}
                          >
                            {transaction.type === "inflow" ? "+" : "-"}
                            {transaction.amount}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                transaction.reconciled
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              )}
                            >
                              {transaction.reconciled
                                ? "Reconciled"
                                : "Unreconciled"}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-end">
                            <Button
                              size="sm"
                              variant={
                                transaction.reconciled ? "outline" : "default"
                              }
                              onClick={() =>
                                toggle(transaction.id, !transaction.reconciled)
                              }
                            >
                              {transaction.reconciled
                                ? "Unmark"
                                : "Mark reconciled"}
                            </Button>
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
