"use client";

import { useMemo, useState } from "react";
import { Fingerprint, Globe, ShieldAlert, Timer } from "lucide-react";
import { useSecurityStore } from "@/stores/securityStore";
import { StatCard, formatTime } from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function FailedLoginsPage() {
  const loginEvents = useSecurityStore((s) => s.loginEvents);

  const [reasonFilter, setReasonFilter] = useState("all");

  const failed = useMemo(
    () => loginEvents.filter((e) => e.status === "failed"),
    [loginEvents]
  );

  const reasons = useMemo(
    () =>
      Array.from(new Set(failed.map((e) => e.reason ?? "Unknown reason"))).sort(),
    [failed]
  );

  const filtered = useMemo(
    () =>
      failed
        .filter(
          (e) =>
            reasonFilter === "all" ||
            (e.reason ?? "Unknown reason") === reasonFilter
        )
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [failed, reasonFilter]
  );

  const last24h = useMemo(() => {
    const cutoff = Date.now() - 864e5;
    return failed.filter(
      (e) => new Date(e.timestamp).getTime() >= cutoff
    ).length;
  }, [failed]);

  const uniqueIps = new Set(failed.map((e) => e.ip)).size;

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Failed Logins</h1>
          <p className="text-sm text-gray-500">
            Attempts that did not succeed — investigate suspicious activity.
          </p>
        </div>
        <select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
          className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
        >
          <option value="all">All reasons</option>
          {reasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard
          label="Total failed logins"
          value={failed.length}
          icon={<ShieldAlert className="size-4" />}
          tone="red"
        />
        <StatCard
          label="Last 24 hours"
          value={last24h}
          icon={<Timer className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Unique IP addresses"
          value={uniqueIps}
          icon={<Globe className="size-4" />}
          tone="sky"
        />
        <StatCard
          label="Reasons tracked"
          value={reasons.length}
          icon={<Fingerprint className="size-4" />}
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
                    <ShieldAlert className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No failed logins
                    </p>
                    <p className="text-sm text-gray-500">
                      Failed attempts will be listed here.
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "timestamp",
                          "username",
                          "ip address",
                          "location",
                          "reason",
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
                      {filtered.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                            {formatTime(event.timestamp)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {event.username}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {event.ip}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {event.location}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                              {event.reason ?? "Unknown reason"}
                            </span>
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
