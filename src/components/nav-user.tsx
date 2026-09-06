"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconShield,
  IconStack2,
  IconSwitchHorizontal,
  IconUserCircle,
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ROLE_LABELS } from "@/constants/roles"
import { useAuthStore } from "@/stores/AuthStore"
import { useLogout } from "@/hooks/useLogout"
import { currentUserName } from "@/utils/user"
import { cn } from "@/lib/utils"

function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        checked ? "bg-emerald-500" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "block size-4 rounded-full bg-background shadow-sm transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  )
}

type NavUserProps = {
  user?: {
    name?: string
    email?: string
    avatar?: string
  } | null
}

export function NavUser({ user: userProp }: NavUserProps) {
  const { isMobile } = useSidebar()
  const logout = useLogout();
  const role = useAuthStore((state) => state.role);
  const isSuperAdmin = useAuthStore((state) => state.isSuperAdmin);
  const setSuperAdmin = useAuthStore((state) => state.setSuperAdmin);
  const authUser = useAuthStore((state) => state.user);
  const router = useRouter();

  const user = {
    name:
      userProp?.name || currentUserName("fullname", authUser) || "User",
    email: userProp?.email || authUser?.email || "",
    avatar: userProp?.avatar || "",
  };

  const initials = currentUserName("initial", { firstName: user.name });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
                {role && (
                  <span className="mt-0.5 w-fit rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700">
                    {ROLE_LABELS[role]}
                  </span>
                )}
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/onboarding/role")}>
                <IconSwitchHorizontal />
                Switch Role
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/onboarding/module")}>
                <IconStack2 />
                Customize Modules
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <IconShield />
                Super Admin
              </span>
              <Switch
                checked={isSuperAdmin}
                onCheckedChange={setSuperAdmin}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
