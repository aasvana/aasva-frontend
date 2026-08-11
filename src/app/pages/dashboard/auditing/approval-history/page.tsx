"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock, ListChecks, XCircle } from "lucide-react";
import {
  APPROVAL_STATUSES,
  useApprovalStore,
} from "@/stores/approvalStore";
import { StatCard, formatDate } from "@/components/auditing/audit-ui";
import { statusBadge } from "@/app/pages/dashboard/accounting/accounting-config";
import { useClientReady } from "@/hooks/useClientReady";

export default function ApprovalHistoryPage() {
  const approvals = useApprovalStore((s) => s.approvals);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return approvals
      .filter((a) => statusFilter === "all" || a.status === statusFilter)
      .filter(
        (a) =>
          !query ||
          `${a.documentType} ${a.documentNo} ${a.submittedBy} ${a.reviewer} ${a.comment}`
            .toLowerCase()
            .includes(query)
      )
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [approvals, statusFilter, searchTerm]);

  const pending = approvals.filter((a) => a.status === "Pending").length;
  const approved = approvals.filter((a) => a.status === "Approved").length;
  const rejected = approvals.filter((a) => a.status === "Rejected").length;

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Approval History
          </h1>
          <p className="text-sm text-gray-500">
            Documents routed for review and their outcome.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <label className="sr-only">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search approvals..."
              className="h-11 w-full max-w-xs rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
          >
            <option value="all">All statuses</option>
            {APPROVAL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard
          label="Total approvals"
          value={approvals.length}
          icon={<ListChecks className="size-4" />}
        />
        <StatCard
          label="Pending"
          value={pending}
          icon={<Clock className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Approved"
          value={approved}
          icon={<CheckCircle2 className="size-4" />}
        />
        <StatCard
          label="Rejected"
          value={rejected}
          icon={<XCircle className="size-4" />}
          tone="red"
        />
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="overflow-hidden min-h-[300px]">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[300px] text-center">
                    <ListChecks className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No approvals found
                    </p>
                    <p className="text-sm text-gray-500">
                      Approvals routed for review will appear here.
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "document",
                          "submitted by",
                          "submitted",
                          "amount",
                          "reviewer",
                          "status",
                          "reviewed",
                          "comment",
                        ].map((header, idx) => (
                          <th
                            key={idx}
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {filtered.map((approval) => (
                        <tr key={approval.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <span className="font-medium text-gray-800 dark:text-neutral-200">
                              {approval.documentType}
                            </span>
                            <span className="text-gray-400"> · </span>
                            <span className="text-gray-600 dark:text-neutral-300">
                              {approval.documentNo}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {approval.submittedBy}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {formatDate(approval.submittedAt)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {approval.amount}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {approval.reviewer}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            {statusBadge(approval.status)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {approval.reviewedAt
                              ? formatDate(approval.reviewedAt)
                              : "—"}
                          </td>
                          <td className="px-6 py-2.5 min-w-[200px] text-sm text-gray-600 dark:text-neutral-300">
                            {approval.comment || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
