"use client";

import { ProfileSectionForm } from "@/components/customer/customer-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerTravelProfilePage() {
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <ProfileSectionForm
      pageTitle="Travel Profile"
      pageDescription="Travel preferences for bookings."
      cardTitle="Travel Profile"
      cardSubtitle="Passport, loyalty and in-flight preferences."
      section="travelProfile"
      fields={[
        { name: "passportNo", label: "Passport No." },
        { name: "passportExpiry", label: "Passport Expiry", type: "date" },
        { name: "visaStatus", label: "Visa Status" },
        { name: "frequentFlyer", label: "Frequent Flyer" },
        {
          name: "preferredAirline",
          label: "Preferred Airline",
          type: "select",
          options: [
            { value: "Singapore Airlines", label: "Singapore Airlines" },
            { value: "Emirates", label: "Emirates" },
            { value: "Qatar Airways", label: "Qatar Airways" },
            { value: "Turkish Airlines", label: "Turkish Airlines" },
          ],
        },
        {
          name: "seatPreference",
          label: "Seat Preference",
          type: "select",
          options: [
            { value: "Window", label: "Window" },
            { value: "Aisle", label: "Aisle" },
            { value: "Middle", label: "Middle" },
          ],
        },
        {
          name: "mealPreference",
          label: "Meal Preference",
          type: "select",
          options: [
            { value: "Standard", label: "Standard" },
            { value: "Vegetarian", label: "Vegetarian" },
            { value: "Vegan", label: "Vegan" },
            { value: "Halal", label: "Halal" },
          ],
        },
        { name: "specialNeeds", label: "Special Needs", full: true },
        { name: "preferredHotelChain", label: "Preferred Hotel Chain" },
      ]}
    />
  );
}
