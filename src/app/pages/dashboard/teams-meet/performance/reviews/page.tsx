"use client";

import { useMemo } from "react";
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

export default function PerformanceReviewsPage() {
  const reviews = useTeamMeetStore((s) => s.reviews);

  const sorted = useMemo(
    () => [...reviews].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [reviews]
  );
  const completed = reviews.filter((r) => r.status === "Completed").length;
  const inProgress = reviews.filter((r) => r.status === "In Progress").length;
  const pending = reviews.filter((r) => r.status === "Draft").length;
  const avgScore = useMemo(() => {
    const scored = reviews.filter((r) => r.score);
    if (scored.length === 0) return "—";
    return (
      scored.reduce((sum, r) => sum + Number(r.score), 0) / scored.length
    ).toFixed(1);
  }, [reviews]);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Reviews"
        description="Performance reviews and check-ins."
      />

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Reviews" value={String(reviews.length)} sub="total" />
        <StatCard label="In Progress" value={String(inProgress)} sub="being written" />
        <StatCard label="Draft" value={String(pending)} sub="not yet submitted" />
        <StatCard label="Avg. Score" value={String(avgScore)} sub={`${completed} completed`} />
      </div>

      <div className="p-1.5">
        <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  {["Review", "Member", "Reviewer", "Period", "Due", "Score", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60">
                    <td className="max-w-[220px] px-6 py-3">
                      <p className="truncate font-medium text-gray-800">{r.title}</p>
                      {r.comments && <p className="truncate text-xs text-gray-400">{r.comments}</p>}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2">
                        <Avatar id={r.memberId} size="size-6" />
                        {memberName(r.memberId)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{memberName(r.reviewerId)}</td>
                    <td className="px-6 py-3 text-gray-600">{r.period}</td>
                    <td className="px-6 py-3 text-gray-600">{formatDate(r.dueDate)}</td>
                    <td className="px-6 py-3 font-semibold text-gray-800">{r.score || "—"}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                      No reviews scheduled.
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
