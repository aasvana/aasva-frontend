"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  SUPPLIER_PAYMENT_MODES,
  SUPPLIER_PAYMENT_STATUSES,
  SupplierPaymentStatus,
  useSupplierPaymentStore,
} from "@/stores/supplierPaymentStore";
import { statusBadge } from "../accounting-config";
import { useClientReady } from "@/hooks/useClientReady";

export default function SupplierPaymentsPage() {
  const payments = useSupplierPaymentStore((s) => s.payments);
  const addPayment = useSupplierPaymentStore((s) => s.addPayment);
  const updatePayment = useSupplierPaymentStore((s) => s.updatePayment);
  const deletePayment = useSupplierPaymentStore((s) => s.deletePayment);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Supplier Payments"
      description="Record money paid to suppliers against bills."
      addLabel="Add Payment"
      emptyTitle="No supplier payments yet"
      emptyDescription="Record the first payment you make to a supplier."
      searchPlaceholder="Search payments..."
      tableHeaders={["No", "Vendor", "Date", "Amount", "Mode", "Status"]}
      fields={[
        {
          name: "paymentNo",
          label: "Payment No.",
          placeholder: "e.g. PY-1001",
          required: true,
        },
        {
          name: "vendor",
          label: "Vendor",
          placeholder: "e.g. Acme Supplies",
          required: true,
        },
        { name: "date", label: "Date", type: "date", required: true },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 480",
          required: true,
        },
        {
          name: "mode",
          label: "Mode",
          type: "select",
          options: SUPPLIER_PAYMENT_MODES.map((m) => ({ value: m, label: m })),
          required: true,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: SUPPLIER_PAYMENT_STATUSES.map((s) => ({
            value: s,
            label: s,
          })),
          required: true,
        },
        {
          name: "notes",
          label: "Notes",
          placeholder: "e.g. BILL-1001",
        },
      ]}
      rowCells={(e) => [
        <span key="no" className="font-medium text-gray-800">
          {e.paymentNo}
        </span>,
        e.vendor,
        e.date,
        e.amount,
        e.mode,
        statusBadge(e.status),
      ]}
      items={payments}
      searchText={(e) => `${e.paymentNo} ${e.vendor} ${e.mode} ${e.status}`}
      add={(data) =>
        addPayment({ ...data, status: data.status as SupplierPaymentStatus })
      }
      update={(id, data) =>
        updatePayment(id, {
          ...data,
          status: data.status as SupplierPaymentStatus,
        })
      }
      remove={deletePayment}
    />
  );
}
