"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CircleDollarSign,
  Clock,
  MapPin,
  Package,
  Route,
  Send,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import {
  StatCard,
  deliveryStatusPill,
} from "@/components/delivery/delivery-ui";
import { useDeliveryStore } from "@/stores/deliveryStore";
import { useClientReady } from "@/hooks/useClientReady";

const QUICK_LINKS = [
  { label: "Deliveries", url: "/dashboard/delivery/deliveries", icon: Package, tone: "bg-emerald-50 text-emerald-700" },
  { label: "Dispatch", url: "/dashboard/delivery/dispatch", icon: Send, tone: "bg-sky-50 text-sky-700" },
  { label: "Delivery Partners", url: "/dashboard/delivery/partners", icon: Users, tone: "bg-violet-50 text-violet-700" },
  { label: "Delivery Zones", url: "/dashboard/delivery/zones", icon: MapPin, tone: "bg-amber-50 text-amber-700" },
  { label: "Delivery Charges", url: "/dashboard/delivery/charges", icon: CircleDollarSign, tone: "bg-teal-50 text-teal-700" },
  { label: "Settings", url: "/dashboard/delivery/settings", icon: Settings, tone: "bg-gray-100 text-gray-600" },
];

export default function DeliveryOverviewPage() {
  const router = useRouter();
  const deliveries = useDeliveryStore((s) => s.deliveries);
  const partners = useDeliveryStore((s) => s.partners);
  const charges = useDeliveryStore((s) => s.charges);

  const stats = useMemo(() => {
    const inTransit = deliveries.filter(
      (d) => d.status === "Dispatched" || d.status === "In Transit"
    ).length;
    const delivered = deliveries.filter((d) => d.status === "Delivered").length;
    const pendingDispatch = deliveries.filter(
      (d) => d.status === "Pending" || d.status === "Ready for Dispatch"
    ).length;
    const revenue = deliveries
      .filter((d) => d.status !== "Cancelled")
      .reduce((sum, d) => sum + Number(d.charge || 0), 0);
    return { inTransit, delivered, pendingDispatch, revenue };
  }, [deliveries]);

  const recent = useMemo(
    () =>
      [...deliveries]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [deliveries]
  );

  const dispatchQueue = useMemo(
    () =>
      deliveries
        .filter((d) => d.status === "Pending" || d.status === "Ready for Dispatch")
        .slice(0, 4),
    [deliveries]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Delivery Overview</h1>
          <p className="text-sm text-gray-500">
            Monitor dispatches, partners and delivery performance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/dashboard/delivery/dispatch")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Send className="size-4" /> Go to Dispatch
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total deliveries" value={deliveries.length} icon={<Truck className="size-4" />} />
        <StatCard label="In transit" value={stats.inTransit} icon={<Route className="size-4" />} tone="sky" />
        <StatCard label="Delivered" value={stats.delivered} icon={<Package className="size-4" />} />
        <StatCard label="Pending dispatch" value={stats.pendingDispatch} icon={<Clock className="size-4" />} tone="amber" />
        <StatCard label="Active partners" value={partners.filter((p) => p.isActive === "Yes").length} icon={<Users className="size-4" />} tone="violet" />
        <StatCard label="Charge rules" value={charges.filter((c) => c.isActive === "Yes").length} icon={<CircleDollarSign className="size-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Dispatch queue</p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/delivery/dispatch")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              Open dispatch <ArrowRight className="size-3.5" />
            </button>
          </div>
          {dispatchQueue.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Package className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">Nothing awaiting dispatch.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {dispatchQueue.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {d.deliveryNo} · {d.customerName}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {d.items} · {d.zoneName || "No zone"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-gray-500">{d.scheduledDate}</span>
                    {deliveryStatusPill(d.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Recent deliveries</p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/delivery/deliveries")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              All deliveries <ArrowRight className="size-3.5" />
            </button>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Truck className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No deliveries yet.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {recent.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {d.deliveryNo} · {d.customerName}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {d.partnerName || "Unassigned"} · {d.zoneName || "No zone"}
                    </p>
                  </div>
                  {deliveryStatusPill(d.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-1.5">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">Quick access</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_LINKS.map((link) => (
              <button
                key={link.url}
                type="button"
                onClick={() => router.push(link.url)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50/50 px-3 py-4 text-center hover:border-emerald-200"
              >
                <span className={link.tone}>
                  <link.icon className="size-6" />
                </span>
                <span className="text-xs font-medium text-gray-700">{link.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
