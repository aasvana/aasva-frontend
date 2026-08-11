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
  useConfirmationVouchers,
  useDeleteConfirmationVoucher,
} from "@/lib/cv-query";
import { SavedConfirmationVoucher } from "@/lib/cv-storage";

type CvRow = {
  id: string;
  cvId: string;
  customerName: string;
  agent: string;
  paymentType: string;
  date: string;
};

const sortOptions = [
  { key: "cvId", label: "CV ID" },
  { key: "customerName", label: "Name" },
  { key: "agent", label: "Agent" },
  { key: "date", label: "Date" },
] as const;

type SortKey = (typeof sortOptions)[number]["key"];
type SortOrder = "asc" | "desc";

const toRow = (record: SavedConfirmationVoucher): CvRow => ({
  id: record.id,
  cvId: record.data.voucherNo || record.id.slice(0, 8),
  customerName: record.data.customerName || "-",
  agent: record.data.companyName || "-",
  paymentType: record.data.paymentType || "-",
  date: format(new Date(record.savedAt), "dd-MM-yyyy"),
});

export default function ConfirmationVouchers() {
  const router = useRouter();
  const { data: vouchers = [], isLoading } = useConfirmationVouchers();
  const deleteMutation = useDeleteConfirmationVoucher();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const rows: CvRow[] = vouchers.map(toRow);

  const sortByKey = (data: CvRow[], key: SortKey, order: SortOrder) => {
    return [...data].sort((a, b) => {
      let aVal: any = a[key];
      let bVal: any = b[key];

      if (key === "date") {
        aVal = new Date(aVal.split("-").reverse().join("-")).getTime();
        bVal = new Date(bVal.split("-").reverse().join("-")).getTime();
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filterAndSortData = () => {
    const filtered = rows.filter((item) =>
      String(item[sortKey]).toLowerCase().includes(searchTerm.toLowerCase())
    );
    return sortByKey(filtered, sortKey, sortOrder);
  };

  const handleSort = (key: SortKey) => {
    const isSameKey = key === sortKey;
    const newOrder = isSameKey && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(newOrder);
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
    if (!window.confirm("Delete this confirmation voucher?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Confirmation voucher deleted."),
      onError: () => toast.error("Failed to delete the confirmation voucher."),
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Confirmation Vouchers</h1>
          <p className="text-sm text-gray-500">
            Create and manage confirmation vouchers.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/confirmation-vouchers/create">
            <CirclePlusIcon /> Create Voucher
          </Link>
        </Button>
      </div>
      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
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
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
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
                        className="hover:bg-emerald-50 hover:text-emerald-700"
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
                </div>
              </div>
              <div className="overflow-hidden min-h-[550px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[550px] text-sm text-gray-500">
                    Loading confirmation vouchers...
                  </div>
                ) : rows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[550px] text-center">
                    <p className="text-lg font-medium text-gray-800">
                      No confirmation vouchers yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Create your first confirmation voucher to see it here.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/confirmation-vouchers/create">
                        <CirclePlusIcon /> Create Voucher
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "cvId",
                          "customerName",
                          "agent",
                          "payment",
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
                            {data.cvId}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {data.customerName}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {data.agent}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {data.paymentType}
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
                                      `/dashboard/confirmation-vouchers/${data.id}/edit`
                                    )
                                  }
                                >
                                  <Pencil /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/confirmation-vouchers/${data.id}/view`
                                    )
                                  }
                                >
                                  <Eye /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(data.id)}
                                >
                                  <Trash2 /> Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download /> Download
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
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
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
