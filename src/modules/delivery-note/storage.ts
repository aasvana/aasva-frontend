import { DELIVERY_NOTES_KEY } from "./constants";
import { DeliveryNoteFormData } from "./schema";

export type SavedDeliveryNote = {
  id: string;
  data: DeliveryNoteFormData;
  savedAt: string;
};

const DATE_FIELDS = new Set(["issueDate"]);

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

function readAll(): SavedDeliveryNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DELIVERY_NOTES_KEY);
    return raw ? (JSON.parse(raw, reviveDates) as SavedDeliveryNote[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: SavedDeliveryNote[]): void {
  window.localStorage.setItem(DELIVERY_NOTES_KEY, JSON.stringify(list));
}

function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `dn_${Date.now()}`;
}

export function saveDeliveryNote(data: DeliveryNoteFormData): SavedDeliveryNote {
  const record: SavedDeliveryNote = {
    id: newId(),
    data,
    savedAt: new Date().toISOString(),
  };
  writeAll([record, ...readAll()]);
  return record;
}

export function getDeliveryNote(id: string): SavedDeliveryNote | undefined {
  return readAll().find((record) => record.id === id);
}

export function getDeliveryNotes(): SavedDeliveryNote[] {
  return readAll();
}

export function updateDeliveryNote(
  id: string,
  data: DeliveryNoteFormData
): SavedDeliveryNote | undefined {
  const list = readAll();
  const index = list.findIndex((record) => record.id === id);
  if (index === -1) return undefined;
  const updated: SavedDeliveryNote = {
    ...list[index],
    data,
    savedAt: new Date().toISOString(),
  };
  list[index] = updated;
  writeAll(list);
  return updated;
}

export function deleteDeliveryNote(id: string): void {
  writeAll(readAll().filter((record) => record.id !== id));
}
