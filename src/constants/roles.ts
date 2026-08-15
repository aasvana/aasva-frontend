import type { Icon } from "@tabler/icons-react";
import {
  IconPlaneTilt,
  IconShoppingCart,
  IconStethoscope,
  IconTruckDelivery,
} from "@tabler/icons-react";

export type UserRole = "doctor" | "travel" | "delivery" | "ecommerce";

export const ALL_ROLES: UserRole[] = [
  "doctor",
  "travel",
  "delivery",
  "ecommerce",
];

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
    value: "travel",
    label: "Travel Agent",
    title: "I'm a Travel Agent",
    description:
      "Manage customers, itineraries, bookings and confirmation vouchers.",
    icon: IconPlaneTilt,
    accent: "bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-100",
  },
  {
    value: "delivery",
    label: "Delivery Partner",
    title: "I'm a Delivery Partner",
    description:
      "Track deliveries, dispatch, partners, zones and delivery charges.",
    icon: IconTruckDelivery,
    accent: "bg-violet-50 text-violet-600 border-violet-200 group-hover:bg-violet-100",
  },
  {
    value: "ecommerce",
    label: "E-commerce Store Owner",
    title: "I run an E-commerce Store",
    description:
      "Manage outlets, products, inventory, sales and stock transfers.",
    icon: IconShoppingCart,
    accent: "bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-100",
  },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  doctor: "Doctor",
  travel: "Travel Agent",
  delivery: "Delivery Partner",
  ecommerce: "E-commerce Store",
};

export const MODULE_ACCESS: Record<string, UserRole[]> = {
  Dashboard: ALL_ROLES,
  Healthcare: ["doctor"],
  Travel: ["travel"],
  Delivery: ["delivery"],
  Store: ["ecommerce"],
  Accounting: ALL_ROLES,
  Auditing: ALL_ROLES,
  Analytics: ALL_ROLES,
  Customers: ALL_ROLES,
  "User Requests": ALL_ROLES,
  "Help Center": ALL_ROLES,
  "Teams Meet": ALL_ROLES,
};
