import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { NotificationBell } from "@/components/notification-bell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { triggerWelcomeModal } from "@/components/dashboard/welcome-modal"
import { Crown, ShieldCheck } from "lucide-react"
import { useAuthStore } from "@/stores/AuthStore"
import { getTrialRemainingDays, isUserInTrialPeriod } from "@/helpers/pageAccess"

export function SiteHeader() {
  const user = useAuthStore((s) => s.user)
  const role = useAuthStore((s) => s.role)
  const isSysAdmin = role === "systemadmin" || (user?.roles?.some((r) => r.name === "systemadmin") ?? false)
  const trialActive = isUserInTrialPeriod(user)
  const remainingDays = getTrialRemainingDays(user)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <AppBreadcrumb />
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerWelcomeModal}
            className="hidden sm:flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium text-xs border border-emerald-500/20 transition-all shadow-2xs"
            title="View access details"
          >
            {trialActive ? (
              <>
                <Crown className="size-3.5 text-amber-500 fill-amber-500" />
                <span>3-Month Access</span>
                <Badge variant="secondary" className="ml-0.5 bg-emerald-600 text-white dark:bg-emerald-500 px-1.5 py-0 text-[10px] font-bold rounded-full">
                  {remainingDays}d Left
                </Badge>
              </>
            ) : isSysAdmin ? (
              <>
                <Crown className="size-3.5 text-amber-500 fill-amber-500" />
                <span>System Admin</span>
                <Badge variant="secondary" className="ml-0.5 bg-amber-500 text-white font-bold px-1.5 py-0 text-[10px] rounded-full">
                  FULL ACCESS
                </Badge>
              </>
            ) : (
              <>
                <ShieldCheck className="size-3.5 text-blue-500" />
                <span>Role Access</span>
                <Badge variant="secondary" className="ml-0.5 bg-blue-600 text-white dark:bg-blue-500 px-1.5 py-0 text-[10px] font-bold rounded-full">
                  ACTIVE
                </Badge>
              </>
            )}
          </Button>
          <NotificationBell />
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="#"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              {process.env.NEXT_PUBLIC_APP_NAME} - {process.env.NEXT_PUBLIC_APP_VERSION}
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
