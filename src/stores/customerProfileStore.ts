"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SEED_CUSTOMERS, Customer } from "./customerStore";

export type PersonalInfo = {
  preferredName: string;
  dob: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  occupation: string;
};

export type ContactInfo = {
  email: string;
  phone: string;
  alternatePhone: string;
  emergencyContact: string;
  whatsapp: string;
  preferredChannel: string;
  timezone: string;
};

export type AddressInfo = {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: string;
};

export type BusinessInfo = {
  company: string;
  jobTitle: string;
  taxId: string;
  businessType: string;
  industry: string;
  website: string;
};

export type TravelProfileInfo = {
  passportNo: string;
  passportExpiry: string;
  visaStatus: string;
  frequentFlyer: string;
  preferredAirline: string;
  seatPreference: string;
  mealPreference: string;
  specialNeeds: string;
  preferredHotelChain: string;
};

export type CustomerOrder = {
  id: string;
  orderNo: string;
  date: string;
  status: string;
  amount: string;
  notes: string;
};

export type CustomerInvoice = {
  id: string;
  invoiceNo: string;
  date: string;
  currency: string;
  amount: string;
  status: string;
  balance: string;
};

export type CustomerPayment = {
  id: string;
  paymentNo: string;
  date: string;
  amount: string;
  mode: string;
  status: string;
  reference: string;
};

export type CustomerCreditNote = {
  id: string;
  creditNoteNo: string;
  date: string;
  amount: string;
  status: string;
  reason: string;
};

export type CustomerRefund = {
  id: string;
  refundNo: string;
  date: string;
  amount: string;
  status: string;
  reason: string;
};

export type CustomerBooking = {
  id: string;
  reference: string;
  service: string;
  supplierName: string;
  startDate: string;
  endDate: string;
  pax: string;
  amount: string;
  status: string;
  notes: string;
};

export type CustomerDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
};

export type CustomerCommunication = {
  id: string;
  channel: string;
  direction: string;
  subject: string;
  body: string;
  agent: string;
  timestamp: string;
};

export type CustomerNote = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomerActivity = {
  id: string;
  action: string;
  details: string;
  timestamp: string;
};

export type CustomerProfile = {
  personal: PersonalInfo;
  contact: ContactInfo;
  address: AddressInfo;
  business: BusinessInfo;
  travelProfile: TravelProfileInfo;
  sales: {
    orders: CustomerOrder[];
    invoices: CustomerInvoice[];
    payments: CustomerPayment[];
    creditNotes: CustomerCreditNote[];
    refunds: CustomerRefund[];
  };
  travel: {
    bookings: CustomerBooking[];
    documents: CustomerDocument[];
  };
  communication: CustomerCommunication[];
  notes: CustomerNote[];
  activity: CustomerActivity[];
};

export const PROFILE_SECTIONS = [
  "personal",
  "contact",
  "address",
  "business",
  "travelProfile",
] as const;

export type ProfileSection = (typeof PROFILE_SECTIONS)[number];

export const EMPTY_PROFILE: CustomerProfile = {
  personal: {
    preferredName: "",
    dob: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
    occupation: "",
  },
  contact: {
    email: "",
    phone: "",
    alternatePhone: "",
    emergencyContact: "",
    whatsapp: "",
    preferredChannel: "email",
    timezone: "UTC",
  },
  address: {
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    addressType: "Home",
  },
  business: {
    company: "",
    jobTitle: "",
    taxId: "",
    businessType: "",
    industry: "",
    website: "",
  },
  travelProfile: {
    passportNo: "",
    passportExpiry: "",
    visaStatus: "",
    frequentFlyer: "",
    preferredAirline: "",
    seatPreference: "",
    mealPreference: "",
    specialNeeds: "",
    preferredHotelChain: "",
  },
  sales: {
    orders: [],
    invoices: [],
    payments: [],
    creditNotes: [],
    refunds: [],
  },
  travel: {
    bookings: [],
    documents: [],
  },
  communication: [],
  notes: [],
  activity: [],
};

const newId = (prefix: string) =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);

const daysFromNow = (d: number) =>
  new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);

const hoursAgo = (h: number) => new Date(Date.now() - h * 36e5).toISOString();

const CUSTOMER_STATUSES = ["Paid", "Pending", "Approved", "Cancelled"];

function buildSeedProfile(customer: Customer, index: number): CustomerProfile {
  const salesTotal = 900 + index * 240;
  const orders: CustomerOrder[] = [
    {
      id: `${customer.id}_ord_1`,
      orderNo: `ORD-${3001 + index}`,
      date: daysAgo(6 + index),
      status: "Delivered",
      amount: (salesTotal).toFixed(2),
      notes: `Standard order for ${customer.name}.`,
    },
    {
      id: `${customer.id}_ord_2`,
      orderNo: `ORD-${3101 + index}`,
      date: daysAgo(1 + index),
      status: "Processing",
      amount: (salesTotal * 0.4).toFixed(2),
      notes: "",
    },
  ];
  const invoices: CustomerInvoice[] = [
    {
      id: `${customer.id}_inv_1`,
      invoiceNo: `INV-${4101 + index}`,
      date: daysAgo(5 + index),
      currency: customer.currency,
      amount: salesTotal.toFixed(2),
      status: "paid",
      balance: "0.00",
    },
    {
      id: `${customer.id}_inv_2`,
      invoiceNo: `INV-${4201 + index}`,
      date: daysAgo(1 + index),
      currency: customer.currency,
      amount: (salesTotal * 0.4).toFixed(2),
      status: "partially_paid",
      balance: (salesTotal * 0.2).toFixed(2),
    },
  ];
  const payments: CustomerPayment[] = [
    {
      id: `${customer.id}_pay_1`,
      paymentNo: `RCPT-${5101 + index}`,
      date: daysAgo(4 + index),
      amount: (salesTotal * 0.8).toFixed(2),
      mode: "bank_transfer",
      status: "Paid",
      reference: invoices[0].invoiceNo,
    },
  ];
  const creditNotes: CustomerCreditNote[] =
    index % 2 === 0
      ? [
          {
            id: `${customer.id}_cn_1`,
            creditNoteNo: `CN-${6101 + index}`,
            date: daysAgo(8 + index),
            amount: "45.00",
            status: "Applied",
            reason: "Partial return of damaged goods.",
          },
        ]
      : [];
  const refunds: CustomerRefund[] =
    index % 3 === 0
      ? [
          {
            id: `${customer.id}_rf_1`,
            refundNo: `REF-${7101 + index}`,
            date: daysAgo(9 + index),
            amount: "35.50",
            status: "Approved",
            reason: "Duplicate charge refund.",
          },
        ]
      : [];
  const bookings: CustomerBooking[] = [
    {
      id: `${customer.id}_bk_1`,
      reference: `BK-${2001 + index}`,
      service: "Deluxe Room (2 nights)",
      supplierName: "Meridian Grand",
      startDate: daysFromNow(12 + index),
      endDate: daysFromNow(14 + index),
      pax: "2",
      amount: (420 + index * 40).toFixed(2),
      status: "Confirmed",
      notes: "High floor preferred.",
    },
    {
      id: `${customer.id}_bk_2`,
      reference: `BK-${2051 + index}`,
      service: "Airport Transfer",
      supplierName: "City Transfers",
      startDate: daysFromNow(13 + index),
      endDate: daysFromNow(13 + index),
      pax: "2",
      amount: "38.00",
      status: "Pending",
      notes: "",
    },
  ];
  const documents: CustomerDocument[] = [
    {
      id: `${customer.id}_doc_1`,
      name: "Passport Scan",
      type: "Passport",
      size: "1.2 MB",
      uploadedAt: daysAgo(40 + index),
    },
    {
      id: `${customer.id}_doc_2`,
      name: "Visa Approval",
      type: "Visa",
      size: "0.4 MB",
      uploadedAt: daysAgo(20 + index),
    },
  ];
  const communication: CustomerCommunication[] = [
    {
      id: `${customer.id}_com_1`,
      channel: "email",
      direction: "outbound",
      subject: "Booking confirmation",
      body: `Sent booking confirmation to ${customer.email}.`,
      agent: "Admin",
      timestamp: hoursAgo(30 + index * 4),
    },
    {
      id: `${customer.id}_com_2`,
      channel: "phone",
      direction: "inbound",
      subject: "Enquiry call",
      body: "Discussed itinerary options and pricing.",
      agent: "Admin",
      timestamp: hoursAgo(80 + index * 6),
    },
  ];
  const notes: CustomerNote[] = [
    {
      id: `${customer.id}_note_1`,
      title: "Preferences",
      body: customer.notes || "No preferences recorded yet.",
      createdAt: daysAgo(15 + index),
      updatedAt: daysAgo(2 + index),
    },
  ];
  const activity: CustomerActivity[] = [
    {
      id: `${customer.id}_act_1`,
      action: "created",
      details: `Customer record created for ${customer.name}.`,
      timestamp: hoursAgo(500 + index * 30),
    },
    {
      id: `${customer.id}_act_2`,
      action: "updated",
      details: "Contact details updated.",
      timestamp: hoursAgo(90 + index * 5),
    },
    {
      id: `${customer.id}_act_3`,
      action: "booked",
      details: "New booking BK-" + (2001 + index) + " confirmed.",
      timestamp: hoursAgo(40 + index * 3),
    },
  ];

  return {
    personal: {
      preferredName: customer.name,
      dob: daysAgo(13000 + index * 400),
      gender: index % 2 === 0 ? "Female" : "Male",
      nationality: customer.country,
      maritalStatus: index % 3 === 0 ? "Married" : "Single",
      occupation: "Business Owner",
    },
    contact: {
      email: customer.email,
      phone: customer.phone,
      alternatePhone: "",
      emergencyContact: "Spouse / Family",
      whatsapp: customer.phone,
      preferredChannel: "email",
      timezone: "UTC",
    },
    address: {
      address: customer.address,
      city: customer.place,
      state: "",
      postalCode: "",
      country: customer.country,
      addressType: "Home",
    },
    business: {
      company: customer.company,
      jobTitle: "Director",
      taxId: customer.taxId,
      businessType: "Private Limited",
      industry: "Services",
      website: `https://${customer.company.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`,
    },
    travelProfile: {
      passportNo: `${customer.id.slice(4).toUpperCase()}${1000 + index}`,
      passportExpiry: daysFromNow(1400 + index * 100),
      visaStatus: "Valid",
      frequentFlyer: index % 2 === 0 ? "Star Alliance Gold" : "SkyTeam Silver",
      preferredAirline: index % 2 === 0 ? "Singapore Airlines" : "Emirates",
      seatPreference: index % 2 === 0 ? "Window" : "Aisle",
      mealPreference: index % 2 === 0 ? "Vegetarian" : "Standard",
      specialNeeds: "",
      preferredHotelChain: index % 2 === 0 ? "Marriott" : "Hilton",
    },
    sales: { orders, invoices, payments, creditNotes, refunds },
    travel: { bookings, documents },
    communication,
    notes,
    activity,
  };
}

const buildSeedProfiles = (): Record<string, CustomerProfile> => {
  const profiles: Record<string, CustomerProfile> = {};
  SEED_CUSTOMERS.forEach((customer, index) => {
    profiles[customer.id] = buildSeedProfile(customer, index);
  });
  return profiles;
};

function patchProfile(
  profiles: Record<string, CustomerProfile>,
  customerId: string,
  mutate: (profile: CustomerProfile) => CustomerProfile
): Record<string, CustomerProfile> {
  const profile = profiles[customerId] ?? { ...EMPTY_PROFILE };
  return { ...profiles, [customerId]: mutate(profile) };
}

type CustomerProfileState = {
  profiles: Record<string, CustomerProfile>;
  selectedCustomerId: string | null;
  setSelectedCustomer: (id: string | null) => void;
  updateSection: (
    customerId: string,
    section: ProfileSection,
    patch: Partial<CustomerProfile[ProfileSection]>
  ) => void;
  addOrder: (customerId: string, data: Omit<CustomerOrder, "id">) => void;
  updateOrder: (customerId: string, id: string, data: Omit<CustomerOrder, "id">) => void;
  deleteOrder: (customerId: string, id: string) => void;
  addInvoice: (customerId: string, data: Omit<CustomerInvoice, "id">) => void;
  updateInvoice: (customerId: string, id: string, data: Omit<CustomerInvoice, "id">) => void;
  deleteInvoice: (customerId: string, id: string) => void;
  addPayment: (customerId: string, data: Omit<CustomerPayment, "id">) => void;
  updatePayment: (customerId: string, id: string, data: Omit<CustomerPayment, "id">) => void;
  deletePayment: (customerId: string, id: string) => void;
  addCreditNote: (customerId: string, data: Omit<CustomerCreditNote, "id">) => void;
  deleteCreditNote: (customerId: string, id: string) => void;
  addRefund: (customerId: string, data: Omit<CustomerRefund, "id">) => void;
  deleteRefund: (customerId: string, id: string) => void;
  addBooking: (customerId: string, data: Omit<CustomerBooking, "id">) => void;
  updateBooking: (customerId: string, id: string, data: Omit<CustomerBooking, "id">) => void;
  deleteBooking: (customerId: string, id: string) => void;
  addDocument: (customerId: string, data: Omit<CustomerDocument, "id">) => void;
  deleteDocument: (customerId: string, id: string) => void;
  addCommunication: (customerId: string, data: Omit<CustomerCommunication, "id">) => void;
  deleteCommunication: (customerId: string, id: string) => void;
  addNote: (customerId: string, data: Omit<CustomerNote, "id">) => void;
  updateNote: (customerId: string, id: string, data: Omit<CustomerNote, "id">) => void;
  deleteNote: (customerId: string, id: string) => void;
  addActivity: (customerId: string, data: Omit<CustomerActivity, "id">) => void;
  resetProfiles: () => void;
};

export const useCustomerProfileStore = create<CustomerProfileState>()(
  persist(
    (set) => ({
      profiles: buildSeedProfiles(),
      selectedCustomerId: SEED_CUSTOMERS[0]?.id ?? null,

      setSelectedCustomer: (id) => set({ selectedCustomerId: id }),

      updateSection: (customerId, section, patch) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            [section]: { ...p[section], ...patch },
          })),
        })),

      addOrder: (customerId, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: { ...p.sales, orders: [{ id: newId("ord"), ...data }, ...p.sales.orders] },
          })),
        })),

      updateOrder: (customerId, id, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: {
              ...p.sales,
              orders: p.sales.orders.map((o) => (o.id === id ? { ...o, ...data } : o)),
            },
          })),
        })),

      deleteOrder: (customerId, id) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: { ...p.sales, orders: p.sales.orders.filter((o) => o.id !== id) },
          })),
        })),

      addInvoice: (customerId, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: { ...p.sales, invoices: [{ id: newId("inv"), ...data }, ...p.sales.invoices] },
          })),
        })),

      updateInvoice: (customerId, id, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: {
              ...p.sales,
              invoices: p.sales.invoices.map((o) => (o.id === id ? { ...o, ...data } : o)),
            },
          })),
        })),

      deleteInvoice: (customerId, id) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: { ...p.sales, invoices: p.sales.invoices.filter((o) => o.id !== id) },
          })),
        })),

      addPayment: (customerId, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: { ...p.sales, payments: [{ id: newId("pay"), ...data }, ...p.sales.payments] },
          })),
        })),

      updatePayment: (customerId, id, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: {
              ...p.sales,
              payments: p.sales.payments.map((o) => (o.id === id ? { ...o, ...data } : o)),
            },
          })),
        })),

      deletePayment: (customerId, id) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: { ...p.sales, payments: p.sales.payments.filter((o) => o.id !== id) },
          })),
        })),

      addCreditNote: (customerId, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: { ...p.sales, creditNotes: [{ id: newId("cn"), ...data }, ...p.sales.creditNotes] },
          })),
        })),

      deleteCreditNote: (customerId, id) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: { ...p.sales, creditNotes: p.sales.creditNotes.filter((o) => o.id !== id) },
          })),
        })),

      addRefund: (customerId, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: { ...p.sales, refunds: [{ id: newId("rf"), ...data }, ...p.sales.refunds] },
          })),
        })),

      deleteRefund: (customerId, id) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            sales: { ...p.sales, refunds: p.sales.refunds.filter((o) => o.id !== id) },
          })),
        })),

      addBooking: (customerId, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            travel: { ...p.travel, bookings: [{ id: newId("bk"), ...data }, ...p.travel.bookings] },
          })),
        })),

      updateBooking: (customerId, id, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            travel: {
              ...p.travel,
              bookings: p.travel.bookings.map((o) => (o.id === id ? { ...o, ...data } : o)),
            },
          })),
        })),

      deleteBooking: (customerId, id) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            travel: { ...p.travel, bookings: p.travel.bookings.filter((o) => o.id !== id) },
          })),
        })),

      addDocument: (customerId, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            travel: { ...p.travel, documents: [{ id: newId("doc"), ...data }, ...p.travel.documents] },
          })),
        })),

      deleteDocument: (customerId, id) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            travel: { ...p.travel, documents: p.travel.documents.filter((o) => o.id !== id) },
          })),
        })),

      addCommunication: (customerId, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            communication: [{ id: newId("com"), ...data }, ...p.communication],
          })),
        })),

      deleteCommunication: (customerId, id) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            communication: p.communication.filter((o) => o.id !== id),
          })),
        })),

      addNote: (customerId, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            notes: [
              {
                id: newId("note"),
                ...data,
                createdAt: new Date().toISOString().slice(0, 10),
                updatedAt: new Date().toISOString().slice(0, 10),
              },
              ...p.notes,
            ],
          })),
        })),

      updateNote: (customerId, id, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            notes: p.notes.map((o) =>
              o.id === id
                ? { ...o, ...data, updatedAt: new Date().toISOString().slice(0, 10) }
                : o
            ),
          })),
        })),

      deleteNote: (customerId, id) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            notes: p.notes.filter((o) => o.id !== id),
          })),
        })),

      addActivity: (customerId, data) =>
        set((state) => ({
          profiles: patchProfile(state.profiles, customerId, (p) => ({
            ...p,
            activity: [{ id: newId("act"), ...data }, ...p.activity],
          })),
        })),

      resetProfiles: () => set({ profiles: buildSeedProfiles() }),
    }),
    {
      name: "xmerge_customer_profiles",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const CUSTOMER_STATUS_OPTIONS = CUSTOMER_STATUSES;
