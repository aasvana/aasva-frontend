import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: string;
};

export function KpiCard({ label, value, sub, icon: Icon, tone }: KpiCardProps) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>
        {Icon && (
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-xl",
              tone ?? "bg-emerald-50 text-emerald-700"
            )}
          >
            <Icon className="size-4" />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function BreakdownList({
  items,
  format = (n: number) => String(n),
}: {
  items: { label: string; value: number }[];
  format?: (n: number) => string;
}) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium text-gray-700">
              {item.label}
            </span>
            <span className="shrink-0 font-semibold text-gray-900">
              {format(item.value)}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-400">No data yet.</p>
      )}
    </div>
  );
}

export function TopList({
  items,
  format = (n: number) => String(n),
}: {
  items: { label: string; subtitle?: string; value: number }[];
  format?: (n: number) => string;
}) {
  return (
    <div className="divide-y divide-gray-100">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-3 py-2.5">
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
              index < 3
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-50 text-gray-500"
            )}
          >
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-800">
              {item.label}
            </p>
            {item.subtitle && (
              <p className="truncate text-xs text-gray-500">{item.subtitle}</p>
            )}
          </div>
          <span className="shrink-0 text-sm font-semibold text-gray-900">
            {format(item.value)}
          </span>
        </div>
      ))}
      {items.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-400">No data yet.</p>
      )}
    </div>
  );
}

export function SimpleTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-400 first:pl-1 last:pr-1"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "px-3 py-2.5 first:pl-1 last:pr-1",
                    cellIndex === 0
                      ? "font-medium text-gray-800"
                      : "text-gray-600"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="py-6 text-center text-sm text-gray-400"
              >
                No data yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
