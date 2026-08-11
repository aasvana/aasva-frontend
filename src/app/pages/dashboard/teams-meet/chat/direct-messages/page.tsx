"use client";

import { useClientReady } from "@/hooks/useClientReady";
import { ChatWorkspace } from "@/components/teams-meet/chat-workspace";

export default function ChatDirectMessagesPage() {
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <ChatWorkspace
      title="Direct Messages"
      description="One-on-one conversations with your team."
      type="direct"
    />
  );
}
