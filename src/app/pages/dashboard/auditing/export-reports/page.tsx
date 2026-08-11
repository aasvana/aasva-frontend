"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  Download,
  FileBarChart,
  FileSpreadsheet,
  FileWarning,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useAuditLogStore,
  AuditLogEntry,
} from "@/stores/auditStore";
import { useSecurityStore } from "@/stores/securityStore";
import { useApprovalStore } from "@/stores/approvalStore";
import {
  StatCard,
  downloadCsv,
  moduleBadge,
  actionBadge,
} from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

const STOCK_CATEGORIES = ["Stock Adjustment", "Stock Transfer", "Product"];

export default function ExportReportsPage() {
  const entries = useAuditLogStore((s) => s.entries);
  const addEntry = useAuditLogStore((s) => s.addEntry);
  const loginEvents = useSecurityStore((s) => s.loginEvents);
  const sessions = useSecurityStore((s) => s.sessions);
  const approvals = useApprovalStore((s) => s.approvals);

  const critical = useMemo(
    () => entries.filter((e) => e.severity === "critical").length,
    [entries]
  );
  const warnings = useMemo(
    () => entries.filter((e) => e.severity === "warning").length,
    [entries]
  );
  const exportsPerformed = useMemo(
    () => entries.filter((e) => e.action === "exported").length,
    [entries]
  );

  const moduleBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of entries) {
      map.set(entry.module, (map.get(entry.module) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const actionBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of entries) {
      map.set(entry.action, (map.get(entry.action) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const logExport = (name: string) => {
    addEntry({
      action: "exported",
      module: "System",
      category: "Export",
      entity: "Export",
      ref: name,
      actor: "Admin",
      timestamp: new Date().toISOString(),
      details: `Exported the ${name} report to CSV.`,
      severity: "info",
    });
    toast.success(`${name} exported.`);
  };

  const exportAuditTrail = () => {
    downloadCsv(
      "audit-trail.csv",
      ["Timestamp", "Action", "Module", "Category", "Entity", "Reference", "Actor", "Details", "Severity"],
      entries.map((entry: AuditLogEntry) => [
        entry.timestamp,
        entry.action,
        entry.module,
        entry.category,
        entry.entity,
        entry.ref,
        entry.actor,
        entry.details,
        entry.severity,
      ])
    );
    logExport("Audit Trail");
  };

  const exportLoginHistory = () => {
    downloadCsv(
      "login-history.csv",
      ["Timestamp", "Username", "Type", "Status", "IP", "Device", "Browser", "Location", "Reason"],
      loginEvents.map((event) => [
        event.timestamp,
        event.username,
        event.type,
        event.status,
        event.ip,
        event.device,
        event.browser,
        event.location,
        event.reason ?? "",
      ])
    );
    logExport("Login History");
  };

  const exportSessions = () => {
    downloadCsv(
      "sessions.csv",
      ["User", "Device", "Browser", "IP", "Location", "Started", "Last Active", "Status"],
      sessions.map((session) => [
        session.username,
        session.device,
        session.browser,
        session.ip,
        session.location,
        session.startedAt,
        session.lastActive,
        session.status,
      ])
    );
    logExport("Session History");
  };

  const exportApprovals = () => {
    downloadCsv(
      "approvals.csv",
      ["Document Type", "Document No", "Submitted By", "Submitted At", "Amount", "Reviewer", "Status", "Reviewed At", "Comment"],
      approvals.map((approval) => [
        approval.documentType,
        approval.documentNo,
        approval.submittedBy,
        approval.submittedAt,
        approval.amount,
        approval.reviewer,
        approval.status,
        approval.reviewedAt,
        approval.comment,
      ])
    );
    logExport("Approval History");
  };

  const exportStockChanges = () => {
    downloadCsv(
      "stock-changes.csv",
      ["Timestamp", "Action", "Category", "Entity", "Reference", "Actor", "Details", "Severity"],
      entries
        .filter((entry) => STOCK_CATEGORIES.includes(entry.category))
        .map((entry) => [
          entry.timestamp,
          entry.action,
          entry.category,
          entry.entity,
          entry.ref,
          entry.actor,
          entry.details,
          entry.severity,
        ])
    );
    logExport("Stock Changes");
  };

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">
          Export & Reports
        </h1>
        <p className="text-sm text-gray-500">
          Download audit datasets as CSV and review workspace insights.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard
          label="Audit records"
          value={entries.length}
          icon={<FileBarChart className="size-4" />}
        />
        <StatCard
          label="Critical events"
          value={critical}
          icon={<ShieldAlert className="size-4" />}
          tone="red"
        />
        <StatCard
          label="Warnings"
          value={warnings}
          icon={<AlertTriangle className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Exports performed"
          value={exportsPerformed}
          icon={<FileWarning className="size-4" />}
          tone="sky"
        />
      </div>

      <div className="flex flex-col gap-4 p-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Reports
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            {
              title: "Audit Trail",
              description: "Complete record of every tracked event.",
              action: exportAuditTrail,
            },
            {
              title: "Login History",
              description: "Sign-ins, sign-outs and device details.",
              action: exportLoginHistory,
            },
            {
              title: "Session History",
              description: "Active, expired and revoked sessions.",
              action: exportSessions,
            },
            {
              title: "Approval History",
              description: "Documents routed for review.",
              action: exportApprovals,
            },
            {
              title: "Stock Changes",
              description: "Adjustments, transfers and stock-level updates.",
              action: exportStockChanges,
            },
          ].map((report) => (
            <div
              key={report.title}
              className="flex items-center justify-between gap-3 rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {report.title}
                </p>
                <p className="text-xs text-gray-500">{report.description}</p>
              </div>
              <Button size="sm" variant="outline" onClick={report.action}>
                <Download /> CSV
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Insights
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-emerald-600" />
              <p className="text-sm font-semibold text-gray-800">
                Events by module
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {moduleBreakdown.map(([module, count]) => (
                <div
                  key={module}
                  className="flex items-center justify-between py-2.5"
                >
                  {moduleBadge(module)}
                  <span className="text-sm font-semibold text-gray-800">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FileBarChart className="size-4 text-emerald-600" />
              <p className="text-sm font-semibold text-gray-800">
                Events by action
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {actionBreakdown.map(([action, count]) => (
                <div
                  key={action}
                  className="flex items-center justify-between py-2.5"
                >
                  {actionBadge(action)}
                  <span className="text-sm font-semibold text-gray-800">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
