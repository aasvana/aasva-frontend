"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Customer = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  place: string;
  country: string;
  address: string;
  currency: string;
  taxId: string;
  notes: string;
};

export const SEED_CUSTOMERS: Customer[] = [
  {
    id: "cus_nguyen",
    name: "Theo Nguyen",
    company: "Hanoi Nomads",
    email: "theo.nguyen@hanoinomads.com",
    phone: "+84 912 345 678",
    place: "Hanoi",
    country: "Vietnam",
    address: "12 Hang Bong St, Hoan Kiem",
    currency: "USD",
    taxId: "VN-0912-3456",
    notes: "Prefers window seats and early check-in.",
  },
  {
    id: "cus_patel",
    name: "Aria Patel",
    company: "Mumbai Metrics",
    email: "aria.patel@mumbaimetrics.com",
    phone: "+91 98200 12345",
    place: "Mumbai",
    country: "India",
    address: "404 Marine Drive, Bandra West",
    currency: "INR",
    taxId: "27AABCU9603R1ZM",
    notes: "Corporate client — net 30 billing.",
  },
  {
    id: "cus_cole",
    name: "Marcus Cole",
    company: "Cole & Co",
    email: "marcus@coleandco.io",
    phone: "+1 415 555 0132",
    place: "San Francisco",
    country: "United States",
    address: "88 Market St, Suite 2100",
    currency: "USD",
    taxId: "US-94-1234567",
    notes: "VIP — direct line to account manager.",
  },
  {
    id: "cus_rossi",
    name: "Elena Rossi",
    company: "Rossa Viaggi",
    email: "elena.rossi@rossaviaggi.it",
    phone: "+39 06 555 0199",
    place: "Rome",
    country: "Italy",
    address: "Via del Corso 120",
    currency: "EUR",
    taxId: "IT-12345678901",
    notes: "",
  },
  {
    id: "cus_tanaka",
    name: "Mei Tanaka",
    company: "Tokyo Tide",
    email: "mei.tanaka@tokyotide.jp",
    phone: "+81 3 5555 0198",
    place: "Tokyo",
    country: "Japan",
    address: "2-11-3 Ginza, Chuo City",
    currency: "JPY",
    taxId: "JP-491-234-5678",
    notes: "Prefers vegetarian meal preference.",
  },
  {
    id: "cus_hassan",
    name: "Omar Hassan",
    company: "Cairo Canvas",
    email: "omar.hassan@cairocanvas.com",
    phone: "+20 2 5555 0127",
    place: "Cairo",
    country: "Egypt",
    address: "15 Kasr El Nile St",
    currency: "USD",
    taxId: "EG-101-234-567",
    notes: "Frequent flyer — Star Alliance.",
  },
];

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `cust_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

type CustomerState = {
  customers: Customer[];
  addCustomer: (data: Omit<Customer, "id">) => void;
  updateCustomer: (id: string, data: Omit<Customer, "id">) => void;
  deleteCustomer: (id: string) => void;
  resetCustomers: () => void;
};

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customers: SEED_CUSTOMERS,

      addCustomer: (data) =>
        set((state) => ({
          customers: [...state.customers, { id: newId(), ...data }],
        })),

      updateCustomer: (id, data) =>
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id ? { ...customer, ...data } : customer
          ),
        })),

      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
        })),

      resetCustomers: () => set({ customers: SEED_CUSTOMERS }),
    }),
    {
      name: "xmerge_customers",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
