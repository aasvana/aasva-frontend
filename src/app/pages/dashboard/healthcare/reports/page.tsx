"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function ReportsPage() {
  return (
    <HealthcarePlaceholder
      title="Reports"
      description="Clinical, billing and operational analytics."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
