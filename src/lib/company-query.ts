"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiEnhanceTagline,
  apiGetCompany,
  apiUpdateCompany,
  CompanySettings,
} from "@/lib/company-api";
import { CompanyData, useCompanyStore } from "@/stores/companyStore";
import { useAuthStore } from "@/stores/AuthStore";

export const companyQueryKeys = {
  all: (tenantId: string) => ["company-settings", tenantId] as const,
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
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? "";

  const settingsQuery = useQuery({
    queryKey: companyQueryKeys.all(tenantId),
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
      queryClient.setQueryData(companyQueryKeys.all(tenantId), data);
    },
  });

  return {
    company: settingsQuery.data ? toCompanyData(settingsQuery.data) : null,
    isLoading: settingsQuery.isLoading,
    updateMutation,
  };
}

export function useEnhanceTagline() {
  return useMutation({
    mutationFn: apiEnhanceTagline,
  });
}