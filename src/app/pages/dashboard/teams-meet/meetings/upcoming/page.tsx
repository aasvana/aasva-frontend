"use client";

import { useMemo } from "react";
import { CalendarClock, Clock, MapPin } from "lucide-react";
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

export default function MeetingsUpcomingPage() {
  const meetings = useTeamMeetStore((s) => s.meetings);
  const setMeetingStatus = useTeamMeetStore((s) => s.setMeetingStatus);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const upcoming = useMemo(
    () =>
      meetings
        .filter((m) => m.date >= today && m.status !== "Cancelled")
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    [meetings, today]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Upcoming Meetings"
        description={`${upcoming.length} sessions scheduled ahead.`}
      />
      <div className="grid gap-3 p-1.5 md:grid-cols-2 xl:grid-cols-3">
        {upcoming.length === 0 && (
          <div className="rounded-[20px] border border-gray-100 bg-white p-8 text-center shadow-sm md:col-span-2 xl:col-span-3">
            <p className="text-sm text-gray-400">No upcoming meetings scheduled.</p>
          </div>
        )}
        {upcoming.map((m) => {
          const attendees = m.attendees.split(",").map((id) => id.trim()).filter(Boolean);
          return (
            <div key={m.id} className="flex flex-col rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">{m.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{m.agenda}</p>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <div className="mt-4 flex flex-col gap-1.5 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <CalendarClock className="size-4 text-gray-400" />
                  {formatDate(m.date)} at {m.time} · {m.duration} min
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-gray-400" />
                  {m.roomName}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4 text-gray-400" />
                  Organized by {memberName(m.organizerId)}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex -space-x-2">
                  {attendees.slice(0, 5).map((id) => (
                    <Avatar key={id} id={id} size="size-7" className="ring-2 ring-white" />
                  ))}
                  {attendees.length > 5 && (
                    <span className="grid size-7 place-items-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-500 ring-2 ring-white">
                      +{attendees.length - 5}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setMeetingStatus(m.id, "Completed");
                    toast.success("Meeting marked as completed.");
                  }}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Mark done
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
