"use client";

import { MoneyRow, ReportCard } from "@/components/accounting/report-ui";
import {
  salesTaxCollected,
  purchaseTaxPaid,
} from "@/modules/accounting/reporting";
import { useClientReady } from "@/hooks/useClientReady";

export default function TaxReturnsPage() {
  const output = salesTaxCollected();
  const input = purchaseTaxPaid();
  const net = output - input;

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Tax Returns</h1>
        <p className="text-sm text-gray-500">
          The computed return based on taxable sales and purchases.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Output tax</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {output.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Input tax</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {input.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Net tax payable</p>
          <p
            className={`mt-1 text-2xl font-bold ${
              net >= 0 ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {net.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Tax paid (input)</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {input.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5">
        <ReportCard title="Tax return summary">
          <MoneyRow label="Tax charged on sales (output tax)" amount={output} />
          <MoneyRow label="Tax paid on purchases (input tax)" amount={input} />
          <MoneyRow
            label="Net tax due"
            amount={Math.abs(net)}
            emphasized
            negative={net >= 0}
          />
        </ReportCard>
      </div>
    </div>
  );
}
