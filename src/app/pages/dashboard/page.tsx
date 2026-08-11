"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  ChevronRight,
  CreditCard,
  Package,
  Plane,
  Plus,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Store,
  TrendingUp,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import { AnalyticsAreaChart } from "@/components/analytics/charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  customerOverview,
  deliveryOverview,
  financeOverview,
  money,
  moneyCompact,
  monthlyRevenue,
  num,
  productOverview,
  salesOverview,
  travelOverview,
} from "@/modules/analytics/data";
import { getInvoices } from "@/modules/invoice/storage";
import { useAuditLogStore } from "@/stores/auditStore";
import { useOutletStore } from "@/stores/outletStore";

function timeAgo(iso: string) {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  if (isNaN(diffMs) || diffMs < 0) return "Just now";
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function DashboardPage() {
  const [range, setRange] = useState<"3m" | "6m" | "12m">("6m");
  const outlets = useOutletStore((s) => s.outlets);
  const activeOutletId = useOutletStore((s) => s.activeOutletId);
  const setActiveOutlet = useOutletStore((s) => s.setActiveOutlet);
  const auditEntries = useAuditLogStore((s) => s.entries);

  // Computations
  const sales = useMemo(() => salesOverview(), []);
  const finance = useMemo(() => financeOverview(), []);
  const product = useMemo(() => productOverview(), []);
  const delivery = useMemo(() => deliveryOverview(), []);
  const travel = useMemo(() => travelOverview(), []);
  const customer = useMemo(() => customerOverview(), []);

  const openInvoices = useMemo(() => {
    const invoices = getInvoices();
    return invoices.filter(
      (inv) => inv.data.status === "sent" || inv.data.status === "overdue" || inv.data.status === "draft"
    );
  }, []);

  const monthlyTrend = useMemo(() => {
    const n = range === "3m" ? 3 : range === "6m" ? 6 : 12;
    const data = monthlyRevenue(n);
    return data.map((m) => ({
      label: m.label,
      total: m.invoices + m.pos,
      invoices: m.invoices,
      pos: m.pos,
    }));
  }, [range]);

  const recentAudits = useMemo(
    () => auditEntries.slice(0, 6),
    [auditEntries]
  );

  const ready = useClientReady();
  if (!ready) return null;

  const currentOutlet = outlets.find((o) => o.id === activeOutletId) ?? outlets[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6">
      {/* 1. Header Greeting Bar */}
      <div className="flex flex-col gap-3 rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {greeting}, Aquib
          </h1>
          <p className="mt-1 flex items-center gap-2 text-xs font-medium text-gray-500">
            <Calendar className="size-3.5 text-emerald-600" />
            <span>{todayFormatted}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs">
            <Store className="size-4 text-emerald-600" />
            <span className="font-medium text-gray-500">Outlet:</span>
            <Select value={activeOutletId} onValueChange={setActiveOutlet}>
              <SelectTrigger className="h-6 border-0 bg-transparent p-0 text-xs font-semibold text-gray-900 focus:ring-0">
                <SelectValue>{currentOutlet?.name ?? "Main Outlet"}</SelectValue>
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl">
                {outlets.map((o) => (
                  <SelectItem key={o.id} value={o.id} className="rounded-lg text-xs">
                    {o.name} ({o.code || "MAIN"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Sales */}
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Sales
            </p>
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {money(sales.revenue + sales.posRevenue)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              {num(sales.invoiceCount)} Invoices · {num(sales.posCount)} POS
            </span>
            <span className="inline-flex items-center font-semibold text-emerald-600">
              +12.5%
            </span>
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Orders
            </p>
            <span className="grid size-9 place-items-center rounded-xl bg-sky-50 text-sky-700">
              <ShoppingCart className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {num(customer.orders + sales.posCount + travel.bookings)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>{num(sales.posCount)} POS · {num(customer.orders)} Orders</span>
            <span className="inline-flex items-center font-medium text-sky-600">
              Active
            </span>
          </div>
        </div>

        {/* Receivable */}
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Receivable
            </p>
            <span className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-700">
              <CreditCard className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {money(finance.receivables)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>{openInvoices.length} outstanding invoices</span>
            <span className="inline-flex items-center font-medium text-amber-600">
              Due
            </span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Net Profit
            </p>
            <span className="grid size-9 place-items-center rounded-xl bg-violet-50 text-violet-700">
              <Wallet className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {money(finance.net)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>After operating expenses</span>
            <span className="inline-flex items-center font-medium text-violet-600">
              Net
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Sales Overview + Quick Actions */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Sales Overview Chart */}
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Sales Overview</h2>
              <p className="text-xs text-gray-500">
                Monthly sales revenue across Invoices and Point-of-Sale
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
              {(["3m", "6m", "12m"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    range === r
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <AnalyticsAreaChart
            data={monthlyTrend}
            xKey="label"
            series={[
              { key: "total", name: "Total Revenue", color: "#10b981" },
              { key: "invoices", name: "Invoices", color: "#0ea5e9" },
            ]}
            format={moneyCompact}
            height={260}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col justify-between rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-xs text-gray-500">
              Instant shortcuts to key workspace operations
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                href="/dashboard/invoices"
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 px-3.5 py-2.5 text-xs font-semibold text-gray-800 transition-all hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700"
              >
                <span className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white">
                    <Plus className="size-4" />
                  </span>
                  New Invoice
                </span>
                <ChevronRight className="size-4 text-gray-400 group-hover:text-emerald-600" />
              </Link>

              <Link
                href="/dashboard/customer/overview"
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 px-3.5 py-2.5 text-xs font-semibold text-gray-800 transition-all hover:border-sky-200 hover:bg-sky-50/50 hover:text-sky-700"
              >
                <span className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white">
                    <Users className="size-4" />
                  </span>
                  Add Customer
                </span>
                <ChevronRight className="size-4 text-gray-400 group-hover:text-sky-600" />
              </Link>

              <Link
                href="/dashboard/pos/overview"
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 px-3.5 py-2.5 text-xs font-semibold text-gray-800 transition-all hover:border-amber-200 hover:bg-amber-50/50 hover:text-amber-700"
              >
                <span className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white">
                    <ShoppingCart className="size-4" />
                  </span>
                  New POS Order
                </span>
                <ChevronRight className="size-4 text-gray-400 group-hover:text-amber-600" />
              </Link>

              <Link
                href="/dashboard/travel/dashboard"
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 px-3.5 py-2.5 text-xs font-semibold text-gray-800 transition-all hover:border-violet-200 hover:bg-violet-50/50 hover:text-violet-700"
              >
                <span className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-violet-100 text-violet-700 group-hover:bg-violet-600 group-hover:text-white">
                    <Plane className="size-4" />
                  </span>
                  Book Travel
                </span>
                <ChevronRight className="size-4 text-gray-400 group-hover:text-violet-600" />
              </Link>

              <Link
                href="/dashboard/teams-meet/meetings/upcoming"
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 px-3.5 py-2.5 text-xs font-semibold text-gray-800 transition-all hover:border-rose-200 hover:bg-rose-50/50 hover:text-rose-700"
              >
                <span className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white">
                    <Calendar className="size-4" />
                  </span>
                  Schedule Meeting
                </span>
                <ChevronRight className="size-4 text-gray-400 group-hover:text-rose-600" />
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs text-emerald-800">
            <p className="font-semibold">Workspace Connected</p>
            <p className="mt-0.5 text-emerald-700">All 10 modules synced in real-time.</p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Needs Attention + Recent Activity */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Needs Attention */}
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Needs Attention</h2>
              <p className="text-xs text-gray-500">Action items across operations</p>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              5 Categories
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {/* Low Stock */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/60 p-3.5">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-amber-100 text-amber-700">
                  <Package className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Low Stock Items</p>
                  <p className="text-xs text-gray-500">Products requiring restock</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  {product.lowStock || 12}
                </span>
                <Link
                  href="/dashboard/pos/stock/low-stock"
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-100"
                >
                  Review
                </Link>
              </div>
            </div>

            {/* Overdue Invoices */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/60 p-3.5">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-rose-100 text-rose-700">
                  <Receipt className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Overdue / Open Invoices</p>
                  <p className="text-xs text-gray-500">Outstanding payment collection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                  {openInvoices.length || 5}
                </span>
                <Link
                  href="/dashboard/invoices"
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-100"
                >
                  Collect
                </Link>
              </div>
            </div>

            {/* Pending Deliveries */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/60 p-3.5">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-sky-100 text-sky-700">
                  <Truck className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Pending Deliveries</p>
                  <p className="text-xs text-gray-500">Awaiting dispatch or in transit</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800">
                  {delivery.pending || 4}
                </span>
                <Link
                  href="/dashboard/delivery/deliveries"
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-100"
                >
                  Dispatch
                </Link>
              </div>
            </div>

            {/* Pending Bookings */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/60 p-3.5">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-violet-100 text-violet-700">
                  <Plane className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Pending Travel Enquiries</p>
                  <p className="text-xs text-gray-500">Open itinerary requests</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-800">
                  {travel.openEnquiries || 2}
                </span>
                <Link
                  href="/dashboard/travel/bookings"
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-100"
                >
                  Review
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-xs text-gray-500">Live operational log stream</p>
            </div>
            <Link
              href="/dashboard/auditing/activity-log"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-3 divide-y divide-gray-100">
            {recentAudits.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 pt-3 first:pt-0">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gray-100 text-gray-600">
                  {entry.module === "Finance" ? (
                    <Receipt className="size-4 text-emerald-600" />
                  ) : entry.module === "Inventory" ? (
                    <Package className="size-4 text-amber-600" />
                  ) : entry.module === "Delivery" ? (
                    <Truck className="size-4 text-sky-600" />
                  ) : (
                    <ShieldCheck className="size-4 text-violet-600" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-semibold text-gray-900">
                      {entry.details}
                    </p>
                    <span className="shrink-0 text-[10px] font-medium text-gray-400">
                      {timeAgo(entry.timestamp)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    <span className="font-semibold text-gray-700">{entry.ref}</span> · {entry.actor} ({entry.module})
                  </p>
                </div>
              </div>
            ))}
            {recentAudits.length === 0 && (
              <p className="py-8 text-center text-xs text-gray-400">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
