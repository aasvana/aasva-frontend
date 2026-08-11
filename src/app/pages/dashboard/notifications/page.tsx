"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { CheckCheck, Inbox, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORY_META, TYPE_META } from "@/lib/notify";
import {
  AppNotification,
  NotificationCategory,
  useNotificationStore,
} from "@/stores/notificationStore";

type Tab = "all" | "unread" | "read";

function groupLabel(iso: string): string {
  const now = new Date();
  const d = new Date(iso);
  const startOfDay = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const days = Math.round(
    (startOfDay(now).getTime() - startOfDay(d).getTime()) / 86400000
  );
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "This week";
  return "Earlier";
}

const GROUP_ORDER = ["Today", "Yesterday", "This week", "Earlier"];

export default function NotificationsPage() {
  const router = useRouter();

  const notifications = useNotificationStore((s) => s.notifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const markUnread = useNotificationStore((s) => s.markUnread);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);
  const clearAll = useNotificationStore((s) => s.clearAll);

  const [tab, setTab] = useState<Tab>("all");
  const [category, setCategory] = useState<"all" | NotificationCategory>("all");
  const [customer, setCustomer] = useState("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const customers = useMemo(
    () =>
      Array.from(
        new Set(
          notifications
            .map((n) => n.customer)
            .filter((c): c is string => Boolean(c))
        )
      ),
    [notifications]
  );

  const filtered = useMemo(
    () =>
      notifications.filter(
        (n) =>
          (tab === "all" ||
            (tab === "unread" && !n.read) ||
            (tab === "read" && n.read)) &&
          (category === "all" || n.category === category) &&
          (customer === "all" || n.customer === customer)
      ),
    [notifications, tab, category, customer]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, AppNotification[]>();
    for (const n of filtered) {
      const label = groupLabel(n.createdAt);
      map.set(label, [...(map.get(label) ?? []), n]);
    }
    return GROUP_ORDER.filter((label) => map.has(label)).map((label) => ({
      label,
      items: map.get(label)!,
    }));
  }, [filtered]);

  const hasFilters = tab !== "all" || category !== "all" || customer !== "all";

  const resetFilters = () => {
    setTab("all");
    setCategory("all");
    setCustomer("all");
  };

  const handleOpen = (n: AppNotification) => {
    if (!n.read) markRead(n.id);
    if (n.link) router.push(n.link);
  };

  const handleClearAll = () => {
    if (!window.confirm("Delete all notifications? This cannot be undone.")) {
      return;
    }
    clearAll();
    toast.success("All notifications cleared.");
  };

  const stats = [
    { label: "Total", value: notifications.length },
    { label: "Unread", value: unreadCount },
    { label: "Categories", value: new Set(notifications.map((n) => n.category)).size },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Notifications</h1>
          <p className="text-sm text-gray-500">
            Activity from your documents, customers and inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck /> Mark all read
          </Button>
          <Button
            variant="outline"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            <Trash2 /> Clear all
          </Button>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="grid grid-cols-3 gap-3 p-1.5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 p-1.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
            {(["all", "unread", "read"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors cursor-pointer",
                  tab === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="h-10 cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
            >
              <option value="all">All categories</option>
              {Object.entries(CATEGORY_META).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="h-10 cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
            >
              <option value="all">All customers</option>
              {customers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset filters
              </Button>
            )}
          </div>
        </div>

        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-[20px] border border-dashed border-gray-200 py-20 text-center">
                <Inbox className="size-10 text-gray-300" />
                <p className="text-lg font-medium text-gray-800">
                  No notifications yet
                </p>
                <p className="max-w-sm text-sm text-gray-500">
                  You'll see updates here when documents are created, customers
                  are added or stock runs low.
                </p>
                <Button asChild variant="outline">
                  <Link href="/dashboard/invoices">Create an invoice</Link>
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-[20px] border border-dashed border-gray-200 py-20 text-center">
                <p className="text-lg font-medium text-gray-800">
                  Nothing matches your filters
                </p>
                <p className="text-sm text-gray-500">
                  Try a different category, customer or status.
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {grouped.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {group.label}
                    </p>
                    <div className="overflow-hidden rounded-[20px] border border-gray-100 divide-y divide-gray-100 bg-white shadow-sm">
                      {group.items.map((n) => {
                        const TypeIcon = TYPE_META[n.type].icon;
                        const CategoryIcon = CATEGORY_META[n.category].icon;
                        return (
                          <div
                            key={n.id}
                            className={cn(
                              "flex items-start gap-3 px-4 py-3.5 transition-colors",
                              n.link && "cursor-pointer hover:bg-gray-50",
                              !n.read && "bg-emerald-50/40"
                            )}
                            onClick={() => handleOpen(n)}
                          >
                            <div
                              className={cn(
                                "grid size-9 shrink-0 place-items-center rounded-full",
                                TYPE_META[n.type].className
                              )}
                            >
                              <TypeIcon className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={cn(
                                    "text-sm text-gray-900",
                                    !n.read && "font-semibold"
                                  )}
                                >
                                  {n.title}
                                </p>
                                <span className="shrink-0 text-xs text-gray-400">
                                  {formatDistanceToNow(new Date(n.createdAt), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>
                              {n.message && (
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {n.message}
                                </p>
                              )}
                              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                                    CATEGORY_META[n.category].className
                                  )}
                                >
                                  <CategoryIcon className="size-3" />
                                  {CATEGORY_META[n.category].label}
                                </span>
                                {n.customer && (
                                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                                    {n.customer}
                                  </span>
                                )}
                                {!n.read && (
                                  <span className="size-1.5 rounded-full bg-emerald-500" />
                                )}
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                aria-label={n.read ? "Mark as unread" : "Mark as read"}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (n.read) markUnread(n.id);
                                  else markRead(n.id);
                                }}
                              >
                                <CheckCheck className="size-4" />
                              </button>
                              <button
                                type="button"
                                aria-label="Delete notification"
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(n.id);
                                }}
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
