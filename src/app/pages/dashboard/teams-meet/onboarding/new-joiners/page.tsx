"use client";

import { useMemo } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import { MasterDataManager, MasterField } from "@/components/cv/master-data-manager";
import { Avatar, formatDate, memberName, planName, StatusBadge } from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

export default function OnboardingNewJoinersPage() {
  const joiners = useTeamMeetStore((s) => s.joiners);
  const departments = useTeamMeetStore((s) => s.departments);
  const plans = useTeamMeetStore((s) => s.plans);
  const members = useTeamMeetStore((s) => s.members);
  const addJoiner = useTeamMeetStore((s) => s.addJoiner);
  const updateJoiner = useTeamMeetStore((s) => s.updateJoiner);
  const deleteJoiner = useTeamMeetStore((s) => s.deleteJoiner);

  const fields: MasterField[] = useMemo(
    () => [
      { name: "name", label: "Full name", required: true, placeholder: "Jane Doe" },
      { name: "title", label: "Job title", placeholder: "Engineer" },
      {
        name: "departmentId",
        label: "Department",
        type: "select",
        options: departments.map((d) => ({ value: d.id, label: d.name })),
      },
      { name: "startDate", label: "Start date", type: "date" },
      {
        name: "planId",
        label: "Onboarding plan",
        type: "select",
        options: plans.map((p) => ({ value: p.id, label: p.title })),
      },
      { name: "stage", label: "Stage", placeholder: "Week 1" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "On Track", label: "On Track" },
          { value: "At Risk", label: "At Risk" },
          { value: "Completed", label: "Completed" },
        ],
      },
      {
        name: "buddyId",
        label: "Buddy",
        type: "select",
        options: members.map((m) => ({ value: m.id, label: m.name })),
      },
      { name: "tasksDone", label: "Tasks done", type: "number", placeholder: "0" },
      { name: "tasksTotal", label: "Tasks total", type: "number", placeholder: "12" },
      { name: "notes", label: "Notes", placeholder: "Anything noteworthy" },
    ],
    [departments, plans, members]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="New Joiners"
      description="Track everyone currently onboarding."
      addLabel="Add New Joiner"
      emptyTitle="No new joiners"
      emptyDescription="Add a new joiner to start their onboarding."
      searchPlaceholder="Search joiners…"
      fields={fields}
      tableHeaders={["Joiner", "Title", "Department", "Start", "Plan", "Buddy", "Progress", "Status"]}
      rowCells={(item) => [
        <div key="j" className="flex items-center gap-3">
          <Avatar name={item.name} size="size-9" />
          <p className="font-medium text-gray-800">{item.name}</p>
        </div>,
        item.title,
        memberName(item.departmentId),
        formatDate(item.startDate),
        planName(item.planId),
        item.buddyId ? memberName(item.buddyId) : "—",
        <div key="p" className="w-24">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{item.stage}</span>
            <span className="font-medium text-gray-800">
              {item.tasksDone}/{item.tasksTotal}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${(Number(item.tasksDone) / Math.max(Number(item.tasksTotal), 1)) * 100}%`,
              }}
            />
          </div>
        </div>,
        <StatusBadge key="s" status={item.status} />,
      ]}
      items={joiners}
      searchText={(item) => `${item.name} ${item.title} ${item.stage}`}
      add={addJoiner}
      update={updateJoiner}
      remove={deleteJoiner}
    />
  );
}
