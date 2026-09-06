"use client";

import * as React from "react";
import {
  Bell,
  Building2,
  CreditCard,
  ImageIcon,
  KeyRound,
  Palette,
  ReceiptText,
  ScrollText,
  Shield,
  ShieldCheck,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/AuthStore";

export type SettingsSectionId =
  | "user-profile"
  | "company-profile"
  | "company-branding"
  | "company-tax"
  | "company-registration"
  | "appearance"
  | "team"
  | "billing"
  | "integrations"
  | "notifications"
  | "security"
  | "page-access"
  | "users";

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
        id: "appearance",
        label: "Appearance",
        description: "Theme and display preferences",
        icon: Palette,
      },
    ],
  },
  {
    label: "Company",
    sections: [
      {
        id: "company-profile",
        label: "Company Profile",
        description: "Company details and contact info",
        icon: Building2,
      },
      {
        id: "company-branding",
        label: "Branding & Logo",
        description: "Logo, tagline and branding",
        icon: ImageIcon,
      },
      {
        id: "company-tax",
        label: "Tax & GST",
        description: "GST, PAN and tax details",
        icon: ReceiptText,
      },
      {
        id: "company-registration",
        label: "Registration",
        description: "Registration and legal details",
        icon: ScrollText,
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
  {
    label: "Admin",
    sections: [
      {
        id: "users",
        label: "Users",
        description: "View and manage onboarded users",
        icon: Users,
      },
      {
        id: "page-access",
        label: "Page Access",
        description: "Control which pages users can see",
        icon: ShieldCheck,
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
  const authUser = useAuthStore((state) => state.user);
  const isSystemAdmin = authUser?.roles?.some(
    (r) => r.name === 'systemadmin' || r.name === 'superadmin'
  ) ?? false;

  const groups = React.useMemo(
    () =>
      isSystemAdmin
        ? settingsGroups
        : settingsGroups.filter((group) => group.label !== "Admin"),
    [isSystemAdmin]
  );

  return (
    <nav className="flex flex-col gap-6" aria-label="Settings">
      {groups.map((group) => (
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
                    ? "bg-emerald-50 text-emerald-700"
                    : "hover:bg-emerald-50/60 hover:text-emerald-700"
                )}
              >
                <Icon
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    isActive
                      ? "text-emerald-600"
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
