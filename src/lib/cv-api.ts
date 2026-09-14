import api from "@/lib/api.utils";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";

const DATE_FIELDS = new Set([
  "journeyDate",
  "boardingDate",
  "returnDate",
  "bookingDate",
  "checkinDate",
  "checkoutDate",
  "date",
]);

export const reviveDates = (key: string, value: unknown) => {
  if (
    DATE_FIELDS.has(key) &&
    typeof value === "string" &&
    value.trim() !== ""
  ) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }
  return value;
};

function reviveVoucherData(data: ConfirmationVoucherFormData): ConfirmationVoucherFormData {
  return JSON.parse(JSON.stringify(data), reviveDates) as ConfirmationVoucherFormData;
}

export type ConfirmationVoucherRecord = {
  id: string;
  voucherNo: string;
  customerName: string;
  companyName: string;
  agentName: string;
  paymentType: string;
  journeyDate: string | null;
  data: ConfirmationVoucherFormData;
  createdAt: string;
  updatedAt: string;
};

type PaginatedVouchers = {
  items: ConfirmationVoucherRecord[];
  total: number;
  page: number;
  limit: number;
};

function reviveRecord(record: ConfirmationVoucherRecord): ConfirmationVoucherRecord {
  return {
    ...record,
    data: reviveVoucherData(record.data),
  };
}

export async function apiGetVouchers(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {},
): Promise<PaginatedVouchers> {
  const { data } = await api.get<PaginatedVouchers>("/vouchers", { params });
  return {
    ...data,
    items: data.items.map(reviveRecord),
  };
}

export async function apiGetVoucher(
  id: string,
): Promise<ConfirmationVoucherRecord> {
  const { data } = await api.get<ConfirmationVoucherRecord>(`/vouchers/${id}`);
  return reviveRecord(data);
}

export async function apiSaveVoucher(
  data: ConfirmationVoucherFormData,
): Promise<ConfirmationVoucherRecord> {
  const { data: saved } = await api.post<ConfirmationVoucherRecord>("/vouchers", {
    voucherNo: data.voucherNo,
    data,
  });
  return reviveRecord(saved);
}

export async function apiUpdateVoucher(
  id: string,
  data: ConfirmationVoucherFormData,
): Promise<ConfirmationVoucherRecord> {
  const { data: updated } = await api.patch<ConfirmationVoucherRecord>(
    `/vouchers/${id}`,
    { voucherNo: data.voucherNo, data },
  );
  return reviveRecord(updated);
}

export async function apiDeleteVoucher(id: string): Promise<void> {
  await api.delete(`/vouchers/${id}`);
}