"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Banknote,
  BookOpen,
  Building2,
  CalendarDays,
  FileText,
  FolderOpen,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Receipt,
  ShoppingCart,
} from "lucide-react";
import {
  StatCard,
  actionBadge,
  formatTime,
  customerInitials,
  useSelectedCustomer,
} from "@/components/customer/customer-ui";
import { useClientReady } from "@/hooks/useClientReady";
import { toNumber } from "@/modules/accounting/reporting";

export default function CustomerOverviewPage() {
  const router = useRouter();
  const { customer, profile } = useSelectedCustomer();

  const stats = useMemo(() => {
    const sales = profile.sales;
    const orders = sales.orders.length;
    const invoices = sales.invoices.length;
    const payments = sales.payments.reduce(
      (sum, p) => sum + toNumber(p.amount),
      0
    );
    const openBalance = sales.invoices
      .filter((inv) => inv.status !== "paid" && inv.status !== "cancelled")
      .reduce((sum, inv) => sum + toNumber(inv.balance), 0);
    return { orders, invoices, payments, openBalance };
  }, [profile]);

  const upcoming = useMemo(
    () =>
      [...profile.travel.bookings]
        .filter((b) => b.status !== "Cancelled")
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .slice(0, 4),
    [profile]
  );

  const recentActivity = useMemo(
    () =>
      [...profile.activity]
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, 6),
    [profile]
  );

  const ready = useClientReady();
  if (!ready) return null;

  if (!customer) {
    return (
      <div className="flex flex-col gap-4 p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Customer Overview</h1>
        <div className="rounded-[20px] border border-gray-100 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            No customers yet. Add a customer to see their 360° overview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-full bg-emerald-50 text-base font-bold text-emerald-700">
            {customerInitials(customer.name)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {customer.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
              {customer.company && (
                <span className="inline-flex items-center gap-1">
                  <Building2 className="size-3.5" /> {customer.company}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" /> {customer.place},{" "}
                {customer.country}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard/customer/activity")}
            className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:border-emerald-200"
          >
            <BookOpen className="size-4" /> Activity
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/customer/communication")}
            className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:border-emerald-200"
          >
            <Mail className="size-4" /> Contact
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard
          label="Orders"
          value={stats.orders}
          icon={<ShoppingCart className="size-4" />}
        />
        <StatCard
          label="Invoices"
          value={stats.invoices}
          icon={<Receipt className="size-4" />}
          tone="sky"
        />
        <StatCard
          label="Payments received"
          value={stats.payments.toFixed(2)}
          icon={<Banknote className="size-4" />}
        />
        <StatCard
          label="Open balance"
          value={stats.openBalance.toFixed(2)}
          icon={<Landmark className="size-4" />}
          tone={stats.openBalance > 0 ? "amber" : "default"}
        />
        <StatCard
          label="Bookings"
          value={profile.travel.bookings.length}
          icon={<CalendarDays className="size-4" />}
          tone="violet"
        />
        <StatCard
          label="Documents"
          value={profile.travel.documents.length}
          icon={<FolderOpen className="size-4" />}
          tone="sky"
        />
        <StatCard
          label="Notes"
          value={profile.notes.length}
          icon={<FileText className="size-4" />}
        />
        <StatCard
          label="Contact points"
          value={profile.communication.length}
          icon={<Phone className="size-4" />}
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Upcoming bookings
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/customer/bookings")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              All bookings <ArrowRight className="size-3.5" />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <CalendarDays className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No upcoming bookings.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {upcoming.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {booking.service}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking.reference} · {booking.supplierName}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-500">
                    {booking.startDate}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Recent activity
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/customer/activity")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              Full activity <ArrowRight className="size-3.5" />
            </button>
          </div>
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <BookOpen className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No activity yet.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {recentActivity.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {actionBadge(event.action)}
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-600">
                      {event.details}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
