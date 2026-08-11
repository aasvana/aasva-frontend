"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, PackageCheck, BellRing, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DeliverySettings,
  useDeliveryStore,
} from "@/stores/deliveryStore";
import { logDeliveryAction } from "@/components/delivery/delivery-ui";
import { useClientReady } from "@/hooks/useClientReady";

const YES_NO = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const DISPATCH_MODES = [
  { value: "Manual", label: "Manual" },
  { value: "Auto-assign", label: "Auto-assign" },
];

function SettingField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </div>
  );
}

const inputClasses =
  "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]";

function SettingCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function DeliverySettingsPage() {
  const settings = useDeliveryStore((s) => s.settings);
  const partners = useDeliveryStore((s) => s.partners);
  const updateSettings = useDeliveryStore((s) => s.updateSettings);

  const [form, setForm] = useState<DeliverySettings>(settings);

  const partnerOptions = useMemo(
    () => partners.filter((p) => p.isActive === "Yes").map((p) => p.name),
    [partners]
  );

  const ready = useClientReady();
  if (!ready) return null;

  const setValue = (name: keyof DeliverySettings, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSave = () => {
    updateSettings(form);
    logDeliveryAction(
      "updated",
      "Delivery Settings",
      form.companyName,
      "Delivery settings updated."
    );
    toast.success("Delivery settings saved.");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Delivery Settings</h1>
        <p className="text-sm text-gray-500">
          Configure dispatch, tracking and notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5 lg:grid-cols-2">
        <SettingCard
          title="Company & Support"
          subtitle="Details shown on dispatch and delivery notes."
          icon={<Building2 className="size-4" />}
        >
          <div className="grid gap-4">
            <SettingField label="Company Name">
              <input
                className={inputClasses}
                value={form.companyName}
                onChange={(e) => setValue("companyName", e.target.value)}
              />
            </SettingField>
            <SettingField label="Address">
              <input
                className={inputClasses}
                value={form.address}
                onChange={(e) => setValue("address", e.target.value)}
              />
            </SettingField>
            <div className="grid gap-4 sm:grid-cols-2">
              <SettingField label="Support Phone">
                <input
                  className={inputClasses}
                  value={form.supportPhone}
                  onChange={(e) => setValue("supportPhone", e.target.value)}
                />
              </SettingField>
              <SettingField label="Support Email">
                <input
                  className={inputClasses}
                  value={form.supportEmail}
                  onChange={(e) => setValue("supportEmail", e.target.value)}
                />
              </SettingField>
            </div>
          </div>
        </SettingCard>

        <SettingCard
          title="Dispatch"
          subtitle="How deliveries are assigned to partners."
          icon={<Send className="size-4" />}
        >
          <div className="grid gap-4">
            <SettingField label="Dispatch Mode">
              <select
                className={inputClasses}
                value={form.dispatchMode}
                onChange={(e) => setValue("dispatchMode", e.target.value)}
              >
                {DISPATCH_MODES.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </SettingField>
            <SettingField label="Default Partner">
              <select
                className={inputClasses}
                value={form.defaultPartnerName}
                onChange={(e) => setValue("defaultPartnerName", e.target.value)}
              >
                <option value="">No default</option>
                {partnerOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </SettingField>
            <SettingField label="Working Hours">
              <input
                className={inputClasses}
                value={form.workingHours}
                onChange={(e) => setValue("workingHours", e.target.value)}
              />
            </SettingField>
          </div>
        </SettingCard>

        <SettingCard
          title="Tracking & Delivery"
          subtitle="Delivery experience defaults."
          icon={<PackageCheck className="size-4" />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingField label="Live Tracking">
              <select
                className={inputClasses}
                value={form.trackingEnabled}
                onChange={(e) => setValue("trackingEnabled", e.target.value)}
              >
                {YES_NO.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </SettingField>
            <SettingField label="Signature on Delivery">
              <select
                className={inputClasses}
                value={form.signatureOnDelivery}
                onChange={(e) => setValue("signatureOnDelivery", e.target.value)}
              >
                {YES_NO.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </SettingField>
            <SettingField label="Cash on Delivery (COD)">
              <select
                className={inputClasses}
                value={form.codEnabled}
                onChange={(e) => setValue("codEnabled", e.target.value)}
              >
                {YES_NO.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </SettingField>
            <SettingField label="Estimated Delivery Days">
              <input
                className={inputClasses}
                type="number"
                value={form.estimatedDeliveryDays}
                onChange={(e) => setValue("estimatedDeliveryDays", e.target.value)}
              />
            </SettingField>
          </div>
        </SettingCard>

        <SettingCard
          title="Notifications"
          subtitle="How customers are notified about deliveries."
          icon={<BellRing className="size-4" />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingField label="SMS">
              <select
                className={inputClasses}
                value={form.notifySms}
                onChange={(e) => setValue("notifySms", e.target.value)}
              >
                {YES_NO.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </SettingField>
            <SettingField label="Email">
              <select
                className={inputClasses}
                value={form.notifyEmail}
                onChange={(e) => setValue("notifyEmail", e.target.value)}
              >
                {YES_NO.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </SettingField>
            <SettingField label="WhatsApp">
              <select
                className={inputClasses}
                value={form.notifyWhatsapp}
                onChange={(e) => setValue("notifyWhatsapp", e.target.value)}
              >
                {YES_NO.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </SettingField>
          </div>
        </SettingCard>
      </div>

      <div className="flex justify-end p-1.5">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
