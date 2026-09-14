"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Crown,
  CheckCircle2,
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
  ArrowRight,
  Gift,
  Lock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/AuthStore";
import { getTrialRemainingDays, isUserInTrialPeriod } from "@/helpers/pageAccess";

const WELCOME_MODAL_STORAGE_KEY = "aasva_welcome_modal_dismissed_v1";

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed = localStorage.getItem(WELCOME_MODAL_STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOpenModal = () => setOpen(true);
    window.addEventListener("aasva:open-welcome-modal", handleOpenModal);
    return () => {
      window.removeEventListener("aasva:open-welcome-modal", handleOpenModal);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(WELCOME_MODAL_STORAGE_KEY, "true");
    }
  };

  const userName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : "there";

  const isSysAdmin = role === "systemadmin" || (user?.roles?.some((r: any) => r.name === "systemadmin") ?? false);
  const remainingDays = getTrialRemainingDays(user);
  const trialActive = isUserInTrialPeriod(user);

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? handleClose() : setOpen(val))}>
      <DialogContent className="max-w-xl border-none p-0 overflow-hidden shadow-2xl rounded-3xl bg-background dark:bg-zinc-950">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-6 sm:p-8 text-white">
          <div className="absolute -right-8 -top-8 size-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 size-44 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-white/20 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                <Gift className="size-3.5 mr-1 text-amber-300 animate-bounce" /> {trialActive || isSysAdmin ? "Special Offer Activated" : "Trial Ended"}
              </Badge>
              <span className="text-xs font-medium text-emerald-100/90 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-400/30">
                {trialActive ? `${remainingDays} Days Left` : isSysAdmin ? "System Admin (Permanent)" : "Role Access Active"}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                <Crown className="size-6 text-amber-300" />
              </div>
              <div>
                <DialogTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Welcome to AASVANA, {userName}!
                </DialogTitle>
                <DialogDescription className="text-emerald-100 text-sm mt-0.5 font-medium">
                  {trialActive || isSysAdmin
                    ? "Your 3-Month Full Access Pass is active. Enjoy all modules without limits."
                    : "Your 3-month trial has ended. Access is now tailored to your assigned role."}
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col gap-6">
          <div className="rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Active Access Level
                </p>
                <p className="text-sm font-bold text-foreground">
                  {trialActive || isSysAdmin ? "Complete Platform Suite — Unrestricted" : `Role Restricted (${role || "Standard"})`}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-600 text-white dark:bg-emerald-500 font-semibold text-xs px-3 py-1 shrink-0">
              {trialActive ? `${remainingDays} Days Remaining` : isSysAdmin ? "System Admin" : "Role Access"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/60 bg-accent/30 hover:bg-accent/60 transition-colors">
              <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {trialActive ? "All Modules Unlocked" : "Role Specific Modules"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {trialActive
                    ? "Sales, Accounting, Travel, Teams & Delivery ready to use."
                    : "Modules filtered to match your primary role responsibility."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/60 bg-accent/30 hover:bg-accent/60 transition-colors">
              <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Unlimited Vouchers & Invoices</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Zero caps on transactions, PDF exports, or documents.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/60 bg-accent/30 hover:bg-accent/60 transition-colors">
              <div className="size-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <BarChart3 className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Full Analytics & Audit</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Real-time revenue charts, activity logs & custom reports.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/60 bg-accent/30 hover:bg-accent/60 transition-colors">
              <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                {trialActive ? <Users className="size-4" /> : <Lock className="size-4" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {trialActive ? "Full Team Access" : "Role Gating Enforced"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {trialActive
                    ? "Full access to cross-functional workflows for 90 days."
                    : "Post-trial restriction active for security and role alignment."}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              {trialActive ? "Enjoy full access for 3 months with 0 commitment." : "Access updated to match your role."}
            </p>
            <Button
              onClick={handleClose}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md shadow-emerald-600/20 px-6 gap-2"
            >
              Explore Dashboard <ArrowRight className="size-4" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function triggerWelcomeModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("aasva:open-welcome-modal"));
  }
}
