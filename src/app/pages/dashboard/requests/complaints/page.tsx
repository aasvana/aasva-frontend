"use client";

import { RequestManager } from "@/components/user-request/request-manager";

export default function ComplaintsPage() {
  return (
    <RequestManager
      category="complaint"
      description="Escalations and billing concerns from customers."
    />
  );
}
