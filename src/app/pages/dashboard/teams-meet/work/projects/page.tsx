"use client";

import { useMemo } from "react";
import { CalendarRange, FolderKanban } from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  formatDate,
  memberName,
  pageShell,
  PageHeader,
  ProgressBar,
  StatusBadge,
} from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

const PROJECT_TONES: Record<string, string> = {
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  teal: "bg-teal-500",
};

export default function WorkProjectsPage() {
  const projects = useTeamMeetStore((s) => s.projects);
  const tasks = useTeamMeetStore((s) => s.tasks);

  const rows = useMemo(
    () =>
      projects.map((p) => ({
        project: p,
        taskCount: tasks.filter((t) => t.projectId === p.id).length,
        doneCount: tasks.filter((t) => t.projectId === p.id && t.status === "Done").length,
      })),
    [projects, tasks]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader
        title="Projects"
        description={`${projects.length} active initiatives.`}
      />
      <div className="grid gap-3 p-1.5 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(({ project: p, taskCount, doneCount }) => (
          <div key={p.id} className="flex flex-col rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl text-white ${
                    PROJECT_TONES[p.color] ?? "bg-gray-400"
                  }`}
                >
                  <FolderKanban className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">{p.name}</p>
                  <p className="font-mono text-[10px] uppercase text-gray-400">{p.code}</p>
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-gray-500">{p.description}</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Progress</span>
                <span className="font-semibold text-gray-800">{p.progress}%</span>
              </div>
              <ProgressBar value={p.progress} className="mt-1.5" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarRange className="size-3.5" />
                {formatDate(p.startDate)} → {formatDate(p.endDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Avatar id={p.leadId} size="size-5" />
                {memberName(p.leadId)}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {doneCount}/{taskCount} tasks done
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
