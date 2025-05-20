"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
import cvInfosJson from "../../../../resources/test-json/cvList.json";

type CvInfo = {
  cvId: string;
  reservationId: string;
  customerName: string;
  agent: string;
  paymentType: string;
  date: string;
};

type CvData = {
  title: string;
  content: CvInfo[];
};

const sortOptions = [
  { key: "cvId", label: "CV ID" },
  { key: "customerName", label: "Name" },
  { key: "agent", label: "Agent" },
  { key: "date", label: "Date" },
] as const;

type SortKey = (typeof sortOptions)[number]["key"];
type SortOrder = "asc" | "desc";

export default function ConfirmationVouchers() {
  const cvInfos: CvData = cvInfosJson as CvData;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortByKey = (data: CvInfo[], key: SortKey, order: SortOrder) => {
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
    const filtered = cvInfos.content.filter((item) =>
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
    setSortOrder("desc");
    setCurrentPage(1);
  };
  useEffect(() => {
    handleSort("date");
  }, []);

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
                    <Link href="/dashboard/confirmation-vouchers/create">
                      <CirclePlusIcon /> Create Voucher
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="overflow-hidden min-h-[550px]">
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
                    {paginatedData().map((data, index) => (
                      <tr key={index}>
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
                              <DropdownMenuItem>
                                <Pencil /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
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
              </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
