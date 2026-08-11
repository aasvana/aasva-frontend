"use client";

import { RequestManager } from "@/components/user-request/request-manager";

export default function AllRequestsPage() {
  return (
    <RequestManager
      category="all"
      showCategory
      description="Every request, ticket, feedback and announcement."
    />
  );
}
