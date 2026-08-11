"use client";

import { useMemo, useState } from "react";
import { LogIn, LogOut, Monitor, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSecurityStore } from "@/stores/securityStore";
import { StatCard, formatTime } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function LoginHistoryPage() {
  const loginEvents = useSecurityStore((s) => s.loginEvents);
  const sessions = useSecurityStore((s) => s.sessions);

  const [userFilter, setUserFilter] = useState("all");

  const users = useMemo(
    () => Array.from(new Set(loginEvents.map((e) => e.username))).sort(),
    [loginEvents]
  );

  const events = useMemo(
    () =>
      loginEvents
        .filter((e) => e.status === "success")
        .filter((e) => userFilter === "all" || e.username === userFilter)
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [loginEvents, userFilter]
  );

  const logins = loginEvents.filter(
    (e) => e.type === "login" && e.status === "success"
  ).length;
  const logouts = loginEvents.filter(
    (e) => e.type === "logout" && e.status === "success"
  ).length;
  const activeSessions = sessions.filter((s) => s.status === "active").length;

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Login History</h1>
          <p className="text-sm text-gray-500">
            Successful sign-ins and sign-outs across the workspace.
          </p>
        </div>
        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
        >
          <option value="all">All users</option>
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard
          label="Successful logins"
          value={logins}
          icon={<LogIn className="size-4" />}
        />
        <StatCard
          label="Logouts"
          value={logouts}
          icon={<LogOut className="size-4" />}
          tone="sky"
        />
        <StatCard
          label="Active sessions"
          value={activeSessions}
          icon={<Monitor className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Events (selected)"
          value={events.length}
          icon={<ShieldCheck className="size-4" />}
          tone="violet"
        />
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="overflow-hidden min-h-[300px]">
                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[300px] text-center">
                    <LogIn className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No login events
                    </p>
                    <p className="text-sm text-gray-500">
                      Successful sign-ins will appear here.
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "timestamp",
                          "user",
                          "type",
                          "ip address",
                          "device",
                          "browser",
                          "location",
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
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                            {formatTime(event.timestamp)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {event.username}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                event.type === "login"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-gray-100 text-gray-600"
                              )}
                            >
                              {event.type === "login" ? "Login" : "Logout"}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {event.ip}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {event.device}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {event.browser}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {event.location}
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
