"use client";

import { useMemo, useState } from "react";
import { PackageOpen, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CURRENT_MEMBER_ID, useTeamMeetStore } from "@/stores/teamMeetStore";

export const pageShell = "flex flex-col gap-4";

export const memberById = (id: string) =>
  useTeamMeetStore.getState().members.find((m) => m.id === id);

export const memberName = (id: string) => memberById(id)?.name ?? id;

export const departmentName = (id: string) =>
  useTeamMeetStore.getState().departments.find((d) => d.id === id)?.name ??
  "—";

export const roleName = (id: string) =>
  useTeamMeetStore.getState().roles.find((r) => r.id === id)?.name ?? "—";

export const projectName = (id: string) =>
  useTeamMeetStore.getState().projects.find((p) => p.id === id)?.name ?? "—";

export const planName = (id: string) =>
  useTeamMeetStore.getState().plans.find((p) => p.id === id)?.title ?? "—";

const AVATAR_TONES = [
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

export function Avatar({
  id,
  name,
  size = "size-9",
  className,
}: {
  id?: string;
  name?: string;
  size?: string;
  className?: string;
}) {
  const member = id ? memberById(id) : undefined;
  const display = name ?? member?.name ?? "?";
  const initials = display
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const key = id ?? display;
  const hash = key.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full text-xs font-semibold",
        size,
        AVATAR_TONES[hash % AVATAR_TONES.length],
        className
      )}
    >
      {initials}
    </span>
  );
}

const STATUS_TONES: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  "On Track": "bg-emerald-50 text-emerald-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Achieved: "bg-emerald-50 text-emerald-700",
  Done: "bg-emerald-50 text-emerald-700",
  Present: "bg-emerald-50 text-emerald-700",
  Available: "bg-emerald-50 text-emerald-700",
  Remote: "bg-sky-50 text-sky-700",
  Scheduled: "bg-sky-50 text-sky-700",
  "In Progress": "bg-sky-50 text-sky-700",
  "In Review": "bg-violet-50 text-violet-700",
  Submitted: "bg-violet-50 text-violet-700",
  WFA: "bg-teal-50 text-teal-700",
  Planning: "bg-gray-100 text-gray-600",
  "Not Started": "bg-gray-100 text-gray-600",
  Draft: "bg-gray-100 text-gray-600",
  Normal: "bg-gray-100 text-gray-600",
  Inactive: "bg-gray-100 text-gray-600",
  "On Hold": "bg-amber-50 text-amber-700",
  Pending: "bg-amber-50 text-amber-700",
  "At Risk": "bg-amber-50 text-amber-700",
  Late: "bg-amber-50 text-amber-700",
  "Half Day": "bg-amber-50 text-amber-700",
  "On Leave": "bg-amber-50 text-amber-700",
  Important: "bg-amber-50 text-amber-700",
  Ongoing: "bg-sky-50 text-sky-700",
  Rejected: "bg-rose-50 text-rose-700",
  Cancelled: "bg-rose-50 text-rose-700",
  Absent: "bg-rose-50 text-rose-700",
  Urgent: "bg-rose-50 text-rose-700",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_TONES[status] ?? "bg-gray-100 text-gray-600",
        className
      )}
    >
      {status}
    </span>
  );
}

const PRIORITY_TONES: Record<string, string> = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-sky-50 text-sky-700",
  High: "bg-amber-50 text-amber-700",
  Urgent: "bg-rose-50 text-rose-700",
};

export function PriorityPill({
  priority,
  className,
}: {
  priority: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        PRIORITY_TONES[priority] ?? "bg-gray-100 text-gray-600",
        className
      )}
    >
      {priority}
    </span>
  );
}

export function ProgressBar({
  value,
  tone,
  className,
}: {
  value: number | string;
  tone?: string;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-100", className)}
    >
      <div
        className={cn("h-full rounded-full", tone ?? "bg-emerald-500")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 p-1.5">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "bg-emerald-50 text-emerald-700",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: string;
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>
        {Icon && (
          <span
            className={cn("grid size-9 shrink-0 place-items-center rounded-xl", tone)}
          >
            <Icon className="size-4" />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
      <PackageOpen className="size-10 text-gray-300" />
      <p className="text-lg font-medium text-gray-800">{title}</p>
      <p className="max-w-sm text-sm text-gray-500">{description}</p>
      {action}
    </div>
  );
}

export function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ChatPanel({
  chatId,
  myId = CURRENT_MEMBER_ID,
  onBack,
}: {
  chatId: string;
  myId?: string;
  onBack?: () => void;
}) {
  const [draft, setDraft] = useState("");
  const chats = useTeamMeetStore((s) => s.chats);
  const messages = useTeamMeetStore((s) => s.messages);
  const sendMessage = useTeamMeetStore((s) => s.sendMessage);

  const chat = chats.find((c) => c.id === chatId);
  const thread = useMemo(
    () =>
      messages
        .filter((m) => m.chatId === chatId)
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    [messages, chatId]
  );

  if (!chat) return null;

  const participants = chat.participants
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const handleSend = () => {
    const body = draft.trim();
    if (!body) return;
    sendMessage(chatId, myId, body);
    setDraft("");
  };

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm font-medium text-gray-500 hover:text-gray-800 lg:hidden"
          >
            Back
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-800">
            {chat.name}
          </p>
          <p className="truncate text-xs text-gray-500">
            {chat.type === "direct"
              ? participants
                  .filter((id) => id !== myId)
                  .map(memberName)
                  .join(", ")
              : `${participants.length} participants`}
          </p>
        </div>
        <div className="flex -space-x-2">
          {participants.slice(0, 4).map((id) => (
            <Avatar key={id} id={id} size="size-7" className="ring-2 ring-white" />
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {thread.length === 0 && (
          <p className="pt-10 text-center text-sm text-gray-400">
            No messages yet. Say hello!
          </p>
        )}
        {thread.map((m) => {
          const mine = m.senderId === myId;
          const sender = memberById(m.senderId);
          return (
            <div key={m.id} className={cn("flex gap-2.5", mine && "flex-row-reverse")}>
              {!mine && <Avatar id={m.senderId} size="size-8" />}
              <div className={cn("max-w-[75%]", mine && "text-right")}>
                <div className={cn("flex items-baseline gap-2", mine && "flex-row-reverse")}>
                  <p className="text-xs font-medium text-gray-500">
                    {mine ? "You" : sender?.name ?? "Unknown"}
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {formatDateTime(m.timestamp)}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-1 inline-block rounded-2xl px-3.5 py-2 text-left text-sm",
                    mine
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {m.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message…"
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
          />
          <Button onClick={handleSend} disabled={!draft.trim()}>
            <Send /> Send
          </Button>
        </div>
      </div>
    </div>
  );
}
