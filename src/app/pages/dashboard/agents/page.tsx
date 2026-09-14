"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { notify } from "@/lib/notify";
import { Agent, useAgentStore } from "@/stores/agentStore";

export default function AgentsPage() {
  const agents = useAgentStore((s) => s.agents);
  const addAgent = useAgentStore((s) => s.addAgent);
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const deleteAgent = useAgentStore((s) => s.deleteAgent);

  const handleAdd = (data: Omit<Agent, "id">) => {
    addAgent(data);
    notify({
      type: "success",
      category: "agent",
      title: "Agent added",
      message: data.name,
      link: "/dashboard/agents",
    });
  };

  const handleUpdate = (id: string, data: Omit<Agent, "id">) => {
    updateAgent(id, data);
    notify({
      type: "info",
      category: "agent",
      title: "Agent updated",
      message: data.name,
    });
  };

  return (
    <MasterDataManager
      title="Agents"
      description="Manage travel agents reused across confirmation vouchers."
      addLabel="Add Agent"
      emptyTitle="No agents yet"
      emptyDescription="Add your first agent to assign bookings to them in vouchers."
      searchPlaceholder="Search agents..."
      tableHeaders={["Name", "Agency", "Place", "Phone", "Email"]}
      fields={[
        {
          name: "name",
          label: "Agent Name",
          placeholder: "e.g. Sekhar Rao",
          required: true,
        },
        {
          name: "company",
          label: "Agency / Company",
          placeholder: "e.g. VR Holidays",
        },
        {
          name: "email",
          label: "Email",
          placeholder: "e.g. sekhar@vrholidays.in",
        },
        {
          name: "phone",
          label: "Phone",
          placeholder: "e.g. +91 98450 11223",
        },
        {
          name: "place",
          label: "Place / City",
          placeholder: "e.g. Hyderabad",
        },
        {
          name: "notes",
          label: "Notes",
          placeholder: "Optional notes...",
        },
      ]}
      rowCells={(a) => [
        <span key="name" className="font-medium text-gray-800">
          {a.name}
        </span>,
        a.company || "—",
        a.place || "—",
        a.phone || "—",
        a.email || "—",
      ]}
      items={agents}
      searchText={(a) =>
        `${a.name} ${a.company} ${a.place} ${a.phone} ${a.email}`
      }
      add={handleAdd}
      update={handleUpdate}
      remove={deleteAgent}
    />
  );
}