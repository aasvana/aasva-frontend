"use client";

import { RequestManager } from "@/components/user-request/request-manager";

export default function FeedbackPage() {
  return (
    <RequestManager
      category="feedback"
      description="User opinions, praise and suggestions."
    />
  );
}
