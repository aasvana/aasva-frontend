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
} from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

export default function TimeWorkHoursPage() {
  const [week, setWeek] = useState<string>("W34");
  const workHours = useTeamMeetStore((s) => s.workHours);

  const weeks = useMemo(
    () => [...new Set(workHours.map((w) => w.week))].sort().reverse(),
    [workHours]
  );

  const rows = useMemo(
    () =>
      workHours
        .filter((w) => w.week === week)
        .map((w) => ({ ...w, util: Math.min(100, Math.round((Number(w.actual) / Math.max(Number(w.planned), 1)) * 100)) }))
        .sort((a, b) => memberName(a.memberId).localeCompare(memberName(b.memberId))),
    [workHours, week]
  );

  const totalActual = rows.reduce((sum, r) => sum + Number(r.actual), 0);
  const totalPlanned = rows.reduce((sum, r) => sum + Number(r.planned), 0);
  const totalOvertime = rows.reduce((sum, r) => sum + Number(r.overtime), 0);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Work Hours"
        description="Planned versus actual hours per week."
      />

      <div className="flex flex-wrap items-center gap-2 p-1.5">
        {weeks.map((w) => (
          <button
            key={w}
            onClick={() => setWeek(w)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              week === w
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            Week {w}
          </button>
        ))}
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-3">
        <StatCard label="Actual Total" value={`${totalActual.toFixed(1)}h`} sub={`${rows.length} members`} />
        <StatCard label="Planned Total" value={`${totalPlanned.toFixed(1)}h`} sub="baseline" />
        <StatCard label="Overtime" value={`${totalOvertime.toFixed(1)}h`} sub="above plan" />
      </div>

      <div className="p-1.5">
        <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  {["Member", "Planned", "Actual", "Utilization", "Overtime"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2">
                        <Avatar id={r.memberId} size="size-6" />
                        {memberName(r.memberId)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{r.planned}h</td>
                    <td className="px-6 py-3 font-medium text-gray-800">{r.actual}h</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={r.util} className="w-28" tone={r.util > 100 ? "bg-amber-500" : "bg-emerald-500"} />
                        <span className="text-xs font-medium text-gray-600">{r.util}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {Number(r.overtime) > 0 ? (
                        <span className="font-medium text-amber-600">+{r.overtime}h</span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-gray-400">
                      No work hours logged for this week.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
