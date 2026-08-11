"use client";

import { useMemo } from "react";
import { Award, Heart, Trophy, Sparkles, Medal, Users } from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  formatDate,
  memberName,
  pageShell,
  PageHeader,
} from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Kudos: Heart,
  "Spot Bonus": Trophy,
  "Employee of the Month": Medal,
  Milestone: Sparkles,
  "Team Award": Users,
};

const TYPE_TONES: Record<string, string> = {
  Kudos: "bg-rose-50 text-rose-600",
  "Spot Bonus": "bg-amber-50 text-amber-600",
  "Employee of the Month": "bg-violet-50 text-violet-600",
  Milestone: "bg-emerald-50 text-emerald-600",
  "Team Award": "bg-sky-50 text-sky-600",
};

export default function PerformanceRecognitionPage() {
  const recognition = useTeamMeetStore((s) => s.recognition);
  const members = useTeamMeetStore((s) => s.members);

  const sorted = useMemo(
    () => [...recognition].sort((a, b) => b.date.localeCompare(a.date)),
    [recognition]
  );

  const kudosCount = useMemo(
    () => sorted.filter((r) => r.type === "Kudos").length,
    [sorted]
  );

  const topRecipients = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of recognition) {
      map.set(r.to, (map.get(r.to) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [recognition]);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Recognition"
        description="Celebrate the people who make the team great."
      />

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          {sorted.length === 0 && (
            <div className="grid h-48 place-items-center rounded-[20px] border border-gray-100 bg-white shadow-sm">
              <p className="text-sm text-gray-400">No recognition yet.</p>
            </div>
          )}
          {sorted.map((r) => {
            const Icon = TYPE_ICONS[r.type] ?? Award;
            return (
              <div key={r.id} className="flex items-start gap-4 rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-xl ${
                    TYPE_TONES[r.type] ?? "bg-gray-50 text-gray-500"
                  }`}
                >
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-800">{r.type}</p>
                    <span className="text-xs text-gray-400">{formatDate(r.date)}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{r.message}</p>
                  <p className="mt-2 text-xs text-gray-400">
                    from {memberName(r.from)} to {memberName(r.to)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800">Top Recipients</p>
            <p className="mt-0.5 text-xs text-gray-500">
              {kudosCount} kudos · {sorted.length} total
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {topRecipients.map(([id, count], idx) => (
                <div key={id} className="flex items-center gap-3">
                  <span className="grid size-6 place-items-center rounded-full bg-gray-50 text-[10px] font-bold text-gray-500">
                    {idx + 1}
                  </span>
                  <Avatar id={id} size="size-8" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">{memberName(id)}</p>
                    <p className="text-[10px] text-gray-400">{members.find((m) => m.id === id)?.title}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
              {topRecipients.length === 0 && (
                <p className="py-4 text-center text-xs text-gray-400">No recipients yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-[20px] border border-gray-100 bg-emerald-50 p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-800">Shout it out</p>
            </div>
            <p className="mt-1.5 text-xs text-emerald-700">
              Recognize a teammate for great work — a little acknowledgment goes a long way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
