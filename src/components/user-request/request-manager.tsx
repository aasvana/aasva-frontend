"use client";

import { useMemo } from "react";
import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  REQUEST_CATEGORIES,
  REQUEST_CATEGORY_LABELS,
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
  RequestCategory,
  UserRequest,
  useUserRequestStore,
} from "@/stores/userRequestStore";
import {
  categoryBadge,
  priorityPill,
  statusPill,
  logRequestAction,
} from "@/components/user-request/request-ui";

const PRIORITY_OPTIONS = REQUEST_PRIORITIES.map((p) => ({ value: p, label: p }));
const STATUS_OPTIONS = REQUEST_STATUSES.map((s) => ({ value: s, label: s }));
const CATEGORY_OPTIONS = REQUEST_CATEGORIES.map((c) => ({
  value: c,
  label: REQUEST_CATEGORY_LABELS[c],
}));

export function RequestManager({
  category,
  showCategory = false,
  description,
}: {
  category: RequestCategory | "all";
  showCategory?: boolean;
  description: string;
}) {
  const requests = useUserRequestStore((s) => s.requests);
  const addRequest = useUserRequestStore((s) => s.addRequest);
  const updateRequest = useUserRequestStore((s) => s.updateRequest);
  const deleteRequest = useUserRequestStore((s) => s.deleteRequest);

  const filtered = useMemo(
    () =>
      category === "all"
        ? requests
        : requests.filter((r) => r.category === category),
    [requests, category]
  );

  const handleAdd = (data: Omit<UserRequest, "id">) => {
    addRequest({ ...data, category: category === "all" ? data.category : category });
    logRequestAction(
      "created",
      "Request",
      data.title,
      `New request "${data.title}" logged.`
    );
  };

  const handleUpdate = (id: string, data: Omit<UserRequest, "id">) => {
    updateRequest(id, {
      ...data,
      category: category === "all" ? data.category : category,
    });
    logRequestAction(
      "updated",
      "Request",
      data.title,
      `Request "${data.title}" updated.`
    );
  };

  const handleDelete = (id: string) => {
    const request = requests.find((r) => r.id === id);
    deleteRequest(id);
    if (request) {
      logRequestAction(
        "deleted",
        "Request",
        request.title,
        `Request "${request.title}" deleted.`
      );
    }
  };

  const categoryLabel =
    category === "all" ? "Request" : REQUEST_CATEGORY_LABELS[category];

  const title = showCategory
    ? "All Requests"
    : `${categoryLabel}s`;

  const headers = showCategory
    ? ["Ref No", "Title", "Category", "Requester", "Priority", "Status"]
    : ["Ref No", "Title", "Requester", "Priority", "Status", "Assigned"];

  return (
    <MasterDataManager
      title={title}
      description={description}
      addLabel={`Add ${showCategory ? "Request" : categoryLabel}`}
      emptyTitle={`No ${showCategory ? "requests" : categoryLabel.toLowerCase() + "s"} yet`}
      emptyDescription="Add one to get started."
      searchPlaceholder="Search requests…"
      tableHeaders={headers}
      fields={[
        { name: "refNo", label: "Ref No" },
        ...(showCategory
          ? [{ name: "category", label: "Category", type: "select" as const, options: CATEGORY_OPTIONS }]
          : []),
        { name: "title", label: "Title", required: true },
        { name: "description", label: "Description" },
        { name: "requesterName", label: "Requester Name" },
        { name: "requesterEmail", label: "Requester Email" },
        { name: "priority", label: "Priority", type: "select", options: PRIORITY_OPTIONS },
        { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
        { name: "assignedTo", label: "Assigned To" },
        { name: "votes", label: "Votes", type: "number" },
        { name: "targetRelease", label: "Target Release" },
      ]}
      rowCells={(r) =>
        [
          <span key="ref" className="font-medium text-gray-800">{r.refNo}</span>,
          <div key="title" className="max-w-64">
            <span className="font-medium text-gray-800">{r.title}</span>
            {r.description && (
              <span className="block truncate text-xs text-gray-400">
                {r.description}
              </span>
            )}
          </div>,
          ...(showCategory ? [categoryBadge(r.category)] : []),
          <div key="req">
            <span className="text-gray-700">{r.requesterName}</span>
            <span className="block text-xs text-gray-400">{r.requesterEmail}</span>
          </div>,
          priorityPill(r.priority),
          statusPill(r.status),
          ...(showCategory
            ? []
            : [
                <span key="assign" className="text-gray-500">
                  {r.assignedTo || "—"}
                </span>,
              ]),
        ]
      }
      items={filtered}
      searchText={(r) =>
        `${r.refNo} ${r.title} ${r.description} ${r.requesterName} ${r.requesterEmail} ${r.status} ${r.priority}`
      }
      add={handleAdd}
      update={handleUpdate}
      remove={handleDelete}
    />
  );
}
