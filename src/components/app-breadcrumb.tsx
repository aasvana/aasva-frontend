"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useOutletStore } from "@/stores/outletStore";

type Crumb = {
  label: string;
  href?: string;
};

const PAGE_ROUTES: {
  prefix: string;
  group?: string;
  parent?: string;
  label: string;
}[] = [
  {
    prefix: "/dashboard/pos/overview",
    group: "Store",
    label: "Overview",
  },
  { prefix: "/dashboard/pos/store", group: "Store", label: "Register" },
  { prefix: "/dashboard/pos/products", group: "Store", label: "Products" },
  { prefix: "/dashboard/pos/outlets", group: "Store", label: "Outlets" },
  {
    prefix: "/dashboard/pos/stock/adjustments",
    group: "Store",
    label: "Stock Adjustments",
  },
  {
    prefix: "/dashboard/pos/stock/low-stock",
    group: "Store",
    label: "Low Stock",
  },
  { prefix: "/dashboard/pos/stock", group: "Store", label: "Stock Overview" },
  {
    prefix: "/dashboard/pos/transfers",
    group: "Store",
    label: "Stock Transfers",
  },
  {
    prefix: "/dashboard/pos/settings",
    group: "Store",
    label: "Settings",
  },
  {
    prefix: "/dashboard/analytics/overview",
    group: "Analytics",
    label: "Overview",
  },
  {
    prefix: "/dashboard/analytics/sales",
    group: "Analytics",
    label: "Sales",
  },
  {
    prefix: "/dashboard/analytics/customers",
    group: "Analytics",
    label: "Customers",
  },
  {
    prefix: "/dashboard/analytics/products",
    group: "Analytics",
    label: "Products",
  },
  {
    prefix: "/dashboard/analytics/inventory",
    group: "Analytics",
    label: "Inventory",
  },
  {
    prefix: "/dashboard/analytics/accounting",
    group: "Analytics",
    label: "Accounting",
  },
  {
    prefix: "/dashboard/analytics/expenses",
    group: "Analytics",
    label: "Expenses",
  },
  {
    prefix: "/dashboard/analytics/travel",
    group: "Analytics",
    label: "Travel",
  },
  {
    prefix: "/dashboard/analytics/delivery",
    group: "Analytics",
    label: "Delivery",
  },
  {
    prefix: "/dashboard/analytics/team",
    group: "Analytics",
    label: "Team",
  },
  {
    prefix: "/dashboard/teams-meet/overview",
    group: "Teams Meet",
    label: "Overview",
  },
  {
    prefix: "/dashboard/teams-meet/team/members",
    group: "Teams Meet",
    parent: "Team",
    label: "All Members",
  },
  {
    prefix: "/dashboard/teams-meet/team/departments",
    group: "Teams Meet",
    parent: "Team",
    label: "Departments",
  },
  {
    prefix: "/dashboard/teams-meet/team/roles",
    group: "Teams Meet",
    parent: "Team",
    label: "Roles & Permissions",
  },
  {
    prefix: "/dashboard/teams-meet/team/org-chart",
    group: "Teams Meet",
    parent: "Team",
    label: "Organization Chart",
  },
  {
    prefix: "/dashboard/teams-meet/chat/direct-messages",
    group: "Teams Meet",
    parent: "Chat",
    label: "Direct Messages",
  },
  {
    prefix: "/dashboard/teams-meet/chat/group-chats",
    group: "Teams Meet",
    parent: "Chat",
    label: "Group Chats",
  },
  {
    prefix: "/dashboard/teams-meet/chat/channels",
    group: "Teams Meet",
    parent: "Chat",
    label: "Channels",
  },
  {
    prefix: "/dashboard/teams-meet/meetings/upcoming",
    group: "Teams Meet",
    parent: "Meetings",
    label: "Upcoming",
  },
  {
    prefix: "/dashboard/teams-meet/meetings/calendar",
    group: "Teams Meet",
    parent: "Meetings",
    label: "Calendar",
  },
  {
    prefix: "/dashboard/teams-meet/meetings/rooms",
    group: "Teams Meet",
    parent: "Meetings",
    label: "Meeting Rooms",
  },
  {
    prefix: "/dashboard/teams-meet/meetings/history",
    group: "Teams Meet",
    parent: "Meetings",
    label: "Meeting History",
  },
  {
    prefix: "/dashboard/teams-meet/work/my-tasks",
    group: "Teams Meet",
    parent: "Work",
    label: "My Tasks",
  },
  {
    prefix: "/dashboard/teams-meet/work/team-tasks",
    group: "Teams Meet",
    parent: "Work",
    label: "Team Tasks",
  },
  {
    prefix: "/dashboard/teams-meet/work/projects",
    group: "Teams Meet",
    parent: "Work",
    label: "Projects",
  },
  {
    prefix: "/dashboard/teams-meet/work/my-work",
    group: "Teams Meet",
    parent: "Work",
    label: "My Work",
  },
  {
    prefix: "/dashboard/teams-meet/work/approvals",
    group: "Teams Meet",
    parent: "Work",
    label: "Approvals",
  },
  {
    prefix: "/dashboard/teams-meet/onboarding/new-joiners",
    group: "Teams Meet",
    parent: "Onboarding",
    label: "New Joiners",
  },
  {
    prefix: "/dashboard/teams-meet/onboarding/plans",
    group: "Teams Meet",
    parent: "Onboarding",
    label: "Onboarding Plans",
  },
  {
    prefix: "/dashboard/teams-meet/onboarding/checklists",
    group: "Teams Meet",
    parent: "Onboarding",
    label: "Checklists",
  },
  {
    prefix: "/dashboard/teams-meet/onboarding/progress",
    group: "Teams Meet",
    parent: "Onboarding",
    label: "Progress",
  },
  {
    prefix: "/dashboard/teams-meet/time/attendance",
    group: "Teams Meet",
    parent: "Time & Attendance",
    label: "Attendance",
  },
  {
    prefix: "/dashboard/teams-meet/time/leave",
    group: "Teams Meet",
    parent: "Time & Attendance",
    label: "Leave",
  },
  {
    prefix: "/dashboard/teams-meet/time/work-hours",
    group: "Teams Meet",
    parent: "Time & Attendance",
    label: "Work Hours",
  },
  {
    prefix: "/dashboard/teams-meet/performance/goals",
    group: "Teams Meet",
    parent: "Performance",
    label: "Goals",
  },
  {
    prefix: "/dashboard/teams-meet/performance/reviews",
    group: "Teams Meet",
    parent: "Performance",
    label: "Reviews",
  },
  {
    prefix: "/dashboard/teams-meet/performance/progress",
    group: "Teams Meet",
    parent: "Performance",
    label: "Progress",
  },
  {
    prefix: "/dashboard/teams-meet/performance/recognition",
    group: "Teams Meet",
    parent: "Performance",
    label: "Recognition",
  },
  {
    prefix: "/dashboard/teams-meet/documents/team-documents",
    group: "Teams Meet",
    parent: "Documents",
    label: "Team Documents",
  },
  {
    prefix: "/dashboard/teams-meet/documents/policies",
    group: "Teams Meet",
    parent: "Documents",
    label: "Policies",
  },
  {
    prefix: "/dashboard/teams-meet/documents/employee-documents",
    group: "Teams Meet",
    parent: "Documents",
    label: "Employee Documents",
  },
  {
    prefix: "/dashboard/teams-meet/announcements",
    group: "Teams Meet",
    label: "Announcements",
  },
  {
    prefix: "/dashboard/pos/sales",
    group: "Accounting",
    parent: "Sales",
    label: "Sales Orders",
  },
  {
    prefix: "/dashboard/accounting/dashboard",
    group: "Accounting",
    label: "Dashboard",
  },
  {
    prefix: "/dashboard/invoices",
    group: "Accounting",
    parent: "Sales",
    label: "Invoices",
  },
  {
    prefix: "/dashboard/estimates",
    group: "Accounting",
    parent: "Sales",
    label: "Estimates",
  },
  {
    prefix: "/dashboard/delivery-notes",
    group: "Accounting",
    parent: "Sales",
    label: "Delivery Notes",
  },
  {
    prefix: "/dashboard/credit-notes",
    group: "Accounting",
    parent: "Sales",
    label: "Credit Notes",
  },
  {
    prefix: "/dashboard/receipts",
    group: "Accounting",
    parent: "Sales",
    label: "Customer Payments",
  },
  {
    prefix: "/dashboard/purchase-orders",
    group: "Accounting",
    parent: "Purchases",
    label: "Purchase Orders",
  },
  {
    prefix: "/dashboard/bills",
    group: "Accounting",
    parent: "Purchases",
    label: "Bills",
  },
  {
    prefix: "/dashboard/debit-notes",
    group: "Accounting",
    parent: "Purchases",
    label: "Debit Notes",
  },
  {
    prefix: "/dashboard/supplier-payments",
    group: "Accounting",
    parent: "Purchases",
    label: "Supplier Payments",
  },
  {
    prefix: "/dashboard/expenses",
    group: "Accounting",
    parent: "Expenses",
    label: "Expenses",
  },
  {
    prefix: "/dashboard/expense-claims",
    group: "Accounting",
    parent: "Expenses",
    label: "Expense Claims",
  },
  {
    prefix: "/dashboard/bank-accounts",
    group: "Accounting",
    parent: "Banking & Cash",
    label: "Bank Accounts",
  },
  {
    prefix: "/dashboard/cash-accounts",
    group: "Accounting",
    parent: "Banking & Cash",
    label: "Cash Accounts",
  },
  {
    prefix: "/dashboard/bank-transactions",
    group: "Accounting",
    parent: "Banking & Cash",
    label: "Bank Transactions",
  },
  {
    prefix: "/dashboard/reconciliation",
    group: "Accounting",
    parent: "Banking & Cash",
    label: "Reconciliation",
  },
  {
    prefix: "/dashboard/chart-of-accounts",
    group: "Accounting",
    parent: "Accounting",
    label: "Chart of Accounts",
  },
  {
    prefix: "/dashboard/journal-entries",
    group: "Accounting",
    parent: "Accounting",
    label: "Journal Entries",
  },
  {
    prefix: "/dashboard/general-ledger",
    group: "Accounting",
    parent: "Accounting",
    label: "General Ledger",
  },
  {
    prefix: "/dashboard/trial-balance",
    group: "Accounting",
    parent: "Accounting",
    label: "Trial Balance",
  },
  {
    prefix: "/dashboard/tax-rates",
    group: "Accounting",
    parent: "Taxes",
    label: "Tax Rates",
  },
  {
    prefix: "/dashboard/tax-transactions",
    group: "Accounting",
    parent: "Taxes",
    label: "Tax Transactions",
  },
  {
    prefix: "/dashboard/tax-returns",
    group: "Accounting",
    parent: "Taxes",
    label: "Tax Returns",
  },
  {
    prefix: "/dashboard/reports/profit-loss",
    group: "Accounting",
    parent: "Reports",
    label: "Profit & Loss",
  },
  {
    prefix: "/dashboard/reports/balance-sheet",
    group: "Accounting",
    parent: "Reports",
    label: "Balance Sheet",
  },
  {
    prefix: "/dashboard/reports/cash-flow",
    group: "Accounting",
    parent: "Reports",
    label: "Cash Flow",
  },
  {
    prefix: "/dashboard/reports/sales",
    group: "Accounting",
    parent: "Reports",
    label: "Sales Report",
  },
  {
    prefix: "/dashboard/reports/purchases",
    group: "Accounting",
    parent: "Reports",
    label: "Purchase Report",
  },
  {
    prefix: "/dashboard/reports/expenses",
    group: "Accounting",
    parent: "Reports",
    label: "Expense Report",
  },
  {
    prefix: "/dashboard/reports/accounts-receivable",
    group: "Accounting",
    parent: "Reports",
    label: "Accounts Receivable",
  },
  {
    prefix: "/dashboard/reports/accounts-payable",
    group: "Accounting",
    parent: "Reports",
    label: "Accounts Payable",
  },
  {
    prefix: "/dashboard/reports/tax",
    group: "Accounting",
    parent: "Reports",
    label: "Tax Report",
  },
  {
    prefix: "/dashboard/accounting/settings/general",
    group: "Accounting",
    parent: "Settings",
    label: "Accounting Settings",
  },
  {
    prefix: "/dashboard/accounting/settings/invoice",
    group: "Accounting",
    parent: "Settings",
    label: "Invoice Settings",
  },
  {
    prefix: "/dashboard/accounting/settings/numbering",
    group: "Accounting",
    parent: "Settings",
    label: "Numbering",
  },
  {
    prefix: "/dashboard/accounting/settings/payment-terms",
    group: "Accounting",
    parent: "Settings",
    label: "Payment Terms",
  },
  {
    prefix: "/dashboard/auditing/overview",
    group: "Auditing",
    label: "Overview",
  },
  {
    prefix: "/dashboard/auditing/activity-log",
    group: "Auditing",
    label: "Activity Log",
  },
  {
    prefix: "/dashboard/auditing/audit-trail",
    group: "Auditing",
    label: "Audit Trail",
  },
  {
    prefix: "/dashboard/auditing/user-activity",
    group: "Auditing",
    label: "User Activity",
  },
  {
    prefix: "/dashboard/auditing/login-history",
    group: "Auditing",
    parent: "Login & Security",
    label: "Login History",
  },
  {
    prefix: "/dashboard/auditing/failed-logins",
    group: "Auditing",
    parent: "Login & Security",
    label: "Failed Logins",
  },
  {
    prefix: "/dashboard/auditing/sessions",
    group: "Auditing",
    parent: "Login & Security",
    label: "Session History",
  },
  {
    prefix: "/dashboard/auditing/data-created",
    group: "Auditing",
    parent: "Data Changes",
    label: "Created",
  },
  {
    prefix: "/dashboard/auditing/data-updated",
    group: "Auditing",
    parent: "Data Changes",
    label: "Updated",
  },
  {
    prefix: "/dashboard/auditing/data-deleted",
    group: "Auditing",
    parent: "Data Changes",
    label: "Deleted",
  },
  {
    prefix: "/dashboard/auditing/data-restored",
    group: "Auditing",
    parent: "Data Changes",
    label: "Restored",
  },
  {
    prefix: "/dashboard/auditing/invoice-changes",
    group: "Auditing",
    parent: "Financial Audit",
    label: "Invoice Changes",
  },
  {
    prefix: "/dashboard/auditing/payment-changes",
    group: "Auditing",
    parent: "Financial Audit",
    label: "Payment Changes",
  },
  {
    prefix: "/dashboard/auditing/expense-changes",
    group: "Auditing",
    parent: "Financial Audit",
    label: "Expense Changes",
  },
  {
    prefix: "/dashboard/auditing/accounting-changes",
    group: "Auditing",
    parent: "Financial Audit",
    label: "Accounting Changes",
  },
  {
    prefix: "/dashboard/auditing/stock-changes",
    group: "Auditing",
    parent: "Inventory Audit",
    label: "Stock Changes",
  },
  {
    prefix: "/dashboard/auditing/stock-adjustments",
    group: "Auditing",
    parent: "Inventory Audit",
    label: "Stock Adjustments",
  },
  {
    prefix: "/dashboard/auditing/stock-transfers",
    group: "Auditing",
    parent: "Inventory Audit",
    label: "Stock Transfers",
  },
  {
    prefix: "/dashboard/auditing/approval-history",
    group: "Auditing",
    label: "Approval History",
  },
  {
    prefix: "/dashboard/auditing/export-reports",
    group: "Auditing",
    label: "Export & Reports",
  },
  {
    prefix: "/dashboard/travel/dashboard",
    group: "Travel",
    label: "Dashboard",
  },
  {
    prefix: "/dashboard/travel/customers",
    group: "Travel",
    label: "Customers",
  },
  {
    prefix: "/dashboard/travel/enquiries",
    group: "Travel",
    label: "Enquiries",
  },
  {
    prefix: "/dashboard/travel/itineraries",
    group: "Travel",
    label: "Itineraries",
  },
  {
    prefix: "/dashboard/travel/bookings",
    group: "Travel",
    label: "Bookings",
  },
  {
    prefix: "/dashboard/travel/suppliers/hotels",
    group: "Travel",
    parent: "Suppliers",
    label: "Hotels",
  },
  {
    prefix: "/dashboard/travel/suppliers/airlines",
    group: "Travel",
    parent: "Suppliers",
    label: "Airlines",
  },
  {
    prefix: "/dashboard/travel/suppliers/transport",
    group: "Travel",
    parent: "Suppliers",
    label: "Transport",
  },
  {
    prefix: "/dashboard/travel/suppliers/activities",
    group: "Travel",
    parent: "Suppliers",
    label: "Activities",
  },
  {
    prefix: "/dashboard/travel/documents",
    group: "Travel",
    label: "Travel Documents",
  },
  {
    prefix: "/dashboard/travel/settings/general-details",
    group: "Travel",
    parent: "Settings",
    label: "General Details",
  },
  {
    prefix: "/dashboard/travel/settings/voucher-settings",
    group: "Travel",
    parent: "Settings",
    label: "Voucher Settings",
  },
  {
    prefix: "/dashboard/confirmation-vouchers",
    group: "Travel",
    label: "Confirmation Vouchers",
  },
  { prefix: "/dashboard/customers", label: "Customers" },
  {
    prefix: "/dashboard/customer/overview",
    group: "Customers",
    label: "Overview",
  },
  {
    prefix: "/dashboard/customer/personal",
    group: "Customers",
    parent: "Details",
    label: "Personal",
  },
  {
    prefix: "/dashboard/customer/contact",
    group: "Customers",
    parent: "Details",
    label: "Contact",
  },
  {
    prefix: "/dashboard/customer/address",
    group: "Customers",
    parent: "Details",
    label: "Address",
  },
  {
    prefix: "/dashboard/customer/business",
    group: "Customers",
    parent: "Details",
    label: "Business",
  },
  {
    prefix: "/dashboard/customer/travel-profile",
    group: "Customers",
    parent: "Travel",
    label: "Travel Profile",
  },
  {
    prefix: "/dashboard/customer/bookings",
    group: "Customers",
    parent: "Travel",
    label: "Bookings",
  },
  {
    prefix: "/dashboard/customer/documents",
    group: "Customers",
    parent: "Travel",
    label: "Documents",
  },
  {
    prefix: "/dashboard/customer/orders",
    group: "Customers",
    parent: "Sales",
    label: "Orders",
  },
  {
    prefix: "/dashboard/customer/invoices",
    group: "Customers",
    parent: "Sales",
    label: "Invoices",
  },
  {
    prefix: "/dashboard/customer/payments",
    group: "Customers",
    parent: "Sales",
    label: "Payments",
  },
  {
    prefix: "/dashboard/customer/credit-notes",
    group: "Customers",
    parent: "Sales",
    label: "Credit Notes",
  },
  {
    prefix: "/dashboard/customer/refunds",
    group: "Customers",
    parent: "Sales",
    label: "Refunds",
  },
  {
    prefix: "/dashboard/customer/communication",
    group: "Customers",
    label: "Communication",
  },
  {
    prefix: "/dashboard/customer/notes",
    group: "Customers",
    label: "Notes",
  },
  {
    prefix: "/dashboard/customer/activity",
    group: "Customers",
    label: "Activity",
  },
  {
    prefix: "/dashboard/delivery/overview",
    group: "Delivery",
    label: "Overview",
  },
  {
    prefix: "/dashboard/delivery/deliveries",
    group: "Delivery",
    label: "Deliveries",
  },
  {
    prefix: "/dashboard/delivery/dispatch",
    group: "Delivery",
    label: "Dispatch",
  },
  {
    prefix: "/dashboard/delivery/partners",
    group: "Delivery",
    label: "Delivery Partners",
  },
  {
    prefix: "/dashboard/delivery/zones",
    group: "Delivery",
    label: "Delivery Zones",
  },
  {
    prefix: "/dashboard/delivery/charges",
    group: "Delivery",
    label: "Delivery Charges",
  },
  {
    prefix: "/dashboard/delivery/settings",
    group: "Delivery",
    label: "Settings",
  },
  {
    prefix: "/dashboard/requests/overview",
    group: "User Requests",
    label: "Overview",
  },
  {
    prefix: "/dashboard/requests/all",
    group: "User Requests",
    label: "All Requests",
  },
  {
    prefix: "/dashboard/requests/support",
    group: "User Requests",
    label: "Support",
  },
  {
    prefix: "/dashboard/requests/features",
    group: "User Requests",
    label: "Feature Requests",
  },
  {
    prefix: "/dashboard/requests/feedback",
    group: "User Requests",
    label: "Feedback",
  },
  {
    prefix: "/dashboard/requests/bugs",
    group: "User Requests",
    label: "Bug Reports",
  },
  {
    prefix: "/dashboard/requests/complaints",
    group: "User Requests",
    label: "Complaints",
  },
  {
    prefix: "/dashboard/requests/announcements",
    group: "User Requests",
    label: "Announcements",
  },
  { prefix: "/dashboard/guides", group: "Help Center", label: "Guides" },
  { prefix: "/dashboard/search", label: "Search" },
  {
    prefix: "/dashboard/help-center",
    group: "Help Center",
    label: "Overview",
  },
  {
    prefix: "/dashboard/knowledge-base",
    group: "Help Center",
    label: "Knowledge Base",
  },
  { prefix: "/dashboard/faqs", group: "Help Center", label: "FAQs" },
  {
    prefix: "/dashboard/troubleshooting",
    group: "Help Center",
    label: "Troubleshooting",
  },
  {
    prefix: "/dashboard/whats-new",
    group: "Help Center",
    label: "What's New",
  },
  { prefix: "/dashboard/notifications", label: "Notifications" },
  { prefix: "/dashboard/settings", label: "Settings" },
];

function actionLabel(action: string): string {
  if (action === "create") return "Create";
  if (action === "edit") return "Edit";
  if (action === "view") return "View";
  return action.charAt(0).toUpperCase() + action.slice(1);
}

function getCrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Dashboard", href: "/dashboard" }];

  if (pathname === "/dashboard") return crumbs;

  const outletDetailsMatch =
    pathname.match(/^\/dashboard\/pos\/outlets\/([^/]+)$/);
  if (outletDetailsMatch) {
    const id = outletDetailsMatch[1];
    const outlet = useOutletStore
      .getState()
      .outlets.find((o) => o.id === id);
    crumbs.push({ label: "Store" });
    crumbs.push({ label: "Outlets", href: "/dashboard/pos/outlets" });
    crumbs.push({ label: outlet?.name ?? "Outlet Details" });
    return crumbs;
  }

  const route = PAGE_ROUTES.find((r) => pathname.startsWith(r.prefix));
  if (!route) return crumbs;

  if (route.group) {
    crumbs.push({ label: route.group });
  }
  if (route.parent) {
    crumbs.push({ label: route.parent });
  }
  crumbs.push({ label: route.label, href: route.prefix });

  const rest = pathname.slice(route.prefix.length).split("/").filter(Boolean);
  if (rest.length > 0) {
    crumbs.push({ label: actionLabel(rest[rest.length - 1]) });
  }

  return crumbs;
}

export function AppBreadcrumb() {
  const pathname = usePathname();
  const crumbs = getCrumbs(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <Fragment key={`${crumb.label}-${index}`}>
              <BreadcrumbItem>
                {!isLast && crumb.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
