"use client"

import * as React from "react"
import {
  IconAddressBook,
  IconBell,
  IconBook2,
  IconCamera,
  IconChartScatter,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  // IconFolder,
  IconInnerShadowTop,
  IconPlaneTilt,
  // IconListDetails,
  IconReport,
  IconReportMoney,
  IconSearch,
  IconSettings,
  IconShieldLock,
  IconShoppingCart,
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
import { useOutletStore } from "@/stores/outletStore"
import type { NavMainItem } from "@/components/nav-main"
import Link from "next/link"

const data = {
  user: {
    name: "Admin",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
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
      url: "#",
      icon: IconChartScatter,
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
      title: "Team",
      url: "#",
      icon: IconUsers,
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
      title: "Guides",
      url: "/dashboard/guides",
      icon: IconBook2,
    },
    {
      title: "Search",
      url: "#",
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

  const navMain: NavMainItem[] = React.useMemo(
    () =>
      data.navMain.map((item) => {
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
    [activeOutletId]
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
