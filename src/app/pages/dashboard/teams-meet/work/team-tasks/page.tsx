"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  formatDate,
  memberName,
  pageShell,
  PageHeader,
  PriorityPill,
  projectName,
} from "@/helpers/teams-meet/team-ui";
import { TASK_STATUSES, useTeamMeetStore } from "@/stores/teamMeetStore";

export default function WorkTeamTasksPage() {
  const tasks = useTeamMeetStore((s) => s.tasks);
  const setTaskStatus = useTeamMeetStore((s) => s.setTaskStatus);

  const sorted = useMemo(
    () => [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Team Tasks"
        description={`${tasks.length} tasks across the whole team.`}
      />
      <div className="p-1.5">
        <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  {["Task", "Assignee", "Project", "Priority", "Due", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/60">
                    <td className="max-w-[280px] px-6 py-3">
                      <p className="truncate font-medium text-gray-800">{t.title}</p>
                      <p className="truncate text-xs text-gray-400">{t.notes}</p>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2">
                        <Avatar id={t.assigneeId} size="size-6" />
                        {memberName(t.assigneeId)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{projectName(t.projectId)}</td>
                    <td className="px-6 py-3">
                      <PriorityPill priority={t.priority} />
                    </td>
                    <td className="px-6 py-3 text-gray-600">{formatDate(t.dueDate)}</td>
                    <td className="px-6 py-3">
                      <select
                        value={t.status}
                        onChange={(e) => {
                          setTaskStatus(t.id, e.target.value as (typeof TASK_STATUSES)[number]);
                          toast.success("Status updated.");
                        }}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none focus:border-emerald-400"
                      >
                        {TASK_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                      No tasks yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
