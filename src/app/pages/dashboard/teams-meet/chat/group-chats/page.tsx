"use client";

import { useClientReady } from "@/hooks/useClientReady";
import { ChatWorkspace } from "@/components/teams-meet/chat-workspace";

export default function ChatGroupChatsPage() {
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <ChatWorkspace
      title="Group Chats"
      description="Small team conversations that keep everyone in the loop."
      type="group"
    />
  );
}
