"use client";

import * as React from "react";
import {
  Bell,
  Building2,
  CreditCard,
  KeyRound,
  Palette,
  Shield,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsSectionId =
  | "user-profile"
  | "company-profile"
  | "appearance"
  | "team"
  | "billing"
  | "integrations"
  | "notifications"
  | "security";

export type SettingsSection = {
  id: SettingsSectionId;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type SettingsGroup = {
  label: string;
  sections: SettingsSection[];
};

export const settingsGroups: SettingsGroup[] = [
  {
    label: "General",
    sections: [
      {
        id: "user-profile",
        label: "User Profile",
        description: "Your personal information",
        icon: User,
      },
      {
        id: "company-profile",
        label: "Company Profile",
        description: "Company details and branding",
        icon: Building2,
      },
      {
        id: "appearance",
        label: "Appearance",
        description: "Theme and display preferences",
        icon: Palette,
      },
    ],
  },
  {
    label: "Workspace",
    sections: [
      {
        id: "team",
        label: "Team & Members",
        description: "Manage members and roles",
        icon: Users,
      },
      {
        id: "billing",
        label: "Billing & Plans",
        description: "Subscription and payments",
        icon: CreditCard,
      },
      {
        id: "integrations",
        label: "Integrations & API",
        description: "Connected apps and API keys",
        icon: KeyRound,
      },
      {
        id: "notifications",
        label: "Notifications",
        description: "Email and push preferences",
        icon: Bell,
      },
      {
        id: "security",
        label: "Security",
        description: "Password and two-factor auth",
        icon: Shield,
      },
    ],
  },
];

export function SettingsNav({
  active,
  onChange,
}: {
  active: SettingsSectionId;
  onChange: (id: SettingsSectionId) => void;
}) {
  return (
    <nav className="flex flex-col gap-6" aria-label="Settings">
      {settingsGroups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {group.label}
          </p>
          {group.sections.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === active;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onChange(section.id)}
                className={cn(
                  "flex items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium leading-none">
                    {section.label}
                  </span>
                  <span className="text-xs text-muted-foreground leading-snug">
                    {section.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
