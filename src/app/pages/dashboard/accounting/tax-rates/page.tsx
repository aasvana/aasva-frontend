"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  TAX_TYPES,
  TAX_TYPE_LABELS,
  TaxType,
  useTaxStore,
} from "@/stores/taxStore";
import { statusBadge } from "../accounting-config";
import { useClientReady } from "@/hooks/useClientReady";

const toBool = (v: string | boolean) => v === true || v === "Yes";

export default function TaxRatesPage() {
  const rates = useTaxStore((s) => s.rates);
  const addRate = useTaxStore((s) => s.addRate);
  const updateRate = useTaxStore((s) => s.updateRate);
  const deleteRate = useTaxStore((s) => s.deleteRate);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Tax Rates"
      description="Configure the tax rates applied to sales and purchases."
      addLabel="Add Tax Rate"
      emptyTitle="No tax rates yet"
      emptyDescription="Create your first tax rate to apply on documents."
      searchPlaceholder="Search tax rates..."
      tableHeaders={["Name", "Rate", "Type", "Default", "Status"]}
      fields={[
        {
          name: "name",
          label: "Name",
          placeholder: "e.g. Standard VAT",
          required: true,
        },
        {
          name: "rate",
          label: "Rate (%)",
          type: "number",
          placeholder: "e.g. 20",
          required: true,
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: TAX_TYPES.map((t) => ({ value: t, label: TAX_TYPE_LABELS[t] })),
          required: true,
        },
        {
          name: "isDefault",
          label: "Default",
          type: "select",
          options: [
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ],
          required: true,
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
        <span key="name" className="font-medium text-gray-800">
          {e.name}
        </span>,
        `${e.rate}%`,
        TAX_TYPE_LABELS[e.type],
        statusBadge(toBool(e.isDefault) ? "Yes" : "No"),
        statusBadge(e.status),
      ]}
      items={rates}
      searchText={(e) => `${e.name} ${e.rate} ${e.type} ${e.status}`}
      add={(data) =>
        addRate({
          ...data,
          type: data.type as TaxType,
          isDefault: toBool(data.isDefault),
        })
      }
      update={(id, data) =>
        updateRate(id, {
          ...data,
          type: data.type as TaxType,
          isDefault: toBool(data.isDefault),
        })
      }
      remove={deleteRate}
    />
  );
}
