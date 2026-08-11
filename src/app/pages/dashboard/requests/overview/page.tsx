"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bug,
  CheckCircle2,
  ClipboardList,
  Clock,
  Inbox,
  LifeBuoy,
  Lightbulb,
  Megaphone,
  MessageSquare,
  Timer,
  AlertTriangle,
} from "lucide-react";
import {
  StatCard,
  categoryBadge,
  priorityPill,
  statusPill,
} from "@/components/user-request/request-ui";
import { REQUEST_CATEGORIES, useUserRequestStore } from "@/stores/userRequestStore";
import { useClientReady } from "@/hooks/useClientReady";

const CATEGORY_META = [
  { category: "support", label: "Support", url: "/dashboard/requests/support", icon: LifeBuoy, tone: "bg-sky-50 text-sky-700" },
  { category: "feature", label: "Feature Requests", url: "/dashboard/requests/features", icon: Lightbulb, tone: "bg-violet-50 text-violet-700" },
  { category: "feedback", label: "Feedback", url: "/dashboard/requests/feedback", icon: MessageSquare, tone: "bg-teal-50 text-teal-700" },
  { category: "bug", label: "Bug Reports", url: "/dashboard/requests/bugs", icon: Bug, tone: "bg-red-50 text-red-700" },
  { category: "complaint", label: "Complaints", url: "/dashboard/requests/complaints", icon: AlertTriangle, tone: "bg-amber-50 text-amber-700" },
  { category: "announcement", label: "Announcements", url: "/dashboard/requests/announcements", icon: Megaphone, tone: "bg-indigo-50 text-indigo-700" },
] as const;

const QUICK_LINKS = [
  { label: "All Requests", url: "/dashboard/requests/all", icon: ClipboardList, tone: "bg-gray-100 text-gray-600" },
  ...CATEGORY_META.map(({ label, url, icon, tone }) => ({ label, url, icon, tone })),
];

export default function RequestsOverviewPage() {
  const router = useRouter();
  const requests = useUserRequestStore((s) => s.requests);

  const stats = useMemo(() => {
    const open = requests.filter((r) => r.status === "Open").length;
    const inProgress = requests.filter((r) => r.status === "In Progress").length;
    const resolved = requests.filter(
      (r) => r.status === "Resolved" || r.status === "Closed"
    ).length;
    return { open, inProgress, resolved };
  }, [requests]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    REQUEST_CATEGORIES.forEach((c) => {
      counts[c] = requests.filter((r) => r.category === c).length;
    });
    return counts;
  }, [requests]);

  const recent = useMemo(
    () =>
      [...requests]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [requests]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">User Requests</h1>
          <p className="text-sm text-gray-500">
            Support tickets, feature ideas, feedback and announcements.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/dashboard/requests/all")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <ClipboardList className="size-4" /> View All Requests
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard label="Total requests" value={requests.length} icon={<Inbox className="size-4" />} />
        <StatCard label="Open" value={stats.open} icon={<Clock className="size-4" />} tone="sky" />
        <StatCard label="In progress" value={stats.inProgress} icon={<Timer className="size-4" />} tone="amber" />
        <StatCard label="Resolved / closed" value={stats.resolved} icon={<CheckCircle2 className="size-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">By category</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORY_META.map((meta) => (
              <button
                key={meta.category}
                type="button"
                onClick={() => router.push(meta.url)}
                className="flex flex-col items-start gap-2 rounded-2xl border border-gray-100 bg-gray-50/50 px-3 py-3 text-left hover:border-emerald-200"
              >
                <span className={meta.tone}>
                  <meta.icon className="size-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {categoryCounts[meta.category]}
                  </p>
                  <p className="text-xs text-gray-500">{meta.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Recent requests</p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/requests/all")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              All requests <ArrowRight className="size-3.5" />
            </button>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Inbox className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No requests yet.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {categoryBadge(r.category)}
                      <span className="text-xs text-gray-400">{r.refNo}</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-gray-800">
                      {r.title}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {priorityPill(r.priority)}
                    {statusPill(r.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-1.5">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">Quick access</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
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
