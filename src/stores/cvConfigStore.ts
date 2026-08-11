"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import airlinesSeed from "@/constants/json/airlines.json";
import airportsSeed from "@/constants/json/airports.json";
import { hotels as hotelsSeed } from "@/constants/hotels";

export type CvHotel = {
  id: string;
  name: string;
  destination: string;
  rating: string;
  notes?: string;
};

export type CvAirline = {
  id: string;
  code: string;
  name: string;
};

export type CvAirport = {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
};

export type CvGeneralDetail = {
  id: string;
  key: string;
  label: string;
  value: string;
};

export type CvSettings = {
  defaultCurrency: string;
  voucherPrefix: string;
  voucherSuffix: string;
  defaultPaymentType: string;
  defaultTaxRate: number;
};

export const GENERAL_DETAIL_KEYS: { key: string; label: string }[] = [
  { key: "checkinTime", label: "Check-in Time" },
  { key: "checkoutTime", label: "Checkout Time" },
  { key: "smokingPolicy", label: "Smoking Policy" },
  { key: "consumptionOfLiquor", label: "Consumption of Liquor" },
  { key: "assistanceName", label: "Assistance Name" },
  { key: "assistancePhone", label: "Assistance Phone" },
  { key: "supportName", label: "Support Name" },
  { key: "supportPhone", label: "Support Phone" },
  { key: "emergencyName", label: "Emergency Name" },
  { key: "emergencyPhone", label: "Emergency Phone" },
];

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `cv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const seedHotels = (): CvHotel[] =>
  hotelsSeed.map((h) => ({
    id: newId(),
    name: h.name,
    destination: h.destination,
    rating: h.rating,
  }));

const seedAirlines = (): CvAirline[] =>
  airlinesSeed.map((a) => ({
    id: newId(),
    code: a.code,
    name: a.name,
  }));

const seedAirports = (): CvAirport[] =>
  airportsSeed.map((a) => ({
    id: newId(),
    code: a.code,
    name: a.name,
    city: a.city,
    country: a.country ?? "",
  }));

const seedGeneralDetails = (): CvGeneralDetail[] =>
  GENERAL_DETAIL_KEYS.map((k) => ({
    id: newId(),
    key: k.key,
    label: k.label,
    value:
      k.key === "smokingPolicy" || k.key === "consumptionOfLiquor"
        ? "As per the hotel policy"
        : "",
  }));

const seedSettings = (): CvSettings => ({
  defaultCurrency: "USD",
  voucherPrefix: "",
  voucherSuffix: "",
  defaultPaymentType: "Full Payment",
  defaultTaxRate: 18,
});

type CvConfigState = {
  hotels: CvHotel[];
  airlines: CvAirline[];
  airports: CvAirport[];
  generalDetails: CvGeneralDetail[];
  settings: CvSettings;
  addHotel: (data: Omit<CvHotel, "id">) => void;
  updateHotel: (id: string, data: Omit<CvHotel, "id">) => void;
  deleteHotel: (id: string) => void;
  addAirline: (data: Omit<CvAirline, "id">) => void;
  updateAirline: (id: string, data: Omit<CvAirline, "id">) => void;
  deleteAirline: (id: string) => void;
  addAirport: (data: Omit<CvAirport, "id">) => void;
  updateAirport: (id: string, data: Omit<CvAirport, "id">) => void;
  deleteAirport: (id: string) => void;
  addGeneralDetail: (data: Omit<CvGeneralDetail, "id">) => void;
  updateGeneralDetail: (id: string, data: Omit<CvGeneralDetail, "id">) => void;
  deleteGeneralDetail: (id: string) => void;
  updateSettings: (data: Partial<CvSettings>) => void;
  resetConfig: () => void;
};

export const useCvConfigStore = create<CvConfigState>()(
  persist(
    (set) => ({
      hotels: seedHotels(),
      airlines: seedAirlines(),
      airports: seedAirports(),
      generalDetails: seedGeneralDetails(),
      settings: seedSettings(),

      addHotel: (data) =>
        set((state) => ({ hotels: [...state.hotels, { id: newId(), ...data }] })),
      updateHotel: (id, data) =>
        set((state) => ({
          hotels: state.hotels.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        })),
      deleteHotel: (id) =>
        set((state) => ({
          hotels: state.hotels.filter((item) => item.id !== id),
        })),

      addAirline: (data) =>
        set((state) => ({
          airlines: [...state.airlines, { id: newId(), ...data }],
        })),
      updateAirline: (id, data) =>
        set((state) => ({
          airlines: state.airlines.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        })),
      deleteAirline: (id) =>
        set((state) => ({
          airlines: state.airlines.filter((item) => item.id !== id),
        })),

      addAirport: (data) =>
        set((state) => ({
          airports: [...state.airports, { id: newId(), ...data }],
        })),
      updateAirport: (id, data) =>
        set((state) => ({
          airports: state.airports.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        })),
      deleteAirport: (id) =>
        set((state) => ({
          airports: state.airports.filter((item) => item.id !== id),
        })),

      addGeneralDetail: (data) =>
        set((state) => ({
          generalDetails: [...state.generalDetails, { id: newId(), ...data }],
        })),
      updateGeneralDetail: (id, data) =>
        set((state) => ({
          generalDetails: state.generalDetails.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        })),
      deleteGeneralDetail: (id) =>
        set((state) => ({
          generalDetails: state.generalDetails.filter((item) => item.id !== id),
        })),

      updateSettings: (data) =>
        set((state) => ({ settings: { ...state.settings, ...data } })),

      resetConfig: () =>
        set({
          hotels: seedHotels(),
          airlines: seedAirlines(),
          airports: seedAirports(),
          generalDetails: seedGeneralDetails(),
          settings: seedSettings(),
        }),
    }),
    {
      name: "xmerge_cv_config",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
