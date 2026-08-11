"use client";

import { RequestManager } from "@/components/user-request/request-manager";

export default function AnnouncementsPage() {
  return (
    <RequestManager
      category="announcement"
      description="Product news and updates shared with users."
    />
  );
}
