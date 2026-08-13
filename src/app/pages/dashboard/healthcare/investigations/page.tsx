"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function InvestigationsPage() {
  return (
    <HealthcarePlaceholder
      title="Investigations"
      description="Lab tests, imaging and diagnostic investigations."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
