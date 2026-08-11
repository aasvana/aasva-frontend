"use client";

import { useClientReady } from "@/hooks/useClientReady";
import { ChatWorkspace } from "@/components/teams-meet/chat-workspace";

export default function ChatChannelsPage() {
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <ChatWorkspace
      title="Channels"
      description="Broadcast conversations for the whole workspace."
      type="channel"
    />
  );
}
