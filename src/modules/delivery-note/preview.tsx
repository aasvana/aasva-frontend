"use client";

import { format } from "date-fns";
import {
  DELIVERY_NOTE_STATUS_LABELS,
  DeliveryNoteStatus,
  InvoiceBusiness,
  formatMoney,
} from "./constants";
import {
  DeliveryNoteFormData,
  computeTotals,
  toNumber,
  resolveBusiness,
} from "./schema";
import { Badge } from "./ui";

const statusVariant: Record<DeliveryNoteStatus, string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-300",
  sent: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

const sealVariant: Record<DeliveryNoteStatus, string> = {
  draft: "border-slate-400 text-slate-500",
  sent: "border-blue-500 text-blue-600",
  delivered: "border-emerald-600 text-emerald-700",
  cancelled: "border-gray-400 text-gray-500",
};

function StatusSeal({ status }: { status: DeliveryNoteStatus }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute bottom-1 left-2 -rotate-12 rounded-lg border-[3px] bg-white/70 px-5 py-1.5 text-lg font-black uppercase tracking-[0.2em] shadow-sm ${sealVariant[status]}`}
    >
      {DELIVERY_NOTE_STATUS_LABELS[status]}
    </div>
  );
}

const formatDate = (value: Date | string | undefined) =>
  value ? format(new Date(value), "dd MMM yyyy") : "-";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800">{value || "-"}</p>
    </div>
  );
}

function PartyBlock({ title, party }: { title: string; party?: any }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-wider text-gray-400">
        {title}
      </p>
      <p className="text-sm font-medium text-gray-800">{party?.name || "-"}</p>
      {party?.company && (
        <p className="text-sm text-gray-600">{party.company}</p>
      )}
      {party?.address && (
        <p className="text-sm text-gray-600">{party.address}</p>
      )}
      {party?.email && (
        <p className="text-sm text-gray-600">{party.email}</p>
      )}
      {party?.phone && (
        <p className="text-sm text-gray-600">{party.phone}</p>
      )}
    </div>
  );
}

export function DeliveryNotePreview({
  data,
  business,
}: {
  data: DeliveryNoteFormData;
  business?: InvoiceBusiness;
}) {
  const totals = computeTotals(data);
  const currency = data.currency;
  const resolvedBusiness = business ?? resolveBusiness(data);

  return (
    <div className="relative px-6 py-6 md:px-10 md:py-8">
      <div className="flex items-start justify-between border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
            {resolvedBusiness.name.slice(0, 1)}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {resolvedBusiness.name}
            </p>
            <p className="text-sm text-gray-500">{resolvedBusiness.address}</p>
            <p className="text-sm text-gray-500">
              {resolvedBusiness.email} · {resolvedBusiness.phone}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold uppercase tracking-wide text-gray-900">
            Delivery Note
          </p>
          <p className="text-sm font-medium text-gray-800">
            #{data.dnNo || "-"}
          </p>
          <div className="mt-1">
            <Badge variant="outline" className={statusVariant[data.status]}>
              {DELIVERY_NOTE_STATUS_LABELS[data.status]}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PartyBlock title="Deliver To" party={data.deliverTo} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <DetailRow label="Issue Date" value={formatDate(data.issueDate)} />
          <DetailRow label="Currency" value={currency} />
          <DetailRow label="Reference" value={data.reference} />
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Description", "Qty", "Rate", "Tax %", "Amount"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.items.map((item, index) => {
              const amount =
                toNumber(item.qty) * toNumber(item.rate) +
                (toNumber(item.qty) *
                  toNumber(item.rate) *
                  toNumber(item.taxRate)) /
                  100;
              return (
                <tr key={index}>
                  <td className="px-4 py-2.5 font-medium text-gray-800">
                    {item.description || "-"}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">
                    {toNumber(item.qty)}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">
                    {formatMoney(toNumber(item.rate), currency)}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">
                    {toNumber(item.taxRate)}%
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-800">
                    {formatMoney(amount, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="relative mt-6 flex justify-end">
        <div className="w-full max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatMoney(totals.subtotal, currency)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span className="text-red-600">
                -{formatMoney(totals.discountAmount, currency)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>{formatMoney(totals.tax, currency)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
            <span>Total</span>
            <span>{formatMoney(totals.total, currency)}</span>
          </div>
        </div>
        <StatusSeal status={data.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.notes && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              Notes
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
              {data.notes}
            </p>
          </div>
        )}
        {data.terms && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              Terms & Conditions
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
              {data.terms}
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
        This is a system-generated delivery note. Please verify all details
        before dispatch.
      </div>
    </div>
  );
}
