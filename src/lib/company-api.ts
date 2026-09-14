import api from "@/lib/api.utils";

export type CompanySettings = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};

export type CompanySettingsPatch = Partial<
  Omit<CompanySettings, "id" | "createdAt" | "updatedAt">
>;

function coerceNumbers(raw: Record<string, unknown>): CompanySettings {
  return {
    ...raw,
    defaultTaxRate: Number(raw.defaultTaxRate ?? 0),
  } as unknown as CompanySettings;
}

export async function apiGetCompany(): Promise<CompanySettings> {
  const { data } = await api.get("/company");
  return coerceNumbers(data);
}

export async function apiUpdateCompany(
  patch: CompanySettingsPatch,
): Promise<CompanySettings> {
  const { data } = await api.patch("/company", patch);
  return coerceNumbers(data);
}

export async function apiEnhanceTagline(tagline: string): Promise<string> {
  const { data } = await api.post<{ enhanced: string }>(
    "/company/enhance-tagline",
    { tagline },
  );
  return data.enhanced;
}