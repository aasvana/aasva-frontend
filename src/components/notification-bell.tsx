"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CATEGORY_META, TYPE_META } from "@/lib/notify";
import {
  AppNotification,
  useNotificationStore,
} from "@/stores/notificationStore";

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const notifications = useNotificationStore((s) => s.notifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const recent = notifications.slice(0, 8);

  const handleOpen = (n: AppNotification) => {
    if (!n.read) markRead(n.id);
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              Notifications
            </span>
            <span className="text-xs text-gray-500">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck /> Read all
          </Button>
        </div>

        <div className="max-h-[320px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Inbox className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            recent.map((n) => {
              const TypeIcon = TYPE_META[n.type].icon;
              const CategoryIcon = CATEGORY_META[n.category].icon;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleOpen(n)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50 cursor-pointer",
                    !n.read && "bg-emerald-50/40"
                  )}
                >
                  <div
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full",
                      TYPE_META[n.type].className
                    )}
                  >
                    <TypeIcon className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-sm text-gray-900",
                        !n.read && "font-semibold"
                      )}
                    >
                      {n.title}
                    </p>
                    {n.message && (
                      <p className="truncate text-xs text-gray-500">
                        {n.message}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          CATEGORY_META[n.category].className
                        )}
                      >
                        <CategoryIcon className="size-2.5" />
                        {CATEGORY_META[n.category].label}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  {!n.read && (
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="border-t p-1.5">
          <Button
            variant="ghost"
            className="w-full justify-center"
            asChild
          >
            <Link href="/dashboard/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
