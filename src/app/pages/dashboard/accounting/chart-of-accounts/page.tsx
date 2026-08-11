"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_LABELS,
  AccountType,
  useChartOfAccountsStore,
} from "@/stores/chartOfAccountsStore";
import { statusBadge } from "../accounting-config";
import { useClientReady } from "@/hooks/useClientReady";

export default function ChartOfAccountsPage() {
  const accounts = useChartOfAccountsStore((s) => s.accounts);
  const addAccount = useChartOfAccountsStore((s) => s.addAccount);
  const updateAccount = useChartOfAccountsStore((s) => s.updateAccount);
  const deleteAccount = useChartOfAccountsStore((s) => s.deleteAccount);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Chart of Accounts"
      description="Define the accounts used to classify every transaction."
      addLabel="Add Account"
      emptyTitle="No accounts yet"
      emptyDescription="Create the accounts for your general ledger."
      searchPlaceholder="Search accounts..."
      tableHeaders={["Code", "Name", "Type", "Opening Balance", "Status"]}
      fields={[
        {
          name: "code",
          label: "Code",
          placeholder: "e.g. 1000",
          required: true,
        },
        {
          name: "name",
          label: "Account Name",
          placeholder: "e.g. Cash & Bank",
          required: true,
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: ACCOUNT_TYPES.map((t) => ({
            value: t,
            label: ACCOUNT_TYPE_LABELS[t],
          })),
          required: true,
        },
        {
          name: "openingBalance",
          label: "Opening Balance",
          type: "number",
          placeholder: "e.g. 0",
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ],
          required: true,
        },
        {
          name: "description",
          label: "Description",
          placeholder: "Optional details...",
        },
      ]}
      rowCells={(e) => [
        <span key="code" className="font-mono text-xs text-gray-500">
          {e.code}
        </span>,
        <span key="name" className="font-medium text-gray-800">
          {e.name}
        </span>,
        ACCOUNT_TYPE_LABELS[e.type],
        e.openingBalance,
        statusBadge(e.status),
      ]}
      items={accounts}
      searchText={(e) => `${e.code} ${e.name} ${e.type}`}
      add={(data) => addAccount({ ...data, type: data.type as AccountType })}
      update={(id, data) =>
        updateAccount(id, { ...data, type: data.type as AccountType })
      }
      remove={deleteAccount}
    />
  );
}
