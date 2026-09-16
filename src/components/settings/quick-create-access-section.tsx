"use client";

import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { ROLE_LABELS, ALL_ROLES, type UserRole } from "@/constants/roles";
import {
  QUICK_CREATE_ACTIONS,
  useQuickCreateAccessStore,
  type QuickCreateAction,
} from "@/stores/quickCreateAccessStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function Switch({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span className={`block size-4 rounded-full bg-background shadow-sm transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0.5"}`} />
    </button>
  );
}

export function QuickCreateAccessSection() {
  const access = useQuickCreateAccessStore((state) => state.access);
  const setAccess = useQuickCreateAccessStore((state) => state.setAccess);
  const resetAccess = useQuickCreateAccessStore((state) => state.resetAccess);

  const handleChange = (role: UserRole, action: QuickCreateAction, enabled: boolean) => {
    setAccess(role, action, enabled);
    toast.success("Quick Create access updated.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Create Access</CardTitle>
        <CardDescription>Choose which roles can see each Quick Create action.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                {QUICK_CREATE_ACTIONS.map((action) => (
                  <th key={action.id} className="px-4 py-3 text-center font-medium">{action.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_ROLES.filter((role) => role !== "systemadmin").map((role) => (
                <tr key={role} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{ROLE_LABELS[role]}</td>
                  {QUICK_CREATE_ACTIONS.map((action) => (
                    <td key={action.id} className="px-4 py-3 text-center">
                      <Switch
                        checked={access[role]?.[action.id] ?? false}
                        onChange={(enabled) => handleChange(role, action.id, enabled)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="outline" className="w-fit" onClick={() => { resetAccess(); toast.success("Quick Create access reset."); }}>
          <RotateCcw className="size-4" /> Reset defaults
        </Button>
      </CardContent>
    </Card>
  );
}
