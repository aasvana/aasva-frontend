"use client";

import { useMemo } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  departmentName,
  memberName,
  pageShell,
  PageHeader,
  ProgressBar,
  StatCard,
} from "@/helpers/teams-meet/team-ui";
import { CURRENT_MEMBER_ID, useTeamMeetStore } from "@/stores/teamMeetStore";

export default function PerformanceProgressPage() {
  const goals = useTeamMeetStore((s) => s.goals);
  const members = useTeamMeetStore((s) => s.members);

  const rows = useMemo(
    () =>
      members
        .map((m) => {
          const owned = goals.filter((g) => g.ownerId === m.id);
          const avg = owned.length
            ? Math.round(owned.reduce((sum, g) => sum + Number(g.progress), 0) / owned.length)
            : 0;
          const achieved = owned.filter((g) => g.status === "Achieved").length;
          const atRisk = owned.filter((g) => g.status === "At Risk").length;
          return { member: m, owned, avg, achieved, atRisk };
        })
        .filter((r) => r.owned.length > 0)
        .sort((a, b) => b.avg - a.avg),
    [goals, members]
  );

  const teamAvg = useMemo(() => {
    if (rows.length === 0) return 0;
    return Math.round(rows.reduce((sum, r) => sum + r.avg, 0) / rows.length);
  }, [rows]);

  const me = rows.find((r) => r.member.id === CURRENT_MEMBER_ID);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Progress"
        description="Goal progress by owner, ranked."
      />

      <div className="grid gap-3 p-1.5 sm:grid-cols-3">
        <StatCard label="Tracked Members" value={String(rows.length)} sub="with open goals" />
        <StatCard label="Team Avg. Progress" value={`${teamAvg}%`} sub="across all owners" />
        <StatCard label="My Progress" value={me ? `${me.avg}%` : "—"} sub={`${me?.achieved ?? 0} achieved`} />
      </div>

      <div className="p-1.5">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            {rows.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">No goals tracked yet.</p>
            )}
            {rows.map(({ member, owned, avg, achieved, atRisk }) => (
              <div key={member.id} className="flex items-center gap-4">
                <Avatar id={member.id} size="size-10" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {memberName(member.id)}
                        {member.id === CURRENT_MEMBER_ID && (
                          <span className="ml-1.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                            You
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {departmentName(member.departmentId)} · {owned.length} goals · {achieved} achieved
                        {atRisk > 0 && <span className="text-amber-600"> · {atRisk} at risk</span>}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-gray-900">{avg}%</span>
                  </div>
                  <ProgressBar
                    value={avg}
                    className="mt-1.5"
                    tone={avg >= 80 ? "bg-emerald-500" : avg >= 50 ? "bg-sky-500" : "bg-amber-500"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
