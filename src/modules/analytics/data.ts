import { computeTotals } from "@/modules/invoice/schema";
import { getInvoices, SavedInvoice } from "@/modules/invoice/storage";
import { getProducts, getSales } from "@/modules/pos/storage";
import { useAccountingStore } from "@/stores/accountingStore";
import { useAccountStore } from "@/stores/accountStore";
import { useApprovalStore } from "@/stores/approvalStore";
import { useAuditLogStore } from "@/stores/auditStore";
import { useBillStore } from "@/stores/billStore";
import { useBookingStore } from "@/stores/bookingStore";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import { useCustomerStore } from "@/stores/customerStore";
import { useDeliveryStore } from "@/stores/deliveryStore";
import { useEnquiryStore } from "@/stores/enquiryStore";
import { useExpenseClaimStore } from "@/stores/expenseClaimStore";
import { useItineraryStore } from "@/stores/itineraryStore";
import { useOutletStore } from "@/stores/outletStore";
import { useStockAdjustmentStore } from "@/stores/stockAdjustmentStore";
import { useStockTransferStore } from "@/stores/stockTransferStore";
import { useSupplierPaymentStore } from "@/stores/supplierPaymentStore";
import { useSupplierStore } from "@/stores/supplierStore";
import { useTravelDocumentStore } from "@/stores/travelDocumentStore";
import { useUserRequestStore } from "@/stores/userRequestStore";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function money(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${Math.abs(n).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

export function moneyCompact(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)}Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(1)}L`;
  if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1)}k`;
  return `${sign}₹${Math.round(abs)}`;
}

export function num(n: number): string {
  return n.toLocaleString("en-IN");
}

export function toNum(v: string | number | null | undefined): number {
  if (typeof v === "number") return v;
  const n = Number(v ?? "");
  return isNaN(n) ? 0 : n;
}

function asDate(v: string | Date | null | undefined): Date | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function lastNMonths(n: number): { key: string; label: string }[] {
  const now = new Date();
  const out: { key: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: monthKey(d), label: MONTHS[d.getMonth()] });
  }
  return out;
}

function monthlyAggregate<T>(
  items: T[],
  getDate: (t: T) => string | Date | null | undefined,
  value: (t: T) => number,
  n = 12
): { label: string; key: string; value: number }[] {
  const months = lastNMonths(n);
  const sums = new Map(months.map((m) => [m.key, 0]));
  for (const item of items) {
    const d = asDate(getDate(item));
    if (!d) continue;
    const k = monthKey(d);
    if (!sums.has(k)) continue;
    sums.set(k, (sums.get(k) ?? 0) + (value(item) || 0));
  }
  return months.map((m) => ({
    label: m.label,
    key: m.key,
    value: Math.round(sums.get(m.key) ?? 0),
  }));
}

function countBy<T>(items: T[], key: (t: T) => string): { label: string; value: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item) || "—";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function sumBy<T>(items: T[], value: (t: T) => number): number {
  return items.reduce((sum, item) => sum + (value(item) || 0), 0);
}

export function invoiceTotal(inv: SavedInvoice): number {
  return computeTotals(inv.data).total || 0;
}

export function invoiceBalance(inv: SavedInvoice): number {
  return computeTotals(inv.data).balance || 0;
}

export function invoicePaid(inv: SavedInvoice): number {
  return computeTotals(inv.data).paid || 0;
}

const ACTIVE_STATUSES = new Set(["draft", "cancelled"]);

// ---- Sales ----

export function salesOverview() {
  const invoices = getInvoices();
  const sales = getSales();
  const active = invoices.filter((i) => !ACTIVE_STATUSES.has(i.data.status));
  const revenue = sumBy(active, invoiceTotal);
  const received = sumBy(active, invoicePaid);
  const openBalance = sumBy(active, invoiceBalance);
  const posRevenue = sumBy(sales, (s) => s.total);
  const avgInvoice = active.length ? revenue / active.length : 0;
  return {
    revenue,
    received,
    openBalance,
    posRevenue,
    invoiceCount: active.length,
    posCount: sales.length,
    avgInvoice,
  };
}

export function monthlyRevenue(n = 12) {
  const invoice = monthlyAggregate(
    getInvoices(),
    (i) => i.data.issueDate,
    invoiceTotal,
    n
  );
  const pos = monthlyAggregate(
    getSales(),
    (s) => s.createdAt,
    (s) => s.total,
    n
  );
  return invoice.map((m, i) => ({
    label: m.label,
    invoices: m.value,
    pos: pos[i].value,
  }));
}

export function salesByStatus() {
  const invoices = getInvoices();
  const map = new Map<string, { count: number; amount: number }>();
  for (const inv of invoices) {
    const label = inv.data.status || "Draft";
    const cur = map.get(label) ?? { count: 0, amount: 0 };
    cur.count += 1;
    cur.amount += invoiceTotal(inv);
    map.set(label, cur);
  }
  return [...map.entries()]
    .map(([label, v]) => ({ label, ...v }))
    .sort((a, b) => b.amount - a.amount);
}

export function topProductsByRevenue(limit = 6) {
  const map = new Map<string, { qty: number; revenue: number }>();
  const bump = (name: string, qty: number, revenue: number) => {
    if (!name) return;
    const cur = map.get(name) ?? { qty: 0, revenue: 0 };
    cur.qty += qty;
    cur.revenue += revenue;
    map.set(name, cur);
  };
  for (const sale of getSales()) {
    for (const item of sale.items) {
      bump(item.name, item.qty, item.qty * item.rate);
    }
  }
  for (const inv of getInvoices()) {
    for (const item of inv.data.items) {
      bump(item.description, toNum(item.qty), toNum(item.qty) * toNum(item.rate));
    }
  }
  return [...map.entries()]
    .map(([label, v]) => ({ label, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function recentInvoices(limit = 6) {
  return getInvoices()
    .slice(0, limit)
    .map((inv) => ({
      id: inv.id,
      label: inv.data.invoiceNo,
      party: inv.data.billTo?.name ?? "—",
      status: inv.data.status || "Draft",
      amount: invoiceTotal(inv),
    }));
}

// ---- Customers ----

export function topCustomersBySpend(limit = 6) {
  const customers = useCustomerStore.getState().customers;
  const profiles = useCustomerProfileStore.getState().profiles;
  const map = new Map<string, { spend: number; orders: number }>();
  const bump = (name: string, spend: number, orders: number) => {
    if (!name) return;
    const cur = map.get(name) ?? { spend: 0, orders: 0 };
    cur.spend += spend;
    cur.orders += orders;
    map.set(name, cur);
  };
  for (const customer of customers) {
    const p = profiles[customer.id];
    const invoices = sumBy(p?.sales?.invoices ?? [], (x) => toNum(x.amount));
    const bookings = sumBy(p?.travel?.bookings ?? [], (x) => toNum(x.amount));
    const orderCount = (p?.sales?.orders ?? []).length;
    if (invoices + bookings > 0 || orderCount > 0) {
      bump(customer.name, invoices + bookings, orderCount);
    }
  }
  for (const sale of getSales()) {
    if (sale.customerName) bump(sale.customerName, sale.total, 1);
  }
  return [...map.entries()]
    .map(([label, v]) => ({ label, ...v }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, limit);
}

export function customerOverview() {
  const customers = useCustomerStore.getState().customers;
  const profiles = useCustomerProfileStore.getState().profiles;
  const current = monthKey(new Date());
  let newThisMonth = 0;
  let orders = 0;
  let invoices = 0;
  let payments = 0;
  let bookings = 0;
  let spend = 0;
  for (const customer of customers) {
    const p = profiles[customer.id];
    const createdActivity = (p?.activity ?? []).find(
      (a) => a.action === "created"
    );
    const created = asDate(createdActivity?.timestamp);
    if (created && monthKey(created) === current) newThisMonth += 1;
    orders += p?.sales?.orders?.length ?? 0;
    invoices += p?.sales?.invoices?.length ?? 0;
    payments += p?.sales?.payments?.length ?? 0;
    bookings += p?.travel?.bookings?.length ?? 0;
    spend += sumBy(p?.sales?.invoices ?? [], (x) => toNum(x.amount));
    spend += sumBy(p?.travel?.bookings ?? [], (x) => toNum(x.amount));
  }
  const top = topCustomersBySpend(1)[0];
  return {
    total: customers.length,
    newThisMonth,
    orders,
    invoices,
    payments,
    bookings,
    spend,
    topSpender: top?.label ?? "—",
    topSpend: top?.spend ?? 0,
  };
}

export function customersByCompany() {
  const customers = useCustomerStore.getState().customers;
  const map = new Map<string, number>();
  for (const customer of customers) {
    const company = customer.company || "Independent";
    map.set(company, (map.get(company) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

// ---- Products ----

export function productOverview() {
  const products = getProducts();
  const totalStock = sumBy(products, (p) => p.stock);
  const stockValue = sumBy(products, (p) => (p.price || 0) * (p.stock || 0));
  const avgPrice = products.length
    ? sumBy(products, (p) => p.price) / products.length
    : 0;
  const lowStock = products.filter((p) => (p.stock || 0) <= 5).length;
  return { total: products.length, totalStock, stockValue, avgPrice, lowStock };
}

export function productsByCategory() {
  const map = new Map<string, { count: number; units: number; value: number }>();
  for (const p of getProducts()) {
    const label = p.category || "Uncategorised";
    const cur = map.get(label) ?? { count: 0, units: 0, value: 0 };
    cur.count += 1;
    cur.units += p.stock || 0;
    cur.value += (p.price || 0) * (p.stock || 0);
    map.set(label, cur);
  }
  return [...map.entries()]
    .map(([label, v]) => ({ label, ...v }))
    .sort((a, b) => b.value - a.value);
}

export function lowStockProducts(limit = 8) {
  return getProducts()
    .filter((p) => (p.stock || 0) <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, limit)
    .map((p) => ({
      label: p.name,
      sku: p.sku || "—",
      category: p.category || "—",
      stock: p.stock || 0,
      value: (p.price || 0) * (p.stock || 0),
    }));
}

// ---- Inventory ----

export function inventoryOverview() {
  const products = getProducts();
  const adjustments = useStockAdjustmentStore.getState().adjustments;
  const transfers = useStockTransferStore.getState().transfers;
  const stockValue = sumBy(products, (p) => (p.price || 0) * (p.stock || 0));
  const units = sumBy(products, (p) => p.stock);
  const netDelta = sumBy(adjustments, (a) => a.delta);
  const adjustmentMonthly = monthlyAggregate(
    adjustments,
    (a) => a.createdAt,
    (a) => a.delta || 0
  );
  const transferMonthly = monthlyAggregate(
    transfers,
    (t) => t.createdAt,
    (t) => toNum(t.qty)
  );
  return {
    stockValue,
    units,
    adjustments: adjustments.length,
    transfers: transfers.length,
    netDelta,
    monthly: adjustmentMonthly.map((m, i) => ({
      label: m.label,
      adjustments: m.value,
      transfers: transferMonthly[i].value,
    })),
  };
}

export function stockByOutlet() {
  const outlets = useOutletStore.getState().outlets;
  const products = getProducts();
  return outlets.map((outlet) => {
    const list = products.filter((p) => p.outletId === outlet.id);
    return {
      id: outlet.id,
      name: outlet.name,
      products: list.length,
      units: sumBy(list, (p) => p.stock),
      value: sumBy(list, (p) => (p.price || 0) * (p.stock || 0)),
    };
  });
}

// ---- Outlets ----

export function outletOverview() {
  const outlets = useOutletStore.getState().outlets;
  const products = getProducts();
  const sales = getSales();
  return outlets.map((outlet) => {
    const plist = products.filter((p) => p.outletId === outlet.id);
    const slist = sales.filter((s) => s.outletId === outlet.id);
    return {
      id: outlet.id,
      name: outlet.name,
      code: outlet.code || "—",
      products: plist.length,
      units: sumBy(plist, (p) => p.stock),
      sales: slist.length,
      revenue: sumBy(slist, (s) => s.total),
    };
  });
}

// ---- Travel ----

export function travelOverview() {
  const bookings = useBookingStore.getState().bookings;
  const enquiries = useEnquiryStore.getState().enquiries;
  const itineraries = useItineraryStore.getState().itineraries;
  const suppliers = useSupplierStore.getState().suppliers;
  const documents = useTravelDocumentStore.getState().documents;
  const revenue = sumBy(bookings, (b) => toNum(b.amount));
  const openEnquiries = enquiries.filter((e) =>
    /open|pending|new|enquired|received/i.test(e.status || "")
  ).length;
  const bookingsByStatus = countBy(bookings, (b) => b.status);
  const bookingsByCategory = countBy(bookings, (b) => b.category);
  const revenueByCategory = new Map<string, number>();
  for (const b of bookings) {
    const label = b.category || "Other";
    revenueByCategory.set(label, (revenueByCategory.get(label) ?? 0) + toNum(b.amount));
  }
  const revenueByCategoryList = [...revenueByCategory.entries()]
    .map(([label, value]) => ({ label, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);
  const monthly = monthlyAggregate(bookings, (b) => b.createdAt, (b) => toNum(b.amount));
  const topSuppliers = countBy(bookings, (b) => b.supplierName || "Direct");
  return {
    bookings: bookings.length,
    revenue,
    enquiries: enquiries.length,
    openEnquiries,
    itineraries: itineraries.length,
    suppliers: suppliers.length,
    documents: documents.length,
    bookingsByStatus,
    bookingsByCategory,
    revenueByCategory: revenueByCategoryList,
    monthly,
    topSuppliers: topSuppliers.slice(0, 6),
  };
}

export function recentBookings(limit = 6) {
  const bookings = useBookingStore.getState().bookings;
  return bookings.slice(0, limit).map((b) => ({
    id: b.id,
    label: b.reference,
    party: b.customerName,
    service: b.service,
    status: b.status,
    amount: toNum(b.amount),
  }));
}

// ---- Delivery ----

export function deliveryOverview() {
  const { deliveries, partners, zones, charges } = useDeliveryStore.getState();
  const delivered = deliveries.filter((d) => d.status === "Delivered").length;
  const inTransit = deliveries.filter((d) => d.status === "In Transit").length;
  const pending = deliveries.filter(
    (d) => d.status === "Pending" || d.status === "Ready for Dispatch"
  ).length;
  const failed = deliveries.filter((d) => d.status === "Failed").length;
  const chargeTotal = sumBy(deliveries, (d) => toNum(d.charge));
  const codTotal = sumBy(deliveries, (d) =>
    String(d.cod).toLowerCase() === "yes" ? toNum(d.charge) : 0
  );
  const byStatus = countBy(deliveries, (d) => d.status);
  const byZone = countBy(deliveries, (d) => d.zoneName || "—");
  const partnerStats = partners
    .map((p) => {
      const list = deliveries.filter((d) => d.partnerName === p.name);
      return {
        name: p.name,
        count: list.length,
        delivered: list.filter((d) => d.status === "Delivered").length,
        active: p.isActive === "Yes",
      };
    })
    .sort((a, b) => b.count - a.count);
  return {
    total: deliveries.length,
    delivered,
    inTransit,
    pending,
    failed,
    chargeTotal,
    codTotal,
    byStatus,
    byZone,
    partnerStats,
    partners: partners.length,
    zones: zones.length,
    charges: charges.length,
  };
}

export function recentDeliveries(limit = 6) {
  const deliveries = useDeliveryStore.getState().deliveries;
  return deliveries.slice(0, limit).map((d) => ({
    id: d.id,
    label: d.deliveryNo,
    party: d.customerName,
    zone: d.zoneName || "—",
    status: d.status,
    amount: toNum(d.charge),
  }));
}

// ---- Finance ----

export function financeOverview() {
  const invoices = getInvoices();
  const entries = useAccountingStore.getState().entries;
  const bills = useBillStore.getState().bills;
  const accounts = useAccountStore.getState().accounts;
  const claims = useExpenseClaimStore.getState().claims;
  const supplierPayments = useSupplierPaymentStore.getState().payments;
  const active = invoices.filter((i) => !ACTIVE_STATUSES.has(i.data.status));
  const revenue = sumBy(active, invoiceTotal);
  const received = sumBy(active, invoicePaid);
  const receivables = sumBy(active, invoiceBalance);
  const claimExpenses = sumBy(claims, (c) =>
    c.status === "Approved" || c.status === "Reimbursed" ? toNum(c.amount) : 0
  );
  const entryExpenses = sumBy(
    entries.filter((e) => e.type === "expense"),
    (e) => toNum(e.amount)
  );
  const expenses = entryExpenses + claimExpenses;
  const payables = sumBy(
    bills.filter((b) => b.status === "Pending" || b.status === "Approved"),
    (b) => toNum(b.amount)
  );
  const bank = sumBy(
    accounts.filter((a) => a.kind === "bank"),
    (a) => toNum(a.openingBalance)
  );
  const cash = sumBy(
    accounts.filter((a) => a.kind === "cash"),
    (a) => toNum(a.openingBalance)
  );
  const paymentsOut = sumBy(supplierPayments, (p) => toNum(p.amount));
  const incomeByMonth = monthlyAggregate(active, (i) => i.data.issueDate, invoiceTotal);
  const expenseByMonth = monthlyAggregate(
    entries.filter((e) => e.type === "expense"),
    (e) => e.date,
    (e) => toNum(e.amount)
  );
  return {
    revenue,
    received,
    receivables,
    expenses,
    payables,
    bank,
    cash,
    paymentsOut,
    net: revenue - expenses,
    billsByStatus: countBy(bills, (b) => b.status),
    incomeByMonth,
    expenseByMonth,
    monthly: incomeByMonth.map((m, i) => ({
      label: m.label,
      income: m.value,
      expenses: expenseByMonth[i].value,
    })),
  };
}

// ---- Expenses ----

type ExpenseRecord = {
  date: string;
  category: string;
  amount: number;
  source: string;
};

export function expenseRecords() {
  const records: ExpenseRecord[] = [];
  for (const e of useAccountingStore
    .getState()
    .entries.filter((x) => x.type === "expense")) {
    records.push({
      date: e.date,
      category: e.category || "Other",
      amount: toNum(e.amount),
      source: "Entry",
    });
  }
  for (const c of useExpenseClaimStore.getState().claims) {
    records.push({
      date: c.date,
      category: c.category,
      amount: toNum(c.amount),
      source: "Claim",
    });
  }
  for (const b of useBillStore.getState().bills) {
    records.push({
      date: b.date,
      category: b.category || "Other",
      amount: toNum(b.amount),
      source: "Bill",
    });
  }
  return records;
}

export function expenseOverview() {
  const records = expenseRecords();
  const monthly = monthlyAggregate(records, (r) => r.date, (r) => r.amount);
  const byCategory = new Map<string, number>();
  for (const r of records) {
    byCategory.set(r.category, (byCategory.get(r.category) ?? 0) + r.amount);
  }
  const claimed = sumBy(
    useExpenseClaimStore.getState().claims.filter(
      (c) => c.status === "Approved" || c.status === "Reimbursed"
    ),
    (c) => toNum(c.amount)
  );
  return {
    total: sumBy(records, (r) => r.amount),
    thisMonth: monthly.length ? monthly[monthly.length - 1].value : 0,
    records: records.length,
    claimed,
    monthly,
    byCategory: [...byCategory.entries()]
      .map(([label, value]) => ({ label, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value),
  };
}

export function recentExpenseClaims(limit = 6) {
  return useExpenseClaimStore.getState().claims.slice(0, limit).map((c) => ({
    id: c.id,
    label: c.claimNo,
    party: c.employee,
    category: c.category,
    status: c.status,
    amount: toNum(c.amount),
  }));
}

// ---- Team ----

export function teamOverview() {
  const audit = useAuditLogStore.getState().entries;
  const requests = useUserRequestStore.getState().requests;
  const approvals = useApprovalStore.getState().approvals;
  const profiles = useCustomerProfileStore.getState().profiles;
  const actors = new Map<string, number>();
  for (const entry of audit) {
    const actor = entry.actor || "System";
    actors.set(actor, (actors.get(actor) ?? 0) + 1);
  }
  const activityByActor = [...actors.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  const agents = new Map<string, number>();
  for (const customer of useCustomerStore.getState().customers) {
    const p = profiles[customer.id];
    for (const message of p?.communication ?? []) {
      const agent = message.agent || "Unassigned";
      agents.set(agent, (agents.get(agent) ?? 0) + 1);
    }
  }
  const activityByAgent = [...agents.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  const openRequests = requests.filter(
    (r) => r.status === "Open" || r.status === "In Progress"
  ).length;
  const pendingApprovals = approvals.filter(
    (a) => a.status === "Pending"
  ).length;
  const monthly = monthlyAggregate(audit, (e) => e.timestamp, () => 1);
  return {
    actors: actors.size,
    activity: audit.length,
    monthly,
    activityByActor: activityByActor.slice(0, 8),
    openRequests,
    totalRequests: requests.length,
    requestsByAssignee: countBy(requests, (r) => r.assignedTo || "Unassigned"),
    pendingApprovals,
    totalApprovals: approvals.length,
    approvalsByReviewer: countBy(approvals, (a) => a.reviewer || "—"),
    activityByAgent,
  };
}
