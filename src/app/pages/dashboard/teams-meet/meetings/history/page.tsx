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
  StatusBadge,
} from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

export default function MeetingsHistoryPage() {
  const meetings = useTeamMeetStore((s) => s.meetings);
  const setMeetingStatus = useTeamMeetStore((s) => s.setMeetingStatus);

  const history = useMemo(
    () =>
      meetings
        .filter((m) => m.status === "Completed" || m.status === "Cancelled")
        .sort((a, b) => b.date.localeCompare(a.date)),
    [meetings]
  );

  const completed = history.filter((m) => m.status === "Completed").length;
  const cancelled = history.length - completed;

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Meeting History"
        description={`${completed} completed · ${cancelled} cancelled.`}
      />
      <div className="p-1.5">
        <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  {["Meeting", "Date", "Time", "Organizer", "Room", "Status", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                      No past meetings yet.
                    </td>
                  </tr>
                )}
                {history.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-800">{m.title}</p>
                      <p className="max-w-[260px] truncate text-xs text-gray-400">{m.notes}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{formatDate(m.date)}</td>
                    <td className="px-6 py-3 text-gray-600">{m.time}</td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2">
                        <Avatar id={m.organizerId} size="size-6" />
                        {memberName(m.organizerId)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{m.roomName}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => {
                          setMeetingStatus(m.id, "Scheduled");
                          toast.success("Meeting moved back to upcoming.");
                        }}
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
