"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { ACCOUNT_STATUSES, useAccountStore } from "@/stores/accountStore";
import { statusBadge } from "../accounting-config";
import { useClientReady } from "@/hooks/useClientReady";

export default function CashAccountsPage() {
  const accounts = useAccountStore((s) => s.accounts);
  const addAccount = useAccountStore((s) => s.addAccount);
  const updateAccount = useAccountStore((s) => s.updateAccount);
  const deleteAccount = useAccountStore((s) => s.deleteAccount);

  const items = accounts.filter((a) => a.kind === "cash");

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Cash Accounts"
      description="Manage physical cash held on hand or in tills."
      addLabel="Add Cash Account"
      emptyTitle="No cash accounts yet"
      emptyDescription="Add a petty cash or till account."
      searchPlaceholder="Search accounts..."
      tableHeaders={["Name", "Currency", "Balance", "Status"]}
      fields={[
        {
          name: "name",
          label: "Account Name",
          placeholder: "e.g. Petty Cash",
          required: true,
        },
        {
          name: "currency",
          label: "Currency",
          placeholder: "e.g. USD",
          required: true,
        },
        {
          name: "openingBalance",
          label: "Opening Balance",
          type: "number",
          placeholder: "e.g. 300",
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ACCOUNT_STATUSES.map((s) => ({ value: s, label: s })),
          required: true,
        },
        {
          name: "description",
          label: "Description",
          placeholder: "Optional notes...",
        },
      ]}
      rowCells={(e) => [
        <span key="name" className="font-medium text-gray-800">
          {e.name}
        </span>,
        e.currency,
        e.openingBalance,
        statusBadge(e.status),
      ]}
      items={items}
      searchText={(e) => `${e.name} ${e.currency} ${e.description}`}
      add={(data) =>
        addAccount({ ...data, kind: "cash", bankName: "", accountNo: "" })
      }
      update={(id, data) =>
        updateAccount(id, { ...data, kind: "cash", bankName: "", accountNo: "" })
      }
      remove={deleteAccount}
    />
  );
}
