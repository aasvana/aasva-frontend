import api from '@/lib/api.utils';
import type { CvGeneralDetail, CvSettings } from '@/stores/cvConfigStore';

export type TravelSettings = CvSettings & {
  id: string;
  invoicePrefix: string;
  invoiceSuffix: string;
  generalDetails: CvGeneralDetail[];
  createdAt: string;
  updatedAt: string;
};

export type TravelSettingsPatch = Partial<CvSettings> & {
  invoicePrefix?: string;
  invoiceSuffix?: string;
  generalDetails?: CvGeneralDetail[];
};

export async function apiGetTravelSettings(): Promise<TravelSettings> {
  const { data } = await api.get<TravelSettings>('/travel/settings');
  return { ...data, defaultTaxRate: Number(data.defaultTaxRate ?? 0) };
}

export async function apiUpdateTravelSettings(patch: TravelSettingsPatch): Promise<TravelSettings> {
  const { data } = await api.patch<TravelSettings>('/travel/settings', patch);
  return { ...data, defaultTaxRate: Number(data.defaultTaxRate ?? 0) };
}
