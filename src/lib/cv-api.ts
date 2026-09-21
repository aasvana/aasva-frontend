import api from "@/lib/api.utils";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";
import { TermSnapshot } from "@/lib/terms-api";
import { cleanPackageText } from "@/lib/package-text";
import { capitalizeWords } from "@/lib/text-format";

const DATE_FIELDS = new Set([
  "journeyDate",
  "boardingDate",
  "returnDate",
  "bookingDate",
  "checkinDate",
  "checkoutDate",
  "date",
]);
const TITLE_CASE_FIELDS = new Set(["customerName", "packageName", "hotelName", "destination"]);

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
  const revived = JSON.parse(JSON.stringify(data ?? {}), reviveDates) as Partial<ConfirmationVoucherFormData>;
  return {
    ...revived,
    travellers: Array.isArray(revived.travellers) ? revived.travellers : [],
    hotels: Array.isArray(revived.hotels) ? revived.hotels : [],
    itineraries: Array.isArray(revived.itineraries) ? revived.itineraries : [],
  } as ConfirmationVoucherFormData;
}

function formatDateOnly(value: Date | string): string {
  if (typeof value === "string") return value.slice(0, 10);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function serializeVoucherValue(key: string, value: unknown): unknown {
  if (TITLE_CASE_FIELDS.has(key) && typeof value === "string") {
    return capitalizeWords(value);
  }
  if (DATE_FIELDS.has(key) && (value instanceof Date || typeof value === "string")) {
    return formatDateOnly(value);
  }
  if (
    (key === "packageIncluded" || key === "packageExcluded") &&
    typeof value === "string"
  ) {
    return cleanPackageText(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeVoucherValue("", item));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        serializeVoucherValue(childKey, childValue),
      ]),
    );
  }
  return value;
}

function serializeVoucherData(data: ConfirmationVoucherFormData) {
  const serialized = serializeVoucherValue("", data) as ConfirmationVoucherFormData & {
    customerTitle?: string;
  };
  const title = serialized.customerTitle?.trim();
  if (title && serialized.customerName) {
    serialized.customerName = `${title} ${serialized.customerName.replace(/^(Mr|Mrs|Ms)\s+/i, "")}`.trim();
  }
  const { customerTitle: _customerTitle, ...voucherData } = serialized;
  void _customerTitle;
  return voucherData as ConfirmationVoucherFormData;
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
  termsSnapshot?: TermSnapshot[];
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
  const serializedData = serializeVoucherData(data);
  const { data: saved } = await api.post<ConfirmationVoucherRecord>("/vouchers", {
    voucherNo: serializedData.voucherNo,
    packageId: serializedData.packageId,
    data: serializedData,
  });
  return reviveRecord(saved);
}

export async function apiUpdateVoucher(
  id: string,
  data: ConfirmationVoucherFormData,
): Promise<ConfirmationVoucherRecord> {
  const serializedData = serializeVoucherData(data);
  const { data: updated } = await api.patch<ConfirmationVoucherRecord>(
    `/vouchers/${id}`,
    { voucherNo: serializedData.voucherNo, packageId: serializedData.packageId, data: serializedData },
  );
  return reviveRecord(updated);
}

export async function apiDeleteVoucher(id: string): Promise<void> {
  await api.delete(`/vouchers/${id}`);
}
