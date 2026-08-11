"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/hooks/useClientReady";
import { pageShell, PageHeader, StatusBadge } from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MeetingsCalendarPage() {
  const meetings = useTeamMeetStore((s) => s.meetings);

  const { grid, monthLabel, today } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leading = first.getDay();
    const todayStr = new Date().toISOString().slice(0, 10);
    const cells: ({ day: number; iso: string } | null)[] = [];
    for (let i = 0; i < leading; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, iso });
    }
    return {
      grid: cells,
      monthLabel: now.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      today: todayStr,
    };
  }, []);

  const byDate = useMemo(() => {
    const map = new Map<string, typeof meetings>();
    for (const m of meetings) {
      const list = map.get(m.date) ?? [];
      list.push(m);
      map.set(m.date, list);
    }
    return map;
  }, [meetings]);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader title="Calendar" description="All meetings for this month at a glance." />
      <div className="p-1.5">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-gray-800">{monthLabel}</p>
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1 text-center text-xs font-medium uppercase tracking-wide text-gray-400">
                {d}
              </div>
            ))}
            {grid.map((cell, i) =>
              cell === null ? (
                <div key={i} />
              ) : (
                <div
                  key={cell.iso}
                  className={cn(
                    "min-h-[92px] rounded-xl border p-1.5",
                    cell.iso === today
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-gray-100 bg-gray-50/60"
                  )}
                >
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      cell.iso === today ? "text-emerald-700" : "text-gray-600"
                    )}
                  >
                    {cell.day}
                  </p>
                  <div className="mt-1 flex flex-col gap-1">
                    {(byDate.get(cell.iso) ?? []).slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        className="truncate rounded-md bg-white px-1.5 py-1 text-[10px] leading-tight shadow-sm"
                        title={`${m.title} · ${m.time}`}
                      >
                        <span className="font-medium text-gray-700">{m.time} · </span>
                        <span className="text-gray-500">{m.title}</span>
                      </div>
                    ))}
                    {(byDate.get(cell.iso) ?? []).length > 3 && (
                      <p className="px-1 text-[10px] text-gray-400">
                        +{byDate.get(cell.iso)!.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4">
            <span className="text-xs text-gray-500">Legend:</span>
            {["Scheduled", "Completed", "Cancelled"].map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
