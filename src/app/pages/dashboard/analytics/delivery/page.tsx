"use client";

import { useMemo } from "react";
import {
  Banknote,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  KpiCard,
  ChartCard,
  TopList,
  BreakdownList,
  SimpleTable,
} from "@/components/analytics/ui";
import { AnalyticsDonutChart } from "@/components/analytics/charts";
import {
  deliveryOverview,
  moneyCompact,
  num,
  recentDeliveries,
} from "@/modules/analytics/data";

export default function AnalyticsDeliveryPage() {
  const delivery = useMemo(() => deliveryOverview(), []);
  const deliveries = useMemo(() => recentDeliveries(8), []);

  const ready = useClientReady();
  if (!ready) return null;

  const statusPie = delivery.byStatus.map((s) => ({
    label: s.label,
    value: s.value,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">
          Delivery Analytics
        </h1>
        <p className="text-sm text-gray-500">
          Dispatch performance, zones and partner activity.
        </p>
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Deliveries"
          value={num(delivery.total)}
          icon={Truck}
          tone="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          label="Delivered"
          value={num(delivery.delivered)}
          icon={CheckCircle2}
          tone="bg-sky-50 text-sky-700"
        />
        <KpiCard
          label="In Transit"
          value={num(delivery.inTransit)}
          icon={Clock}
          tone="bg-violet-50 text-violet-700"
        />
        <KpiCard
          label="Pending"
          value={num(delivery.pending)}
          sub="waiting dispatch"
          icon={Clock}
          tone="bg-amber-50 text-amber-700"
        />
        <KpiCard
          label="Failed"
          value={num(delivery.failed)}
          icon={XCircle}
          tone="bg-rose-50 text-rose-700"
        />
        <KpiCard
          label="Charge Revenue"
          value={moneyCompact(delivery.chargeTotal)}
          sub={`${moneyCompact(delivery.codTotal)} COD`}
          icon={Banknote}
          tone="bg-teal-50 text-teal-700"
        />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard title="Partner Performance" subtitle="Deliveries handled per partner">
          <TopList
            items={delivery.partnerStats.map((p) => ({
              label: p.name,
              subtitle: `${num(p.delivered)} delivered${p.active ? "" : " · inactive"}`,
              value: p.count,
            }))}
            format={num}
          />
        </ChartCard>
        <ChartCard title="Deliveries by Zone">
          <BreakdownList items={delivery.byZone} format={num} />
        </ChartCard>
        <ChartCard title="Status Split">
          <AnalyticsDonutChart data={statusPie} format={num} />
        </ChartCard>
      </div>

      <div className="p-1.5">
        <ChartCard title="Recent Deliveries" subtitle="Latest dispatch activity">
          <SimpleTable
            columns={["Delivery", "Customer", "Zone", "Status", "Charge"]}
            rows={deliveries.map((d) => [
              d.label,
              d.party,
              d.zone,
              d.status,
              moneyCompact(d.amount),
            ])}
          />
        </ChartCard>
      </div>
    </div>
  );
}
