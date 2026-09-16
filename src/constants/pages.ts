export type PageAccessKey =
  | "role-onboarding"
  | "company-onboarding"
  | "dashboard"
  | "accounting"
  | "auditing"
  | "travel"
  | "delivery"
  | "healthcare"
  | "store"
  | "analytics"
  | "customers"
  | "user-requests"
  | "help-center"
  | "teams-meet"
  | "settings"
  | "notifications"
  | "search";

export const PAGE_ACCESS_KEYS: PageAccessKey[] = [
  "role-onboarding",
  "company-onboarding",
  "dashboard",
  "accounting",
  "auditing",
  "travel",
  "delivery",
  "healthcare",
  "store",
  "analytics",
  "customers",
  "user-requests",
  "help-center",
  "teams-meet",
  "settings",
  "notifications",
  "search",
];

export const DEFAULT_PAGE_ACCESS: Record<PageAccessKey, boolean> = {
  "role-onboarding": true,
  "company-onboarding": true,
  dashboard: true,
  accounting: true,
  auditing: true,
  travel: true,
  delivery: true,
  healthcare: true,
  store: true,
  analytics: true,
  customers: true,
  "user-requests": true,
  "help-center": true,
  "teams-meet": true,
  settings: true,
  notifications: true,
  search: true,
};

export const PAGE_ACCESS_LABELS: Record<
  PageAccessKey,
  { label: string; description: string }
> = {
  "role-onboarding": {
    label: "Role Selection",
    description: "Onboarding page that asks users what defines them best.",
  },
  "company-onboarding": {
    label: "Company Profile",
    description: "Onboarding page where users set up their company profile.",
  },
  dashboard: { label: "Dashboard", description: "The dashboard home page." },
  accounting: {
    label: "Accounting",
    description: "Invoices, bills, expenses, banking and reports.",
  },
  auditing: {
    label: "Auditing",
    description: "Activity logs, audit trail and login history.",
  },
  travel: {
    label: "Travel",
    description: "Customers, itineraries, bookings and vouchers.",
  },
  delivery: {
    label: "Delivery",
    description: "Deliveries, dispatch, partners, zones and charges.",
  },
  healthcare: {
    label: "Healthcare",
    description: "Patients, appointments, prescriptions and pharmacy.",
  },
  store: {
    label: "Store",
    description: "Outlets, products, inventory, POS and sales.",
  },
  analytics: {
    label: "Analytics",
    description: "Charts and reports across every module.",
  },
  customers: {
    label: "Customers",
    description: "Customer profiles, orders and communications.",
  },
  "user-requests": {
    label: "User Requests",
    description: "Support, feature requests, feedback and complaints.",
  },
  "help-center": {
    label: "Help Center",
    description: "Knowledge base, guides, FAQs and troubleshooting.",
  },
  "teams-meet": {
    label: "Teams Meet",
    description: "Team, chat, meetings, tasks and performance.",
  },
  settings: { label: "Settings", description: "Account and workspace settings." },
  notifications: {
    label: "Notifications",
    description: "Notification center.",
  },
  search: { label: "Search", description: "Global search." },
};

export const PAGE_ACCESS_CATEGORIES: {
  label: string;
  keys: PageAccessKey[];
}[] = [
  {
    label: "Onboarding",
    keys: ["company-onboarding", "role-onboarding"],
  },
  {
    label: "Modules",
    keys: [
      "dashboard",
      "accounting",
      "auditing",
      "travel",
      "delivery",
      "healthcare",
      "store",
      "analytics",
      "customers",
      "user-requests",
      "help-center",
      "teams-meet",
    ],
  },
  {
    label: "Utilities",
    keys: ["settings", "notifications", "search"],
  },
];

export const MODULE_PAGE_KEY: Record<string, PageAccessKey> = {
  Dashboard: "dashboard",
  Accounting: "accounting",
  Auditing: "auditing",
  Travel: "travel",
  Delivery: "delivery",
  Healthcare: "healthcare",
  Store: "store",
  Analytics: "analytics",
  Customers: "customers",
  "User Requests": "user-requests",
  "Help Center": "help-center",
  "Teams Meet": "teams-meet",
};

export const PATH_ACCESS_PREFIXES: { prefix: string; key: PageAccessKey }[] = [
  { prefix: "/dashboard/confirmation-vouchers", key: "travel" },
  { prefix: "/dashboard/delivery-notes", key: "accounting" },
  { prefix: "/dashboard/accounting", key: "accounting" },
  { prefix: "/dashboard/invoices", key: "accounting" },
  { prefix: "/dashboard/estimates", key: "accounting" },
  { prefix: "/dashboard/bills", key: "accounting" },
  { prefix: "/dashboard/credit-notes", key: "accounting" },
  { prefix: "/dashboard/debit-notes", key: "accounting" },
  { prefix: "/dashboard/receipts", key: "accounting" },
  { prefix: "/dashboard/expenses", key: "accounting" },
  { prefix: "/dashboard/expense-claims", key: "accounting" },
  { prefix: "/dashboard/supplier-payments", key: "accounting" },
  { prefix: "/dashboard/bank-accounts", key: "accounting" },
  { prefix: "/dashboard/cash-accounts", key: "accounting" },
  { prefix: "/dashboard/bank-transactions", key: "accounting" },
  { prefix: "/dashboard/reconciliation", key: "accounting" },
  { prefix: "/dashboard/chart-of-accounts", key: "accounting" },
  { prefix: "/dashboard/journal-entries", key: "accounting" },
  { prefix: "/dashboard/general-ledger", key: "accounting" },
  { prefix: "/dashboard/trial-balance", key: "accounting" },
  { prefix: "/dashboard/tax-rates", key: "accounting" },
  { prefix: "/dashboard/tax-transactions", key: "accounting" },
  { prefix: "/dashboard/tax-returns", key: "accounting" },
  { prefix: "/dashboard/reports", key: "accounting" },
  { prefix: "/dashboard/purchase-orders", key: "accounting" },
  { prefix: "/dashboard/auditing", key: "auditing" },
  { prefix: "/dashboard/travel", key: "travel" },
  { prefix: "/dashboard/delivery", key: "delivery" },
  { prefix: "/dashboard/healthcare", key: "healthcare" },
  { prefix: "/dashboard/pos", key: "store" },
  { prefix: "/dashboard/analytics", key: "analytics" },
  { prefix: "/dashboard/customers", key: "customers" },
  { prefix: "/dashboard/customer", key: "customers" },
  { prefix: "/dashboard/requests", key: "user-requests" },
  { prefix: "/dashboard/help-center", key: "help-center" },
  { prefix: "/dashboard/knowledge-base", key: "help-center" },
  { prefix: "/dashboard/faqs", key: "help-center" },
  { prefix: "/dashboard/guides", key: "help-center" },
  { prefix: "/dashboard/troubleshooting", key: "help-center" },
  { prefix: "/dashboard/whats-new", key: "help-center" },
  { prefix: "/dashboard/teams-meet", key: "teams-meet" },
  { prefix: "/dashboard/settings", key: "settings" },
  { prefix: "/dashboard/notifications", key: "notifications" },
  { prefix: "/dashboard/search", key: "search" },
  { prefix: "/dashboard", key: "dashboard" },
].sort((a, b) => b.prefix.length - a.prefix.length) as {
  prefix: string;
  key: PageAccessKey;
}[];
