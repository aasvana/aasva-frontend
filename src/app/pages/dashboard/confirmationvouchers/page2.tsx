"use client";
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
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import cvInfos from "../../../../resources/test-json/cvList.json";
const sortOptions = [
  { key: "cvId", label: "CV ID" },
  { key: "customerName", label: "Name" },
  { key: "agent", label: "Agent" },
  { key: "date", label: "Date" },
];

export default function ConfirmationVouchers() {
  const sortByKey = (data: any, key: any, order = "asc") => {
    return [...data].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === "date") {
        aVal = new Date(aVal.split("-").reverse().join("-"));
        bVal = new Date(bVal.split("-").reverse().join("-"));
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const [sortedData, setSortedData] = useState(cvInfos);
  const [sortState, setSortState] = useState({ key: "date", order: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(cvInfos.content);

  const filterAndSortData = (term: string, key: string, order: string) => {
    const lowerTerm = term.toLowerCase();

    const filtered = cvInfos.content.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowerTerm)
      )
    );

    const sorted = sortByKey(filtered, key, order);
    return sorted;
  };

  const handleSort = (key: string) => {
    const isSameKey = sortState.key === key;
    const newOrder = isSameKey && sortState.order === "asc" ? "desc" : "asc";

    setSortState({ key, order: newOrder });

    const updated = filterAndSortData(searchTerm, key, newOrder);
    setFilteredData(updated);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    const updated = filterAndSortData(term, sortState.key, sortState.order);
    setFilteredData(updated);
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
                    name="hs-table-with-pagination-search"
                    id="hs-table-with-pagination-search"
                    className="py-1.5 sm:py-2 px-3 ps-9 block w-full border-gray-200 shadow-2xs rounded-lg sm:text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    placeholder="Search for customer"
                    value={searchTerm ?? ""}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <svg
                      className="size-4 text-gray-400 dark:text-neutral-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <div id="sort" className="">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          className="hover:bg-black hover:text-white cursor-pointer"
                        >
                          <ArrowDownUp className="w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left" align="start">
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
                  <Button
                    variant="secondary"
                    className="hover:bg-black hover:text-white cursor-pointer"
                    asChild
                  >
                    <Link href="/dashboard/confirmation-vouchers/create">
                      <CirclePlusIcon /> Create Voucher
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                      >
                        Cv Id
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                      >
                        Agent
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {filteredData.map((data, index) => (
                      <tr key={index}>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                          {data.cvId}
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                          {data.customerName}
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                          {data.agent}
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                          {data.date}
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <EllipsisVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start">
                              <DropdownMenuItem>
                                <Pencil /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye />
                                View
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
              <div className="py-1 px-4">
                <nav
                  className="flex items-center space-x-1"
                  aria-label="Pagination"
                >
                  <button
                    type="button"
                    className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    aria-label="Previous"
                  >
                    <span aria-hidden="true">«</span>
                    <span className="sr-only">Previous</span>
                  </button>
                  <button
                    type="button"
                    className="min-w-10 flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:focus:bg-neutral-700 dark:hover:bg-neutral-700"
                    aria-current="page"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="min-w-10 flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:focus:bg-neutral-700 dark:hover:bg-neutral-700"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="min-w-10 flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:focus:bg-neutral-700 dark:hover:bg-neutral-700"
                  >
                    3
                  </button>
                  <button
                    type="button"
                    className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    aria-label="Next"
                  >
                    <span className="sr-only">Next</span>
                    <span aria-hidden="true">»</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}