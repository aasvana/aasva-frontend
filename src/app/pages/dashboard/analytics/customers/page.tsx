"use client";

import { useMemo } from "react";
import { Building2, Receipt, ShoppingBag, UserPlus, Users } from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import { KpiCard, ChartCard, TopList, BreakdownList } from "@/components/analytics/ui";
import { AnalyticsDonutChart } from "@/components/analytics/charts";
import {
  customerOverview,
  customersByCompany,
  moneyCompact,
  num,
  topCustomersBySpend,
} from "@/modules/analytics/data";

export default function AnalyticsCustomersPage() {
  const customers = useMemo(() => customerOverview(), []);
  const top = useMemo(() => topCustomersBySpend(8), []);
  const byCompany = useMemo(() => customersByCompany(), []);

  const ready = useClientReady();
  if (!ready) return null;

  const companyPie = byCompany.map((c) => ({ label: c.label, value: c.value }));

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">
          Customer Analytics
        </h1>
        <p className="text-sm text-gray-500">
          Customer base, spend and engagement across the workspace.
        </p>
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Customers"
          value={num(customers.total)}
          icon={Users}
          tone="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          label="New This Month"
          value={num(customers.newThisMonth)}
          icon={UserPlus}
          tone="bg-sky-50 text-sky-700"
        />
        <KpiCard
          label="Total Spend"
          value={moneyCompact(customers.spend)}
          icon={Receipt}
          tone="bg-violet-50 text-violet-700"
        />
        <KpiCard
          label="Orders"
          value={num(customers.orders)}
          icon={ShoppingBag}
          tone="bg-amber-50 text-amber-700"
        />
        <KpiCard
          label="Invoices"
          value={num(customers.invoices)}
          sub={`${num(customers.payments)} payments`}
          icon={Receipt}
          tone="bg-teal-50 text-teal-700"
        />
        <KpiCard
          label="Bookings"
          value={num(customers.bookings)}
          sub={`top: ${customers.topSpender}`}
          icon={Building2}
          tone="bg-rose-50 text-rose-700"
        />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard title="Top Customers" subtitle="By lifetime spend">
          <TopList
            items={top.map((c) => ({
              label: c.label,
              subtitle: `${num(c.orders)} orders`,
              value: c.spend,
            }))}
            format={moneyCompact}
          />
        </ChartCard>
        <ChartCard title="Customers by Company">
          <BreakdownList items={byCompany} format={num} />
        </ChartCard>
        <ChartCard title="Company Split">
          <AnalyticsDonutChart data={companyPie} />
        </ChartCard>
      </div>
    </div>
  );
}
