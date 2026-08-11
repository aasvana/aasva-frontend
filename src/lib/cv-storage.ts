import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";

const STORAGE_KEY = "xmerge_confirmation_vouchers";

export type SavedConfirmationVoucher = {
  id: string;
  data: ConfirmationVoucherFormData;
  savedAt: string;
};

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

function readAll(): SavedConfirmationVoucher[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw
      ? (JSON.parse(raw, reviveDates) as SavedConfirmationVoucher[])
      : [];
  } catch {
    return [];
  }
}

function writeAll(list: SavedConfirmationVoucher[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function saveConfirmationVoucher(
  data: ConfirmationVoucherFormData
): SavedConfirmationVoucher {
  const list = readAll();
  const record: SavedConfirmationVoucher = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `cv_${Date.now()}`,
    data,
    savedAt: new Date().toISOString(),
  };
  writeAll([record, ...list]);
  return record;
}

export function getConfirmationVoucher(
  id: string
): SavedConfirmationVoucher | undefined {
  return readAll().find((v) => v.id === id);
}

export function updateConfirmationVoucher(
  id: string,
  data: ConfirmationVoucherFormData
): SavedConfirmationVoucher | undefined {
  const list = readAll();
  const index = list.findIndex((v) => v.id === id);
  if (index === -1) return undefined;
  const updated: SavedConfirmationVoucher = {
    ...list[index],
    data,
    savedAt: new Date().toISOString(),
  };
  list[index] = updated;
  writeAll(list);
  return updated;
}

export function getConfirmationVouchers(): SavedConfirmationVoucher[] {
  return readAll();
}

export function deleteConfirmationVoucher(id: string): void {
  writeAll(readAll().filter((v) => v.id !== id));
}
