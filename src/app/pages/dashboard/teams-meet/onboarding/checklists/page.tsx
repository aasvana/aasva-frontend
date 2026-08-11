"use client";

import { useMemo } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import { MasterDataManager, MasterField } from "@/components/cv/master-data-manager";
import { Avatar, planName } from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

export default function OnboardingChecklistsPage() {
  const checklists = useTeamMeetStore((s) => s.checklists);
  const plans = useTeamMeetStore((s) => s.plans);
  const addChecklist = useTeamMeetStore((s) => s.addChecklist);
  const updateChecklist = useTeamMeetStore((s) => s.updateChecklist);
  const deleteChecklist = useTeamMeetStore((s) => s.deleteChecklist);

  const fields: MasterField[] = useMemo(
    () => [
      { name: "title", label: "Checklist title", required: true, placeholder: "Week 1 — Foundations" },
      {
        name: "planId",
        label: "Plan",
        type: "select",
        options: plans.map((p) => ({ value: p.id, label: p.title })),
      },
      { name: "items", label: "Items", placeholder: "Comma-separated items" },
    ],
    [plans]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Checklists"
      description="Reusable checklists attached to onboarding plans."
      addLabel="Add Checklist"
      emptyTitle="No checklists yet"
      emptyDescription="Create a checklist for one of your plans."
      searchPlaceholder="Search checklists…"
      fields={fields}
      tableHeaders={["Checklist", "Plan", "Items"]}
      rowCells={(item) => [
        <div key="n" className="flex items-center gap-3">
          <Avatar name={item.title} size="size-9" />
          <p className="font-medium text-gray-800">{item.title}</p>
        </div>,
        planName(item.planId),
        <span key="i" className="text-gray-600">
          {item.items
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .join(" · ")}
        </span>,
      ]}
      items={checklists}
      searchText={(item) => `${item.title} ${item.items}`}
      add={addChecklist}
      update={updateChecklist}
      remove={deleteChecklist}
    />
  );
}
