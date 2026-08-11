"use client";

import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Package,
  Plane,
  Receipt,
  Settings2,
  ShoppingCart,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import {
  NotificationCategory,
  NotificationType,
  useNotificationStore,
} from "@/stores/notificationStore";

export type NotifyInput = {
  type?: NotificationType;
  category?: NotificationCategory;
  title: string;
  message?: string;
  customer?: string;
  link?: string;
};

export const TYPE_META: Record<
  NotificationType,
  { icon: LucideIcon; className: string }
> = {
  success: { icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600" },
  info: { icon: Info, className: "bg-blue-50 text-blue-600" },
  warning: { icon: AlertTriangle, className: "bg-amber-50 text-amber-600" },
  error: { icon: XCircle, className: "bg-red-50 text-red-600" },
};

export const CATEGORY_META: Record<
  NotificationCategory,
  { label: string; icon: LucideIcon; className: string }
> = {
  system: { label: "System", icon: Settings2, className: "bg-gray-100 text-gray-600" },
  invoice: { label: "Invoice", icon: Receipt, className: "bg-blue-50 text-blue-600" },
  sales: { label: "Sales", icon: ShoppingCart, className: "bg-emerald-50 text-emerald-600" },
  inventory: { label: "Inventory", icon: Package, className: "bg-amber-50 text-amber-600" },
  customer: { label: "Customer", icon: Users, className: "bg-violet-50 text-violet-600" },
  travel: { label: "Travel", icon: Plane, className: "bg-sky-50 text-sky-600" },
};

export function notify(input: NotifyInput) {
  const { type = "info", category = "system", title, message = "", customer, link } = input;

  useNotificationStore.getState().addNotification({
    type,
    category,
    title,
    message,
    customer,
    link,
  });

  const options = {
    description: message || undefined,
    duration: 5000,
    ...(link
      ? {
          action: {
            label: "View",
            onClick: () => {
              window.location.assign(link);
            },
          },
        }
      : {}),
  };

  switch (type) {
    case "success":
      toast.success(title, options);
      break;
    case "warning":
      toast.warning(title, options);
      break;
    case "error":
      toast.error(title, options);
      break;
    default:
      toast.info(title, options);
  }
}
