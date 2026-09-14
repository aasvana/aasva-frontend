"use client";

import { useAuthStore } from "@/stores/AuthStore";
import { useLogout } from "@/hooks/useLogout";
import { ShieldAlert, Mail, MessageSquare, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function UnapprovedUserScreen() {
  const user = useAuthStore((s) => s.user);
  const handleLogout = useLogout();

  const userEmail = user?.email || "";
  const whatsappUrl = `https://wa.me/919883817343?text=${encodeURIComponent(
    `Hello, I need account approval for my AASVANA account (${userEmail}).`
  )}`;
  const mailtoUrl = `mailto:developer@aasvana.com?subject=${encodeURIComponent(
    `Account Approval Request - ${userEmail}`
  )}&body=${encodeURIComponent(
    `Hello Admin,\n\nPlease approve my account for AASVANA.\n\nRegistered Email: ${userEmail}\nName: ${user?.firstName || ""} ${user?.lastName || ""}`
  )}`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-background border border-border/80 shadow-2xl rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col gap-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-inner">
          <ShieldAlert className="size-8" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Lock className="size-3 mr-1" /> Pending Approval
            </Badge>
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Account Approval Required
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your AASVANA account is currently awaiting administrator review. Once an admin approves your request, you will gain full access to the platform.
          </p>
        </div>

        <div className="rounded-2xl bg-accent/40 border border-border/60 p-4 flex flex-col gap-3 text-left">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider">
            Contact Administrator for Fast Approval:
          </p>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold">Connect via WhatsApp</span>
                <span className="text-[11px] text-muted-foreground">+91 9883817343</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
              Chat &rarr;
            </span>
          </a>

          <a
            href={mailtoUrl}
            className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold">Email Administrator</span>
                <span className="text-[11px] text-muted-foreground">developer@aasvana.com</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
              Send &rarr;
            </span>
          </a>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full gap-2 text-muted-foreground hover:text-foreground mt-1"
        >
          <LogOut className="size-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
