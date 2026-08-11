"use client";

import { useMemo, useState } from "react";
import { Ban, Monitor, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSecurityStore } from "@/stores/securityStore";
import { StatCard, formatTime } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  expired: "bg-gray-100 text-gray-600",
  revoked: "bg-red-50 text-red-700",
};

export default function SessionHistoryPage() {
  const sessions = useSecurityStore((s) => s.sessions);
  const revokeSession = useSecurityStore((s) => s.revokeSession);
  const updateSession = useSecurityStore((s) => s.updateSession);

  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () =>
      sessions
        .filter((s) => statusFilter === "all" || s.status === statusFilter)
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    [sessions, statusFilter]
  );

  const active = sessions.filter((s) => s.status === "active").length;
  const expired = sessions.filter((s) => s.status === "expired").length;
  const revoked = sessions.filter((s) => s.status === "revoked").length;

  const ready = useClientReady();
  if (!ready) return null;

  const expire = (id: string) => {
    updateSession(id, { status: "expired" });
    toast.success("Session marked as expired.");
  };

  const revoke = (id: string) => {
    if (!window.confirm("Revoke this session?")) return;
    revokeSession(id);
    toast.success("Session revoked.");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Session History
          </h1>
          <p className="text-sm text-gray-500">
            Devices signed into the workspace and their session state.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="revoked">Revoked</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard
          label="Active sessions"
          value={active}
          icon={<Monitor className="size-4" />}
        />
        <StatCard
          label="Expired"
          value={expired}
          icon={<Monitor className="size-4" />}
          tone="sky"
        />
        <StatCard
          label="Revoked"
          value={revoked}
          icon={<Ban className="size-4" />}
          tone="red"
        />
        <StatCard
          label="Total sessions"
          value={sessions.length}
          icon={<ShieldCheck className="size-4" />}
          tone="violet"
        />
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="overflow-hidden min-h-[300px]">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[300px] text-center">
                    <Monitor className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No sessions found
                    </p>
                    <p className="text-sm text-gray-500">
                      Sessions will appear here once users sign in.
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "user",
                          "device",
                          "browser",
                          "ip address",
                          "location",
                          "started",
                          "last active",
                          "status",
                          "action",
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
                      {filtered.map((session) => (
                        <tr key={session.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {session.username}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {session.device}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {session.browser}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {session.ip}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {session.location}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {formatTime(session.startedAt)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {formatTime(session.lastActive)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                                STATUS_STYLES[session.status] ?? "bg-gray-100 text-gray-600"
                              )}
                            >
                              {session.status}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            {session.status === "active" ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => expire(session.id)}
                                >
                                  Expire
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => revoke(session.id)}
                                >
                                  Revoke
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
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
