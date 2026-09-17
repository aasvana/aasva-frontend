import type { Icon } from "@tabler/icons-react";
import {
  IconBriefcase,
  IconCalculator,
  IconPlaneTilt,
  IconReceipt,
  IconShoppingCart,
  IconStethoscope,
  IconTruckDelivery,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";

export type UserRole = 
  | "doctor"
  | "manager"
  | "accountant"
  | "receptionist"
  | "travel-agent"
  | "delivery-partner"
  | "store-manager"
  | "ecommerce-user"
  | "healthcare-admin"
  | "systemadmin";

export const ALL_ROLES: UserRole[] = [
  "doctor",
  "manager",
  "accountant",
  "receptionist",
  "travel-agent",
  "delivery-partner",
  "store-manager",
  "ecommerce-user",
  "healthcare-admin",
  "systemadmin",
];

export const VOUCHER_TERMS_ADMIN_ROLES = [
  "admin",
  "superadmin",
  "systemadmin",
] as const;

export type RoleOption = {
  value: UserRole;
  label: string;
  title: string;
  description: string;
  icon: Icon;
  accent: string;
};

export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "doctor",
    label: "Doctor",
    title: "I'm a Doctor",
    description:
      "Manage patients, appointments, prescriptions and clinic operations.",
    icon: IconStethoscope,
    accent: "bg-sky-50 text-sky-600 border-sky-200 group-hover:bg-sky-100",
  },
  {
    value: "manager",
    label: "Manager",
    title: "I'm a Manager",
    description:
      "Oversee operations, teams, and cross-functional workflows.",
    icon: IconBriefcase,
    accent: "bg-indigo-50 text-indigo-600 border-indigo-200 group-hover:bg-indigo-100",
  },
  {
    value: "accountant",
    label: "Accountant",
    title: "I'm an Accountant",
    description:
      "Manage invoices, bills, expenses, banking and financial reports.",
    icon: IconCalculator,
    accent: "bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-100",
  },
  {
    value: "receptionist",
    label: "Receptionist",
    title: "I'm a Receptionist",
    description:
      "Handle front desk operations, appointments and customer check-ins.",
    icon: IconUserCheck,
    accent: "bg-pink-50 text-pink-600 border-pink-200 group-hover:bg-pink-100",
  },
  {
    value: "travel-agent",
    label: "Travel Agent",
    title: "I'm a Travel Agent",
    description:
      "Manage customers, itineraries, bookings and confirmation vouchers.",
    icon: IconPlaneTilt,
    accent: "bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-100",
  },
  {
    value: "delivery-partner",
    label: "Delivery Partner",
    title: "I'm a Delivery Partner",
    description:
      "Track deliveries, dispatch, partners, zones and delivery charges.",
    icon: IconTruckDelivery,
    accent: "bg-violet-50 text-violet-600 border-violet-200 group-hover:bg-violet-100",
  },
  {
    value: "store-manager",
    label: "Store Manager",
    title: "I'm a Store Manager",
    description:
      "Manage outlets, products, inventory, POS and sales operations.",
    icon: IconShoppingCart,
    accent: "bg-teal-50 text-teal-600 border-teal-200 group-hover:bg-teal-100",
  },
  {
    value: "ecommerce-user",
    label: "E-commerce Store Owner",
    title: "I run an E-commerce Store",
    description:
      "Manage online store, products, inventory, sales and stock transfers.",
    icon: IconReceipt,
    accent: "bg-cyan-50 text-cyan-600 border-cyan-200 group-hover:bg-cyan-100",
  },
  {
    value: "healthcare-admin",
    label: "Healthcare Admin",
    title: "I'm a Healthcare Admin",
    description:
      "Administer healthcare operations, patients, appointments and pharmacy.",
    icon: IconUsers,
    accent: "bg-rose-50 text-rose-600 border-rose-200 group-hover:bg-rose-100",
  },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  doctor: "Doctor",
  manager: "Manager",
  accountant: "Accountant",
  receptionist: "Receptionist",
  "travel-agent": "Travel Agent",
  "delivery-partner": "Delivery Partner",
  "store-manager": "Store Manager",
  "ecommerce-user": "E-commerce Store Owner",
  "healthcare-admin": "Healthcare Admin",
  systemadmin: "System Admin",
};

export const ROLE_MODULES: Record<UserRole, string[]> = {
  doctor: [
    "Healthcare",
    "Accounting",
    "Auditing",
    "Analytics",
    "Customers",
    "User Requests",
    "Help Center",
    "Teams Meet",
  ],
  manager: [
    "Dashboard",
    "Accounting",
    "Auditing",
    "Analytics",
    "Customers",
    "User Requests",
    "Help Center",
    "Teams Meet",
  ],
  accountant: [
    "Accounting",
    "Auditing",
    "Analytics",
    "Customers",
    "User Requests",
    "Help Center",
    "Teams Meet",
  ],
  receptionist: [
    "Dashboard",
    "Customers",
    "User Requests",
    "Help Center",
    "Teams Meet",
  ],
  "travel-agent": [
    "Travel",
    "Accounting",
    "Auditing",
    "Analytics",
    "Customers",
    "User Requests",
    "Help Center",
    "Teams Meet",
  ],
  "delivery-partner": [
    "Delivery",
    "Accounting",
    "Auditing",
    "Analytics",
    "Customers",
    "User Requests",
    "Help Center",
    "Teams Meet",
  ],
  "store-manager": [
    "Store",
    "Accounting",
    "Auditing",
    "Analytics",
    "Customers",
    "User Requests",
    "Help Center",
    "Teams Meet",
  ],
  "ecommerce-user": [
    "Store",
    "Accounting",
    "Auditing",
    "Analytics",
    "Customers",
    "User Requests",
    "Help Center",
    "Teams Meet",
  ],
  "healthcare-admin": [
    "Healthcare",
    "Accounting",
    "Auditing",
    "Analytics",
    "Customers",
    "User Requests",
    "Help Center",
    "Teams Meet",
  ],
  systemadmin: [
    "Dashboard",
    "Accounting",
    "Auditing",
    "Travel",
    "Delivery",
    "Healthcare",
    "Store",
    "Analytics",
    "Customers",
    "User Requests",
    "Help Center",
    "Teams Meet",
  ],
};

export const MODULE_ACCESS: Record<string, UserRole[]> = {
  Dashboard: ALL_ROLES,
  Healthcare: ["doctor", "healthcare-admin"],
  Travel: ["travel-agent"],
  Delivery: ["delivery-partner"],
  Store: ["store-manager", "ecommerce-user"],
  Accounting: ALL_ROLES,
  Auditing: ALL_ROLES,
  Analytics: ALL_ROLES,
  Customers: ALL_ROLES,
  "User Requests": ALL_ROLES,
  "Help Center": ALL_ROLES,
  "Teams Meet": ALL_ROLES,
};
