"use client";

import { useMemo } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import { MasterDataManager, MasterField } from "@/components/cv/master-data-manager";
import { Avatar, departmentName, formatDate, memberName, roleName, StatusBadge } from "@/helpers/teams-meet/team-ui";
import { TEAM_STATUSES, useTeamMeetStore } from "@/stores/teamMeetStore";

export default function TeamMembersPage() {
  const members = useTeamMeetStore((s) => s.members);
  const departments = useTeamMeetStore((s) => s.departments);
  const roles = useTeamMeetStore((s) => s.roles);
  const addMember = useTeamMeetStore((s) => s.addMember);
  const updateMember = useTeamMeetStore((s) => s.updateMember);
  const deleteMember = useTeamMeetStore((s) => s.deleteMember);

  const fields: MasterField[] = useMemo(
    () => [
      { name: "name", label: "Full name", required: true, placeholder: "Jane Doe" },
      { name: "email", label: "Email", placeholder: "jane@xmerge.app" },
      { name: "phone", label: "Phone", placeholder: "+1 555 0100" },
      {
        name: "departmentId",
        label: "Department",
        type: "select",
        options: departments.map((d) => ({ value: d.id, label: d.name })),
      },
      {
        name: "roleId",
        label: "Role",
        type: "select",
        options: roles.map((r) => ({ value: r.id, label: r.name })),
      },
      { name: "title", label: "Job title", placeholder: "Engineer" },
      {
        name: "managerId",
        label: "Manager",
        type: "select",
        options: members.map((m) => ({ value: m.id, label: m.name })),
      },
      { name: "location", label: "Location", placeholder: "San Francisco" },
      { name: "joinedAt", label: "Joined on", type: "date" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: TEAM_STATUSES.map((s) => ({ value: s, label: s })),
      },
      { name: "notes", label: "Notes", placeholder: "Anything noteworthy" },
    ],
    [departments, roles, members]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="All Members"
      description="Manage the people in your workspace."
      addLabel="Add Member"
      emptyTitle="No members yet"
      emptyDescription="Add your first team member to get started."
      searchPlaceholder="Search members…"
      fields={fields}
      tableHeaders={["Member", "Department", "Role", "Title", "Manager", "Joined", "Status"]}
      rowCells={(item) => [
        <div key="m" className="flex items-center gap-3">
          <Avatar id={item.id} size="size-9" />
          <div>
            <p className="font-medium text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-400">{item.email}</p>
          </div>
        </div>,
        departmentName(item.departmentId),
        roleName(item.roleId),
        item.title,
        item.managerId ? memberName(item.managerId) : "—",
        formatDate(item.joinedAt),
        <StatusBadge key="s" status={item.status} />,
      ]}
      items={members}
      searchText={(item) => `${item.name} ${item.email} ${item.title}`}
      add={addMember}
      update={updateMember}
      remove={deleteMember}
    />
  );
}
