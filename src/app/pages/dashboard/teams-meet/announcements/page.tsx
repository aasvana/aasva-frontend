"use client";

import { useMemo } from "react";
import { Pin } from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  formatDateTime,
  memberName,
  pageShell,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

const CHANNEL_TONES: Record<string, string> = {
  "All Company": "bg-emerald-50 text-emerald-700",
  Team: "bg-sky-50 text-sky-700",
  Meetings: "bg-violet-50 text-violet-700",
};

export default function AnnouncementsPage() {
  const announcements = useTeamMeetStore((s) => s.announcements);

  const sorted = useMemo(
    () =>
      [...announcements].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [announcements]
  );
  const pinned = sorted.filter((a) => a.pinned === "Yes");
  const rest = sorted.filter((a) => a.pinned !== "Yes");
  const urgent = announcements.filter((a) => a.priority === "Urgent").length;

  const ready = useClientReady();
  if (!ready) return null;

  const renderList = (items: typeof sorted) => (
    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-400">Nothing here yet.</p>
      )}
      {items.map((a) => (
        <div
          key={a.id}
          className={`rounded-[20px] border bg-white p-5 shadow-sm ${
            a.pinned === "Yes" ? "border-emerald-200" : "border-gray-100"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {a.pinned === "Yes" && <Pin className="size-4 text-emerald-600" />}
              <p className="text-sm font-semibold text-gray-800">{a.title}</p>
            </div>
            <StatusBadge status={a.priority} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{a.body}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar id={a.authorId} size="size-7" />
              <div className="text-xs">
                <p className="font-medium text-gray-700">{memberName(a.authorId)}</p>
                <p className="text-gray-400">{formatDateTime(a.publishedAt)}</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                CHANNEL_TONES[a.channel] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {a.channel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={pageShell}>
      <PageHeader
        title="Announcements"
        description="News and updates across the company."
      />

      <div className="grid gap-3 p-1.5 sm:grid-cols-3">
        <StatCard label="Announcements" value={String(announcements.length)} sub="published" />
        <StatCard label="Pinned" value={String(pinned.length)} sub="top of feed" />
        <StatCard label="Urgent" value={String(urgent)} sub="requires attention" />
      </div>

      {pinned.length > 0 && (
        <div className="p-1.5">
          <p className="mb-3 px-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Pinned
          </p>
          {renderList(pinned)}
        </div>
      )}

      <div className="p-1.5">
        <p className="mb-3 px-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Latest
        </p>
        {renderList(rest)}
      </div>
    </div>
  );
}
