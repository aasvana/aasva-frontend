"use client";

import { useMemo } from "react";
import { toast } from "sonner";
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

export default function TimeLeavePage() {
  const leave = useTeamMeetStore((s) => s.leave);
  const updateLeave = useTeamMeetStore((s) => s.updateLeave);

  const sorted = useMemo(
    () => [...leave].sort((a, b) => b.from.localeCompare(a.from)),
    [leave]
  );
  const approved = leave.filter((l) => l.status === "Approved").length;
  const pending = leave.filter((l) => l.status === "Pending").length;
  const totalDays = leave
    .filter((l) => l.status === "Approved")
    .reduce((sum, l) => sum + Number(l.days), 0);

  const ready = useClientReady();
  if (!ready) return null;

  const decide = (id: string, status: "Approved" | "Rejected", approvedBy: string) => {
    const item = leave.find((l) => l.id === id);
    if (!item) return;
    updateLeave(id, {
      memberId: item.memberId,
      type: item.type,
      from: item.from,
      to: item.to,
      days: item.days,
      reason: item.reason,
      status,
      approvedBy: status === "Approved" ? approvedBy : "",
    });
    toast.success(`Leave ${status.toLowerCase()}.`);
  };

  return (
    <div className={pageShell}>
      <PageHeader title="Leave" description="Time-off requests from the team." />

      <div className="grid gap-3 p-1.5 sm:grid-cols-3">
        <StatCard label="Approved Days" value={String(totalDays)} sub={`${approved} requests`} />
        <StatCard label="Pending" value={String(pending)} sub="awaiting decision" />
        <StatCard label="Total Requests" value={String(leave.length)} sub="all time" />
      </div>

      <div className="p-1.5">
        <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  {["Member", "Type", "From", "To", "Days", "Reason", "Status", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2">
                        <Avatar id={l.memberId} size="size-6" />
                        {memberName(l.memberId)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{l.type}</td>
                    <td className="px-6 py-3 text-gray-600">{formatDate(l.from)}</td>
                    <td className="px-6 py-3 text-gray-600">{formatDate(l.to)}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">{l.days}</td>
                    <td className="max-w-[200px] truncate px-6 py-3 text-gray-500">{l.reason}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={l.status} />
                        {l.approvedBy && (
                          <span className="text-[10px] text-gray-400">by {memberName(l.approvedBy)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {l.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => decide(l.id, "Approved", "mem_khan")}
                            className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-100"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => decide(l.id, "Rejected", "")}
                            className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-100"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-gray-400">
                      No leave requests.
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
