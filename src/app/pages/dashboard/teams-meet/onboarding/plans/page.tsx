"use client";

import { useMemo } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import { MasterDataManager, MasterField } from "@/components/cv/master-data-manager";
import { Avatar, memberName } from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

export default function OnboardingPlansPage() {
  const plans = useTeamMeetStore((s) => s.plans);
  const members = useTeamMeetStore((s) => s.members);
  const addPlan = useTeamMeetStore((s) => s.addPlan);
  const updatePlan = useTeamMeetStore((s) => s.updatePlan);
  const deletePlan = useTeamMeetStore((s) => s.deletePlan);

  const fields: MasterField[] = useMemo(
    () => [
      { name: "title", label: "Plan title", required: true, placeholder: "Standard Onboarding" },
      {
        name: "ownerId",
        label: "Owner",
        type: "select",
        options: members.map((m) => ({ value: m.id, label: m.name })),
      },
      { name: "defaultDays", label: "Default days", type: "number", placeholder: "30" },
      { name: "description", label: "Description", placeholder: "What this plan covers" },
    ],
    [members]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Onboarding Plans"
      description="Templates that guide new joiners through their first weeks."
      addLabel="Add Plan"
      emptyTitle="No plans yet"
      emptyDescription="Create an onboarding plan template."
      searchPlaceholder="Search plans…"
      fields={fields}
      tableHeaders={["Plan", "Owner", "Default days", "Description"]}
      rowCells={(item) => [
        <div key="n" className="flex items-center gap-3">
          <Avatar name={item.title} size="size-9" />
          <p className="font-medium text-gray-800">{item.title}</p>
        </div>,
        <div key="o" className="flex items-center gap-2">
          <Avatar id={item.ownerId} size="size-6" />
          <span>{memberName(item.ownerId)}</span>
        </div>,
        <span key="d" className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">
          {item.defaultDays} days
        </span>,
        item.description,
      ]}
      items={plans}
      searchText={(item) => `${item.title} ${item.description}`}
      add={addPlan}
      update={updatePlan}
      remove={deletePlan}
    />
  );
}
