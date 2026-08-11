"use client";

import { ProfileSectionForm } from "@/components/customer/customer-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerContactPage() {
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <ProfileSectionForm
      pageTitle="Contact"
      pageDescription="Ways to reach this customer."
      cardTitle="Contact Information"
      cardSubtitle="Phone, email and preferred channels."
      section="contact"
      fields={[
        { name: "email", label: "Email", full: true },
        { name: "phone", label: "Phone" },
        { name: "alternatePhone", label: "Alternate Phone" },
        { name: "whatsapp", label: "WhatsApp" },
        { name: "emergencyContact", label: "Emergency Contact" },
        {
          name: "preferredChannel",
          label: "Preferred Channel",
          type: "select",
          options: [
            { value: "email", label: "Email" },
            { value: "phone", label: "Phone" },
            { value: "whatsapp", label: "WhatsApp" },
          ],
        },
        { name: "timezone", label: "Timezone" },
      ]}
    />
  );
}
