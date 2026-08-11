"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDownUp,
  CirclePlusIcon,
  Download,
  EllipsisVertical,
  Eye,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import {
  SavedDeliveryNote,
  computeTotals,
  DELIVERY_NOTE_STATUS_LABELS,
  formatMoney,
  downloadDeliveryNotePdf,
  useDeliveryNotes,
  useDeleteDeliveryNote,
} from "@/modules/delivery-note";
import { usePosStore } from "@/modules/pos";
import { useHydrate } from "@/hooks/useHydrate";

type DeliveryNoteRow = {
  id: string;
  dnNo: string;
  deliverTo: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
};

const sortOptions = [
  { key: "dnNo", label: "Delivery Note No" },
  { key: "deliverTo", label: "Deliver To" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
] as const;

type SortKey = (typeof sortOptions)[number]["key"];
type SortOrder = "asc" | "desc";

const toRow = (record: SavedDeliveryNote): DeliveryNoteRow => {
  const totals = computeTotals(record.data);
  return {
    id: record.id,
    dnNo: record.data.dnNo || record.id.slice(0, 8),
    deliverTo: record.data.deliverTo.name || "-",
    amount: totals.total,
    currency: record.data.currency,
    status: record.data.status,
    date: format(new Date(record.savedAt), "dd-MM-yyyy"),
  };
};

const statusClasses: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-50 text-blue-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function DeliveryNotes() {
  const router = useRouter();
  const { data: deliveryNotes = [], isLoading } = useDeliveryNotes();
  const deleteMutation = useDeleteDeliveryNote();
  useHydrate(usePosStore((s) => s.hydrate));

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const rows: DeliveryNoteRow[] = deliveryNotes.map(toRow);

  const sortByKey = (data: DeliveryNoteRow[], key: SortKey, order: SortOrder) => {
    return [...data].sort((a, b) => {
      if (key === "date") {
        return (
          (new Date(a[key]).getTime() - new Date(b[key]).getTime()) *
          (order === "asc" ? 1 : -1)
        );
      }
      const aVal =
        key === "amount" ? Number(a.amount) : String(a[key]).toLowerCase();
      const bVal =
        key === "amount" ? Number(b.amount) : String(b[key]).toLowerCase();
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filterAndSortData = () => {
    const filtered = rows.filter((item) =>
      String(item[sortKey as keyof DeliveryNoteRow])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    return sortByKey(filtered, sortKey, sortOrder);
  };

  const handleSort = (key: SortKey) => {
    const isSameKey = key === sortKey;
    setSortKey(key);
    setSortOrder(isSameKey && sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const paginatedData = () => {
    const sortedFiltered = filterAndSortData();
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedFiltered.slice(startIdx, startIdx + itemsPerPage);
  };

  const totalPages = Math.ceil(filterAndSortData().length / itemsPerPage);

  const handleReset = () => {
    setSearchTerm("");
    setSortKey("date");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this delivery note?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Delivery note deleted."),
      onError: () => toast.error("Failed to delete the delivery note."),
    });
  };

  const handleDownload = (record: DeliveryNoteRow) => {
    const source = deliveryNotes.find((v) => v.id === record.id);
    if (!source) return;
    downloadDeliveryNotePdf(source.data).catch(() =>
      toast.error("Failed to generate the PDF.")
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="py-3 px-4 flex flex-row justify-between">
                <div className="relative w-lg max-w-sm">
                  <label className="sr-only">Search</label>
                  <input
                    type="text"
                    value={searchTerm ?? ""}
                    onChange={handleSearch}
                    placeholder={`Search by ${
                      sortOptions.find((o) => o.key === sortKey)?.label
                    }`}
                    className="py-1.5 sm:py-2 px-3 ps-9 block w-full border border-gray-200 shadow-2xs rounded-lg sm:text-sm"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={handleReset}
                  >
                    <RefreshCw />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        className="hover:bg-black hover:text-white"
                      >
                        <ArrowDownUp className="w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left" align="start">
                      <DropdownMenuItem className="bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 mb-2">
                        Sort By
                      </DropdownMenuItem>
                      {sortOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.key}
                          onClick={() => handleSort(option.key)}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="secondary" asChild>
                    <Link href="/dashboard/delivery-notes/create">
                      <CirclePlusIcon /> Create Delivery Note
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="overflow-hidden min-h-[550px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[550px] text-sm text-gray-500">
                    Loading delivery notes...
                  </div>
                ) : rows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[550px] text-center">
                    <p className="text-lg font-medium text-gray-800">
                      No delivery notes yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Create your first delivery note to see it here.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/delivery-notes/create">
                        <CirclePlusIcon /> Create Delivery Note
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "delivery note no",
                          "deliver to",
                          "amount",
                          "status",
                          "date",
                          "Action",
                        ].map((header, idx) => (
                          <th
                            key={idx}
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {paginatedData().map((data) => (
                        <tr key={data.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {data.dnNo}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {data.deliverTo}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {formatMoney(data.amount, data.currency)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                statusClasses[data.status] ??
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {DELIVERY_NOTE_STATUS_LABELS[
                                data.status as keyof typeof DELIVERY_NOTE_STATUS_LABELS
                              ] ?? data.status}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {data.date}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <EllipsisVertical />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side="left" align="start">
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/delivery-notes/${data.id}/edit`
                                    )
                                  }
                                >
                                  <Pencil /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/delivery-notes/${data.id}/view`
                                    )
                                  }
                                >
                                  <Eye /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDownload(data)}
                                >
                                  <Download /> Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(data.id)}
                                >
                                  <Trash2 /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {totalPages > 1 && (
                <div className="py-4 px-4 flex justify-center space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      variant="secondary"
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`min-w-10 flex justify-center items-center
                        focus:outline-hidden py-2.5 text-sm rounded-full disabled:opacity-50
                        disabled:pointer-events-none
                        cursor-pointer ${
                          currentPage === i + 1
                            ? "bg-black text-white hover:bg-black"
                            : "text-gray-800 hover:bg-gray-100"
                        }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
