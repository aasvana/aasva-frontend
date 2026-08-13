"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Calendar,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileText,
  Landmark,
  Package,
  Plane,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Store,
  TrendingUp,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
  deliveryOverview,
  expenseOverview,
  financeOverview,
  invoiceBalance,
  money,
  moneyCompact,
  monthlyRevenue,
  num,
  productOverview,
  salesOverview,
  travelOverview,
} from "@/modules/analytics/data";
import { getInvoices } from "@/modules/invoice/storage";
import { useApprovalStore } from "@/stores/approvalStore";
import { useAuditLogStore } from "@/stores/auditStore";
import { useBookingStore } from "@/stores/bookingStore";
import { useOutletStore } from "@/stores/outletStore";
import {
  CURRENT_MEMBER_ID,
  useTeamMeetStore,
} from "@/stores/teamMeetStore";
import { memberName } from "@/helpers/teams-meet/team-ui";

const CURRENT_USER_NAME = "Aquib";

const RANGE_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
  { key: "3m", label: "Last 3 Months" },
  { key: "6m", label: "Last 6 Months" },
  { key: "12m", label: "Last 12 Months" },
  { key: "custom", label: "Custom Range" },
] as const;

type RangeKey = (typeof RANGE_OPTIONS)[number]["key"];

const RANGE_LABELS = RANGE_OPTIONS.reduce(
  (acc, o) => ({ ...acc, [o.key]: o.label }),
  {} as Record<RangeKey, string>
);

function monthsForRange(r: RangeKey): number {
  if (r === "6m") return 6;
  if (r === "12m" || r === "custom") return 12;
  return 3;
}

type ActivityModule =
  | "Sales"
  | "Accounting"
  | "Inventory"
  | "Travel"
  | "Delivery"
  | "Teams";

type ActivityItem = {
  id: string;
  module: ActivityModule;
  user: string;
  verb: string;
  entity: string;
  time: string;
};

const ACTIVITY_FILTERS: (ActivityModule | "All")[] = [
  "All",
  "Sales",
  "Accounting",
  "Inventory",
  "Travel",
  "Delivery",
  "Teams",
];

const MODULE_META: Record<
  ActivityModule,
  { icon: LucideIcon; wrap: string; iconClass: string }
> = {
  Sales: { icon: TrendingUp, wrap: "bg-emerald-50", iconClass: "text-emerald-600" },
  Accounting: { icon: Receipt, wrap: "bg-amber-50", iconClass: "text-amber-600" },
  Inventory: { icon: Package, wrap: "bg-sky-50", iconClass: "text-sky-600" },
  Travel: { icon: Plane, wrap: "bg-violet-50", iconClass: "text-violet-600" },
  Delivery: { icon: Truck, wrap: "bg-orange-50", iconClass: "text-orange-600" },
  Teams: { icon: Users, wrap: "bg-rose-50", iconClass: "text-rose-600" },
};

const AUDIT_VERBS: Record<string, string> = {
  created: "created",
  updated: "updated",
  deleted: "deleted",
  restored: "restored",
  posted: "posted",
  approved: "approved",
  rejected: "rejected",
  accepted: "accepted",
  converted: "converted",
  sent: "sent",
  paid: "received payment for",
  revoked: "revoked",
  exported: "exported",
  login: "signed in",
};

const TASK_STATUS_CLASS: Record<string, string> = {
  "To Do": "bg-gray-100 text-gray-600",
  "In Progress": "bg-sky-100 text-sky-700",
  "In Review": "bg-violet-100 text-violet-700",
  Done: "bg-emerald-100 text-emerald-700",
};

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

function fmtShortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function sumOf<T>(items: T[], pick: (t: T) => number): number {
  return items.reduce((s, t) => s + (pick(t) || 0), 0);
}

function trendInfo(prev: number, cur: number): { label: string; up: boolean | null } {
  if (!prev) return cur > 0 ? { label: "New", up: true } : { label: "—", up: null };
  const pct = ((cur - prev) / Math.abs(prev)) * 100;
  return {
    label: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
    up: pct >= 0,
  };
}

function KpiCard({
  label,
  icon: Icon,
  iconClass,
  value,
  delta,
  up,
  caption,
}: {
  label: string;
  icon: LucideIcon;
  iconClass: string;
  value: string;
  delta: string;
  up: boolean | null;
  caption: string;
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <span className={`grid size-9 place-items-center rounded-xl ${iconClass}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-gray-500">
        <span className="truncate">{caption}</span>
        <span
          className={`inline-flex shrink-0 items-center gap-0.5 font-semibold ${
            up === null
              ? "text-gray-400"
              : up
                ? "text-emerald-600"
                : "text-rose-600"
          }`}
        >
          {up === null ? null : up ? (
            <ArrowUpRight className="size-3.5" />
          ) : (
            <ArrowDownRight className="size-3.5" />
          )}
          {delta}
        </span>
      </div>
    </div>
  );
}

function AlertRow({
  severity,
  icon: Icon,
  iconClass,
  title,
  value,
  description,
  href,
  action,
}: {
  severity: "critical" | "warning" | "info";
  icon: LucideIcon;
  iconClass: string;
  title: string;
  value: string;
  description: string;
  href: string;
  action: string;
}) {
  const badge =
    severity === "critical"
      ? "bg-rose-100 text-rose-700"
      : severity === "warning"
        ? "bg-amber-100 text-amber-700"
        : "bg-sky-100 text-sky-700";
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/60 p-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${iconClass}`}>
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-gray-800">{title}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge}`}
            >
              {severity}
            </span>
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
            <span className="shrink-0 font-semibold text-gray-700">{value}</span>
            <span className="text-gray-300">·</span>
            <span className="truncate">{description}</span>
          </p>
        </div>
      </div>
      <Link
        href={href}
        className="ml-3 shrink-0 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-100"
      >
        {action}
      </Link>
    </div>
  );
}

function SnapshotCard({
  title,
  href,
  icon: Icon,
  iconClass,
  accent,
  metrics,
}: {
  title: string;
  href: string;
  icon: LucideIcon;
  iconClass: string;
  accent: string;
  metrics: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${iconClass}`}>
            <Icon className="size-4" />
          </span>
          <h3 className="truncate text-sm font-semibold text-gray-900">{title}</h3>
        </div>
        <Link
          href={href}
          className={`flex shrink-0 items-center gap-0.5 rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ${accent}`}
        >
          View <ArrowUpRight className="size-3" />
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="min-w-0 rounded-xl bg-gray-50/70 px-2.5 py-2">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              {m.label}
            </p>
            <p className="mt-0.5 truncate text-sm font-bold text-gray-800">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [range, setRange] = useState<RangeKey>("6m");
  const [outletFilter, setOutletFilter] = useState<string>("all");
  const [chartMetric, setChartMetric] = useState<"revenue" | "expenses" | "profit">(
    "revenue"
  );
  const [activityFilter, setActivityFilter] = useState<ActivityModule | "All">("All");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const outlets = useOutletStore((s) => s.outlets);
  const auditEntries = useAuditLogStore((s) => s.entries);
  const bookings = useBookingStore((s) => s.bookings);
  const orgApprovals = useApprovalStore((s) => s.approvals);
  const members = useTeamMeetStore((s) => s.members);
  const roles = useTeamMeetStore((s) => s.roles);
  const departments = useTeamMeetStore((s) => s.departments);
  const meetings = useTeamMeetStore((s) => s.meetings);
  const tasks = useTeamMeetStore((s) => s.tasks);
  const teamApprovals = useTeamMeetStore((s) => s.approvals);
  const recognition = useTeamMeetStore((s) => s.recognition);
  const joiners = useTeamMeetStore((s) => s.joiners);

  const n = monthsForRange(range);

  const sales = useMemo(() => salesOverview(), []);
  const finance = useMemo(() => financeOverview(), []);
  const product = useMemo(() => productOverview(), []);
  const delivery = useMemo(() => deliveryOverview(), []);
  const travel = useMemo(() => travelOverview(), []);

  const invoices = useMemo(() => getInvoices(), []);
  const openInvoices = useMemo(
    () =>
      invoices.filter(
        (inv) =>
          inv.data.status === "sent" ||
          inv.data.status === "overdue" ||
          inv.data.status === "draft"
      ),
    [invoices]
  );
  const overdueInvoices = useMemo(
    () => invoices.filter((inv) => inv.data.status === "overdue"),
    [invoices]
  );

  const businessTrend = useMemo(() => {
    const rev = monthlyRevenue(n);
    const exp = expenseOverview().monthly.slice(-n);
    return rev.map((m, i) => ({
      label: m.label,
      revenue: (m.invoices || 0) + (m.pos || 0),
      expenses: exp[i]?.value ?? 0,
      profit: (m.invoices || 0) + (m.pos || 0) - (exp[i]?.value ?? 0),
    }));
  }, [n]);

  const revenueTrend = useMemo(() => {
    const data = monthlyRevenue(n * 2);
    const cur = sumOf(data.slice(-n), (m) => (m.invoices || 0) + (m.pos || 0));
    const prev = sumOf(data.slice(0, n), (m) => (m.invoices || 0) + (m.pos || 0));
    return trendInfo(prev, cur);
  }, [n]);

  const cashTrend = useMemo(() => {
    const monthly = finance.monthly;
    const cur = sumOf(monthly.slice(-n), (m) => (m.income || 0) - (m.expenses || 0));
    const prev = sumOf(monthly.slice(-2 * n, -n), (m) => (m.income || 0) - (m.expenses || 0));
    return trendInfo(prev, cur);
  }, [n, finance.monthly]);

  const joinersTrend = useMemo(() => {
    const now = new Date();
    const windowStart = new Date(now.getFullYear(), now.getMonth() - n, 1);
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 2 * n, 1);
    const cur = joiners.filter((j) => {
      const d = new Date(j.startDate);
      return d >= windowStart && d <= now;
    }).length;
    const prev = joiners.filter((j) => {
      const d = new Date(j.startDate);
      return d >= prevStart && d < windowStart;
    }).length;
    return trendInfo(prev, cur);
  }, [n, joiners]);

  const activityFeed = useMemo(() => {
    const items: ActivityItem[] = [];
    for (const e of auditEntries) {
      let mod: ActivityModule | null = null;
      if (e.module === "Finance") mod = "Accounting";
      else if (e.module === "Sales") mod = "Sales";
      else if (e.module === "Inventory") mod = "Inventory";
      else if (e.module === "Delivery") mod = "Delivery";
      else continue;
      items.push({
        id: `aud_${e.id}`,
        module: mod,
        user: e.actor,
        verb: AUDIT_VERBS[e.action] ?? e.action,
        entity: `${e.category} ${e.ref}`.trim(),
        time: e.timestamp,
      });
    }
    for (const b of bookings) {
      items.push({
        id: `bk_${b.id}`,
        module: "Travel",
        user: "Admin",
        verb: "booked",
        entity: `${b.service} · ${b.reference}`,
        time: b.createdAt,
      });
    }
    for (const rec of recognition) {
      items.push({
        id: `rec_${rec.id}`,
        module: "Teams",
        user: memberName(rec.from),
        verb: "recognized",
        entity: `${memberName(rec.to)} · ${rec.type}`,
        time: rec.date,
      });
    }
    for (const m of meetings) {
      items.push({
        id: `mtg_${m.id}`,
        module: "Teams",
        user: memberName(m.organizerId),
        verb: "scheduled",
        entity: `Meeting ${m.title}`,
        time: `${m.date}T00:00:00`,
      });
    }
    return items
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 14);
  }, [auditEntries, bookings, recognition, meetings]);

  const ready = useClientReady();
  if (!ready) return null;

  const currentMember = members.find((m) => m.id === CURRENT_MEMBER_ID);
  const currentRole = roles.find((r) => r.id === currentMember?.roleId);
  const canAccounting =
    currentRole?.name === "Administrator" || currentRole?.name === "Finance Access";

  const currentOutletName =
    outletFilter === "all"
      ? "All Outlets"
      : outlets.find((o) => o.id === outletFilter)?.name ?? "All Outlets";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const totalRevenue = sales.revenue + sales.posRevenue;
  const cashPosition = finance.bank + finance.cash;
  const overdueCount = overdueInvoices.length;
  const overdueValue = sumOf(overdueInvoices, (inv) => invoiceBalance(inv));
  const overdueShare = openInvoices.length
    ? Math.round((overdueCount / openInvoices.length) * 100)
    : 0;
  const pendingApprovals = orgApprovals.filter((a) => a.status === "Pending").length;
  const pendingBookings =
    travel.bookingsByStatus.find((b) => b.label === "Pending")?.value ?? 0;
  const tasksOpen = tasks.filter((t) => t.status !== "Done").length;
  const lowStock = product.lowStock;

  const series =
    chartMetric === "revenue"
      ? [{ key: "revenue", name: "Revenue", color: "#10b981" }]
      : chartMetric === "expenses"
        ? [{ key: "expenses", name: "Expenses", color: "#f43f5e" }]
        : [{ key: "profit", name: "Profit", color: "#8b5cf6" }];

  const metricTotal = sumOf(businessTrend, (m) => m[chartMetric]);

  const todayIso = new Date().toISOString().slice(0, 10);
  const dueSoon = new Date();
  dueSoon.setDate(dueSoon.getDate() + 7);
  const dueSoonIso = dueSoon.toISOString().slice(0, 10);

  const dueTasks = tasks
    .filter(
      (t) =>
        t.assigneeId === CURRENT_MEMBER_ID &&
        t.status !== "Done" &&
        t.dueDate <= dueSoonIso
    )
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))
    .slice(0, 3);

  const myApprovals = teamApprovals
    .filter((a) => a.reviewer === CURRENT_MEMBER_ID && a.status === "Pending")
    .slice(0, 3);

  const upcomingMeetings = meetings
    .filter(
      (m) =>
        m.status === "Scheduled" &&
        m.date >= todayIso &&
        (m.attendees || "").includes(CURRENT_MEMBER_ID)
    )
    .sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1))
    .slice(0, 3);

  const alerts = [
    ...(canAccounting
      ? [
          {
            severity: "critical" as const,
            icon: Receipt,
            iconClass: "bg-rose-100 text-rose-700",
            title: "Overdue Invoices",
            value: `${num(overdueCount)} Invoices`,
            description: `${moneyCompact(overdueValue)} outstanding`,
            href: "/dashboard/invoices",
            action: "View Invoices",
          },
        ]
      : []),
    {
      severity: "warning" as const,
      icon: Package,
      iconClass: "bg-amber-100 text-amber-700",
      title: "Low Stock Products",
      value: `${num(lowStock)} Products`,
      description: "Below reorder threshold",
      href: "/dashboard/pos/stock/low-stock",
      action: "View Inventory",
    },
    {
      severity: "warning" as const,
      icon: Truck,
      iconClass: "bg-sky-100 text-sky-700",
      title: "Pending Deliveries",
      value: `${num(delivery.pending)} Awaiting Dispatch`,
      description: `${num(delivery.inTransit)} in transit`,
      href: "/dashboard/delivery/deliveries",
      action: "Dispatch",
    },
    {
      severity: "info" as const,
      icon: Plane,
      iconClass: "bg-violet-100 text-violet-700",
      title: "Pending Travel Bookings",
      value: `${num(pendingBookings)} Bookings`,
      description: `${num(travel.openEnquiries)} open enquiries`,
      href: "/dashboard/travel/bookings",
      action: "Review",
    },
    {
      severity: "warning" as const,
      icon: ClipboardCheck,
      iconClass: "bg-indigo-100 text-indigo-700",
      title: "Pending Approvals",
      value: `${num(pendingApprovals)} Awaiting Review`,
      description: "Across expenses, bills and requests",
      href: "/dashboard/teams-meet/work/approvals",
      action: "Approve",
    },
    {
      severity: "critical" as const,
      icon: AlertTriangle,
      iconClass: "bg-orange-100 text-orange-700",
      title: "Failed / Returned Deliveries",
      value: `${num(delivery.failed)} Failed`,
      description: "Require re-dispatch",
      href: "/dashboard/delivery/deliveries",
      action: "Resolve",
    },
  ];

  const snapshots = [
    {
      title: "Sales",
      href: "/dashboard/pos/sales",
      icon: TrendingUp,
      iconClass: "bg-emerald-100 text-emerald-700",
      accent: "text-emerald-600 hover:bg-emerald-50",
      metrics: [
        { label: "Revenue", value: moneyCompact(totalRevenue) },
        { label: "Invoices", value: num(sales.invoiceCount) },
        { label: "POS Orders", value: num(sales.posCount) },
      ],
    },
    ...(canAccounting
      ? [
          {
            title: "Accounting",
            href: "/dashboard/accounting/dashboard",
            icon: Landmark,
            iconClass: "bg-amber-100 text-amber-700",
            accent: "text-amber-600 hover:bg-amber-50",
            metrics: [
              { label: "Receivable", value: moneyCompact(finance.receivables) },
              { label: "Overdue", value: num(overdueCount) },
              { label: "Expenses", value: moneyCompact(finance.expenses) },
            ],
          },
        ]
      : []),
    {
      title: "Inventory",
      href: "/dashboard/pos/stock",
      icon: Boxes,
      iconClass: "bg-sky-100 text-sky-700",
      accent: "text-sky-600 hover:bg-sky-50",
      metrics: [
        { label: "Products", value: num(product.total) },
        { label: "Units", value: num(product.totalStock) },
        { label: "Low Stock", value: num(lowStock) },
      ],
    },
    {
      title: "Travel",
      href: "/dashboard/travel/dashboard",
      icon: Plane,
      iconClass: "bg-violet-100 text-violet-700",
      accent: "text-violet-600 hover:bg-violet-50",
      metrics: [
        { label: "Bookings", value: num(travel.bookings) },
        { label: "Revenue", value: moneyCompact(travel.revenue) },
        { label: "Enquiries", value: num(travel.openEnquiries) },
      ],
    },
    {
      title: "Delivery",
      href: "/dashboard/delivery/overview",
      icon: Truck,
      iconClass: "bg-orange-100 text-orange-700",
      accent: "text-orange-600 hover:bg-orange-50",
      metrics: [
        { label: "Pending", value: num(delivery.pending) },
        { label: "In Transit", value: num(delivery.inTransit) },
        { label: "Delivered", value: num(delivery.delivered) },
      ],
    },
    {
      title: "Teams",
      href: "/dashboard/teams-meet/overview",
      icon: Users,
      iconClass: "bg-rose-100 text-rose-700",
      accent: "text-rose-600 hover:bg-rose-50",
      metrics: [
        { label: "Members", value: num(members.length) },
        { label: "Tasks Open", value: num(tasksOpen) },
        { label: "Approvals", value: num(pendingApprovals) },
      ],
    },
  ];

  const quickActions = [
    {
      label: "New Invoice",
      href: "/dashboard/invoices",
      icon: FileText,
      box: "bg-emerald-100 text-emerald-700",
      hover: "hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700",
      ring: "group-hover:bg-emerald-600 group-hover:text-white",
      perm: true,
    },
    {
      label: "Add Customer",
      href: "/dashboard/customer/overview",
      icon: Users,
      box: "bg-sky-100 text-sky-700",
      hover: "hover:border-sky-200 hover:bg-sky-50/50 hover:text-sky-700",
      ring: "group-hover:bg-sky-600 group-hover:text-white",
      perm: true,
    },
    {
      label: "New POS Order",
      href: "/dashboard/pos/sales",
      icon: ShoppingCart,
      box: "bg-amber-100 text-amber-700",
      hover: "hover:border-amber-200 hover:bg-amber-50/50 hover:text-amber-700",
      ring: "group-hover:bg-amber-600 group-hover:text-white",
      perm: true,
    },
    {
      label: "Add Product",
      href: "/dashboard/pos/products",
      icon: Package,
      box: "bg-teal-100 text-teal-700",
      hover: "hover:border-teal-200 hover:bg-teal-50/50 hover:text-teal-700",
      ring: "group-hover:bg-teal-600 group-hover:text-white",
      perm: true,
    },
    {
      label: "Book Travel",
      href: "/dashboard/travel/bookings",
      icon: Plane,
      box: "bg-violet-100 text-violet-700",
      hover: "hover:border-violet-200 hover:bg-violet-50/50 hover:text-violet-700",
      ring: "group-hover:bg-violet-600 group-hover:text-white",
      perm: true,
    },
    {
      label: "Dispatch Delivery",
      href: "/dashboard/delivery/dispatch",
      icon: Truck,
      box: "bg-orange-100 text-orange-700",
      hover: "hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-700",
      ring: "group-hover:bg-orange-600 group-hover:text-white",
      perm: true,
    },
    {
      label: "Log Expense",
      href: "/dashboard/expenses",
      icon: Receipt,
      box: "bg-rose-100 text-rose-700",
      hover: "hover:border-rose-200 hover:bg-rose-50/50 hover:text-rose-700",
      ring: "group-hover:bg-rose-600 group-hover:text-white",
      perm: canAccounting,
    },
    {
      label: "New Task",
      href: "/dashboard/teams-meet/work/my-tasks",
      icon: ClipboardCheck,
      box: "bg-indigo-100 text-indigo-700",
      hover: "hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700",
      ring: "group-hover:bg-indigo-600 group-hover:text-white",
      perm: true,
    },
  ].filter((a) => a.perm);

  const visibleFeed =
    activityFilter === "All"
      ? activityFeed
      : activityFeed.filter((f) => f.module === activityFilter);
  const filteredFeed = canAccounting
    ? visibleFeed
    : visibleFeed.filter((f) => f.module !== "Accounting");

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6">
      {/* 1. Header */}
      <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-700">
              {greeting}, {CURRENT_USER_NAME} 👋
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Here&apos;s what&apos;s happening across your business today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs">
              <Calendar className="size-4 text-emerald-600" />
              <span className="font-medium text-gray-500">Range:</span>
              <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
                <SelectTrigger className="h-6 border-0 bg-transparent p-0 text-xs font-semibold text-gray-900 focus:ring-0">
                  <SelectValue>{RANGE_LABELS[range]}</SelectValue>
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl">
                  {RANGE_OPTIONS.map((o) => (
                    <SelectItem key={o.key} value={o.key} className="rounded-lg text-xs">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs">
              <Store className="size-4 text-emerald-600" />
              <span className="font-medium text-gray-500">Outlet:</span>
              <Select value={outletFilter} onValueChange={setOutletFilter}>
                <SelectTrigger className="h-6 border-0 bg-transparent p-0 text-xs font-semibold text-gray-900 focus:ring-0">
                  <SelectValue>{currentOutletName}</SelectValue>
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl">
                  <SelectItem value="all" className="rounded-lg text-xs">
                    All Outlets
                  </SelectItem>
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

        {range === "custom" && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3.5 py-3">
            <span className="text-xs font-semibold text-gray-600">Custom Range</span>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-emerald-300"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-emerald-300"
            />
          </div>
        )}
      </div>

      {/* 2. Executive Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Business Revenue"
          icon={TrendingUp}
          iconClass="bg-emerald-50 text-emerald-700"
          value={money(totalRevenue)}
          delta={revenueTrend.label}
          up={revenueTrend.up}
          caption={`${num(sales.invoiceCount)} invoices · ${num(sales.posCount)} POS orders`}
        />
        <KpiCard
          label="Cash Position"
          icon={Wallet}
          iconClass="bg-sky-50 text-sky-700"
          value={money(cashPosition)}
          delta={cashTrend.label}
          up={cashTrend.up}
          caption={`${moneyCompact(finance.bank)} bank · ${moneyCompact(finance.cash)} cash`}
        />
        {canAccounting ? (
          <KpiCard
            label="Outstanding Amount"
            icon={CreditCard}
            iconClass="bg-amber-50 text-amber-700"
            value={money(finance.receivables)}
            delta={`${overdueShare}% overdue`}
            up={null}
            caption={`${num(openInvoices.length)} open · ${num(overdueCount)} overdue`}
          />
        ) : (
          <KpiCard
            label="Products in Stock"
            icon={Boxes}
            iconClass="bg-amber-50 text-amber-700"
            value={num(product.total)}
            delta={`${num(lowStock)} low`}
            up={null}
            caption={`${num(product.totalStock)} units across outlets`}
          />
        )}
        <KpiCard
          label="Team Members"
          icon={Users}
          iconClass="bg-violet-50 text-violet-700"
          value={num(members.length)}
          delta={joinersTrend.label}
          up={joinersTrend.up}
          caption={`across ${departments.length} departments`}
        />
      </div>

      {/* 3. Business Overview + Quick Actions */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Business Overview</h2>
              <p className="text-xs text-gray-500">
                Revenue, expenses and profit across the business
              </p>
            </div>
            <div className="flex items-center gap-1 self-start rounded-xl bg-gray-100 p-1">
              {(["revenue", "expenses", "profit"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setChartMetric(m)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-colors ${
                    chartMetric === m
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <AnalyticsAreaChart
            data={businessTrend}
            xKey="label"
            series={series}
            format={moneyCompact}
            height={260}
          />

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ background: series[0].color }}
              />
              <span className="font-medium">{series[0].name}</span>
              <span className="font-bold text-gray-800">{moneyCompact(metricTotal)}</span>
            </span>
            <span>
              {RANGE_LABELS[range]} · {currentOutletName}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-xs text-gray-500">
              Shortcuts you have permission to perform
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className={`group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-2 text-xs font-semibold text-gray-800 transition-all ${a.hover}`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-lg ${a.box} ${a.ring}`}
                    >
                      <a.icon className="size-4" />
                    </span>
                    <span className="truncate">{a.label}</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs text-emerald-800">
            <p className="font-semibold">Workspace Connected</p>
            <p className="mt-0.5 text-emerald-700">
              All modules synced in real-time · {currentOutletName}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Module Snapshots */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Module Snapshots</h2>
            <p className="text-xs text-gray-500">
              Live health of every business module
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {snapshots.map((s) => (
            <SnapshotCard key={s.title} {...s} />
          ))}
        </div>
      </div>

      {/* 5. Needs Attention + My Work */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Needs Attention</h2>
              <p className="text-xs text-gray-500">Actionable items across operations</p>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              {num(alerts.length)} Categories
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {alerts.map((a) => (
              <AlertRow key={a.title} {...a} />
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
          <h2 className="text-base font-semibold text-gray-900">My Work</h2>
          <p className="text-xs text-gray-500">Your priorities across the business</p>

          <div className="mt-4 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-1.5">
                <ClipboardCheck className="size-3.5 text-gray-400" />
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Tasks Due
                </p>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                {dueTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-gray-800">
                        {t.title}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Due {fmtShortDate(t.dueDate)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        TASK_STATUS_CLASS[t.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
                {dueTasks.length === 0 && (
                  <p className="py-3 text-center text-xs text-gray-400">
                    No tasks due soon.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-gray-400" />
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Pending Approvals
                </p>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                {myApprovals.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-gray-800">
                        {a.subject}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {a.type} · by {memberName(a.submittedBy)}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-semibold text-gray-700">
                      {a.amount ? money(Number(a.amount)) : "—"}
                    </span>
                  </div>
                ))}
                {myApprovals.length === 0 && (
                  <p className="py-3 text-center text-xs text-gray-400">
                    Nothing awaiting your approval.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-gray-400" />
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Upcoming Meetings
                </p>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                {upcomingMeetings.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-gray-800">
                        {m.title}
                      </p>
                      <p className="text-[11px] text-gray-500">{m.roomName || "Meeting"}</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-semibold text-gray-700">
                      {fmtShortDate(m.date)} · {m.time}
                    </span>
                  </div>
                ))}
                {upcomingMeetings.length === 0 && (
                  <p className="py-3 text-center text-xs text-gray-400">
                    No upcoming meetings.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Recent Activity */}
      <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-xs text-gray-500">Live cross-module operational log</p>
          </div>
          <Link
            href="/dashboard/auditing/activity-log"
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View all <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {ACTIVITY_FILTERS.map((f) => {
            const active = activityFilter === f;
            const disabled = f === "Accounting" && !canAccounting;
            return (
              <button
                key={f}
                disabled={disabled}
                onClick={() => setActivityFilter(f)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  disabled
                    ? "cursor-not-allowed text-gray-300"
                    : active
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-3 divide-y divide-gray-100">
          {filteredFeed.slice(0, 8).map((item) => {
            const meta = MODULE_META[item.module];
            const Icon = meta.icon;
            return (
              <div key={item.id} className="flex items-start gap-3 pt-3 first:pt-0">
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-xl ${meta.wrap}`}
                >
                  <Icon className={`size-4 ${meta.iconClass}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-semibold text-gray-900">
                      <span className="font-bold text-gray-800">{item.user}</span>{" "}
                      {item.verb} {item.entity}
                    </p>
                    <span className="shrink-0 text-[10px] font-medium text-gray-400">
                      {timeAgo(item.time)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    <span className="font-semibold text-gray-700">{item.module}</span>
                  </p>
                </div>
              </div>
            );
          })}
          {filteredFeed.length === 0 && (
            <p className="py-8 text-center text-xs text-gray-400">
              No recent activity in this module.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
