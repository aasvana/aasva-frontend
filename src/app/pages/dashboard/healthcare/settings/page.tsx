"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function SettingsPage() {
  return (
    <HealthcarePlaceholder
      title="Settings"
      description="Department, room and healthcare preferences."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
