"use client";

import { useMemo, useState } from "react";
import { UserCheck, Users } from "lucide-react";
import { useAuditLogStore } from "@/stores/auditStore";
import {
  StatCard,
  actionBadge,
  formatTime,
  moduleBadge,
  severityBadge,
} from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

type ActorSummary = {
  actor: string;
  total: number;
  actions: string[];
  modules: string[];
  lastActive: string;
};

export default function UserActivityPage() {
  const entries = useAuditLogStore((s) => s.entries);

  const [actorFilter, setActorFilter] = useState("all");

  const actors = useMemo<ActorSummary[]>(() => {
    const byActor = new Map<string, AuditActorGroup>();
    for (const entry of entries) {
      const group = byActor.get(entry.actor) ?? {
        actor: entry.actor,
        total: 0,
        actions: new Set<string>(),
        modules: new Set<string>(),
        lastActive: "",
      };
      group.total += 1;
      group.actions.add(entry.action);
      group.modules.add(entry.module);
      if (!group.lastActive || entry.timestamp > group.lastActive) {
        group.lastActive = entry.timestamp;
      }
      byActor.set(entry.actor, group);
    }
    return Array.from(byActor.values())
      .map((group) => ({
        actor: group.actor,
        total: group.total,
        actions: Array.from(group.actions),
        modules: Array.from(group.modules),
        lastActive: group.lastActive,
      }))
      .sort((a, b) => b.total - a.total);
  }, [entries]);

  const filtered = useMemo(() => {
    if (actorFilter === "all") return entries;
    return entries.filter((entry) => entry.actor === actorFilter);
  }, [entries, actorFilter]);

  const topActor = actors[0];
  const totalUsers = actors.length;

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            User Activity
          </h1>
          <p className="text-sm text-gray-500">
            What each user has done across the workspace.
          </p>
        </div>
        <select
          value={actorFilter}
          onChange={(e) => setActorFilter(e.target.value)}
          className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
        >
          <option value="all">All users</option>
          {actors.map((actor) => (
            <option key={actor.actor} value={actor.actor}>
              {actor.actor}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard
          label="Active users"
          value={totalUsers}
          icon={<Users className="size-4" />}
        />
        <StatCard
          label="Most active"
          value={topActor ? topActor.actor : "—"}
          icon={<UserCheck className="size-4" />}
        />
        <StatCard
          label="Events (selected)"
          value={filtered.length}
          icon={<UserCheck className="size-4" />}
          tone="sky"
        />
        <StatCard
          label="Distinct actions"
          value={
            new Set(filtered.map((entry) => entry.action)).size
          }
          icon={<UserCheck className="size-4" />}
          tone="violet"
        />
      </div>

      {actors.length > 0 && (
        <div className="flex gap-3 p-1.5">
          {actors.map((actor) => (
            <button
              key={actor.actor}
              type="button"
              onClick={() => setActorFilter(actor.actor)}
              className={`flex min-w-[160px] flex-col gap-1 rounded-[20px] border bg-white p-4 text-left shadow-sm transition-colors ${
                actorFilter === actor.actor
                  ? "border-emerald-300 bg-emerald-50/40"
                  : "border-gray-100 hover:border-emerald-200"
              }`}
            >
              <p className="text-sm font-semibold text-gray-800">
                {actor.actor}
              </p>
              <p className="text-xs text-gray-500">
                {actor.total} events · {actor.modules.length} modules
              </p>
              <p className="text-xs text-gray-400">
                Last active {formatTime(actor.lastActive)}
              </p>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="overflow-hidden min-h-[300px]">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[300px] text-center">
                    <UserCheck className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No activity for this user
                    </p>
                    <p className="text-sm text-gray-500">
                      Pick another user to see their events.
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "timestamp",
                          "action",
                          "module",
                          "entity / reference",
                          "details",
                          "severity",
                        ].map((header, idx) => (
                          <th
                            key={idx}
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {filtered.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                            {formatTime(entry.timestamp)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            {actionBadge(entry.action)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            {moduleBadge(entry.module)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <span className="font-medium text-gray-800 dark:text-neutral-200">
                              {entry.entity}
                            </span>
                            <span className="text-gray-400"> · </span>
                            <span className="text-gray-600 dark:text-neutral-300">
                              {entry.ref}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 min-w-[220px] text-sm text-gray-600 dark:text-neutral-300">
                            {entry.details}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            {severityBadge(entry.severity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type AuditActorGroup = {
  actor: string;
  total: number;
  actions: Set<string>;
  modules: Set<string>;
  lastActive: string;
};
