"use client";

import { RequestManager } from "@/components/user-request/request-manager";

export default function BugReportsPage() {
  return (
    <RequestManager
      category="bug"
      description="Reported defects and issues to fix."
    />
  );
}
