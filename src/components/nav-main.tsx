"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import {
  IconChevronRight,
  IconCirclePlusFilled,
  IconMail,
  type Icon,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/AuthStore"
import { useQuickCreateAccessStore, QUICK_CREATE_ACTIONS } from "@/stores/quickCreateAccessStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export type NavMainLeaf = {
  title: string
  url: string
}

export type NavSubItem = NavMainLeaf & {
  items?: NavMainLeaf[]
}

export type NavMainItem = {
  title: string
  url: string
  icon?: Icon
  items?: NavSubItem[]
}

const isLeafActive = (leaf: NavMainLeaf, pathname: string) =>
  pathname === leaf.url || pathname.startsWith(`${leaf.url}/`)

const isSubActive = (sub: NavSubItem, pathname: string) =>
  isLeafActive(sub, pathname) ||
  (sub.items?.some((leaf) => isLeafActive(leaf, pathname)) ?? false)

export function NavMain({
  items,
}: {
  items: NavMainItem[]
}) {
  const pathname = usePathname()
  const role = useAuthStore((state) => state.role)
  const access = useQuickCreateAccessStore((state) => state.access)
  const quickCreateActions = QUICK_CREATE_ACTIONS.filter((action) =>
    role ? access[role]?.[action.id] : false
  )

  const findActiveGroup = (): string | null => {
    for (const item of items) {
      if (!item.items || item.items.length === 0) continue
      if (item.items.some((sub) => isSubActive(sub, pathname))) {
        return item.title
      }
    }
    return null
  }

  const [openGroup, setOpenGroup] = useState<string | null>(
    () => findActiveGroup()
  )

  const activeGroup = findActiveGroup()

  useEffect(() => {
    if (activeGroup) {
      setOpenGroup(activeGroup)
    }
  }, [activeGroup])

  const toggleGroup = (title: string) => {
    setOpenGroup((prev) => (prev === title ? null : title))
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="bottom">
                {quickCreateActions.length > 0 ? quickCreateActions.map((action) => (
                  <DropdownMenuItem key={action.id} onSelect={() => { window.location.href = action.href }}>
                    {action.label}
                  </DropdownMenuItem>
                )) : <DropdownMenuItem disabled>No actions available</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) =>
            item.items && item.items.length > 0 ? (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="cursor-pointer"
                  tooltip={item.title}
                  isActive={activeGroup === item.title}
                  onClick={() => toggleGroup(item.title)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <IconChevronRight
                    className={cn(
                      "ml-auto transition-transform duration-200",
                      openGroup === item.title && "rotate-90"
                    )}
                  />
                </SidebarMenuButton>
                {openGroup === item.title && (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        {subItem.items && subItem.items.length > 0 ? (
                          <>
                            <div
                              className={cn(
                                "px-2 py-1.5 text-xs font-semibold uppercase tracking-wide",
                                isSubActive(subItem, pathname)
                                  ? "text-emerald-700"
                                  : "text-gray-400"
                              )}
                            >
                              {subItem.title}
                            </div>
                            <SidebarMenuSub>
                              {subItem.items.map((leaf) => (
                                <SidebarMenuSubItem key={leaf.title}>
                                  <SidebarMenuSubButton
                                    href={leaf.url}
                                    isActive={isLeafActive(leaf, pathname)}
                                  >
                                    <span>{leaf.title}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </>
                        ) : (
                          <SidebarMenuSubButton
                            href={subItem.url}
                            isActive={isLeafActive(subItem, pathname)}
                          >
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        )}
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton className="cursor-pointer" tooltip={item.title}>
                  <SidebarMenuSubButton
                    href={item.url}
                    isActive={pathname === item.url}
                    className="flex items-center gap-2 text-sm"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
