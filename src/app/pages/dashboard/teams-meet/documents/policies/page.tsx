"use client";

import { useClientReady } from "@/hooks/useClientReady";
import { DocumentTable } from "@/components/teams-meet/document-table";

export default function DocumentsPoliciesPage() {
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <DocumentTable
      title="Policies"
      description="Company policies everyone should know."
      category="Policy"
    />
  );
}
