"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const DELIVERY_STATUSES = [
  "Pending",
  "Ready for Dispatch",
  "Dispatched",
  "In Transit",
  "Delivered",
  "Failed",
  "Cancelled",
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export type DeliveryPartner = {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicleReg: string;
  serviceZones: string;
  commission: string;
  rating: string;
  isActive: string;
  notes: string;
  createdAt: string;
};

export type DeliveryZone = {
  id: string;
  name: string;
  region: string;
  pincodes: string;
  deliveryTime: string;
  baseCharge: string;
  perKmCharge: string;
  isActive: string;
  createdAt: string;
};

export type DeliveryCharge = {
  id: string;
  name: string;
  zoneName: string;
  ruleType: string;
  weightFrom: string;
  weightTo: string;
  baseCharge: string;
  perKg: string;
  perKm: string;
  minCharge: string;
  maxCharge: string;
  isActive: string;
  createdAt: string;
};

export type Delivery = {
  id: string;
  deliveryNo: string;
  customerName: string;
  customerPhone: string;
  address: string;
  pincode: string;
  zoneId: string;
  zoneName: string;
  partnerId: string;
  partnerName: string;
  orderRef: string;
  items: string;
  weight: string;
  charge: string;
  cod: string;
  scheduledDate: string;
  dispatchedAt: string;
  deliveredAt: string;
  status: DeliveryStatus;
  notes: string;
  createdAt: string;
};

export type DeliverySettings = {
  companyName: string;
  supportPhone: string;
  supportEmail: string;
  dispatchMode: string;
  defaultPartnerId: string;
  defaultPartnerName: string;
  trackingEnabled: string;
  signatureOnDelivery: string;
  codEnabled: string;
  notifySms: string;
  notifyEmail: string;
  notifyWhatsapp: string;
  estimatedDeliveryDays: string;
  workingHours: string;
  address: string;
};

const newId = (prefix: string) =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysFromNow = (d: number) => {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString().slice(0, 10);
};

const daysAgo = (d: number) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString().slice(0, 10);
};

const seedPartners = (): DeliveryPartner[] => [
  {
    id: newId("ptn"),
    name: "Swift Express",
    contactPerson: "Ravi Kumar",
    phone: "+91 98765 43210",
    email: "dispatch@swiftexpress.in",
    vehicleType: "Van",
    vehicleReg: "MH 01 AB 2233",
    serviceZones: "Zone A, Zone B",
    commission: "10",
    rating: "4.5",
    isActive: "Yes",
    notes: "Preferred partner for express deliveries.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("ptn"),
    name: "CityFast Logistics",
    contactPerson: "Meera Nair",
    phone: "+91 91234 56789",
    email: "ops@cityfast.in",
    vehicleType: "Motorbike",
    vehicleReg: "MH 02 CD 4455",
    serviceZones: "Zone A, Zone C",
    commission: "12",
    rating: "4.2",
    isActive: "Yes",
    notes: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("ptn"),
    name: "Metro Cargo",
    contactPerson: "Sandeep Rao",
    phone: "+91 90000 11122",
    email: "bookings@metrocargo.com",
    vehicleType: "Truck",
    vehicleReg: "MH 03 EF 6677",
    serviceZones: "Zone B, Zone D",
    commission: "8",
    rating: "4.8",
    isActive: "Yes",
    notes: "Handles bulk and heavy loads.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("ptn"),
    name: "Last Mile Couriers",
    contactPerson: "Anita Desai",
    phone: "+91 99887 76655",
    email: "hello@lastmile.in",
    vehicleType: "Bicycle",
    vehicleReg: "—",
    serviceZones: "Zone A",
    commission: "15",
    rating: "3.9",
    isActive: "No",
    notes: "",
    createdAt: new Date().toISOString(),
  },
];

const seedZones = (): DeliveryZone[] => [
  {
    id: newId("zn"),
    name: "Zone A",
    region: "Central District",
    pincodes: "400001, 400002, 400003, 400005",
    deliveryTime: "1-2 days",
    baseCharge: "40",
    perKmCharge: "5",
    isActive: "Yes",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("zn"),
    name: "Zone B",
    region: "North District",
    pincodes: "400020, 400021, 400022",
    deliveryTime: "2-3 days",
    baseCharge: "60",
    perKmCharge: "6",
    isActive: "Yes",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("zn"),
    name: "Zone C",
    region: "South District",
    pincodes: "400060, 400061",
    deliveryTime: "2-4 days",
    baseCharge: "80",
    perKmCharge: "8",
    isActive: "Yes",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("zn"),
    name: "Zone D",
    region: "Outskirts",
    pincodes: "400101, 400102",
    deliveryTime: "3-5 days",
    baseCharge: "120",
    perKmCharge: "10",
    isActive: "Yes",
    createdAt: new Date().toISOString(),
  },
];

const seedCharges = (): DeliveryCharge[] => [
  {
    id: newId("chg"),
    name: "Standard — Zone A",
    zoneName: "Zone A",
    ruleType: "Per Weight",
    weightFrom: "0",
    weightTo: "5",
    baseCharge: "40",
    perKg: "8",
    perKm: "5",
    minCharge: "40",
    maxCharge: "150",
    isActive: "Yes",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("chg"),
    name: "Standard — Zone B",
    zoneName: "Zone B",
    ruleType: "Per Weight",
    weightFrom: "0",
    weightTo: "5",
    baseCharge: "60",
    perKg: "10",
    perKm: "6",
    minCharge: "60",
    maxCharge: "180",
    isActive: "Yes",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("chg"),
    name: "Heavy — Zone C",
    zoneName: "Zone C",
    ruleType: "Per Distance",
    weightFrom: "5",
    weightTo: "20",
    baseCharge: "120",
    perKg: "12",
    perKm: "8",
    minCharge: "120",
    maxCharge: "400",
    isActive: "Yes",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("chg"),
    name: "Bulk — Zone D",
    zoneName: "Zone D",
    ruleType: "Fixed",
    weightFrom: "20",
    weightTo: "100",
    baseCharge: "500",
    perKg: "0",
    perKm: "10",
    minCharge: "500",
    maxCharge: "2000",
    isActive: "No",
    createdAt: new Date().toISOString(),
  },
];

const seedDeliveries = (): Delivery[] => [
  {
    id: newId("dlv"),
    deliveryNo: "DLV-1001",
    customerName: "Theo Nguyen",
    customerPhone: "+91 90001 10001",
    address: "14 Marine Drive, Fort",
    pincode: "400001",
    zoneId: "",
    zoneName: "Zone A",
    partnerId: "",
    partnerName: "Swift Express",
    orderRef: "ORD-3001",
    items: "Titan watch (1)",
    weight: "1.2",
    charge: "40",
    cod: "No",
    scheduledDate: daysFromNow(1),
    dispatchedAt: "",
    deliveredAt: "",
    status: "Ready for Dispatch",
    notes: "Signature required.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("dlv"),
    deliveryNo: "DLV-1002",
    customerName: "Alicia Reyes",
    customerPhone: "+91 90002 20002",
    address: "22 Linking Road, Bandra",
    pincode: "400020",
    zoneId: "",
    zoneName: "Zone B",
    partnerId: "",
    partnerName: "CityFast Logistics",
    orderRef: "ORD-3002",
    items: "Sneakers (2), T-shirt (1)",
    weight: "2.4",
    charge: "60",
    cod: "Yes",
    scheduledDate: daysAgo(1),
    dispatchedAt: daysAgo(1),
    deliveredAt: "",
    status: "In Transit",
    notes: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("dlv"),
    deliveryNo: "DLV-1003",
    customerName: "Jane Cooper",
    customerPhone: "+91 90003 30003",
    address: "45 Hill Road, Andheri",
    pincode: "400060",
    zoneId: "",
    zoneName: "Zone C",
    partnerId: "",
    partnerName: "Metro Cargo",
    orderRef: "ORD-3003",
    items: "Office chair (1)",
    weight: "18.5",
    charge: "120",
    cod: "No",
    scheduledDate: daysAgo(3),
    dispatchedAt: daysAgo(2),
    deliveredAt: daysAgo(1),
    status: "Delivered",
    notes: "Delivered to front desk.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("dlv"),
    deliveryNo: "DLV-1004",
    customerName: "Marcus Chen",
    customerPhone: "+91 90004 40004",
    address: "8 Carter Road, Bandra West",
    pincode: "400021",
    zoneId: "",
    zoneName: "Zone B",
    partnerId: "",
    partnerName: "",
    orderRef: "ORD-3004",
    items: "Bluetooth speaker (1)",
    weight: "0.8",
    charge: "60",
    cod: "Yes",
    scheduledDate: daysFromNow(0),
    dispatchedAt: "",
    deliveredAt: "",
    status: "Pending",
    notes: "Call before delivery.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("dlv"),
    deliveryNo: "DLV-1005",
    customerName: "Sofia Rossi",
    customerPhone: "+91 90005 50005",
    address: "3 Park Street, Colaba",
    pincode: "400003",
    zoneId: "",
    zoneName: "Zone A",
    partnerId: "",
    partnerName: "Swift Express",
    orderRef: "ORD-3005",
    items: "Books (3)",
    weight: "3.1",
    charge: "40",
    cod: "No",
    scheduledDate: daysAgo(2),
    dispatchedAt: daysAgo(2),
    deliveredAt: "",
    status: "Dispatched",
    notes: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("dlv"),
    deliveryNo: "DLV-1006",
    customerName: "Haruto Tanaka",
    customerPhone: "+91 90006 60006",
    address: "19 Worli Sea Face",
    pincode: "400101",
    zoneId: "",
    zoneName: "Zone D",
    partnerId: "",
    partnerName: "Metro Cargo",
    orderRef: "ORD-3006",
    items: "Small appliance (1)",
    weight: "9.0",
    charge: "120",
    cod: "Yes",
    scheduledDate: daysAgo(5),
    dispatchedAt: daysAgo(4),
    deliveredAt: "",
    status: "Failed",
    notes: "Recipient not available, re-attempt scheduled.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId("dlv"),
    deliveryNo: "DLV-1007",
    customerName: "Omar Hassan",
    customerPhone: "+91 90007 70007",
    address: "55 Juhu Tara Road",
    pincode: "400060",
    zoneId: "",
    zoneName: "Zone C",
    partnerId: "",
    partnerName: "",
    orderRef: "ORD-3007",
    items: "Gift hamper (1)",
    weight: "2.0",
    charge: "80",
    cod: "No",
    scheduledDate: daysFromNow(2),
    dispatchedAt: "",
    deliveredAt: "",
    status: "Ready for Dispatch",
    notes: "Deliver between 6-8 PM.",
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_SETTINGS: DeliverySettings = {
  companyName: "XMerge Retail",
  supportPhone: "+91 1800 123 456",
  supportEmail: "support@xmerge.app",
  address: "12 MG Road, Mumbai 400001",
  dispatchMode: "Manual",
  defaultPartnerId: "",
  defaultPartnerName: "",
  trackingEnabled: "Yes",
  signatureOnDelivery: "Yes",
  codEnabled: "Yes",
  notifySms: "Yes",
  notifyEmail: "Yes",
  notifyWhatsapp: "No",
  estimatedDeliveryDays: "2",
  workingHours: "9:00 AM – 7:00 PM",
};

type DeliveryState = {
  partners: DeliveryPartner[];
  zones: DeliveryZone[];
  charges: DeliveryCharge[];
  deliveries: Delivery[];
  settings: DeliverySettings;

  addPartner: (data: Omit<DeliveryPartner, "id" | "createdAt">) => void;
  updatePartner: (id: string, data: Omit<DeliveryPartner, "id" | "createdAt">) => void;
  deletePartner: (id: string) => void;

  addZone: (data: Omit<DeliveryZone, "id" | "createdAt">) => void;
  updateZone: (id: string, data: Omit<DeliveryZone, "id" | "createdAt">) => void;
  deleteZone: (id: string) => void;

  addCharge: (data: Omit<DeliveryCharge, "id" | "createdAt">) => void;
  updateCharge: (id: string, data: Omit<DeliveryCharge, "id" | "createdAt">) => void;
  deleteCharge: (id: string) => void;

  addDelivery: (data: Omit<Delivery, "id" | "createdAt">) => void;
  updateDelivery: (id: string, data: Omit<Delivery, "id" | "createdAt">) => void;
  deleteDelivery: (id: string) => void;
  dispatchDelivery: (id: string, partnerId: string, partnerName: string) => void;
  markDelivered: (id: string) => void;

  updateSettings: (patch: Partial<DeliverySettings>) => void;
  resetDelivery: () => void;
};

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set) => ({
      partners: seedPartners(),
      zones: seedZones(),
      charges: seedCharges(),
      deliveries: seedDeliveries(),
      settings: DEFAULT_SETTINGS,

      addPartner: (data) =>
        set((state) => ({
          partners: [
            { id: newId("ptn"), createdAt: new Date().toISOString(), ...data },
            ...state.partners,
          ],
        })),
      updatePartner: (id, data) =>
        set((state) => ({
          partners: state.partners.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      deletePartner: (id) =>
        set((state) => ({
          partners: state.partners.filter((p) => p.id !== id),
        })),

      addZone: (data) =>
        set((state) => ({
          zones: [
            { id: newId("zn"), createdAt: new Date().toISOString(), ...data },
            ...state.zones,
          ],
        })),
      updateZone: (id, data) =>
        set((state) => ({
          zones: state.zones.map((z) => (z.id === id ? { ...z, ...data } : z)),
        })),
      deleteZone: (id) =>
        set((state) => ({
          zones: state.zones.filter((z) => z.id !== id),
        })),

      addCharge: (data) =>
        set((state) => ({
          charges: [
            { id: newId("chg"), createdAt: new Date().toISOString(), ...data },
            ...state.charges,
          ],
        })),
      updateCharge: (id, data) =>
        set((state) => ({
          charges: state.charges.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteCharge: (id) =>
        set((state) => ({
          charges: state.charges.filter((c) => c.id !== id),
        })),

      addDelivery: (data) =>
        set((state) => ({
          deliveries: [
            { id: newId("dlv"), createdAt: new Date().toISOString(), ...data },
            ...state.deliveries,
          ],
        })),
      updateDelivery: (id, data) =>
        set((state) => ({
          deliveries: state.deliveries.map((d) => (d.id === id ? { ...d, ...data } : d)),
        })),
      deleteDelivery: (id) =>
        set((state) => ({
          deliveries: state.deliveries.filter((d) => d.id !== id),
        })),

      dispatchDelivery: (id, partnerId, partnerName) =>
        set((state) => ({
          deliveries: state.deliveries.map((d) =>
            d.id === id
              ? {
                  ...d,
                  partnerId,
                  partnerName,
                  status: "Dispatched",
                  dispatchedAt: new Date().toISOString().slice(0, 10),
                }
              : d
          ),
        })),

      markDelivered: (id) =>
        set((state) => ({
          deliveries: state.deliveries.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status: "Delivered",
                  deliveredAt: new Date().toISOString().slice(0, 10),
                }
              : d
          ),
        })),

      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),

      resetDelivery: () =>
        set({
          partners: seedPartners(),
          zones: seedZones(),
          charges: seedCharges(),
          deliveries: seedDeliveries(),
          settings: DEFAULT_SETTINGS,
        }),
    }),
    {
      name: "xmerge_delivery",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
