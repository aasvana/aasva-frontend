import { InvoiceFormData } from "./schema";

const STORAGE_KEY = "xmerge_invoices";

export type SavedInvoice = {
  id: string;
  data: InvoiceFormData;
  savedAt: string;
};

const DATE_FIELDS = new Set(["issueDate", "dueDate"]);

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

function readAll(): SavedInvoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw, reviveDates) as SavedInvoice[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: SavedInvoice[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `inv_${Date.now()}`;
}

export function saveInvoice(data: InvoiceFormData): SavedInvoice {
  const list = readAll();
  const record: SavedInvoice = {
    id: newId(),
    data,
    savedAt: new Date().toISOString(),
  };
  writeAll([record, ...list]);
  return record;
}

export function getInvoice(id: string): SavedInvoice | undefined {
  return readAll().find((v) => v.id === id);
}

export function getInvoices(): SavedInvoice[] {
  return readAll();
}

export function updateInvoice(
  id: string,
  data: InvoiceFormData
): SavedInvoice | undefined {
  const list = readAll();
  const index = list.findIndex((v) => v.id === id);
  if (index === -1) return undefined;
  const updated: SavedInvoice = {
    ...list[index],
    data,
    savedAt: new Date().toISOString(),
  };
  list[index] = updated;
  writeAll(list);
  return updated;
}

export function deleteInvoice(id: string): void {
  writeAll(readAll().filter((v) => v.id !== id));
}
