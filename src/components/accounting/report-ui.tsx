"use client";

import { cn } from "@/lib/utils";
import { formatMoney } from "@/modules/invoice";

export function Money({ amount, currency = "USD" }: { amount: number; currency?: string }) {
  return <span>{formatMoney(amount, currency)}</span>;
}

export function ReportCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm", className)}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export function MoneyRow({
  label,
  amount,
  indent = false,
  negative = false,
  emphasized = false,
}: {
  label: string;
  amount: number;
  indent?: boolean;
  negative?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2",
        emphasized ? "border-t border-gray-100 font-semibold" : "",
        indent && "pl-4"
      )}
    >
      <span className={cn("text-sm", emphasized ? "font-semibold text-gray-900" : "text-gray-600")}>
        {label}
      </span>
      <span
        className={cn(
          "text-sm",
          emphasized ? "font-semibold text-gray-900" : "font-medium",
          negative ? "text-red-600" : "text-gray-800"
        )}
      >
        {formatMoney(amount, "USD")}
      </span>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-gray-400 first:mt-0">
      {children}
    </p>
  );
}

export function EmptyReport({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
