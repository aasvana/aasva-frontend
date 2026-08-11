"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { useClientReady } from "@/hooks/useClientReady";
import {
  Avatar,
  formatDate,
  memberName,
  pageShell,
  PageHeader,
  StatusBadge,
} from "@/helpers/teams-meet/team-ui";
import { CURRENT_MEMBER_ID, useTeamMeetStore } from "@/stores/teamMeetStore";

export default function WorkApprovalsPage() {
  const approvals = useTeamMeetStore((s) => s.approvals);
  const updateApproval = useTeamMeetStore((s) => s.updateApproval);

  const sorted = useMemo(
    () => [...approvals].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)),
    [approvals]
  );
  const pending = sorted.filter((a) => a.status === "Pending");
  const mine = sorted.filter((a) => a.reviewer === CURRENT_MEMBER_ID && a.status === "Pending");

  const ready = useClientReady();
  if (!ready) return null;

  const decide = (id: string, status: "Approved" | "Rejected") => {
    const item = approvals.find((a) => a.id === id);
    if (!item) return;
    updateApproval(id, {
      type: item.type,
      subject: item.subject,
      submittedBy: item.submittedBy,
      reviewer: item.reviewer,
      status,
      amount: item.amount,
      requestedAt: item.requestedAt,
      decidedAt: new Date().toISOString().slice(0, 10),
      comment: status === "Approved" ? "Approved." : "Rejected.",
    });
    toast.success(`Request ${status.toLowerCase()}.`);
  };

  return (
    <div className={pageShell}>
      <PageHeader
        title="Approvals"
        description={`${mine.length} waiting on you · ${pending.length} pending overall.`}
      />
      <div className="p-1.5">
        <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  {["Request", "Type", "Submitted by", "Reviewer", "Amount", "Requested", "Status", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/60">
                    <td className="max-w-[260px] px-6 py-3">
                      <p className="truncate font-medium text-gray-800">{a.subject}</p>
                      {a.comment && <p className="truncate text-xs text-gray-400">{a.comment}</p>}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{a.type}</td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2">
                        <Avatar id={a.submittedBy} size="size-6" />
                        {memberName(a.submittedBy)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {a.reviewer ? memberName(a.reviewer) : "—"}
                    </td>
                    <td className="px-6 py-3 font-semibold text-gray-800">
                      {a.amount === "0" ? "—" : `₹${Number(a.amount).toLocaleString("en-IN")}`}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{formatDate(a.requestedAt)}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      {a.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => decide(a.id, "Approved")}
                            className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            title="Approve"
                          >
                            <Check className="size-4" />
                          </button>
                          <button
                            onClick={() => decide(a.id, "Rejected")}
                            className="grid size-7 place-items-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                            title="Reject"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {a.decidedAt ? formatDate(a.decidedAt) : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-gray-400">
                      No approval requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
