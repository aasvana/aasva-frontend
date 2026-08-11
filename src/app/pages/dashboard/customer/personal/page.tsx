"use client";

import {
  ProfileSectionForm,
} from "@/components/customer/customer-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerPersonalPage() {
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <ProfileSectionForm
      pageTitle="Personal"
      pageDescription="Personal details about this customer."
      cardTitle="Personal Information"
      cardSubtitle="Name, date of birth and nationality."
      section="personal"
      fields={[
        { name: "preferredName", label: "Preferred Name" },
        { name: "dob", label: "Date of Birth", type: "date" },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { value: "Female", label: "Female" },
            { value: "Male", label: "Male" },
            { value: "Other", label: "Other" },
          ],
        },
        { name: "nationality", label: "Nationality" },
        {
          name: "maritalStatus",
          label: "Marital Status",
          type: "select",
          options: [
            { value: "Single", label: "Single" },
            { value: "Married", label: "Married" },
            { value: "Other", label: "Other" },
          ],
        },
        { name: "occupation", label: "Occupation" },
      ]}
    />
  );
}
