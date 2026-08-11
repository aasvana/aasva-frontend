import { PURCHASE_ORDERS_KEY } from "./constants";
import { PurchaseOrderFormData } from "./schema";

export type SavedPurchaseOrder = {
  id: string;
  data: PurchaseOrderFormData;
  savedAt: string;
};

const DATE_FIELDS = new Set(["issueDate", "deliveryDate"]);

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

function readAll(): SavedPurchaseOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PURCHASE_ORDERS_KEY);
    return raw ? (JSON.parse(raw, reviveDates) as SavedPurchaseOrder[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: SavedPurchaseOrder[]): void {
  window.localStorage.setItem(PURCHASE_ORDERS_KEY, JSON.stringify(list));
}

function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `po_${Date.now()}`;
}

export function savePurchaseOrder(
  data: PurchaseOrderFormData
): SavedPurchaseOrder {
  const record: SavedPurchaseOrder = {
    id: newId(),
    data,
    savedAt: new Date().toISOString(),
  };
  writeAll([record, ...readAll()]);
  return record;
}

export function getPurchaseOrder(id: string): SavedPurchaseOrder | undefined {
  return readAll().find((record) => record.id === id);
}

export function getPurchaseOrders(): SavedPurchaseOrder[] {
  return readAll();
}

export function updatePurchaseOrder(
  id: string,
  data: PurchaseOrderFormData
): SavedPurchaseOrder | undefined {
  const list = readAll();
  const index = list.findIndex((record) => record.id === id);
  if (index === -1) return undefined;
  const updated: SavedPurchaseOrder = {
    ...list[index],
    data,
    savedAt: new Date().toISOString(),
  };
  list[index] = updated;
  writeAll(list);
  return updated;
}

export function deletePurchaseOrder(id: string): void {
  writeAll(readAll().filter((record) => record.id !== id));
}
