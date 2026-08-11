"use client";

import { RequestManager } from "@/components/user-request/request-manager";

export default function SupportPage() {
  return (
    <RequestManager
      category="support"
      description="Customer support tickets and assistance requests."
    />
  );
}
