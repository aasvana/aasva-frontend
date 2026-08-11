"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { brand } from "@/constants/brand";
import { CURRENCIES } from "@/modules/invoice";

export type CompanyData = {
  name: string;
  shortName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  tagline: string;
  logo: string | null;
  currency: string;
  gstin: string;
  pan: string;
  tan: string;
  cin: string;
  defaultTaxRate: number;
  businessType: string;
  incorporationDate: string;
  authorizedSignatory: string;
};

export const COMPANY_DEFAULTS: CompanyData = {
  name: brand.travelName,
  shortName: brand.name,
  email: brand.contact.email,
  phone: brand.contact.mobile,
  address: brand.contact.address,
  website: brand.url,
  tagline: brand.shortDescription,
  logo: brand.logo.light,
  currency: CURRENCIES[0]?.value ?? "USD",
  gstin: "",
  pan: "",
  tan: "",
  cin: "",
  defaultTaxRate: 0,
  businessType: "Private Limited",
  incorporationDate: "",
  authorizedSignatory: brand.author,
};

interface CompanyState {
  company: CompanyData;
  updateCompany: (data: Partial<CompanyData>) => void;
  resetCompany: () => void;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      company: COMPANY_DEFAULTS,
      updateCompany: (data) =>
        set((state) => ({ company: { ...state.company, ...data } })),
      resetCompany: () => set({ company: COMPANY_DEFAULTS }),
    }),
    { name: "xmerge_company" }
  )
);
