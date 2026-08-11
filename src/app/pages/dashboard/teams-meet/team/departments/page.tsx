"use client";

import { useMemo } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import { MasterDataManager, MasterField } from "@/components/cv/master-data-manager";
import { Avatar, memberName } from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

export default function TeamDepartmentsPage() {
  const departments = useTeamMeetStore((s) => s.departments);
  const members = useTeamMeetStore((s) => s.members);
  const addDepartment = useTeamMeetStore((s) => s.addDepartment);
  const updateDepartment = useTeamMeetStore((s) => s.updateDepartment);
  const deleteDepartment = useTeamMeetStore((s) => s.deleteDepartment);

  const fields: MasterField[] = useMemo(
    () => [
      { name: "name", label: "Department name", required: true, placeholder: "Engineering" },
      { name: "code", label: "Code", placeholder: "ENG" },
      {
        name: "managerId",
        label: "Manager",
        type: "select",
        options: members.map((m) => ({ value: m.id, label: m.name })),
      },
      { name: "description", label: "Description", placeholder: "What this team owns" },
    ],
    [members]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Departments"
      description="Organize people into departments."
      addLabel="Add Department"
      emptyTitle="No departments yet"
      emptyDescription="Create your first department to organize the team."
      searchPlaceholder="Search departments…"
      fields={fields}
      tableHeaders={["Department", "Code", "Manager", "Description"]}
      rowCells={(item) => [
        <div key="n" className="flex items-center gap-3">
          <Avatar name={item.name} size="size-9" />
          <p className="font-medium text-gray-800">{item.name}</p>
        </div>,
        <span key="c" className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">
          {item.code}
        </span>,
        <div key="m" className="flex items-center gap-2">
          <Avatar id={item.managerId} size="size-6" />
          <span>{item.managerId ? memberName(item.managerId) : "—"}</span>
        </div>,
        item.description,
      ]}
      items={departments}
      searchText={(item) => `${item.name} ${item.code}`}
      add={addDepartment}
      update={updateDepartment}
      remove={deleteDepartment}
    />
  );
}
