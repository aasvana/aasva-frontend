"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownUp,
  CirclePlusIcon,
  EllipsisVertical,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHydrate } from "@/hooks/useHydrate";
import {
  formatMoney,
  usePosStore,
} from "@/modules/pos";
import { toast } from "sonner";

const sortOptions = [
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
] as const;

type SortKey = (typeof sortOptions)[number]["key"];
type SortOrder = "asc" | "desc";

export default function PosProductsPage() {
  useHydrate(usePosStore((s) => s.hydrate));
  const router = useRouter();

  const products = usePosStore((s) => s.products);
  const deleteProductById = usePosStore((s) => s.deleteProductById);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sorted = useMemo(() => {
    const filtered = products.filter((product) =>
      `${product.name} ${product.sku} ${product.category}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      const aVal = sortKey === "price" || sortKey === "stock"
        ? Number(a[sortKey])
        : String(a[sortKey]).toLowerCase();
      const bVal = sortKey === "price" || sortKey === "stock"
        ? Number(b[sortKey])
        : String(b[sortKey]).toLowerCase();
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [products, searchTerm, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  );

  const handleSort = (key: SortKey) => {
    const isSameKey = key === sortKey;
    setSortKey(key);
    setSortOrder(isSameKey && sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    deleteProductById(id);
    toast.success("Product deleted.");
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500">
            Manage the products available at your store.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pos/products/create">
            <CirclePlusIcon /> Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="py-3 px-4 flex flex-row justify-between">
                <div className="relative w-lg max-w-sm">
                  <label className="sr-only">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search products..."
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
                    onClick={() => {
                      setSearchTerm("");
                      setSortKey("name");
                      setSortOrder("asc");
                      setCurrentPage(1);
                    }}
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
                </div>
              </div>
              <div className="overflow-hidden min-h-[550px]">
                {products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[550px] text-center">
                    <p className="text-lg font-medium text-gray-800">
                      No products yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Add your first product to start taking orders.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/pos/products/create">
                        <CirclePlusIcon /> Add Product
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "name",
                          "category",
                          "price",
                          "tax",
                          "stock",
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
                      {paginated.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {product.name}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {product.category}
                            {product.subcategory && (
                              <span className="text-gray-400">
                                {" "}
                                · {product.subcategory}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {formatMoney(product.price, "USD")}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {product.taxRate}%
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {product.stock}
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
                                      `/dashboard/pos/products/${product.id}/edit`
                                    )
                                  }
                                >
                                  <Pencil /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(product.id)}>
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
