"use client";

import { CustomerCollectionManager } from "@/components/customer/customer-ui";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerCommunicationPage() {
  const add = useCustomerProfileStore((s) => s.addCommunication);
  const remove = useCustomerProfileStore((s) => s.deleteCommunication);
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <CustomerCollectionManager
      title="Communication"
      description="Messages, calls and interactions with this customer."
      addLabel="Log Communication"
      emptyTitle="No communication"
      emptyDescription="Log a call or message to get started."
      searchPlaceholder="Search communication…"
      tableHeaders={["Channel", "Direction", "Subject", "Body", "Agent", "Time"]}
      getItems={(p) => p.communication}
      searchText={(c) => `${c.subject} ${c.body} ${c.agent} ${c.channel}`}
      add={add}
      remove={remove}
      fields={[
        {
          name: "channel",
          label: "Channel",
          type: "select",
          options: [
            { value: "email", label: "Email" },
            { value: "phone", label: "Phone" },
            { value: "whatsapp", label: "WhatsApp" },
            { value: "meeting", label: "Meeting" },
          ],
        },
        {
          name: "direction",
          label: "Direction",
          type: "select",
          options: [
            { value: "outbound", label: "Outbound" },
            { value: "inbound", label: "Inbound" },
          ],
        },
        { name: "subject", label: "Subject", required: true },
        { name: "body", label: "Body" },
        { name: "agent", label: "Agent" },
        { name: "timestamp", label: "Timestamp", type: "date" },
      ]}
      rowCells={(c) => [
        <span key="ch" className="inline-flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-indigo-50 text-[11px] font-semibold uppercase text-indigo-600">
            {c.channel.slice(0, 3)}
          </span>
          {c.channel}
        </span>,
        <span key="dir" className="capitalize">{c.direction}</span>,
        <span key="sub" className="font-medium text-gray-800">{c.subject}</span>,
        <span key="body" className="max-w-56 truncate text-gray-500">{c.body}</span>,
        <span key="agent">{c.agent}</span>,
        <span key="ts" className="text-gray-500">{new Date(c.timestamp).toLocaleString("en-GB", { day: "2-digit", month: "short" })}</span>,
      ]}
    />
  );
}
