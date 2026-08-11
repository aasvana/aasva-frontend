"use client";

import { RequestManager } from "@/components/user-request/request-manager";

export default function FeatureRequestsPage() {
  return (
    <RequestManager
      category="feature"
      description="New capabilities users are asking for."
    />
  );
}
