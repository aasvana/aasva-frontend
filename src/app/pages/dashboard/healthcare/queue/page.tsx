"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function QueuePage() {
  return (
    <HealthcarePlaceholder
      title="Queue"
      description="Live patient queue with priorities and wait times."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
