"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  departmentName,
  formatDate,
  memberName,
  pageShell,
  PageHeader,
  ProgressBar,
  StatCard,
  StatusBadge,
} from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

const FILTERS = ["All", "On Track", "At Risk", "Completed"] as const;

export default function OnboardingProgressPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const joiners = useTeamMeetStore((s) => s.joiners);

  const filtered = useMemo(
    () => (filter === "All" ? joiners : joiners.filter((j) => j.status === filter)),
    [joiners, filter]
  );
  const avgProgress = useMemo(() => {
    if (joiners.length === 0) return 0;
    const sum = joiners.reduce(
      (acc, j) => acc + (Number(j.tasksDone) / Math.max(Number(j.tasksTotal), 1)) * 100,
      0
    );
    return Math.round(sum / joiners.length);
  }, [joiners]);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Onboarding Progress"
        description="How new joiners are ramping up."
      />

      <div className="grid gap-3 p-1.5 sm:grid-cols-3">
        <StatCard label="Active Joiners" value={String(joiners.filter((j) => j.status !== "Completed").length)} sub={`${joiners.filter((j) => j.status === "At Risk").length} at risk`} />
        <StatCard label="Avg. Progress" value={`${avgProgress}%`} sub="across all joiners" />
        <StatCard label="Completed" value={String(joiners.filter((j) => j.status === "Completed").length)} sub="fully ramped" />
      </div>

      <div className="flex items-center gap-2 p-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              filter === f
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-3 p-1.5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 && (
          <div className="rounded-[20px] border border-gray-100 bg-white p-8 text-center shadow-sm md:col-span-2 xl:col-span-3">
            <p className="text-sm text-gray-400">No joiners match this filter.</p>
          </div>
        )}
        {filtered.map((j) => {
          const pct = Math.round(
            (Number(j.tasksDone) / Math.max(Number(j.tasksTotal), 1)) * 100
          );
          return (
            <div key={j.id} className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={j.name} size="size-10" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">{j.name}</p>
                    <p className="truncate text-xs text-gray-500">
                      {j.title} · {departmentName(j.departmentId)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={j.status} />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {j.stage} · started {formatDate(j.startDate)}
                  </span>
                  <span className="font-semibold text-gray-800">{pct}%</span>
                </div>
                <ProgressBar value={pct} className="mt-1.5" tone={j.status === "At Risk" ? "bg-amber-500" : "bg-emerald-500"} />
                <p className="mt-2 text-xs text-gray-500">
                  {j.tasksDone} of {j.tasksTotal} tasks done · buddy {memberName(j.buddyId)}
                </p>
                {j.notes && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">{j.notes}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
