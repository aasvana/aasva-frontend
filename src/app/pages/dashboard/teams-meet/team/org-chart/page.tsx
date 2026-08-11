"use client";

import { useMemo } from "react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  departmentName,
  pageShell,
  PageHeader,
  roleName,
  StatusBadge,
} from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

type Node = {
  memberId: string;
  children: Node[];
};

export default function TeamOrgChartPage() {
  const members = useTeamMeetStore((s) => s.members);

  const tree = useMemo(() => {
    const byManager = new Map<string, string[]>();
    for (const m of members) {
      const key = m.managerId || "root";
      const list = byManager.get(key) ?? [];
      list.push(m.id);
      byManager.set(key, list);
    }
    const build = (id: string): Node => ({
      memberId: id,
      children: (byManager.get(id) ?? []).map(build),
    });
    return (byManager.get("root") ?? []).map(build);
  }, [members]);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Organization Chart"
        description="How the team reports up."
      />
      <div className="p-1.5">
        <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
          {tree.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">
              No leadership structure yet.
            </p>
          ) : (
            <div className="flex justify-center">
              <OrgNode memberId={tree[0].memberId} childrenNodes={tree[0].children} isRoot />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrgNode({
  memberId,
  childrenNodes,
  isRoot,
}: {
  memberId: string;
  childrenNodes: Node[];
  isRoot?: boolean;
}) {
  const member = useTeamMeetStore
    .getState()
    .members.find((m) => m.id === memberId);
  if (!member) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div
          className={`flex w-44 flex-col items-center gap-2 rounded-2xl border p-3 text-center ${
            isRoot
              ? "border-emerald-200 bg-emerald-50"
              : "border-gray-100 bg-white shadow-sm"
          }`}
        >
          <Avatar id={member.id} size="size-11" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">{member.name}</p>
            <p className="truncate text-xs text-gray-500">{member.title}</p>
            <p className="mt-0.5 truncate text-[10px] text-gray-400">
              {departmentName(member.departmentId)} · {roleName(member.roleId)}
            </p>
          </div>
          <StatusBadge status={member.status} />
        </div>
      </div>
      {childrenNodes.length > 0 && (
        <>
          <div className="h-4 w-px bg-gray-200" />
          <div className="w-px flex-1 bg-gray-200" />
          <div className="relative w-full">
            <div className="absolute left-4 right-4 top-0 h-px bg-gray-200" />
            <div className="flex flex-wrap items-start justify-center gap-6 pt-0">
              {childrenNodes.map((child) => (
                <div key={child.memberId} className="flex flex-col items-center">
                  <div className="h-4 w-px bg-gray-200" />
                  <OrgNode memberId={child.memberId} childrenNodes={child.children} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
