"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  formatDate,
  memberName,
  pageShell,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

export default function TimeAttendancePage() {
  const [filter, setFilter] = useState<string>("All");
  const attendance = useTeamMeetStore((s) => s.attendance);
  const members = useTeamMeetStore((s) => s.members);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? attendance
        : attendance.filter((a) => a.memberId === filter),
    [attendance, filter]
  );
  const sorted = useMemo(
    () => [...filtered].sort((a, b) => b.date.localeCompare(a.date)),
    [filtered]
  );

  const present = attendance.filter((a) => a.status === "Present").length;
  const absent = attendance.filter((a) => a.status === "Absent").length;
  const late = attendance.filter((a) => a.status === "Late").length;
  const wfa = attendance.filter((a) => a.status === "WFA").length;

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Attendance"
        description="Check-ins and presence across the team."
      />

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Present" value={String(present)} sub="on-site today" />
        <StatCard label="Working from Anywhere" value={String(wfa)} sub="remote today" />
        <StatCard label="Late" value={String(late)} sub="arrived late" />
        <StatCard label="Absent" value={String(absent)} sub="no check-in" />
      </div>

      <div className="p-1.5">
        <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-4 py-3">
            {["All", ...members.map((m) => m.id)].map((id) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  filter === id
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                )}
              >
                {id !== "All" && <Avatar id={id} size="size-4" />}
                {id === "All" ? "Everyone" : memberName(id)}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  {["Member", "Date", "Status", "Check-in", "Check-out", "Hours", "Notes"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2">
                        <Avatar id={a.memberId} size="size-6" />
                        {memberName(a.memberId)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{formatDate(a.date)}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-6 py-3 text-gray-600">{a.checkIn}</td>
                    <td className="px-6 py-3 text-gray-600">{a.checkOut}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">{a.hours}h</td>
                    <td className="max-w-[220px] truncate px-6 py-3 text-gray-500">{a.notes}</td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                      No attendance records.
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
