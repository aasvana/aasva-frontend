"use client";

import { getInvoices } from "@/modules/invoice";
import { computeTotals } from "@/modules/invoice";
import { useAccountingStore } from "@/stores/accountingStore";
import { useBillStore } from "@/stores/billStore";
import { useExpenseClaimStore } from "@/stores/expenseClaimStore";
import { useSupplierPaymentStore } from "@/stores/supplierPaymentStore";
import { useAccountStore } from "@/stores/accountStore";
import { useBankTransactionStore } from "@/stores/bankTransactionStore";
import { useChartOfAccountsStore } from "@/stores/chartOfAccountsStore";
import type { AccountType } from "@/stores/chartOfAccountsStore";
import { useJournalStore } from "@/stores/journalStore";
import { useTaxStore } from "@/stores/taxStore";

export const toNumber = (value: unknown, fallback = 0): number => {
  const n = Number(value ?? "");
  return isNaN(n) ? fallback : n;
};

export type InvoiceSummary = {
  id: string;
  no: string;
  billTo: string;
  date: string;
  currency: string;
  status: string;
  total: number;
  paid: number;
  balance: number;
  tax: number;
  subtotal: number;
};

const REVENUE_STATUSES = new Set([
  "sent",
  "partially_paid",
  "paid",
  "overdue",
]);

export function invoiceSummaries(): InvoiceSummary[] {
  return getInvoices().map((record) => {
    const totals = computeTotals(record.data);
    return {
      id: record.id,
      no: record.data.invoiceNo || record.id.slice(0, 8),
      billTo: record.data.billTo.name || "-",
      date: record.data.issueDate
        ? new Date(record.data.issueDate).toISOString()
        : record.savedAt,
      currency: record.data.currency || "USD",
      status: record.data.status,
      total: totals.total,
      paid: totals.paid,
      balance: totals.balance,
      tax: totals.tax,
      subtotal: totals.subtotal,
    };
  });
}

export function salesRevenue(): number {
  return invoiceSummaries()
    .filter((inv) => REVENUE_STATUSES.has(inv.status))
    .reduce((sum, inv) => sum + inv.total, 0);
}

export function salesTaxCollected(): number {
  return invoiceSummaries()
    .filter((inv) => REVENUE_STATUSES.has(inv.status))
    .reduce((sum, inv) => sum + inv.tax, 0);
}

export function accountsReceivable(): number {
  return invoiceSummaries()
    .filter((inv) => inv.status !== "cancelled" && inv.balance > 0)
    .reduce((sum, inv) => sum + inv.balance, 0);
}

export function invoiceCount(): number {
  return invoiceSummaries().length;
}

export function outstandingInvoices() {
  return invoiceSummaries().filter(
    (inv) => inv.status !== "cancelled" && inv.balance > 0
  );
}

export type BillSummary = {
  id: string;
  no: string;
  vendor: string;
  date: string;
  dueDate: string;
  category: string;
  currency: string;
  amount: number;
  status: string;
};

export function billSummaries(): BillSummary[] {
  return useBillStore.getState().bills.map((bill) => ({
    id: bill.id,
    no: bill.billNo,
    vendor: bill.vendor,
    date: bill.date,
    dueDate: bill.dueDate,
    category: bill.category,
    currency: "USD",
    amount: toNumber(bill.amount),
    status: bill.status,
  }));
}

export function billExpenses(): number {
  return billSummaries()
    .filter((bill) => bill.status !== "Cancelled")
    .reduce((sum, bill) => sum + bill.amount, 0);
}

export function accountsPayable(): number {
  return billSummaries()
    .filter((bill) => bill.status !== "Cancelled" && bill.status !== "Paid")
    .reduce((sum, bill) => sum + bill.amount, 0);
}

export function outstandingBills() {
  return billSummaries().filter(
    (bill) => bill.status !== "Cancelled" && bill.status !== "Paid"
  );
}

export function purchaseTaxPaid(): number {
  const rates = useTaxStore.getState().rates;
  const matching = rates.filter(
    (r) => (r.type === "purchase" || r.type === "both") && r.status === "Active"
  );
  const preferred = matching.find((r) => r.isDefault) ?? matching[0];
  const defaultRate = toNumber(preferred?.rate, 0);
  return billExpenses() * (defaultRate / (100 + defaultRate));
}

export function directExpenses(): number {
  const entries = useAccountingStore.getState().entries;
  return entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + toNumber(e.amount), 0);
}

export function expenseClaimsTotal(): number {
  const claims = useExpenseClaimStore.getState().claims;
  return claims
    .filter((c) => c.status === "Approved" || c.status === "Reimbursed")
    .reduce((sum, c) => sum + toNumber(c.amount), 0);
}

export function expensesTotal(): number {
  return directExpenses() + billExpenses() + expenseClaimsTotal();
}

export function receiptsTotal(): number {
  const entries = useAccountingStore.getState().entries;
  return entries
    .filter((e) => e.type === "receipt")
    .reduce((sum, e) => sum + toNumber(e.amount), 0);
}

export function supplierPaymentsTotal(): number {
  const payments = useSupplierPaymentStore.getState().payments;
  return payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + toNumber(p.amount), 0);
}

export function creditNotesTotal(): number {
  const entries = useAccountingStore.getState().entries;
  return entries
    .filter((e) => e.type === "credit-note")
    .reduce((sum, e) => sum + toNumber(e.amount), 0);
}

export function debitNotesTotal(): number {
  const entries = useAccountingStore.getState().entries;
  return entries
    .filter((e) => e.type === "debit-note")
    .reduce((sum, e) => sum + toNumber(e.amount), 0);
}

export function netProfit(): number {
  return salesRevenue() - expensesTotal();
}

export function bankCashBalance(): number {
  const accounts = useAccountStore.getState().accounts;
  const transactions = useBankTransactionStore.getState().transactions;
  return accounts.reduce((sum, account) => {
    const opening = toNumber(account.openingBalance);
    const flow = transactions
      .filter((t) => t.accountName === account.name)
      .reduce(
        (acc, t) =>
          acc + (t.type === "inflow" ? toNumber(t.amount) : -toNumber(t.amount)),
        0
      );
    return sum + opening + flow;
  }, 0);
}

export type AccountBalance = {
  name: string;
  kind: "bank" | "cash";
  opening: number;
  flow: number;
  balance: number;
};

export function accountBalances(): AccountBalance[] {
  const accounts = useAccountStore.getState().accounts;
  const transactions = useBankTransactionStore.getState().transactions;
  return accounts.map((account) => {
    const opening = toNumber(account.openingBalance);
    const flow = transactions
      .filter((t) => t.accountName === account.name)
      .reduce(
        (acc, t) =>
          acc + (t.type === "inflow" ? toNumber(t.amount) : -toNumber(t.amount)),
        0
      );
    return {
      name: account.name,
      kind: account.kind,
      opening,
      flow,
      balance: opening + flow,
    };
  });
}

export type CashFlowSection = {
  title: string;
  rows: { label: string; amount: number }[];
  total: number;
};

export function cashFlowStatement(): CashFlowSection[] {
  const inflow = useBankTransactionStore
    .getState()
    .transactions.filter((t) => t.type === "inflow");
  const outflow = useBankTransactionStore
    .getState()
    .transactions.filter((t) => t.type === "outflow");

  const operating: CashFlowSection = {
    title: "Operating activities",
    rows: [
      { label: "Customer receipts", amount: receiptsTotal() },
      {
        label: "Cash inflows (bank)",
        amount: inflow.reduce((sum, t) => sum + toNumber(t.amount), 0),
      },
      {
        label: "Supplier payments",
        amount: -supplierPaymentsTotal(),
      },
      {
        label: "Cash outflows (bank)",
        amount: -outflow.reduce((sum, t) => sum + toNumber(t.amount), 0),
      },
    ],
    total: 0,
  };
  operating.total = operating.rows.reduce((sum, row) => sum + row.amount, 0);

  const investing: CashFlowSection = {
    title: "Investing activities",
    rows: [{ label: "No investing activity", amount: 0 }],
    total: 0,
  };

  const financing: CashFlowSection = {
    title: "Financing activities",
    rows: [
      {
        label: "Capital contributions (journal)",
        amount: useJournalStore
          .getState()
          .entries.filter((e) => e.status === "Posted")
          .reduce(
            (sum, entry) =>
              sum +
              entry.lines.reduce(
                (acc, line) =>
                  line.accountName === "Owner's Equity"
                    ? acc + toNumber(line.credit)
                    : acc,
                0
              ),
            0
          ),
      },
    ],
    total: 0,
  };
  financing.total = financing.rows.reduce((sum, row) => sum + row.amount, 0);

  return [operating, investing, financing];
}

export function postedJournalEntries() {
  return useJournalStore.getState().entries.filter((e) => e.status === "Posted");
}

export type CoaBalanceRow = {
  code: string;
  name: string;
  type: AccountType;
  opening: number;
  journalDebit: number;
  journalCredit: number;
  balance: number;
};

export function coaBalances(): CoaBalanceRow[] {
  const accounts = useChartOfAccountsStore.getState().accounts;
  return accounts.map((account) => {
    let journalDebit = 0;
    let journalCredit = 0;
    for (const entry of postedJournalEntries()) {
      for (const line of entry.lines) {
        if (line.accountName === account.name) {
          journalDebit += toNumber(line.debit);
          journalCredit += toNumber(line.credit);
        }
      }
    }
    const opening = toNumber(account.openingBalance);
    const balance =
      account.type === "asset" || account.type === "expense"
        ? opening + journalDebit - journalCredit
        : opening + journalCredit - journalDebit;
    return {
      code: account.code,
      name: account.name,
      type: account.type,
      opening,
      journalDebit,
      journalCredit,
      balance,
    };
  });
}

export function trialBalanceRows() {
  return coaBalances().filter((row) => row.balance !== 0);
}

export function profitAndLoss() {
  const revenue = salesRevenue();
  const refunds = creditNotesTotal();
  const expenses = expensesTotal();
  const net = revenue - refunds - expenses;
  return { revenue, refunds, expenses, net };
}

export function balanceSheet() {
  const rows = coaBalances();
  const cash = bankCashBalance();
  const ar = accountsReceivable();
  const assets = rows
    .filter((r) => r.type === "asset")
    .reduce((sum, r) => sum + r.balance, 0);
  const totalAssets = cash + ar + Math.max(assets, 0);

  const ap = accountsPayable();
  const liabilities = rows
    .filter((r) => r.type === "liability")
    .reduce((sum, r) => sum + r.balance, 0);
  const totalLiabilities = ap + liabilities;

  const equity = rows
    .filter((r) => r.type === "equity")
    .reduce((sum, r) => sum + r.balance, 0);
  const retainedEarnings = netProfit();
  const totalEquity = equity + retainedEarnings;

  return { totalAssets, totalLiabilities, totalEquity };
}
