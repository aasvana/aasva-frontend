"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiEnhanceTagline,
  apiGetCompany,
  apiUpdateCompany,
  CompanySettings,
} from "@/lib/company-api";
import { CompanyData, useCompanyStore } from "@/stores/companyStore";

export const companyQueryKeys = {
  all: ["company-settings"] as const,
};

function toCompanyData(settings: CompanySettings): CompanyData {
  return {
    name: settings.name,
    shortName: settings.shortName,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    website: settings.website,
    tagline: settings.tagline,
    logo: settings.logo,
    currency: settings.currency,
    gstin: settings.gstin,
    pan: settings.pan,
    tan: settings.tan,
    cin: settings.cin,
    defaultTaxRate: settings.defaultTaxRate,
    businessType: settings.businessType,
    incorporationDate: settings.incorporationDate,
    authorizedSignatory: settings.authorizedSignatory,
  };
}

export function useCompanySettings() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: companyQueryKeys.all,
    queryFn: async () => {
      const data = await apiGetCompany();
      useCompanyStore.getState().updateCompany(toCompanyData(data));
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: apiUpdateCompany,
    onSuccess: (data) => {
      useCompanyStore.getState().updateCompany(toCompanyData(data));
      queryClient.setQueryData(companyQueryKeys.all, data);
    },
  });

  return {
    company: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    updateMutation,
  };
}

export function useEnhanceTagline() {
  return useMutation({
    mutationFn: apiEnhanceTagline,
  });
}