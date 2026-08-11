"use client";

import { useMemo } from "react";
import { ArrowRight, Check, Flag, X } from "lucide-react";
import { toast } from "sonner";
import { useClientReady } from "@/hooks/useClientReady";
import {
  formatDate,
  pageShell,
  PageHeader,
  PriorityPill,
  projectName,
} from "@/helpers/teams-meet/team-ui";
import { CURRENT_MEMBER_ID, TASK_STATUSES, useTeamMeetStore } from "@/stores/teamMeetStore";

export default function WorkMyTasksPage() {
  const tasks = useTeamMeetStore((s) => s.tasks);
  const setTaskStatus = useTeamMeetStore((s) => s.setTaskStatus);

  const myTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.assigneeId === CURRENT_MEMBER_ID)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks]
  );

  const columns = TASK_STATUSES;

  const ready = useClientReady();
  if (!ready) return null;

  const move = (id: string, dir: 1 | -1) => {
    const task = myTasks.find((t) => t.id === id);
    if (!task) return;
    const idx = columns.indexOf(task.status);
    const next = columns[idx + dir];
    if (!next) return;
    setTaskStatus(id, next);
    toast.success(`Moved to "${next}".`);
  };

  return (
    <div className={pageShell}>
      <PageHeader
        title="My Tasks"
        description={`${myTasks.length} tasks assigned to you.`}
      />
      <div className="grid gap-3 p-1.5 xl:grid-cols-4">
        {columns.map((col) => {
          const colTasks = myTasks.filter((t) => t.status === col);
          return (
            <div key={col} className="flex flex-col rounded-[20px] border border-gray-100 bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {col}
                </p>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {colTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {colTasks.length === 0 && (
                  <p className="rounded-xl border border-dashed border-gray-200 px-3 py-5 text-center text-xs text-gray-400">
                    Nothing here.
                  </p>
                )}
                {colTasks.map((t) => (
                  <div key={t.id} className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-gray-800">{t.title}</p>
                      <PriorityPill priority={t.priority} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{projectName(t.projectId)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Flag className="size-3.5" />
                        {formatDate(t.dueDate)}
                      </span>
                      <div className="flex items-center gap-1">
                        {col !== "To Do" && (
                          <button
                            onClick={() => move(t.id, -1)}
                            className="grid size-6 place-items-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title="Move back"
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                        {col !== "Done" && (
                          <button
                            onClick={() => move(t.id, 1)}
                            className="grid size-6 place-items-center rounded-md text-emerald-500 hover:bg-emerald-50"
                            title="Move forward"
                          >
                            {col === "In Review" ? <Check className="size-3.5" /> : <ArrowRight className="size-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
