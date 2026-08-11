import { GUIDES } from "@/components/guides/guides-data";
import { getConfirmationVouchers } from "@/lib/cv-storage";
import { getDeliveryNotes } from "@/modules/delivery-note/storage";
import { getInvoices } from "@/modules/invoice/storage";
import { getProducts, getSales } from "@/modules/pos/storage";
import { getPurchaseOrders } from "@/modules/purchase-order/storage";
import { useAccountingStore } from "@/stores/accountingStore";
import { useAccountStore } from "@/stores/accountStore";
import { useApprovalStore } from "@/stores/approvalStore";
import { useAuditLogStore } from "@/stores/auditStore";
import { useBankTransactionStore } from "@/stores/bankTransactionStore";
import { useBillStore } from "@/stores/billStore";
import { useBookingStore } from "@/stores/bookingStore";
import { useChartOfAccountsStore } from "@/stores/chartOfAccountsStore";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import { useCustomerStore } from "@/stores/customerStore";
import { useDeliveryStore } from "@/stores/deliveryStore";
import { useEnquiryStore } from "@/stores/enquiryStore";
import { useExpenseClaimStore } from "@/stores/expenseClaimStore";
import { useItineraryStore } from "@/stores/itineraryStore";
import { useJournalStore } from "@/stores/journalStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useOutletStore } from "@/stores/outletStore";
import { useStockAdjustmentStore } from "@/stores/stockAdjustmentStore";
import { useStockTransferStore } from "@/stores/stockTransferStore";
import { useSupplierPaymentStore } from "@/stores/supplierPaymentStore";
import { useSupplierStore } from "@/stores/supplierStore";
import { useTaxStore } from "@/stores/taxStore";
import { useTravelDocumentStore } from "@/stores/travelDocumentStore";
import { useUserRequestStore } from "@/stores/userRequestStore";

export type SearchResult = {
  id: string;
  group: string;
  label: string;
  subtitle: string;
  href: string;
  keywords: string;
  customerId?: string;
};

export const GROUPS: string[] = [
  "Modules",
  "Guides",
  "Customers",
  "Customer Orders",
  "Customer Invoices",
  "Customer Payments",
  "Customer Credit Notes",
  "Customer Refunds",
  "Customer Bookings",
  "Customer Documents",
  "Customer Communication",
  "Customer Notes",
  "Invoices",
  "Estimates",
  "Credit Notes",
  "Debit Notes",
  "Receipts",
  "Expenses",
  "Bills",
  "Purchase Orders",
  "Delivery Notes",
  "Confirmation Vouchers",
  "Accounts",
  "Bank Transactions",
  "Chart of Accounts",
  "Journal Entries",
  "Tax Rates",
  "Supplier Payments",
  "Expense Claims",
  "Travel Bookings",
  "Enquiries",
  "Itineraries",
  "Suppliers",
  "Travel Documents",
  "Products",
  "POS Sales",
  "Outlets",
  "Stock Adjustments",
  "Stock Transfers",
  "Deliveries",
  "Delivery Partners",
  "Delivery Zones",
  "Delivery Charges",
  "User Requests",
  "Approvals",
  "Notifications",
  "Audit Log",
];

export const GROUP_HREF: Record<string, string> = {
  Modules: "/dashboard",
  Guides: "/dashboard/guides",
  Customers: "/dashboard/customer/overview",
  "Customer Orders": "/dashboard/customer/orders",
  "Customer Invoices": "/dashboard/customer/invoices",
  "Customer Payments": "/dashboard/customer/payments",
  "Customer Credit Notes": "/dashboard/customer/credit-notes",
  "Customer Refunds": "/dashboard/customer/refunds",
  "Customer Bookings": "/dashboard/customer/bookings",
  "Customer Documents": "/dashboard/customer/documents",
  "Customer Communication": "/dashboard/customer/communication",
  "Customer Notes": "/dashboard/customer/notes",
  Invoices: "/dashboard/invoices",
  Estimates: "/dashboard/estimates",
  "Credit Notes": "/dashboard/credit-notes",
  "Debit Notes": "/dashboard/debit-notes",
  Receipts: "/dashboard/receipts",
  Expenses: "/dashboard/expenses",
  Bills: "/dashboard/bills",
  "Purchase Orders": "/dashboard/purchase-orders",
  "Delivery Notes": "/dashboard/delivery-notes",
  "Confirmation Vouchers": "/dashboard/confirmation-vouchers",
  Accounts: "/dashboard/bank-accounts",
  "Bank Transactions": "/dashboard/bank-transactions",
  "Chart of Accounts": "/dashboard/chart-of-accounts",
  "Journal Entries": "/dashboard/journal-entries",
  "Tax Rates": "/dashboard/tax-rates",
  "Supplier Payments": "/dashboard/supplier-payments",
  "Expense Claims": "/dashboard/expense-claims",
  "Travel Bookings": "/dashboard/travel/bookings",
  Enquiries: "/dashboard/travel/enquiries",
  Itineraries: "/dashboard/travel/itineraries",
  Suppliers: "/dashboard/travel/suppliers/hotels",
  "Travel Documents": "/dashboard/travel/documents",
  Products: "/dashboard/pos/products",
  "POS Sales": "/dashboard/pos/sales",
  Outlets: "/dashboard/pos/outlets",
  "Stock Adjustments": "/dashboard/pos/stock/adjustments",
  "Stock Transfers": "/dashboard/pos/transfers",
  Deliveries: "/dashboard/delivery/deliveries",
  "Delivery Partners": "/dashboard/delivery/partners",
  "Delivery Zones": "/dashboard/delivery/zones",
  "Delivery Charges": "/dashboard/delivery/charges",
  "User Requests": "/dashboard/requests/all",
  Approvals: "/dashboard/auditing/approval-history",
  Notifications: "/dashboard/notifications",
  "Audit Log": "/dashboard/auditing/audit-trail",
};

const MODULE_LINKS: Array<[string, string, string]> = [
  ["Dashboard", "Home and workspace overview", "/dashboard"],
  ["Accounting", "Bills, invoices, bank and reports", "/dashboard/accounting/dashboard"],
  ["Auditing", "Activity log and approvals", "/dashboard/auditing/overview"],
  ["Travel", "Bookings, enquiries and itineraries", "/dashboard/travel/dashboard"],
  ["Customers", "Customer profiles and records", "/dashboard/customer/overview"],
  ["Delivery", "Deliveries, dispatch and partners", "/dashboard/delivery/overview"],
  ["Store / POS", "Products, sales and outlets", "/dashboard/pos/overview"],
  ["Invoices", "Sales invoices", "/dashboard/invoices"],
  ["Estimates", "Sales estimates", "/dashboard/estimates"],
  ["Credit Notes", "Customer credit notes", "/dashboard/credit-notes"],
  ["Debit Notes", "Vendor debit notes", "/dashboard/debit-notes"],
  ["Receipts", "Money receipts", "/dashboard/receipts"],
  ["Expenses", "Expense entries", "/dashboard/expenses"],
  ["Bills", "Supplier bills", "/dashboard/bills"],
  ["Bank Accounts", "Bank account registers", "/dashboard/bank-accounts"],
  ["Cash Accounts", "Cash account registers", "/dashboard/cash-accounts"],
  ["Bank Transactions", "Bank statement transactions", "/dashboard/bank-transactions"],
  ["Reconciliation", "Reconcile bank entries", "/dashboard/reconciliation"],
  ["Chart of Accounts", "Chart of accounts", "/dashboard/chart-of-accounts"],
  ["Journal Entries", "Journal entries", "/dashboard/journal-entries"],
  ["General Ledger", "General ledger", "/dashboard/general-ledger"],
  ["Trial Balance", "Trial balance", "/dashboard/trial-balance"],
  ["Tax Rates", "Tax configuration", "/dashboard/tax-rates"],
  ["Tax Returns", "Tax returns", "/dashboard/tax-returns"],
  ["Reports", "Financial reports", "/dashboard/reports/profit-loss"],
  ["Purchase Orders", "Purchase orders", "/dashboard/purchase-orders"],
  ["Delivery Notes", "Sales delivery notes", "/dashboard/delivery-notes"],
  ["Confirmation Vouchers", "Travel vouchers", "/dashboard/confirmation-vouchers"],
  ["Travel Bookings", "Travel bookings", "/dashboard/travel/bookings"],
  ["Enquiries", "Travel enquiries", "/dashboard/travel/enquiries"],
  ["Itineraries", "Travel itineraries", "/dashboard/travel/itineraries"],
  ["Travel Documents", "Travel documents", "/dashboard/travel/documents"],
  ["POS Products", "Products and inventory", "/dashboard/pos/products"],
  ["POS Sales", "Sales register", "/dashboard/pos/sales"],
  ["Outlets", "POS outlets", "/dashboard/pos/outlets"],
  ["Stock Adjustments", "Stock adjustments", "/dashboard/pos/stock/adjustments"],
  ["Stock Transfers", "Stock transfers", "/dashboard/pos/transfers"],
  ["Low Stock", "Low stock report", "/dashboard/pos/stock/low-stock"],
  ["Deliveries", "Delivery orders", "/dashboard/delivery/deliveries"],
  ["Dispatch", "Dispatch board", "/dashboard/delivery/dispatch"],
  ["Delivery Partners", "Partner fleet", "/dashboard/delivery/partners"],
  ["Delivery Zones", "Zones and rates", "/dashboard/delivery/zones"],
  ["Delivery Charges", "Charge configuration", "/dashboard/delivery/charges"],
  ["User Requests", "Requests overview", "/dashboard/requests/overview"],
  ["Notifications", "Notification centre", "/dashboard/notifications"],
  ["Audit Trail", "Full audit trail", "/dashboard/auditing/audit-trail"],
  ["Approval History", "Approvals", "/dashboard/auditing/approval-history"],
  ["Guides", "Help and step-by-step guides", "/dashboard/guides"],
  ["Help Center", "Overview of the Help Center", "/dashboard/help-center"],
  ["Knowledge Base", "In-depth articles for every module", "/dashboard/knowledge-base"],
  ["FAQs", "Frequently asked questions", "/dashboard/faqs"],
  ["Troubleshooting", "Common issues and fixes", "/dashboard/troubleshooting"],
  ["What's New", "Release notes and changelog", "/dashboard/whats-new"],
  ["Settings", "App settings", "/dashboard/settings"],
];

function allOf(
  ...values: Array<string | number | boolean | null | undefined | string[]>
): string {
  return values
    .flat()
    .filter((v) => v !== null && v !== undefined)
    .join(" ")
    .toLowerCase();
}

function result(
  group: string,
  label: string,
  subtitle: string,
  href: string,
  keywords: string,
  customerId?: string,
  id?: string
): SearchResult {
  return {
    id: id ?? `${group}-${href}-${label}`,
    group,
    label,
    subtitle,
    href,
    keywords,
    customerId,
  };
}

const ENTRY_GROUPS: Record<string, string> = {
  estimate: "Estimates",
  "credit-note": "Credit Notes",
  "debit-note": "Debit Notes",
  receipt: "Receipts",
  expense: "Expenses",
};

const ENTRY_HREF: Record<string, string> = {
  estimate: "/dashboard/estimates",
  "credit-note": "/dashboard/credit-notes",
  "debit-note": "/dashboard/debit-notes",
  receipt: "/dashboard/receipts",
  expense: "/dashboard/expenses",
};

const REQUEST_HREF: Record<string, string> = {
  support: "/dashboard/requests/support",
  feature: "/dashboard/requests/features",
  feedback: "/dashboard/requests/feedback",
  bug: "/dashboard/requests/bugs",
  complaint: "/dashboard/requests/complaints",
  announcement: "/dashboard/requests/announcements",
};

const SUPPLIER_HREF: Record<string, string> = {
  hotel: "/dashboard/travel/suppliers/hotels",
  airline: "/dashboard/travel/suppliers/airlines",
  transport: "/dashboard/travel/suppliers/transport",
  activity: "/dashboard/travel/suppliers/activities",
};

export function indexAll(): SearchResult[] {
  const out: SearchResult[] = [];

  for (const [label, subtitle, href] of MODULE_LINKS) {
    out.push(result("Modules", label, subtitle, href, allOf(label, subtitle, href)));
  }

  for (const guide of GUIDES) {
    out.push(
      result(
        "Guides",
        guide.title,
        `${guide.module} · ${guide.minutes} min read`,
        "/dashboard/guides",
        allOf(
          guide.title,
          guide.module,
          guide.description,
          guide.steps.map((s) => s.title)
        )
      )
    );
  }

  const customers = useCustomerStore.getState().customers;
  const profiles = useCustomerProfileStore.getState().profiles;
  for (const customer of customers) {
    const customerWords = allOf(customer.name, customer.company, customer.email, customer.phone);
    out.push(
      result(
        "Customers",
        customer.name,
        `${customer.company || customer.email} · Customer profile`,
        "/dashboard/customer/overview",
        customerWords,
        customer.id
      )
    );

    const profile = profiles[customer.id];
    if (!profile) continue;
    const cid = customer.id;
    const cname = customer.name;

    for (const record of profile.sales.orders ?? []) {
      out.push(
        result(
          "Customer Orders",
          record.orderNo,
          `${cname} · ${record.status} · ${record.amount}`,
          "/dashboard/customer/orders",
          allOf(customerWords, record.orderNo, record.status, record.amount, record.notes),
          cid,
          `co-${record.id}`
        )
      );
    }
    for (const record of profile.sales.invoices ?? []) {
      out.push(
        result(
          "Customer Invoices",
          record.invoiceNo,
          `${cname} · ${record.status} · ${record.amount}`,
          "/dashboard/customer/invoices",
          allOf(customerWords, record.invoiceNo, record.status, record.amount, record.currency),
          cid,
          `ci-${record.id}`
        )
      );
    }
    for (const record of profile.sales.payments ?? []) {
      out.push(
        result(
          "Customer Payments",
          record.paymentNo,
          `${cname} · ${record.mode} · ${record.status} · ${record.amount}`,
          "/dashboard/customer/payments",
          allOf(customerWords, record.paymentNo, record.mode, record.status, record.amount, record.reference),
          cid,
          `cp-${record.id}`
        )
      );
    }
    for (const record of profile.sales.creditNotes ?? []) {
      out.push(
        result(
          "Customer Credit Notes",
          record.creditNoteNo,
          `${cname} · ${record.status} · ${record.amount}`,
          "/dashboard/customer/credit-notes",
          allOf(customerWords, record.creditNoteNo, record.status, record.amount, record.reason),
          cid,
          `ccn-${record.id}`
        )
      );
    }
    for (const record of profile.sales.refunds ?? []) {
      out.push(
        result(
          "Customer Refunds",
          record.refundNo,
          `${cname} · ${record.status} · ${record.amount}`,
          "/dashboard/customer/refunds",
          allOf(customerWords, record.refundNo, record.status, record.amount, record.reason),
          cid,
          `cr-${record.id}`
        )
      );
    }
    for (const record of profile.travel.bookings ?? []) {
      out.push(
        result(
          "Customer Bookings",
          record.reference,
          `${cname} · ${record.service}${record.supplierName ? ` · ${record.supplierName}` : ""} · ${record.status}`,
          "/dashboard/customer/bookings",
          allOf(customerWords, record.reference, record.service, record.supplierName, record.status, record.notes),
          cid,
          `cb-${record.id}`
        )
      );
    }
    for (const record of profile.travel.documents ?? []) {
      out.push(
        result(
          "Customer Documents",
          record.name,
          `${cname} · ${record.type} · ${record.uploadedAt ?? ""}`,
          "/dashboard/customer/documents",
          allOf(customerWords, record.name, record.type),
          cid,
          `cdoc-${record.id}`
        )
      );
    }
    for (const record of profile.communication ?? []) {
      out.push(
        result(
          "Customer Communication",
          record.subject || record.channel,
          `${cname} · ${record.channel} · ${record.direction}`,
          "/dashboard/customer/communication",
          allOf(customerWords, record.subject, record.body, record.channel, record.direction, record.agent),
          cid,
          `ccom-${record.id}`
        )
      );
    }
    for (const record of profile.notes ?? []) {
      out.push(
        result(
          "Customer Notes",
          record.title,
          `${cname} · ${record.body ?? ""}`,
          "/dashboard/customer/notes",
          allOf(customerWords, record.title, record.body),
          cid,
          `cnote-${record.id}`
        )
      );
    }
  }

  const accountingEntries = useAccountingStore.getState().entries;
  for (const entry of accountingEntries) {
    const group = ENTRY_GROUPS[entry.type];
    const href = ENTRY_HREF[entry.type];
    if (!group || !href) continue;
    out.push(
      result(
        group,
        entry.no,
        `${entry.party}${entry.category ? ` · ${entry.category}` : ""} · ${entry.status}`,
        href,
        allOf(entry.no, entry.party, entry.category, entry.status, entry.notes, entry.type, entry.amount)
      )
    );
  }

  for (const record of getInvoices()) {
    const d = record.data;
    const party = d.billTo;
    out.push(
      result(
        "Invoices",
        d.invoiceNo,
        `${party?.name ?? ""}${party?.company ? ` · ${party.company}` : ""} · ${d.status}`,
        `/dashboard/invoices/${record.id}/view`,
        allOf(d.invoiceNo, party?.name, party?.company, party?.email, d.status, d.notes)
      )
    );
  }

  for (const record of getPurchaseOrders()) {
    const d = record.data;
    const vendor = d.vendor;
    out.push(
      result(
        "Purchase Orders",
        d.poNo,
        `${vendor?.name ?? ""}${vendor?.company ? ` · ${vendor.company}` : ""} · ${d.status}`,
        `/dashboard/purchase-orders/${record.id}/view`,
        allOf(d.poNo, vendor?.name, vendor?.company, vendor?.email, d.status, d.notes)
      )
    );
  }

  for (const record of getDeliveryNotes()) {
    const d = record.data;
    const party = d.deliverTo;
    out.push(
      result(
        "Delivery Notes",
        d.dnNo,
        `${party?.name ?? ""}${party?.company ? ` · ${party.company}` : ""} · ${d.status}`,
        `/dashboard/delivery-notes/${record.id}/view`,
        allOf(d.dnNo, party?.name, party?.company, d.status, d.notes, d.reference)
      )
    );
  }

  for (const record of getConfirmationVouchers()) {
    const d = record.data;
    const travellers = (d.travellers ?? []).map((t) => t.name);
    out.push(
      result(
        "Confirmation Vouchers",
        d.voucherNo,
        `${d.customerName || travellers.join(", ") || "Voucher"} · ${d.totalAmount ?? ""}`,
        `/dashboard/confirmation-vouchers/${record.id}/view`,
        allOf(d.voucherNo, d.customerName, travellers, d.totalAmount, d.paymentType)
      )
    );
  }

  for (const account of useAccountStore.getState().accounts) {
    const href =
      account.kind === "cash" ? "/dashboard/cash-accounts" : "/dashboard/bank-accounts";
    out.push(
      result(
        "Accounts",
        account.name,
        `${account.kind === "cash" ? "Cash" : "Bank"} · ${account.bankName || ""} ${account.accountNo || ""} · ${account.status}`,
        href,
        allOf(account.name, account.kind, account.bankName, account.accountNo, account.currency, account.status, account.description)
      )
    );
  }

  for (const transaction of useBankTransactionStore.getState().transactions) {
    out.push(
      result(
        "Bank Transactions",
        `${transaction.type} · ${transaction.amount}`,
        `${transaction.accountName} · ${transaction.description}`,
        "/dashboard/bank-transactions",
        allOf(transaction.accountName, transaction.description, transaction.category, transaction.type, transaction.amount, transaction.reconciled)
      )
    );
  }

  for (const bill of useBillStore.getState().bills) {
    out.push(
      result(
        "Bills",
        bill.billNo,
        `${bill.vendor} · ${bill.category} · ${bill.status}`,
        "/dashboard/bills",
        allOf(bill.billNo, bill.vendor, bill.category, bill.status, bill.notes, bill.amount)
      )
    );
  }

  for (const account of useChartOfAccountsStore.getState().accounts) {
    out.push(
      result(
        "Chart of Accounts",
        `${account.code} · ${account.name}`,
        `${account.type} · ${account.status}`,
        "/dashboard/chart-of-accounts",
        allOf(account.code, account.name, account.type, account.status, account.description)
      )
    );
  }

  for (const entry of useJournalStore.getState().entries) {
    out.push(
      result(
        "Journal Entries",
        entry.journalNo,
        `${entry.description} · ${entry.status}`,
        "/dashboard/journal-entries",
        allOf(entry.journalNo, entry.description, entry.status)
      )
    );
  }

  for (const rate of useTaxStore.getState().rates) {
    out.push(
      result(
        "Tax Rates",
        `${rate.name} · ${rate.rate}%`,
        `${rate.type} · ${rate.status}`,
        "/dashboard/tax-rates",
        allOf(rate.name, rate.type, rate.status, rate.description, rate.rate)
      )
    );
  }

  for (const payment of useSupplierPaymentStore.getState().payments) {
    out.push(
      result(
        "Supplier Payments",
        payment.paymentNo,
        `${payment.vendor} · ${payment.mode} · ${payment.status} · ${payment.amount}`,
        "/dashboard/supplier-payments",
        allOf(payment.paymentNo, payment.vendor, payment.mode, payment.status, payment.notes, payment.amount)
      )
    );
  }

  for (const claim of useExpenseClaimStore.getState().claims) {
    out.push(
      result(
        "Expense Claims",
        claim.claimNo,
        `${claim.employee} · ${claim.category} · ${claim.status} · ${claim.amount}`,
        "/dashboard/expense-claims",
        allOf(claim.claimNo, claim.employee, claim.category, claim.status, claim.notes, claim.amount)
      )
    );
  }

  for (const booking of useBookingStore.getState().bookings) {
    out.push(
      result(
        "Travel Bookings",
        booking.reference,
        `${booking.customerName} · ${booking.service}${booking.supplierName ? ` · ${booking.supplierName}` : ""} · ${booking.status}`,
        "/dashboard/travel/bookings",
        allOf(booking.reference, booking.customerName, booking.service, booking.supplierName, booking.status, booking.notes)
      )
    );
  }

  for (const enquiry of useEnquiryStore.getState().enquiries) {
    out.push(
      result(
        "Enquiries",
        `${enquiry.customerName} · ${enquiry.serviceType}`,
        `${enquiry.destination} · ${enquiry.status}`,
        "/dashboard/travel/enquiries",
        allOf(enquiry.customerName, enquiry.serviceType, enquiry.destination, enquiry.status, enquiry.notes, enquiry.id)
      )
    );
  }

  for (const itinerary of useItineraryStore.getState().itineraries) {
    out.push(
      result(
        "Itineraries",
        itinerary.title,
        `${itinerary.customerName} · ${itinerary.destination} · ${itinerary.status}`,
        "/dashboard/travel/itineraries",
        allOf(itinerary.title, itinerary.customerName, itinerary.destination, itinerary.status, itinerary.notes, itinerary.id)
      )
    );
  }

  for (const supplier of useSupplierStore.getState().suppliers) {
    const href = SUPPLIER_HREF[supplier.category] ?? "/dashboard/travel/suppliers/hotels";
    out.push(
      result(
        "Suppliers",
        supplier.name,
        `${supplier.category} · ${supplier.city ?? ""} ${supplier.country ?? ""} · ${supplier.contactPerson ?? ""}`,
        href,
        allOf(supplier.name, supplier.category, supplier.contactPerson, supplier.phone, supplier.email, supplier.city, supplier.country, supplier.notes)
      )
    );
  }

  for (const document of useTravelDocumentStore.getState().documents) {
    out.push(
      result(
        "Travel Documents",
        document.name,
        `${document.category}${document.reference ? ` · ${document.reference}` : ""} · ${document.relatedTo ?? ""}`,
        "/dashboard/travel/documents",
        allOf(document.name, document.category, document.reference, document.relatedTo, document.notes)
      )
    );
  }

  for (const product of getProducts()) {
    out.push(
      result(
        "Products",
        product.name,
        `${product.sku || "—"} · ${product.category}${product.subcategory ? ` / ${product.subcategory}` : ""}`,
        `/dashboard/pos/products/${product.id}/edit`,
        allOf(product.name, product.sku, product.category, product.subcategory, product.description)
      )
    );
  }

  for (const sale of getSales()) {
    out.push(
      result(
        "POS Sales",
        sale.invoiceId || `Sale ${sale.id.slice(0, 8)}`,
        `${sale.customerName} · ${sale.paymentMode} · ${sale.total}`,
        "/dashboard/pos/sales",
        allOf(sale.invoiceId, sale.customerName, sale.paymentMode, sale.total, sale.currency)
      )
    );
  }

  for (const outlet of useOutletStore.getState().outlets) {
    out.push(
      result(
        "Outlets",
        outlet.name,
        `${outlet.code} · ${outlet.address} · ${outlet.phone ?? ""}`,
        `/dashboard/pos/outlets/${outlet.id}`,
        allOf(outlet.name, outlet.code, outlet.address, outlet.phone, outlet.email, outlet.currency)
      )
    );
  }

  for (const adjustment of useStockAdjustmentStore.getState().adjustments) {
    out.push(
      result(
        "Stock Adjustments",
        adjustment.productName,
        `${adjustment.outletName ?? ""} · ${adjustment.delta} · ${adjustment.reason ?? ""}`,
        "/dashboard/pos/stock/adjustments",
        allOf(adjustment.productName, adjustment.outletName, adjustment.delta, adjustment.reason, adjustment.note)
      )
    );
  }

  for (const transfer of useStockTransferStore.getState().transfers) {
    out.push(
      result(
        "Stock Transfers",
        transfer.productName,
        `${transfer.fromOutletName ?? ""} → ${transfer.toOutletName ?? ""} · ${transfer.qty} units`,
        "/dashboard/pos/transfers",
        allOf(transfer.productName, transfer.sku, transfer.fromOutletName, transfer.toOutletName, transfer.qty, transfer.note)
      )
    );
  }

  const delivery = useDeliveryStore.getState();
  for (const record of delivery.deliveries) {
    out.push(
      result(
        "Deliveries",
        record.deliveryNo,
        `${record.customerName} · ${record.zoneName} · ${record.status}`,
        "/dashboard/delivery/deliveries",
        allOf(record.deliveryNo, record.customerName, record.address, record.pincode, record.zoneName, record.partnerName, record.orderRef, record.status, record.notes)
      )
    );
  }
  for (const partner of delivery.partners) {
    out.push(
      result(
        "Delivery Partners",
        partner.name,
        `${partner.vehicleType ?? ""} ${partner.vehicleReg ?? ""} · ${partner.phone} · ${partner.isActive === "true" || partner.isActive === "active" ? "Active" : partner.isActive}`,
        "/dashboard/delivery/partners",
        allOf(partner.name, partner.contactPerson, partner.phone, partner.email, partner.vehicleType, partner.vehicleReg, partner.serviceZones, partner.notes)
      )
    );
  }
  for (const zone of delivery.zones) {
    out.push(
      result(
        "Delivery Zones",
        zone.name,
        `${zone.region ?? ""} · ${zone.deliveryTime ?? ""}`,
        "/dashboard/delivery/zones",
        allOf(zone.name, zone.region, zone.pincodes, zone.deliveryTime)
      )
    );
  }
  for (const charge of delivery.charges) {
    out.push(
      result(
        "Delivery Charges",
        charge.name,
        `${charge.zoneName ?? ""} · ${charge.ruleType ?? ""} · base ${charge.baseCharge ?? ""}`,
        "/dashboard/delivery/charges",
        allOf(charge.name, charge.zoneName, charge.ruleType, charge.weightFrom, charge.weightTo, charge.baseCharge, charge.perKg, charge.perKm, charge.minCharge, charge.maxCharge)
      )
    );
  }

  for (const request of useUserRequestStore.getState().requests) {
    const href = REQUEST_HREF[request.category] ?? "/dashboard/requests/all";
    out.push(
      result(
        "User Requests",
        request.title,
        `${request.refNo} · ${request.category} · ${request.requesterName} · ${request.status}`,
        href,
        allOf(request.refNo, request.title, request.description, request.requesterName, request.requesterEmail, request.assignedTo, request.priority, request.status, request.category)
      )
    );
  }

  for (const approval of useApprovalStore.getState().approvals) {
    out.push(
      result(
        "Approvals",
        approval.documentNo,
        `${approval.documentType} · ${approval.submittedBy} → ${approval.reviewer} · ${approval.status}`,
        "/dashboard/auditing/approval-history",
        allOf(approval.documentNo, approval.documentType, approval.submittedBy, approval.reviewer, approval.status, approval.comment, approval.amount)
      )
    );
  }

  for (const notification of useNotificationStore.getState().notifications.slice(0, 30)) {
    out.push(
      result(
        "Notifications",
        notification.title,
        `${notification.category} · ${notification.message}`,
        "/dashboard/notifications",
        allOf(notification.title, notification.message, notification.category, notification.type)
      )
    );
  }

  for (const entry of useAuditLogStore.getState().entries.slice(0, 60)) {
    out.push(
      result(
        "Audit Log",
        `${entry.action} · ${entry.entity ?? ""}`,
        `${entry.module}${entry.category ? ` · ${entry.category}` : ""} · ${entry.actor}${entry.ref ? ` · ${entry.ref}` : ""}`,
        "/dashboard/auditing/audit-trail",
        allOf(entry.action, entry.module, entry.category, entry.entity, entry.ref, entry.actor, entry.details)
      )
    );
  }

  return out;
}

export function filterIndex(index: SearchResult[], rawQuery: string): SearchResult[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) {
    return index.filter((r) => r.group === "Modules");
  }
  const tokens = q.split(/\s+/).filter(Boolean);
  return index.filter((r) =>
    tokens.every((token) => r.keywords.includes(token))
  );
}
