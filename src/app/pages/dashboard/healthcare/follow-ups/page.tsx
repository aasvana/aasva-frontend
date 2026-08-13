"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function FollowUpsPage() {
  return (
    <HealthcarePlaceholder
      title="Follow-ups"
      description="Scheduled patient follow-ups and reminders."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
