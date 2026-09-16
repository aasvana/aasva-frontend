"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import {
  Bell,
  Building2,
  ChartPie,
  CreditCard,
  HeartPulse,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  Map,
  MessageSquare,
  Package,
  RotateCcw,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Stethoscope,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  PAGE_ACCESS_CATEGORIES,
  PAGE_ACCESS_LABELS,
  type PageAccessKey,
} from "@/constants/pages";
import { usePageAccessStore } from "@/stores/pageAccessStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PAGE_ICONS: Partial<Record<PageAccessKey, React.ComponentType<{ className?: string }>>> = {
  "role-onboarding": Users,
  "company-onboarding": Building2,
  dashboard: LayoutDashboard,
  accounting: Building2,
  auditing: ShieldCheck,
  travel: Map,
  delivery: Package,
  healthcare: HeartPulse,
  store: ShoppingCart,
  analytics: ChartPie,
  customers: Users,
  "user-requests": MessageSquare,
  "help-center": LifeBuoy,
  "teams-meet": Stethoscope,
  settings: Settings2,
  notifications: Bell,
  search: Lock,
};

function Switch({
  checked,
  disabled,
  onCheckedChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "block size-4 rounded-full bg-background shadow-sm transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function PageAccessSection() {
  const access = usePageAccessStore((state) => state.access);
  const setAccess = usePageAccessStore((state) => state.setAccess);
  const resetAccess = usePageAccessStore((state) => state.resetAccess);
  const [dirty, setDirty] = useState(false);

  const enabledCount = useMemo(
    () => Object.values(access).filter(Boolean).length,
    [access]
  );
  const totalCount = Object.keys(access).length;

  const handleToggle = (key: PageAccessKey, enabled: boolean) => {
    setAccess(key, enabled);
    setDirty(true);
  };

  const handleReset = () => {
    resetAccess();
    setDirty(false);
    toast.success("Page access reset to defaults");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Access</CardTitle>
        <CardDescription>
          Control which pages users can see across the app. Disabled pages are
          hidden from navigation and blocked from direct access.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span className="font-medium">{enabledCount} of {totalCount} pages enabled.</span>{" "}
          The Dashboard is always available.
        </div>

        {PAGE_ACCESS_CATEGORIES.map((category) => (
          <div key={category.label} className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {category.label}
            </p>
            <div className="flex flex-col divide-y rounded-xl border">
              {category.keys.map((key) => {
                const meta = PAGE_ACCESS_LABELS[key];
                const Icon = PAGE_ICONS[key];
                const alwaysOn = key === "dashboard";
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      {Icon && (
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Icon className="size-4 text-muted-foreground" />
                        </span>
                      )}
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-2 text-sm font-medium leading-none">
                          {meta.label}
                          {alwaysOn && (
                            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700">
                              Always on
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground leading-snug">
                          {meta.description}
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={access[key]}
                      disabled={alwaysOn}
                      onCheckedChange={(value) => handleToggle(key, value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-amber-800">
              Super Admin only
            </p>
            <p className="text-xs text-amber-700">
              Only visible to super admins. Changes apply instantly to every user.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {dirty && (
              <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="size-4" />
                Reset defaults
              </Button>
            )}
            <Button type="button" size="sm" onClick={() => { setDirty(false); toast.success("Page access updated successfully!"); }}>
              <CreditCard className="size-4" />
              Save changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
