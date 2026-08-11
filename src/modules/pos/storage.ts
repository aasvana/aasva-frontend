import { POS_PRODUCTS_KEY, POS_SALES_KEY } from "./constants";
import { PosProduct, PosSale } from "./schema";

export type SavedPosProduct = PosProduct;
export type SavedPosSale = PosSale;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `pos_${Date.now()}`;
}

// ---- Products ----

function readProducts(): PosProduct[] {
  return readJson<PosProduct[]>(POS_PRODUCTS_KEY, []);
}

function writeProducts(list: PosProduct[]): void {
  writeJson(POS_PRODUCTS_KEY, list);
}

export function getProducts(): PosProduct[] {
  return readProducts();
}

export function getProduct(id: string): PosProduct | undefined {
  return readProducts().find((p) => p.id === id);
}

export function saveProduct(product: PosProduct): PosProduct {
  writeProducts([...readProducts(), product]);
  return product;
}

export function updateProduct(
  id: string,
  data: PosProduct
): PosProduct | undefined {
  const list = readProducts();
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  list[index] = data;
  writeProducts(list);
  return data;
}

export function deleteProduct(id: string): void {
  writeProducts(readProducts().filter((p) => p.id !== id));
}

export function assignDefaultOutlet(
  products: PosProduct[],
  outletId: string
): PosProduct[] {
  const migrated = products.map((p) =>
    p.outletId ? p : { ...p, outletId }
  );
  if (migrated.some((p, i) => p !== products[i])) {
    writeProducts(migrated);
  }
  return migrated;
}

// ---- Sales ----

function readSales(): PosSale[] {
  return readJson<PosSale[]>(POS_SALES_KEY, []);
}

function writeSales(list: PosSale[]): void {
  writeJson(POS_SALES_KEY, list);
}

export function getSales(): PosSale[] {
  return readSales();
}

export function getSale(id: string): PosSale | undefined {
  return readSales().find((s) => s.id === id);
}

export function saveSale(sale: PosSale): PosSale {
  writeSales([sale, ...readSales()]);
  return sale;
}

export function deleteSale(id: string): void {
  writeSales(readSales().filter((s) => s.id !== id));
}

export { newId };
