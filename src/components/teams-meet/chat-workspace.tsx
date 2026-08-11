"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, ChatPanel, formatDateTime, memberName, pageShell, PageHeader } from "@/helpers/teams-meet/team-ui";
import { CURRENT_MEMBER_ID, useTeamMeetStore } from "@/stores/teamMeetStore";

export function ChatWorkspace({
  title,
  description,
  type,
}: {
  title: string;
  description: string;
  type: "direct" | "group" | "channel";
}) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const chats = useTeamMeetStore((s) => s.chats);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const typed = chats.filter((c) => c.type === type);
    if (!q) return typed;
    return typed.filter((c) => {
      const names = c.participants
        .split(",")
        .map((id) => memberName(id.trim()))
        .join(" ");
      return `${c.name} ${names} ${c.lastMessage}`.toLowerCase().includes(q);
    });
  }, [chats, query, type]);

  const selected = activeId ?? filtered[0]?.id ?? null;

  return (
    <div className={pageShell}>
      <PageHeader title={title} description={description} />
      <div className="grid gap-3 p-1.5 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute inset-y-0 start-3 size-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations…"
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <MessageCircle className="size-8 text-gray-300" />
                <p className="text-sm text-gray-400">No conversations found.</p>
              </div>
            )}
            {filtered.map((chat) => {
              const participantNames =
                chat.type === "direct"
                  ? chat.participants
                      .split(",")
                      .map((id) => memberName(id.trim()))
                      .filter((n) => n !== memberName(CURRENT_MEMBER_ID))
                      .join(", ")
                  : `${chat.participants.split(",").length} participants`;
              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveId(chat.id)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                    chat.id === selected
                      ? "bg-emerald-50/60"
                      : "hover:bg-gray-50"
                  )}
                >
                  {chat.type === "channel" ? (
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-600">
                      <span className="text-sm">#</span>
                    </span>
                  ) : (
                    <Avatar
                      name={chat.name}
                      id={chat.type === "direct" ? chat.id.split("_").slice(-1)[0] : undefined}
                      size="size-10"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {chat.name}
                      </p>
                      <span className="shrink-0 text-[10px] text-gray-400">
                        {formatDateTime(chat.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-gray-500">{participantNames}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-600 text-[10px] font-semibold text-white">
                      {chat.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="min-w-0">
          {selected ? (
            <ChatPanel chatId={selected} />
          ) : (
            <div className="grid h-[600px] place-items-center rounded-[20px] border border-gray-100 bg-white shadow-sm">
              <p className="text-sm text-gray-400">Select a conversation to view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
