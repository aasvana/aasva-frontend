"use client";

import { useState } from "react";
import { SettingsIcon } from "lucide-react";
import {
  SettingsNav,
  SettingsSectionId,
} from "@/components/settings/settings-nav";
import {
  AppearanceSection,
  BillingSection,
  BrandingSection,
  CompanyProfileSection,
  IntegrationsSection,
  NotificationsSection,
  RegistrationSection,
  SecuritySection,
  TaxGstSection,
  TeamSection,
  UserProfileSection,
  UsersSection,
} from "@/components/settings/settings-sections";
import { PageAccessSection } from "@/components/settings/page-access-section";

const sectionContent = (id: SettingsSectionId) => {
  switch (id) {
    case "user-profile":
      return <UserProfileSection />;
    case "company-profile":
      return <CompanyProfileSection />;
    case "company-branding":
      return <BrandingSection />;
    case "company-tax":
      return <TaxGstSection />;
    case "company-registration":
      return <RegistrationSection />;
    case "appearance":
      return <AppearanceSection />;
    case "team":
      return <TeamSection />;
    case "billing":
      return <BillingSection />;
    case "integrations":
      return <IntegrationsSection />;
    case "notifications":
      return <NotificationsSection />;
  case "security":
    return <SecuritySection />;
  case "users":
    return <UsersSection />;
  case "page-access":
    return <PageAccessSection />;
    default:
      return null;
  }
};

export default function Settings() {
  const [active, setActive] = useState<SettingsSectionId>("user-profile");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <SettingsIcon className="size-6" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, company and workspace preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start px-2">
        <aside className="w-full shrink-0 lg:w-72">
          <div className="rounded-[20px] border border-gray-100 p-3 shadow-sm">
            <SettingsNav active={active} onChange={setActive} />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          {sectionContent(active)}
        </section>
      </div>
    </div>
  );
}
