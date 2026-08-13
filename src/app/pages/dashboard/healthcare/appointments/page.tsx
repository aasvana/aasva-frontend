"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function AppointmentsPage() {
  return (
    <HealthcarePlaceholder
      title="Appointments"
      description="Schedule, reschedule and track patient appointments."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
