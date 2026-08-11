"use client";

import { useMemo } from "react";
import {
  BedDouble,
  Building2,
  CalendarCheck,
  FileBadge,
  Map,
  Wallet,
} from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  KpiCard,
  ChartCard,
  TopList,
  BreakdownList,
  SimpleTable,
} from "@/components/analytics/ui";
import { AnalyticsAreaChart, AnalyticsDonutChart } from "@/components/analytics/charts";
import {
  money,
  moneyCompact,
  num,
  recentBookings,
  travelOverview,
} from "@/modules/analytics/data";

export default function AnalyticsTravelPage() {
  const travel = useMemo(() => travelOverview(), []);
  const bookings = useMemo(() => recentBookings(8), []);

  const ready = useClientReady();
  if (!ready) return null;

  const categoryPie = travel.revenueByCategory.map((c) => ({
    label: c.label,
    value: c.value,
  }));
  const statusPie = travel.bookingsByStatus.map((s) => ({
    label: s.label,
    value: s.value,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Travel Analytics</h1>
        <p className="text-sm text-gray-500">
          Bookings, enquiries, itineraries and supplier performance.
        </p>
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Bookings"
          value={num(travel.bookings)}
          icon={BedDouble}
          tone="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          label="Booking Revenue"
          value={moneyCompact(travel.revenue)}
          icon={Wallet}
          tone="bg-sky-50 text-sky-700"
        />
        <KpiCard
          label="Enquiries"
          value={num(travel.enquiries)}
          sub={`${num(travel.openEnquiries)} open`}
          icon={CalendarCheck}
          tone="bg-violet-50 text-violet-700"
        />
        <KpiCard
          label="Itineraries"
          value={num(travel.itineraries)}
          icon={Map}
          tone="bg-amber-50 text-amber-700"
        />
        <KpiCard
          label="Suppliers"
          value={num(travel.suppliers)}
          icon={Building2}
          tone="bg-teal-50 text-teal-700"
        />
        <KpiCard
          label="Documents"
          value={num(travel.documents)}
          icon={FileBadge}
          tone="bg-rose-50 text-rose-700"
        />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard
          title="Booking Revenue"
          subtitle="Last 12 months"
          className="lg:col-span-2"
        >
          <AnalyticsAreaChart
            data={travel.monthly}
            xKey="label"
            series={[{ key: "value", name: "Revenue", color: "#0ea5e9" }]}
            format={moneyCompact}
          />
        </ChartCard>
        <ChartCard title="Revenue by Category">
          <AnalyticsDonutChart data={categoryPie} format={moneyCompact} />
        </ChartCard>
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard title="Top Suppliers" subtitle="By booking count">
          <TopList
            items={travel.topSuppliers.map((s) => ({
              label: s.label,
              value: s.value,
            }))}
            format={num}
          />
        </ChartCard>
        <ChartCard title="Bookings by Status">
          <BreakdownList items={travel.bookingsByStatus} format={num} />
        </ChartCard>
        <ChartCard title="Status Split">
          <AnalyticsDonutChart data={statusPie} format={num} />
        </ChartCard>
      </div>

      <div className="p-1.5">
        <ChartCard title="Recent Bookings" subtitle="Latest travel bookings">
          <SimpleTable
            columns={["Reference", "Customer", "Service", "Status", "Amount"]}
            rows={bookings.map((b) => [
              b.label,
              b.party,
              b.service,
              b.status,
              money(b.amount),
            ])}
          />
        </ChartCard>
      </div>
    </div>
  );
}
