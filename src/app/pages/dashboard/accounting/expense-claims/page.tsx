"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  EXPENSE_CLAIM_CATEGORIES,
  EXPENSE_CLAIM_STATUSES,
  ExpenseClaimStatus,
  useExpenseClaimStore,
} from "@/stores/expenseClaimStore";
import { statusBadge } from "../accounting-config";
import { useClientReady } from "@/hooks/useClientReady";

export default function ExpenseClaimsPage() {
  const claims = useExpenseClaimStore((s) => s.claims);
  const addClaim = useExpenseClaimStore((s) => s.addClaim);
  const updateClaim = useExpenseClaimStore((s) => s.updateClaim);
  const deleteClaim = useExpenseClaimStore((s) => s.deleteClaim);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Expense Claims"
      description="Review and reimburse employee expense claims."
      addLabel="Add Claim"
      emptyTitle="No expense claims yet"
      emptyDescription="Add the first claim submitted by an employee."
      searchPlaceholder="Search claims..."
      tableHeaders={["No", "Employee", "Date", "Category", "Amount", "Status"]}
      fields={[
        {
          name: "claimNo",
          label: "Claim No.",
          placeholder: "e.g. EC-1001",
          required: true,
        },
        {
          name: "employee",
          label: "Employee",
          placeholder: "e.g. Alicia Reyes",
          required: true,
        },
        { name: "date", label: "Date", type: "date", required: true },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: EXPENSE_CLAIM_CATEGORIES.map((c) => ({ value: c, label: c })),
          required: true,
        },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 120",
          required: true,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: EXPENSE_CLAIM_STATUSES.map((s) => ({
            value: s,
            label: s,
          })),
          required: true,
        },
        {
          name: "notes",
          label: "Notes",
          placeholder: "Optional details...",
        },
      ]}
      rowCells={(e) => [
        <span key="no" className="font-medium text-gray-800">
          {e.claimNo}
        </span>,
        e.employee,
        e.date,
        e.category,
        e.amount,
        statusBadge(e.status),
      ]}
      items={claims}
      searchText={(e) => `${e.claimNo} ${e.employee} ${e.category} ${e.status}`}
      add={(data) =>
        addClaim({ ...data, status: data.status as ExpenseClaimStatus })
      }
      update={(id, data) =>
        updateClaim(id, {
          ...data,
          status: data.status as ExpenseClaimStatus,
        })
      }
      remove={deleteClaim}
    />
  );
}
