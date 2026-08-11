"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CirclePlusIcon,
  Landmark,
  PiggyBank,
  Receipt,
  Scale,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  accountsReceivable,
  accountsPayable,
  accountBalances,
  bankCashBalance,
  expensesTotal,
  netProfit,
  outstandingBills,
  outstandingInvoices,
  salesRevenue,
} from "@/modules/accounting/reporting";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/hooks/useClientReady";

function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: "default" | "amber" | "red" | "sky" | "violet";
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <div
          className={cn(
            "grid size-8 place-items-center rounded-full",
            tone === "amber" && "bg-amber-50 text-amber-600",
            tone === "red" && "bg-red-50 text-red-600",
            tone === "sky" && "bg-sky-50 text-sky-600",
            tone === "violet" && "bg-violet-50 text-violet-600",
            tone === "default" && "bg-emerald-50 text-emerald-600"
          )}
        >
          {icon}
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function AccountingDashboardPage() {
  const router = useRouter();
  const revenue = useMemo(() => salesRevenue(), []);
  const expenses = useMemo(() => expensesTotal(), []);
  const profit = useMemo(() => netProfit(), []);
  const ar = useMemo(() => accountsReceivable(), []);
  const ap = useMemo(() => accountsPayable(), []);
  const cash = useMemo(() => bankCashBalance(), []);
  const openInvoices = useMemo(() => outstandingInvoices(), []);
  const openBills = useMemo(() => outstandingBills(), []);
  const balances = useMemo(() => accountBalances(), []);

  const ready = useClientReady();
  if (!ready) return null;

  const quickActions = [
    {
      label: "New Invoice",
      description: "Bill a customer",
      icon: Receipt,
      onClick: () => router.push("/dashboard/invoices/create"),
    },
    {
      label: "Add Bill",
      description: "Track vendor bills",
      icon: Wallet,
      onClick: () => router.push("/dashboard/bills"),
    },
    {
      label: "Journal Entry",
      description: "Post manual entries",
      icon: BookOpen,
      onClick: () => router.push("/dashboard/journal-entries"),
    },
    {
      label: "View Reports",
      description: "P&L, balance sheet & more",
      icon: TrendingUp,
      onClick: () => router.push("/dashboard/reports/profit-loss"),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Accounting</h1>
          <p className="text-sm text-gray-500">
            A live snapshot of your books, built from your records.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/invoices/create")}>
          <CirclePlusIcon /> New Invoice
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard
          label="Revenue"
          value={revenue.toFixed(2)}
          icon={<TrendingUp className="size-4" />}
        />
        <StatCard
          label="Expenses"
          value={expenses.toFixed(2)}
          icon={<TrendingDown className="size-4" />}
          tone="red"
        />
        <StatCard
          label="Net profit"
          value={profit.toFixed(2)}
          icon={<PiggyBank className="size-4" />}
          tone={profit >= 0 ? "default" : "red"}
        />
        <StatCard
          label="Cash & bank"
          value={cash.toFixed(2)}
          icon={<Landmark className="size-4" />}
          tone="sky"
        />
        <StatCard
          label="Accounts receivable"
          value={ar.toFixed(2)}
          icon={<Scale className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Accounts payable"
          value={ap.toFixed(2)}
          icon={<Scale className="size-4" />}
          tone="violet"
        />
        <StatCard
          label="Open invoices"
          value={openInvoices.length}
          icon={<Receipt className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Open bills"
          value={openBills.length}
          icon={<Wallet className="size-4" />}
          tone="sky"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Outstanding invoices
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/reports/accounts-receivable")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              View report <ArrowRight className="size-3.5" />
            </button>
          </div>
          {openInvoices.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Receipt className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No outstanding invoices.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {openInvoices.slice(0, 5).map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {inv.no}
                    </p>
                    <p className="text-xs text-gray-400">{inv.billTo}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {inv.balance.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Account balances
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/reports/balance-sheet")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              Balance sheet <ArrowRight className="size-3.5" />
            </button>
          </div>
          {balances.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Landmark className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No accounts yet.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {balances.map((balance) => (
                <div
                  key={balance.name}
                  className="flex items-center justify-between py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {balance.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {balance.kind === "bank" ? "Bank" : "Cash"}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {balance.balance.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="group flex cursor-pointer flex-col items-start gap-3 rounded-[20px] border border-gray-100 bg-white p-4 text-left shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
          >
            <action.icon className="size-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {action.label}
              </p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
