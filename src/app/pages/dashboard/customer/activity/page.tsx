"use client";

import { useMemo } from "react";
import { Activity } from "lucide-react";
import {
  CustomerPageHeader,
  ProfileCard,
  EmptyState,
  actionBadge,
  formatTime,
  useSelectedCustomer,
} from "@/components/customer/customer-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerActivityPage() {
  const { customer, profile } = useSelectedCustomer();

  const events = useMemo(
    () =>
      [...profile.activity].sort((a, b) =>
        b.timestamp.localeCompare(a.timestamp)
      ),
    [profile]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <CustomerPageHeader
        title="Activity"
        description={`Timeline for ${customer?.name ?? "this customer"}.`}
      />
      <div className="p-1.5">
        <ProfileCard title="Activity Timeline">
          {events.length === 0 ? (
            <EmptyState
              icon={<Activity className="size-10 text-gray-300" />}
              title="No activity yet"
              description="Actions on this customer will appear here."
            />
          ) : (
            <div className="relative space-y-0">
              {events.map((event, idx) => (
                <div key={event.id} className="relative flex gap-3 pb-6">
                  {idx !== events.length - 1 && (
                    <div className="absolute left-3 top-8 h-full w-px bg-gray-100" />
                  )}
                  <div className="relative z-10 mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-gray-100 bg-gray-50">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {actionBadge(event.action)}
                        <span className="text-xs text-gray-400">
                          {formatTime(event.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ProfileCard>
      </div>
    </div>
  );
}
