"use client";

import { useMemo } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import { MasterDataManager, MasterField } from "@/components/cv/master-data-manager";
import { Avatar } from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

export default function TeamRolesPage() {
  const roles = useTeamMeetStore((s) => s.roles);
  const addRole = useTeamMeetStore((s) => s.addRole);
  const updateRole = useTeamMeetStore((s) => s.updateRole);
  const deleteRole = useTeamMeetStore((s) => s.deleteRole);

  const fields: MasterField[] = useMemo(
    () => [
      { name: "name", label: "Role name", required: true, placeholder: "Manager" },
      { name: "level", label: "Level", placeholder: "L3" },
      { name: "description", label: "Description", placeholder: "What this role does" },
      { name: "permissions", label: "Permissions", placeholder: "Team management, approvals" },
    ],
    []
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Roles & Permissions"
      description="Define what each role can do."
      addLabel="Add Role"
      emptyTitle="No roles yet"
      emptyDescription="Create your first role to control access."
      searchPlaceholder="Search roles…"
      fields={fields}
      tableHeaders={["Role", "Level", "Description", "Permissions"]}
      rowCells={(item) => [
        <div key="n" className="flex items-center gap-3">
          <Avatar name={item.name} size="size-9" />
          <p className="font-medium text-gray-800">{item.name}</p>
        </div>,
        <span key="l" className="rounded-md bg-violet-50 px-2 py-0.5 font-mono text-xs font-medium text-violet-700">
          {item.level}
        </span>,
        item.description,
        item.permissions,
      ]}
      items={roles}
      searchText={(item) => `${item.name} ${item.description}`}
      add={addRole}
      update={updateRole}
      remove={deleteRole}
    />
  );
}
