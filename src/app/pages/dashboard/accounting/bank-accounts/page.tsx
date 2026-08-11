"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { ACCOUNT_STATUSES, useAccountStore } from "@/stores/accountStore";
import { statusBadge } from "../accounting-config";
import { useClientReady } from "@/hooks/useClientReady";

export default function BankAccountsPage() {
  const accounts = useAccountStore((s) => s.accounts);
  const addAccount = useAccountStore((s) => s.addAccount);
  const updateAccount = useAccountStore((s) => s.updateAccount);
  const deleteAccount = useAccountStore((s) => s.deleteAccount);

  const items = accounts.filter((a) => a.kind === "bank");

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Bank Accounts"
      description="Manage the bank accounts used for deposits and payments."
      addLabel="Add Bank Account"
      emptyTitle="No bank accounts yet"
      emptyDescription="Add your first bank account to track balances."
      searchPlaceholder="Search accounts..."
      tableHeaders={["Name", "Bank", "Account No", "Currency", "Balance", "Status"]}
      fields={[
        {
          name: "name",
          label: "Account Name",
          placeholder: "e.g. Business Checking",
          required: true,
        },
        {
          name: "bankName",
          label: "Bank",
          placeholder: "e.g. First National Bank",
          required: true,
        },
        {
          name: "accountNo",
          label: "Account No.",
          placeholder: "e.g. •••• 4821",
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
          placeholder: "e.g. 10000",
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
        e.bankName,
        e.accountNo || "—",
        e.currency,
        e.openingBalance,
        statusBadge(e.status),
      ]}
      items={items}
      searchText={(e) => `${e.name} ${e.bankName} ${e.accountNo} ${e.currency}`}
      add={(data) => addAccount({ ...data, kind: "bank" })}
      update={(id, data) => updateAccount(id, { ...data, kind: "bank" })}
      remove={deleteAccount}
    />
  );
}
