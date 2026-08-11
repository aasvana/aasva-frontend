"use client";

import { useMemo } from "react";
import { Award, CalendarClock, CheckCircle2, ClipboardList } from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  formatDate,
  memberName,
  pageShell,
  PageHeader,
  PriorityPill,
  projectName,
  StatCard,
  StatusBadge,
} from "@/helpers/teams-meet/team-ui";
import { CURRENT_MEMBER_ID, useTeamMeetStore } from "@/stores/teamMeetStore";

export default function WorkMyWorkPage() {
  const tasks = useTeamMeetStore((s) => s.tasks);
  const approvals = useTeamMeetStore((s) => s.approvals);
  const leave = useTeamMeetStore((s) => s.leave);
  const recognition = useTeamMeetStore((s) => s.recognition);
  const attendance = useTeamMeetStore((s) => s.attendance);

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigneeId === CURRENT_MEMBER_ID),
    [tasks]
  );
  const openTasks = myTasks.filter((t) => t.status !== "Done");
  const awaiting = approvals.filter(
    (a) => a.reviewer === CURRENT_MEMBER_ID && a.status === "Pending"
  );
  const myLeave = leave.filter((l) => l.memberId === CURRENT_MEMBER_ID);
  const myRecognition = recognition.filter((r) => r.to === CURRENT_MEMBER_ID);
  const myAttendance = attendance.filter((a) => a.memberId === CURRENT_MEMBER_ID);
  const presentDays = myAttendance.filter((a) => a.status === "Present").length;

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader title="My Work" description="Everything queued up for you, in one place." />

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open Tasks" value={String(openTasks.length)} sub={`${myTasks.length} total`} icon={ClipboardList} tone="bg-amber-50 text-amber-700" />
        <StatCard label="Awaiting My Approval" value={String(awaiting.length)} sub="requests to review" icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" />
        <StatCard label="My Leave Requests" value={String(myLeave.length)} sub={`${myLeave.filter((l) => l.status === "Approved").length} approved`} icon={CalendarClock} tone="bg-sky-50 text-sky-700" />
        <StatCard label="Recognitions" value={String(myRecognition.length)} sub="received" icon={Award} tone="bg-violet-50 text-violet-700" />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">My Open Tasks</p>
          <p className="mt-0.5 text-xs text-gray-500">Sorted by due date</p>
          <div className="mt-3 divide-y divide-gray-100">
            {openTasks.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">All clear — nothing pending.</p>
            )}
            {[...openTasks]
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">{t.title}</p>
                    <p className="truncate text-xs text-gray-500">
                      {projectName(t.projectId)} · due {formatDate(t.dueDate)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <PriorityPill priority={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">Awaiting My Approval</p>
          <p className="mt-0.5 text-xs text-gray-500">Requests that need your decision</p>
          <div className="mt-3 divide-y divide-gray-100">
            {awaiting.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">Inbox zero. Nice.</p>
            )}
            {awaiting.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">{a.subject}</p>
                  <p className="truncate text-xs text-gray-500">
                    {a.type} · {memberName(a.submittedBy)} · {formatDate(a.requestedAt)}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">My Leave</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {presentDays}/{Math.max(myAttendance.length, 1)} tracked days present
          </p>
          <div className="mt-3 divide-y divide-gray-100">
            {myLeave.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">No leave requests.</p>
            )}
            {myLeave.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">{l.type} leave</p>
                  <p className="truncate text-xs text-gray-500">
                    {formatDate(l.from)} → {formatDate(l.to)} · {l.days} day{l.days === "1" ? "" : "s"}
                  </p>
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">Recognitions Received</p>
          <p className="mt-0.5 text-xs text-gray-500">Shout-outs from the team</p>
          <div className="mt-3 divide-y divide-gray-100">
            {myRecognition.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">No shout-outs yet.</p>
            )}
            {myRecognition.map((r) => (
              <div key={r.id} className="flex items-start gap-3 py-2.5">
                <Avatar id={r.from} size="size-8" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {r.type} · from {memberName(r.from)}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">{r.message}</p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{formatDate(r.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
