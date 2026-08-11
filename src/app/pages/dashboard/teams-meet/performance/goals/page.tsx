"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  memberName,
  pageShell,
  PageHeader,
  ProgressBar,
  StatCard,
  StatusBadge,
} from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

const PERIODS = ["Q3", "Q4"] as const;

export default function PerformanceGoalsPage() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Q3");
  const goals = useTeamMeetStore((s) => s.goals);

  const filtered = useMemo(
    () => goals.filter((g) => g.period === period),
    [goals, period]
  );
  const avgProgress = useMemo(() => {
    if (filtered.length === 0) return 0;
    return Math.round(filtered.reduce((sum, g) => sum + Number(g.progress), 0) / filtered.length);
  }, [filtered]);
  const achieved = filtered.filter((g) => g.status === "Achieved").length;
  const atRisk = filtered.filter((g) => g.status === "At Risk").length;

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader title="Goals" description="Objectives and key results across the team." />

      <div className="flex items-center gap-2 p-1.5">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              period === p
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-3">
        <StatCard label="Goals" value={String(filtered.length)} sub={`${period} period`} />
        <StatCard label="Avg. Progress" value={`${avgProgress}%`} sub="across all goals" />
        <StatCard label="At Risk" value={String(atRisk)} sub={`${achieved} achieved`} />
      </div>

      <div className="grid gap-3 p-1.5 md:grid-cols-2">
        {filtered.length === 0 && (
          <div className="rounded-[20px] border border-gray-100 bg-white p-8 text-center shadow-sm md:col-span-2">
            <p className="text-sm text-gray-400">No goals for this period.</p>
          </div>
        )}
        {filtered.map((g) => (
          <div key={g.id} className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">{g.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {g.category} · owned by {memberName(g.ownerId)}
                </p>
              </div>
              <StatusBadge status={g.status} />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{g.period}</span>
                <span className="font-semibold text-gray-800">{g.progress}%</span>
              </div>
              <ProgressBar
                value={g.progress}
                className="mt-1.5"
                tone={g.status === "Achieved" ? "bg-emerald-500" : g.status === "At Risk" ? "bg-amber-500" : "bg-sky-500"}
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Avatar id={g.ownerId} size="size-6" />
              <span className="text-xs text-gray-500">{memberName(g.ownerId)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
