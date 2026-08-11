"use client";

import { useMemo } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Megaphone,
  MessageCircle,
  Users,
} from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  formatDate,
  formatDateTime,
  memberName,
  pageShell,
  PageHeader,
  ProgressBar,
  StatCard,
  StatusBadge,
} from "@/helpers/teams-meet/team-ui";
import { CURRENT_MEMBER_ID, useTeamMeetStore } from "@/stores/teamMeetStore";

export default function TeamsMeetOverviewPage() {
  const members = useTeamMeetStore((s) => s.members);
  const meetings = useTeamMeetStore((s) => s.meetings);
  const tasks = useTeamMeetStore((s) => s.tasks);
  const announcements = useTeamMeetStore((s) => s.announcements);
  const joiners = useTeamMeetStore((s) => s.joiners);
  const approvals = useTeamMeetStore((s) => s.approvals);
  const chats = useTeamMeetStore((s) => s.chats);
  const goals = useTeamMeetStore((s) => s.goals);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const todaysMeetings = useMemo(
    () =>
      meetings
        .filter((m) => m.date === today && m.status !== "Cancelled")
        .sort((a, b) => a.time.localeCompare(b.time)),
    [meetings, today]
  );
  const upcomingMeetings = useMemo(
    () =>
      meetings
        .filter((m) => m.date >= today && m.status === "Scheduled")
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
        .slice(0, 5),
    [meetings, today]
  );
  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigneeId === CURRENT_MEMBER_ID),
    [tasks]
  );
  const activeMembers = useMemo(
    () =>
      members.filter((m) => m.status === "Active" || m.status === "Remote")
        .length,
    [members]
  );
  const pendingApprovals = useMemo(
    () => approvals.filter((a) => a.status === "Pending"),
    [approvals]
  );
  const openGoals = useMemo(
    () =>
      goals.filter((g) => g.status !== "Achieved").sort((a, b) => Number(a.progress) - Number(b.progress)),
    [goals]
  );
  const unreadTotal = useMemo(
    () => chats.reduce((sum, c) => sum + (c.unread ?? 0), 0),
    [chats]
  );
  const topAnnouncements = useMemo(
    () =>
      announcements
        .slice()
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, 3),
    [announcements]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Teams Meet"
        description="People, communication and collaboration across the workspace."
      />

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Team Members" value={String(members.length)} sub={`${activeMembers} active`} icon={Users} tone="bg-emerald-50 text-emerald-700" />
        <StatCard label="Unread Messages" value={String(unreadTotal)} sub={`${chats.length} conversations`} icon={MessageCircle} tone="bg-sky-50 text-sky-700" />
        <StatCard label="Meetings" value={String(meetings.length)} sub={`${todaysMeetings.length} today`} icon={CalendarDays} tone="bg-violet-50 text-violet-700" />
        <StatCard label="Open Tasks" value={String(tasks.filter((t) => t.status !== "Done").length)} sub={`${myTasks.length} assigned to you`} icon={ClipboardList} tone="bg-amber-50 text-amber-700" />
        <StatCard label="Pending Approvals" value={String(pendingApprovals.length)} sub="awaiting decision" icon={CheckCircle2} tone="bg-teal-50 text-teal-700" />
        <StatCard label="New Joiners" value={String(joiners.filter((j) => j.status !== "Completed").length)} sub="onboarding" icon={Megaphone} tone="bg-rose-50 text-rose-700" />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Today&apos;s Meetings</p>
              <p className="mt-0.5 text-xs text-gray-500">Up next on the agenda</p>
            </div>
            <span className="text-xs font-medium text-gray-400">
              {todaysMeetings.length} scheduled
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {todaysMeetings.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">No meetings today.</p>
            )}
            {todaysMeetings.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-sm font-semibold text-violet-700">
                  {m.time}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">{m.title}</p>
                  <p className="truncate text-xs text-gray-500">
                    {memberName(m.organizerId)} · {m.roomName} · {m.duration} min
                  </p>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">Announcements</p>
          <p className="mt-0.5 text-xs text-gray-500">Latest from the team</p>
          <div className="mt-3 flex flex-col gap-3">
            {topAnnouncements.map((a) => (
              <div key={a.id} className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-gray-800">{a.title}</p>
                  <StatusBadge status={a.priority} />
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{a.body}</p>
                <p className="mt-2 text-[10px] text-gray-400">
                  {memberName(a.authorId)} · {formatDateTime(a.publishedAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <p className="text-sm font-semibold text-gray-800">Upcoming Meetings</p>
          <p className="mt-0.5 text-xs text-gray-500">Next five scheduled sessions</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  {["Meeting", "Date", "Time", "Organizer", "Status"].map((col) => (
                    <th key={col} className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-400 first:pl-1">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcomingMeetings.map((m) => (
                  <tr key={m.id}>
                    <td className="px-3 py-2.5 font-medium text-gray-800 first:pl-1">{m.title}</td>
                    <td className="px-3 py-2.5 text-gray-600">{formatDate(m.date)}</td>
                    <td className="px-3 py-2.5 text-gray-600">{m.time}</td>
                    <td className="px-3 py-2.5 text-gray-600">
                      <span className="inline-flex items-center gap-2">
                        <Avatar id={m.organizerId} size="size-6" />
                        {memberName(m.organizerId)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">
                      <StatusBadge status={m.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">Goal Health</p>
          <p className="mt-0.5 text-xs text-gray-500">Open goals by progress</p>
          <div className="mt-3 flex flex-col gap-3">
            {openGoals.slice(0, 5).map((g) => (
              <div key={g.id}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium text-gray-700">{g.title}</span>
                  <span className="shrink-0 text-xs font-semibold text-gray-900">{g.progress}%</span>
                </div>
                <ProgressBar value={g.progress} className="mt-1.5" />
              </div>
            ))}
            {openGoals.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">All goals achieved. Nice!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
