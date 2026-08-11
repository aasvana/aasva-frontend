"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  BANK_TRANSACTION_CATEGORIES,
  BANK_TRANSACTION_TYPES,
  BankTransactionType,
  useBankTransactionStore,
} from "@/stores/bankTransactionStore";
import { useAccountStore } from "@/stores/accountStore";
import { cn } from "@/lib/utils";
import { statusBadge } from "../accounting-config";
import { useClientReady } from "@/hooks/useClientReady";

export default function BankTransactionsPage() {
  const transactions = useBankTransactionStore((s) => s.transactions);
  const addTransaction = useBankTransactionStore((s) => s.addTransaction);
  const updateTransaction = useBankTransactionStore((s) => s.updateTransaction);
  const deleteTransaction = useBankTransactionStore((s) => s.deleteTransaction);
  const accounts = useAccountStore((s) => s.accounts);

  const ready = useClientReady();
  if (!ready) return null;

  const accountOptions = accounts.map((a) => ({
    value: a.name,
    label: a.name,
  }));

  return (
    <MasterDataManager
      title="Bank Transactions"
      description="Record deposits and withdrawals across your accounts."
      addLabel="Add Transaction"
      emptyTitle="No transactions yet"
      emptyDescription="Add your first bank or cash transaction."
      searchPlaceholder="Search transactions..."
      tableHeaders={["Date", "Account", "Description", "Type", "Amount", "Reconciled"]}
      fields={[
        {
          name: "accountName",
          label: "Account",
          type: "select",
          options: accountOptions,
          required: true,
        },
        { name: "date", label: "Date", type: "date", required: true },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: BANK_TRANSACTION_TYPES.map((t) => ({
            value: t,
            label: t === "inflow" ? "Inflow (Deposit)" : "Outflow (Withdrawal)",
          })),
          required: true,
        },
        {
          name: "description",
          label: "Description",
          placeholder: "e.g. Customer payment — Acme Corp",
          required: true,
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: BANK_TRANSACTION_CATEGORIES.map((c) => ({
            value: c,
            label: c,
          })),
          required: true,
        },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 500",
          required: true,
        },
      ]}
      rowCells={(e) => [
        e.date,
        e.accountName,
        e.description,
        <span
          key="type"
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            e.type === "inflow"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          )}
        >
          {e.type === "inflow" ? "Deposit" : "Withdrawal"}
        </span>,
        <span
          key="amount"
          className={cn(
            "font-medium",
            e.type === "inflow" ? "text-emerald-600" : "text-gray-800"
          )}
        >
          {e.type === "inflow" ? "+" : "-"}
          {e.amount}
        </span>,
        statusBadge(e.reconciled ? "Reconciled" : "Pending"),
      ]}
      items={transactions}
      searchText={(e) =>
        `${e.accountName} ${e.description} ${e.category} ${e.amount}`
      }
      add={(data) =>
        addTransaction({
          ...data,
          accountId:
            accounts.find((a) => a.name === data.accountName)?.id ?? "",
          type: data.type as BankTransactionType,
          reconciled: false,
        })
      }
      update={(id, data) =>
        updateTransaction(id, {
          ...data,
          accountId:
            accounts.find((a) => a.name === data.accountName)?.id ?? "",
          type: data.type as BankTransactionType,
        })
      }
      remove={deleteTransaction}
    />
  );
}
