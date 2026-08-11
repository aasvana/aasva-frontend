"use client";

import { MoneyRow, ReportCard, SectionTitle } from "@/components/accounting/report-ui";
import {
  balanceSheet,
  bankCashBalance,
  accountsReceivable,
  accountsPayable,
  coaBalances,
} from "@/modules/accounting/reporting";
import { useClientReady } from "@/hooks/useClientReady";

export default function BalanceSheetPage() {
  const { totalAssets, totalLiabilities, totalEquity } = balanceSheet();
  const otherAssets = coaBalances()
    .filter((r) => r.type === "asset")
    .reduce((sum, r) => sum + Math.max(r.balance, 0), 0);
  const otherLiabilities = coaBalances()
    .filter((r) => r.type === "liability")
    .reduce((sum, r) => sum + r.balance, 0);
  const equity = coaBalances()
    .filter((r) => r.type === "equity")
    .reduce((sum, r) => sum + r.balance, 0);
  const retained = coaBalances()
    .filter((r) => r.type === "income" || r.type === "expense")
    .reduce(
      (sum, r) =>
        sum + (r.type === "income" ? r.balance : -r.balance),
      0
    );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Balance Sheet</h1>
        <p className="text-sm text-gray-500">
          Assets, liabilities and equity as of today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-3">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total assets</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {totalAssets.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total liabilities</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {totalLiabilities.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total equity</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {totalEquity.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5 lg:grid-cols-3">
        <ReportCard title="Assets">
          <SectionTitle>Current assets</SectionTitle>
          <MoneyRow label="Cash & bank" amount={bankCashBalance()} />
          <MoneyRow label="Accounts receivable" amount={accountsReceivable()} />
          <SectionTitle>Other</SectionTitle>
          <MoneyRow label="Other assets" amount={otherAssets} />
          <MoneyRow label="Total assets" amount={totalAssets} emphasized />
        </ReportCard>

        <ReportCard title="Liabilities">
          <SectionTitle>Current liabilities</SectionTitle>
          <MoneyRow label="Accounts payable" amount={accountsPayable()} />
          <SectionTitle>Other</SectionTitle>
          <MoneyRow label="Other liabilities" amount={otherLiabilities} />
          <MoneyRow label="Total liabilities" amount={totalLiabilities} emphasized />
        </ReportCard>

        <ReportCard title="Equity">
          <SectionTitle>Owner capital</SectionTitle>
          <MoneyRow label="Owner's equity" amount={equity} />
          <MoneyRow label="Retained earnings" amount={retained} />
          <MoneyRow label="Total equity" amount={totalEquity} emphasized />
        </ReportCard>
      </div>
    </div>
  );
}
