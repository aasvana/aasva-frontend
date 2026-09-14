"use client"

import * as React from "react"
import {
  IconAddressBook,
  IconBell,
  IconCamera,
  IconChartScatter,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  // IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconPlaneTilt,
  // IconListDetails,
  IconReport,
  IconReportMoney,
  IconSearch,
  IconSettings,
  IconShieldLock,
  IconShoppingCart,
  IconStethoscope,
  IconTruckDelivery,
  IconUserQuestion,
  IconUsers,
} from "@tabler/icons-react"

// import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { brand } from "@/constants/brand"
import { MODULE_ACCESS } from "@/constants/roles"
import { MODULE_PAGE_KEY } from "@/constants/pages"
import { useHydrated } from "@/hooks/useHydrated"
import { useOutletStore } from "@/stores/outletStore"
import { useAuthStore } from "@/stores/AuthStore"
import { usePageAccessStore } from "@/stores/pageAccessStore"
import { isSystemAdmin, isModuleAllowedForUser } from "@/helpers/pageAccess"
import type { NavMainItem } from "@/components/nav-main"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Accounting",
      url: "/dashboard/accounting/dashboard",
      icon: IconReportMoney,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/accounting/dashboard",
        },
        {
          title: "Sales",
          url: "/dashboard/invoices",
          items: [
            {
              title: "Estimates",
              url: "/dashboard/estimates",
            },
            {
              title: "Sales Orders",
              url: "/dashboard/pos/sales",
            },
            {
              title: "Invoices",
              url: "/dashboard/invoices",
            },
            {
              title: "Credit Notes",
              url: "/dashboard/credit-notes",
            },
            {
              title: "Delivery Notes",
              url: "/dashboard/delivery-notes",
            },
            {
              title: "Customer Payments",
              url: "/dashboard/receipts",
            },
          ],
        },
        {
          title: "Purchases",
          url: "/dashboard/purchase-orders",
          items: [
            {
              title: "Purchase Orders",
              url: "/dashboard/purchase-orders",
            },
            {
              title: "Bills",
              url: "/dashboard/bills",
            },
            {
              title: "Debit Notes",
              url: "/dashboard/debit-notes",
            },
            {
              title: "Supplier Payments",
              url: "/dashboard/supplier-payments",
            },
          ],
        },
        {
          title: "Expenses",
          url: "/dashboard/expenses",
          items: [
            {
              title: "Expenses",
              url: "/dashboard/expenses",
            },
            {
              title: "Expense Claims",
              url: "/dashboard/expense-claims",
            },
          ],
        },
        {
          title: "Banking & Cash",
          url: "/dashboard/bank-accounts",
          items: [
            {
              title: "Bank Accounts",
              url: "/dashboard/bank-accounts",
            },
            {
              title: "Cash Accounts",
              url: "/dashboard/cash-accounts",
            },
            {
              title: "Bank Transactions",
              url: "/dashboard/bank-transactions",
            },
            {
              title: "Reconciliation",
              url: "/dashboard/reconciliation",
            },
          ],
        },
        {
          title: "Accounting",
          url: "/dashboard/chart-of-accounts",
          items: [
            {
              title: "Chart of Accounts",
              url: "/dashboard/chart-of-accounts",
            },
            {
              title: "Journal Entries",
              url: "/dashboard/journal-entries",
            },
            {
              title: "General Ledger",
              url: "/dashboard/general-ledger",
            },
            {
              title: "Trial Balance",
              url: "/dashboard/trial-balance",
            },
          ],
        },
        {
          title: "Taxes",
          url: "/dashboard/tax-rates",
          items: [
            {
              title: "Tax Rates",
              url: "/dashboard/tax-rates",
            },
            {
              title: "Tax Transactions",
              url: "/dashboard/tax-transactions",
            },
            {
              title: "Tax Returns",
              url: "/dashboard/tax-returns",
            },
          ],
        },
        {
          title: "Reports",
          url: "/dashboard/reports/profit-loss",
          items: [
            {
              title: "Profit & Loss",
              url: "/dashboard/reports/profit-loss",
            },
            {
              title: "Balance Sheet",
              url: "/dashboard/reports/balance-sheet",
            },
            {
              title: "Cash Flow",
              url: "/dashboard/reports/cash-flow",
            },
            {
              title: "Sales Report",
              url: "/dashboard/reports/sales",
            },
            {
              title: "Purchase Report",
              url: "/dashboard/reports/purchases",
            },
            {
              title: "Expense Report",
              url: "/dashboard/reports/expenses",
            },
            {
              title: "Accounts Receivable",
              url: "/dashboard/reports/accounts-receivable",
            },
            {
              title: "Accounts Payable",
              url: "/dashboard/reports/accounts-payable",
            },
            {
              title: "Tax Report",
              url: "/dashboard/reports/tax",
            },
          ],
        },
        {
          title: "Settings",
          url: "/dashboard/accounting/settings/general",
          items: [
            {
              title: "Accounting Settings",
              url: "/dashboard/accounting/settings/general",
            },
            {
              title: "Invoice Settings",
              url: "/dashboard/accounting/settings/invoice",
            },
            {
              title: "Numbering",
              url: "/dashboard/accounting/settings/numbering",
            },
            {
              title: "Payment Terms",
              url: "/dashboard/accounting/settings/payment-terms",
            },
          ],
        },
      ],
    },
    {
      title: "Auditing",
      url: "/dashboard/auditing/overview",
      icon: IconShieldLock,
      items: [
        {
          title: "Overview",
          url: "/dashboard/auditing/overview",
        },
        {
          title: "Activity Log",
          url: "/dashboard/auditing/activity-log",
        },
        {
          title: "Audit Trail",
          url: "/dashboard/auditing/audit-trail",
        },
        {
          title: "User Activity",
          url: "/dashboard/auditing/user-activity",
        },
        {
          title: "Login & Security",
          url: "/dashboard/auditing/login-history",
          items: [
            {
              title: "Login History",
              url: "/dashboard/auditing/login-history",
            },
            {
              title: "Failed Logins",
              url: "/dashboard/auditing/failed-logins",
            },
            {
              title: "Session History",
              url: "/dashboard/auditing/sessions",
            },
          ],
        },
        {
          title: "Data Changes",
          url: "/dashboard/auditing/data-created",
          items: [
            {
              title: "Created",
              url: "/dashboard/auditing/data-created",
            },
            {
              title: "Updated",
              url: "/dashboard/auditing/data-updated",
            },
            {
              title: "Deleted",
              url: "/dashboard/auditing/data-deleted",
            },
            {
              title: "Restored",
              url: "/dashboard/auditing/data-restored",
            },
          ],
        },
        {
          title: "Financial Audit",
          url: "/dashboard/auditing/invoice-changes",
          items: [
            {
              title: "Invoice Changes",
              url: "/dashboard/auditing/invoice-changes",
            },
            {
              title: "Payment Changes",
              url: "/dashboard/auditing/payment-changes",
            },
            {
              title: "Expense Changes",
              url: "/dashboard/auditing/expense-changes",
            },
            {
              title: "Accounting Changes",
              url: "/dashboard/auditing/accounting-changes",
            },
          ],
        },
        {
          title: "Inventory Audit",
          url: "/dashboard/auditing/stock-changes",
          items: [
            {
              title: "Stock Changes",
              url: "/dashboard/auditing/stock-changes",
            },
            {
              title: "Stock Adjustments",
              url: "/dashboard/auditing/stock-adjustments",
            },
            {
              title: "Stock Transfers",
              url: "/dashboard/auditing/stock-transfers",
            },
          ],
        },
        {
          title: "Approval History",
          url: "/dashboard/auditing/approval-history",
        },
        {
          title: "Export & Reports",
          url: "/dashboard/auditing/export-reports",
        },
      ],
    },
    {
      title: "Travel",
      url: "/dashboard/travel/dashboard",
      icon: IconPlaneTilt,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/travel/dashboard",
        },
        {
          title: "Customers",
          url: "/dashboard/travel/customers",
        },
        {
          title: "Agents",
          url: "/dashboard/agents",
        },
        {
          title: "Enquiries",
          url: "/dashboard/travel/enquiries",
        },
        {
          title: "Itineraries",
          url: "/dashboard/travel/itineraries",
        },
        {
          title: "Bookings",
          url: "/dashboard/travel/bookings",
        },
        {
          title: "Confirmation Vouchers",
          url: "/dashboard/confirmation-vouchers",
        },
        {
          title: "Suppliers",
          url: "/dashboard/travel/suppliers/hotels",
          items: [
            {
              title: "Hotels",
              url: "/dashboard/travel/suppliers/hotels",
            },
            {
              title: "Airlines",
              url: "/dashboard/travel/suppliers/airlines",
            },
            {
              title: "Transport",
              url: "/dashboard/travel/suppliers/transport",
            },
            {
              title: "Activities",
              url: "/dashboard/travel/suppliers/activities",
            },
          ],
        },
        {
          title: "Travel Documents",
          url: "/dashboard/travel/documents",
        },
        {
          title: "Settings",
          url: "/dashboard/travel/settings/general-details",
          items: [
            {
              title: "General Details",
              url: "/dashboard/travel/settings/general-details",
            },
            {
              title: "Voucher Settings",
              url: "/dashboard/travel/settings/voucher-settings",
            },
          ],
        },
      ],
    },
    {
      title: "Delivery",
      url: "/dashboard/delivery/overview",
      icon: IconTruckDelivery,
      items: [
        {
          title: "Overview",
          url: "/dashboard/delivery/overview",
        },
        {
          title: "Deliveries",
          url: "/dashboard/delivery/deliveries",
        },
        {
          title: "Dispatch",
          url: "/dashboard/delivery/dispatch",
        },
        {
          title: "Delivery Partners",
          url: "/dashboard/delivery/partners",
        },
        {
          title: "Delivery Zones",
          url: "/dashboard/delivery/zones",
        },
        {
          title: "Delivery Charges",
          url: "/dashboard/delivery/charges",
        },
        {
          title: "Settings",
          url: "/dashboard/delivery/settings",
        },
      ],
    },
    {
      title: "Healthcare",
      url: "/dashboard/healthcare/overview",
      icon: IconStethoscope,
      items: [
        {
          title: "Overview",
          url: "/dashboard/healthcare/overview",
        },
        {
          title: "Patients",
          url: "/dashboard/healthcare/patients",
        },
        {
          title: "Appointments",
          url: "/dashboard/healthcare/appointments",
        },
        {
          title: "Queue",
          url: "/dashboard/healthcare/queue",
        },
        {
          title: "Consultations",
          url: "/dashboard/healthcare/consultations",
        },
        {
          title: "Medical Records",
          url: "/dashboard/healthcare/medical-records",
        },
        {
          title: "Prescriptions",
          url: "/dashboard/healthcare/prescriptions",
        },
        {
          title: "Investigations",
          url: "/dashboard/healthcare/investigations",
        },
        {
          title: "Treatments",
          url: "/dashboard/healthcare/treatments",
        },
        {
          title: "Follow-ups",
          url: "/dashboard/healthcare/follow-ups",
        },
        {
          title: "Billing",
          url: "/dashboard/healthcare/billing",
        },
        {
          title: "Pharmacy",
          url: "/dashboard/healthcare/pharmacy",
        },
        {
          title: "Staff",
          url: "/dashboard/healthcare/staff",
        },
        {
          title: "Reports",
          url: "/dashboard/healthcare/reports",
        },
        {
          title: "Settings",
          url: "/dashboard/healthcare/settings",
        },
      ],
    },
    {
      title: "Store",
      url: "/dashboard/pos/overview",
      icon: IconShoppingCart,
      items: [
        {
          title: "Overview",
          url: "/dashboard/pos/overview",
        },
        {
          title: "Outlets",
          url: "/dashboard/pos/outlets",
          items: [
            {
              title: "All Outlets",
              url: "/dashboard/pos/outlets",
            },
            {
              title: "Outlet Details",
              url: "/dashboard/pos/outlets/",
            },
          ],
        },
        {
          title: "Products",
          url: "/dashboard/pos/products",
        },
        {
          title: "Inventory",
          url: "/dashboard/pos/stock",
          items: [
            {
              title: "Stock Overview",
              url: "/dashboard/pos/stock",
            },
            {
              title: "Stock Adjustments",
              url: "/dashboard/pos/stock/adjustments",
            },
            {
              title: "Low Stock",
              url: "/dashboard/pos/stock/low-stock",
            },
          ],
        },
        {
          title: "Stock Transfers",
          url: "/dashboard/pos/transfers",
        },
        {
          title: "Settings",
          url: "/dashboard/pos/settings",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics/overview",
      icon: IconChartScatter,
      items: [
        {
          title: "Overview",
          url: "/dashboard/analytics/overview",
        },
        {
          title: "Sales",
          url: "/dashboard/analytics/sales",
        },
        {
          title: "Customers",
          url: "/dashboard/analytics/customers",
        },
        {
          title: "Products",
          url: "/dashboard/analytics/products",
        },
        {
          title: "Inventory",
          url: "/dashboard/analytics/inventory",
        },
        {
          title: "Accounting",
          url: "/dashboard/analytics/accounting",
        },
        {
          title: "Expenses",
          url: "/dashboard/analytics/expenses",
        },
        {
          title: "Travel",
          url: "/dashboard/analytics/travel",
        },
        {
          title: "Delivery",
          url: "/dashboard/analytics/delivery",
        },
        {
          title: "Team",
          url: "/dashboard/analytics/team",
        },
      ],
    },
    {
      title: "Customers",
      url: "/dashboard/customer/overview",
      icon: IconAddressBook,
      items: [
        {
          title: "Overview",
          url: "/dashboard/customer/overview",
        },
        {
          title: "Details",
          url: "/dashboard/customer/personal",
          items: [
            {
              title: "Personal",
              url: "/dashboard/customer/personal",
            },
            {
              title: "Contact",
              url: "/dashboard/customer/contact",
            },
            {
              title: "Address",
              url: "/dashboard/customer/address",
            },
            {
              title: "Business",
              url: "/dashboard/customer/business",
            },
          ],
        },
        {
          title: "Travel",
          url: "/dashboard/customer/travel-profile",
          items: [
            {
              title: "Travel Profile",
              url: "/dashboard/customer/travel-profile",
            },
            {
              title: "Bookings",
              url: "/dashboard/customer/bookings",
            },
            {
              title: "Documents",
              url: "/dashboard/customer/documents",
            },
          ],
        },
        {
          title: "Sales",
          url: "/dashboard/customer/orders",
          items: [
            {
              title: "Orders",
              url: "/dashboard/customer/orders",
            },
            {
              title: "Invoices",
              url: "/dashboard/customer/invoices",
            },
            {
              title: "Payments",
              url: "/dashboard/customer/payments",
            },
            {
              title: "Credit Notes",
              url: "/dashboard/customer/credit-notes",
            },
            {
              title: "Refunds",
              url: "/dashboard/customer/refunds",
            },
          ],
        },
        {
          title: "Communication",
          url: "/dashboard/customer/communication",
        },
        {
          title: "Notes",
          url: "/dashboard/customer/notes",
        },
        {
          title: "Activity",
          url: "/dashboard/customer/activity",
        },
      ],
    },
    {
      title: "User Requests",
      url: "/dashboard/requests/overview",
      icon: IconUserQuestion,
      items: [
        {
          title: "Overview",
          url: "/dashboard/requests/overview",
        },
        {
          title: "All Requests",
          url: "/dashboard/requests/all",
        },
        {
          title: "Support",
          url: "/dashboard/requests/support",
        },
        {
          title: "Feature Requests",
          url: "/dashboard/requests/features",
        },
        {
          title: "Feedback",
          url: "/dashboard/requests/feedback",
        },
        {
          title: "Bug Reports",
          url: "/dashboard/requests/bugs",
        },
        {
          title: "Complaints",
          url: "/dashboard/requests/complaints",
        },
        {
          title: "Announcements",
          url: "/dashboard/requests/announcements",
        },
      ],
    },
    {
      title: "Help Center",
      url: "/dashboard/help-center",
      icon: IconHelp,
      items: [
        {
          title: "Overview",
          url: "/dashboard/help-center",
        },
        {
          title: "Knowledge Base",
          url: "/dashboard/knowledge-base",
        },
        {
          title: "FAQs",
          url: "/dashboard/faqs",
        },
        {
          title: "Guides",
          url: "/dashboard/guides",
        },
        {
          title: "Troubleshooting",
          url: "/dashboard/troubleshooting",
        },
        {
          title: "What's New",
          url: "/dashboard/whats-new",
        },
      ],
    },
    {
      title: "Teams Meet",
      url: "/dashboard/teams-meet/overview",
      icon: IconUsers,
      items: [
        {
          title: "Overview",
          url: "/dashboard/teams-meet/overview",
        },
        {
          title: "Team",
          url: "/dashboard/teams-meet/team/members",
          items: [
            {
              title: "All Members",
              url: "/dashboard/teams-meet/team/members",
            },
            {
              title: "Departments",
              url: "/dashboard/teams-meet/team/departments",
            },
            {
              title: "Roles & Permissions",
              url: "/dashboard/teams-meet/team/roles",
            },
            {
              title: "Organization Chart",
              url: "/dashboard/teams-meet/team/org-chart",
            },
          ],
        },
        {
          title: "Chat",
          url: "/dashboard/teams-meet/chat/direct-messages",
          items: [
            {
              title: "Direct Messages",
              url: "/dashboard/teams-meet/chat/direct-messages",
            },
            {
              title: "Group Chats",
              url: "/dashboard/teams-meet/chat/group-chats",
            },
            {
              title: "Channels",
              url: "/dashboard/teams-meet/chat/channels",
            },
          ],
        },
        {
          title: "Meetings",
          url: "/dashboard/teams-meet/meetings/upcoming",
          items: [
            {
              title: "Upcoming",
              url: "/dashboard/teams-meet/meetings/upcoming",
            },
            {
              title: "Calendar",
              url: "/dashboard/teams-meet/meetings/calendar",
            },
            {
              title: "Meeting Rooms",
              url: "/dashboard/teams-meet/meetings/rooms",
            },
            {
              title: "Meeting History",
              url: "/dashboard/teams-meet/meetings/history",
            },
          ],
        },
        {
          title: "Work",
          url: "/dashboard/teams-meet/work/my-tasks",
          items: [
            {
              title: "My Tasks",
              url: "/dashboard/teams-meet/work/my-tasks",
            },
            {
              title: "Team Tasks",
              url: "/dashboard/teams-meet/work/team-tasks",
            },
            {
              title: "Projects",
              url: "/dashboard/teams-meet/work/projects",
            },
            {
              title: "My Work",
              url: "/dashboard/teams-meet/work/my-work",
            },
            {
              title: "Approvals",
              url: "/dashboard/teams-meet/work/approvals",
            },
          ],
        },
        {
          title: "Onboarding",
          url: "/dashboard/teams-meet/onboarding/new-joiners",
          items: [
            {
              title: "New Joiners",
              url: "/dashboard/teams-meet/onboarding/new-joiners",
            },
            {
              title: "Onboarding Plans",
              url: "/dashboard/teams-meet/onboarding/plans",
            },
            {
              title: "Checklists",
              url: "/dashboard/teams-meet/onboarding/checklists",
            },
            {
              title: "Progress",
              url: "/dashboard/teams-meet/onboarding/progress",
            },
          ],
        },
        {
          title: "Time & Attendance",
          url: "/dashboard/teams-meet/time/attendance",
          items: [
            {
              title: "Attendance",
              url: "/dashboard/teams-meet/time/attendance",
            },
            {
              title: "Leave",
              url: "/dashboard/teams-meet/time/leave",
            },
            {
              title: "Work Hours",
              url: "/dashboard/teams-meet/time/work-hours",
            },
          ],
        },
        {
          title: "Performance",
          url: "/dashboard/teams-meet/performance/goals",
          items: [
            {
              title: "Goals",
              url: "/dashboard/teams-meet/performance/goals",
            },
            {
              title: "Reviews",
              url: "/dashboard/teams-meet/performance/reviews",
            },
            {
              title: "Progress",
              url: "/dashboard/teams-meet/performance/progress",
            },
            {
              title: "Recognition",
              url: "/dashboard/teams-meet/performance/recognition",
            },
          ],
        },
        {
          title: "Documents",
          url: "/dashboard/teams-meet/documents/team-documents",
          items: [
            {
              title: "Team Documents",
              url: "/dashboard/teams-meet/documents/team-documents",
            },
            {
              title: "Policies",
              url: "/dashboard/teams-meet/documents/policies",
            },
            {
              title: "Employee Documents",
              url: "/dashboard/teams-meet/documents/employee-documents",
            },
          ],
        },
        {
          title: "Announcements",
          url: "/dashboard/teams-meet/announcements",
        },
      ],
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: IconBell,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Search",
      url: "/dashboard/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const activeOutletId = useOutletStore((s) => s.activeOutletId)
  const role = useAuthStore((s) => s.role)
  const modules = useAuthStore((s) => s.modules)
  const access = usePageAccessStore((s) => s.access)
  const hydrated = useHydrated()
  const user = useAuthStore((s) => s.user)

  const visibleItems = React.useMemo(() => {
    if (!hydrated || !role) return data.navMain
    const systemAdmin = isSystemAdmin()
    const isSuperAdmin = user?.roles?.some((r) => r.name === 'superadmin') ?? false
    return data.navMain.filter((item) => {
      if (systemAdmin) return true
      if (item.title === 'Users' && isSuperAdmin) return true
      const pageKey = MODULE_PAGE_KEY[item.title]
      if (pageKey && access[pageKey] === false) return false
      if (!isModuleAllowedForUser(item.title, role, user)) return false
      if (modules.length > 0 && !modules.includes(item.title)) return false
      return true
    })
  }, [hydrated, role, modules, access, user])

  const navMain: NavMainItem[] = React.useMemo(
    () =>
      visibleItems.map((item) => {
        if (item.title !== "Store") return item
        return {
          ...item,
          items: item.items?.map((sub) =>
            sub.title === "Outlets"
              ? {
                  ...sub,
                  items: sub.items?.map((leaf) =>
                    leaf.title === "Outlet Details"
                      ? { ...leaf, url: `/dashboard/pos/outlets/${activeOutletId}` }
                      : leaf
                  ),
                }
              : sub
          ),
        }
      }),
    [visibleItems, activeOutletId]
  )

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{brand.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
