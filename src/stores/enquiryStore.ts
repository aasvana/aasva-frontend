"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const ENQUIRY_STATUSES = ["New", "Quoted", "Confirmed", "Lost"] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_SERVICE_TYPES = [
  "Hotel",
  "Airline",
  "Transport",
  "Activity",
  "Package",
] as const;

export type Enquiry = {
  id: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  destination: string;
  startDate: string;
  endDate: string;
  pax: string;
  budget: string;
  currency: string;
  status: EnquiryStatus;
  notes: string;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `enq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const seedEnquiries = (): Enquiry[] => [
  {
    id: newId(),
    customerId: "",
    customerName: "Jane Cooper",
    serviceType: "Package",
    destination: "Dubai",
    startDate: daysFromNow(45),
    endDate: daysFromNow(52),
    pax: "4",
    budget: "2500",
    currency: "USD",
    status: "New",
    notes: "Family trip, wants beach resort with kids' club.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    customerId: "",
    customerName: "Alicia Reyes",
    serviceType: "Hotel",
    destination: "Maldives",
    startDate: daysFromNow(80),
    endDate: daysFromNow(87),
    pax: "2",
    budget: "1800",
    currency: "USD",
    status: "Quoted",
    notes: "Honeymoon, overwater villa requested.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    customerId: "",
    customerName: "Theo Nguyen",
    serviceType: "Activity",
    destination: "Phuket",
    startDate: daysFromNow(20),
    endDate: daysFromNow(26),
    pax: "6",
    budget: "900",
    currency: "USD",
    status: "Confirmed",
    notes: "Island hopping and snorkelling tour.",
    createdAt: new Date().toISOString(),
  },
];

type EnquiryState = {
  enquiries: Enquiry[];
  addEnquiry: (data: Omit<Enquiry, "id" | "createdAt">) => void;
  updateEnquiry: (id: string, data: Omit<Enquiry, "id" | "createdAt">) => void;
  deleteEnquiry: (id: string) => void;
  resetEnquiries: () => void;
};

export const useEnquiryStore = create<EnquiryState>()(
  persist(
    (set) => ({
      enquiries: seedEnquiries(),

      addEnquiry: (data) =>
        set((state) => ({
          enquiries: [
            { id: newId(), createdAt: new Date().toISOString(), ...data },
            ...state.enquiries,
          ],
        })),

      updateEnquiry: (id, data) =>
        set((state) => ({
          enquiries: state.enquiries.map((enquiry) =>
            enquiry.id === id ? { ...enquiry, ...data } : enquiry
          ),
        })),

      deleteEnquiry: (id) =>
        set((state) => ({
          enquiries: state.enquiries.filter((enquiry) => enquiry.id !== id),
        })),

      resetEnquiries: () => set({ enquiries: seedEnquiries() }),
    }),
    {
      name: "xmerge_travel_enquiries",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
