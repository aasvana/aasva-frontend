"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { notify } from "@/lib/notify";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_DISCOUNT_TYPES,
  PRODUCT_GENDERS,
  PRODUCT_SIZES,
  PRODUCT_SUBCATEGORIES,
  ProductGender,
  ProductSize,
} from "./constants";
import { PosProduct, PosProductInput, posProductSchema } from "./schema";
import { usePosStore } from "./store";
import { useOutletStore } from "@/stores/outletStore";
import { usePosSettingsStore } from "@/stores/posSettingsStore";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "./ui";

const inputClasses =
  "h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-[15px] focus-visible:border-emerald-400 focus-visible:ring-emerald-100";

const labelClasses = "text-sm font-medium text-gray-800";

const helperClasses = "mt-1 text-xs text-gray-400";

const cardClasses =
  "rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm sm:p-6";

function fileToDataUrl(file: File, maxDim = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(mime, quality));
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read the image file"));
    reader.readAsDataURL(file);
  });
}

function SizePicker({
  value,
  onChange,
}: {
  value: ProductSize[];
  onChange: (next: ProductSize[]) => void;
}) {
  const toggle = (size: ProductSize) => {
    if (value.includes(size)) {
      onChange(value.filter((s) => s !== size));
    } else {
      onChange([...value, size]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      {PRODUCT_SIZES.map((size) => {
        const active = value.includes(size);
        return (
          <button
            key={size}
            type="button"
            onClick={() => toggle(size)}
            aria-pressed={active}
            className={cn(
              "h-10 min-w-14 cursor-pointer rounded-xl border px-3 text-sm font-semibold transition-colors",
              active
                ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                : "border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

function GenderPicker({
  value,
  onChange,
}: {
  value: ProductGender;
  onChange: (next: ProductGender) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {PRODUCT_GENDERS.map((gender) => {
        const active = value === gender;
        return (
          <label
            key={gender}
            className={cn(
              "flex h-10 flex-1 min-w-24 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors",
              active
                ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                : "border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            )}
          >
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={active}
              onChange={() => onChange(gender)}
              className="sr-only"
            />
            {gender}
          </label>
        );
      })}
    </div>
  );
}

function ImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState(0);

  const safeIndex = value.length ? Math.min(selected, value.length - 1) : 0;
  const current = value.length ? value[safeIndex] : null;

  const addFiles = async (files: FileList | File[]) => {
    const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) {
      toast.error("Please choose image files.");
      return;
    }
    try {
      const urls = await Promise.all(images.map((f) => fileToDataUrl(f)));
      onChange([...value, ...urls]);
    } catch {
      toast.error("Failed to process the selected image.");
    }
  };

  const removeImage = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
    if (index === safeIndex) {
      setSelected(Math.max(0, index - 1));
    } else if (index < safeIndex) {
      setSelected(safeIndex - 1);
    }
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setSelected(target);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
          dragging
            ? "border-emerald-400 bg-emerald-50"
            : current
            ? "border-gray-100 bg-gray-50"
            : "border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/40"
        )}
      >
        {current ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current}
              alt="Product preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Upload className="size-6" />
              <p className="text-sm font-medium">Upload another image</p>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Upload className="size-6" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Upload product image
            </p>
            <p className="text-xs text-gray-400">
              Drag & drop or click to browse
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
        {value.map((src, index) => (
          <div key={`${src.slice(0, 40)}-${index}`} className="group relative shrink-0">
            <button
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                "size-16 cursor-pointer overflow-hidden rounded-xl border-2 transition-colors",
                index === safeIndex
                  ? "border-emerald-500"
                  : "border-transparent hover:border-emerald-300"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Product thumbnail" className="h-full w-full object-cover" />
            </button>
            <button
              type="button"
              onClick={() => removeImage(index)}
              aria-label="Remove image"
              className="absolute -right-1.5 -top-1.5 hidden size-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-sm group-hover:flex"
            >
              <X className="size-3" />
            </button>
            <div className="absolute bottom-1 left-1 hidden gap-1 group-hover:flex">
              <button
                type="button"
                onClick={() => moveImage(index, -1)}
                aria-label="Move image left"
                className="flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white"
              >
                <ChevronLeft className="size-3" />
              </button>
              <button
                type="button"
                onClick={() => moveImage(index, 1)}
                aria-label="Move image right"
                className="flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white"
              >
                <ChevronRight className="size-3" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-emerald-400 hover:text-emerald-600"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
            <Plus className="size-4" />
          </span>
        </button>
      </div>
    </div>
  );
}

export function ProductCreateForm({
  product,
}: {
  product?: PosProduct | null;
}) {
  const router = useRouter();
  const addProduct = usePosStore((s) => s.addProduct);
  const updateProductById = usePosStore((s) => s.updateProductById);
  const activeOutletId = useOutletStore((s) => s.activeOutletId);
  const threshold = usePosSettingsStore((s) => s.settings.lowStockThreshold);

  const [categories, setCategories] = useState<string[]>(() => [
    ...PRODUCT_CATEGORIES,
  ]);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [subcategoriesMap, setSubcategoriesMap] = useState<
    Record<string, string[]>
  >(() =>
    Object.fromEntries(
      Object.entries(PRODUCT_SUBCATEGORIES).map(([key, values]) => [
        key,
        [...values],
      ])
    )
  );
  const [addingSubcategory, setAddingSubcategory] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState("");

  const isEdit = Boolean(product);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PosProductInput>({
    resolver: zodResolver(posProductSchema),
    defaultValues: {
      name: product?.name ?? "",
      sku: product?.sku ?? "",
      outletId: product?.outletId ?? activeOutletId,
      category: product?.category ?? "General",
      subcategory: product?.subcategory ?? "",
      price: product?.price ?? 0,
      taxRate: product?.taxRate ?? 0,
      stock: product?.stock ?? 0,
      description: product?.description ?? "",
      sizes: product?.sizes ?? [],
      gender: product?.gender ?? "Unisex",
      images: product?.images ?? [],
      discount: product?.discount ?? 0,
      discountType: product?.discountType ?? "percent",
    },
  });

  const sizes = watch("sizes");
  const gender = watch("gender");
  const images = watch("images");
  const discountType = watch("discountType");
  const category = watch("category");
  const subcategory = watch("subcategory");

  const subcategories = subcategoriesMap[category] ?? [];

  const setImages = (next: string[]) =>
    setValue("images", next, { shouldDirty: true });

  const confirmAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    let list = categories;
    if (!list.includes(trimmed)) {
      list = [...list, trimmed];
      setCategories(list);
    }
    setValue("category", trimmed, { shouldValidate: true });
    setNewCategory("");
    setAddingCategory(false);
  };

  const confirmAddSubcategory = () => {
    const trimmed = newSubcategory.trim();
    if (!trimmed) return;
    const existing = subcategoriesMap[category] ?? [];
    if (!existing.includes(trimmed)) {
      setSubcategoriesMap((prev) => ({
        ...prev,
        [category]: [...(prev[category] ?? []), trimmed],
      }));
    }
    setValue("subcategory", trimmed, { shouldValidate: true });
    setNewSubcategory("");
    setAddingSubcategory(false);
  };

  const onSubmit = (data: PosProductInput) => {
    if (isEdit && product) {
      updateProductById(product.id, data);
      notify({
        type: "info",
        category: "inventory",
        title: "Product updated",
        message: data.name,
      });
    } else {
      addProduct(data);
      if (Number(data.stock) <= threshold) {
        notify({
          type: "warning",
          category: "inventory",
          title: "Low stock alert",
          message: `${data.name} is running low (${data.stock} left).`,
          link: "/dashboard/pos/stock/low-stock",
        });
      } else {
        notify({
          type: "success",
          category: "inventory",
          title: "Product added",
          message: data.name,
          link: "/dashboard/pos/products",
        });
      }
    }
    router.push("/dashboard/pos/products");
  };

  const onInvalid = () => {
    toast.error("Please fill in the required fields correctly.");
  };

  const fieldError = (name: keyof PosProductInput) =>
    errors[name]?.message ? (
      <p className="mt-1.5 text-sm text-red-500">{errors[name]?.message}</p>
    ) : null;

  const numericRegister = (name: "price" | "stock" | "discount") =>
    register(name, { valueAsNumber: true });

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Product" : "Add Product"}
        </h1>
        <Button
          type="button"
          onClick={handleSubmit(onSubmit, onInvalid)}
          disabled={isSubmitting}
          className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
        >
          {isEdit ? "Save Changes" : "Add Product"}
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="grid grid-cols-1 gap-5 lg:grid-cols-3"
      >
        <div className="space-y-5 lg:col-span-2">
          <section className={cardClasses}>
            <h2 className="text-base font-semibold text-gray-900">
              General Information
            </h2>

            <div className="mt-6 space-y-6">
              <div className="grid gap-1.5">
                <Label htmlFor="name" className={labelClasses}>
                  Name Product
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Premium Cotton T-Shirt"
                  className={inputClasses}
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                {fieldError("name")}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="description" className={labelClasses}>
                  Description Product
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the product, materials, features, etc."
                  rows={5}
                  className="min-h-32 rounded-xl border-gray-200 bg-gray-50 p-4 text-[15px] focus-visible:border-emerald-400 focus-visible:ring-emerald-100"
                  {...register("description")}
                />
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-sm font-semibold text-gray-900">
                  Product Attributes
                </p>

                <div className="mt-5 space-y-6">
                  <div>
                    <div className="flex flex-col gap-0.5">
                      <span className={labelClasses}>Size</span>
                      <span className={helperClasses}>Pick Available Size</span>
                    </div>
                    <div className="mt-3">
                      <SizePicker
                        value={sizes}
                        onChange={(next) =>
                          setValue("sizes", next, { shouldDirty: true })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col gap-0.5">
                      <span className={labelClasses}>Gender</span>
                      <span className={helperClasses}>Pick Available Gender</span>
                    </div>
                    <div className="mt-3">
                      <GenderPicker
                        value={gender}
                        onChange={(next) =>
                          setValue("gender", next, { shouldValidate: true })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={cardClasses}>
            <h2 className="text-base font-semibold text-gray-900">
              Pricing And Stock
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="price" className={labelClasses}>
                  Base Pricing
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    className={cn(inputClasses, "pl-9")}
                    aria-invalid={!!errors.price}
                    {...numericRegister("price")}
                  />
                </div>
                {fieldError("price")}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="stock" className={labelClasses}>
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="0"
                  className={inputClasses}
                  aria-invalid={!!errors.stock}
                  {...numericRegister("stock")}
                />
                {fieldError("stock")}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="discount" className={labelClasses}>
                  Discount
                </Label>
                <div className="relative">
                  <Input
                    id="discount"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0"
                    className={cn(inputClasses, "pr-10")}
                    aria-invalid={!!errors.discount}
                    {...numericRegister("discount")}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {discountType === "percent" ? "%" : "$"}
                  </span>
                </div>
                {fieldError("discount")}
              </div>

              <div className="grid gap-1.5">
                <Label className={labelClasses}>Discount Type</Label>
                <Select
                  value={discountType}
                  onValueChange={(value) =>
                    setValue("discountType", value as PosProductInput["discountType"], {
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-[15px] focus-visible:border-emerald-400 focus-visible:ring-emerald-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_DISCOUNT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "percent" ? "Percentage" : "Fixed Amount"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className={cardClasses}>
            <h2 className="text-base font-semibold text-gray-900">Upload Img</h2>
            <div className="mt-6">
              <ImageUploader value={images} onChange={setImages} />
            </div>
          </section>

          <section className={cardClasses}>
            <h2 className="text-base font-semibold text-gray-900">Category</h2>

            <div className="mt-6 space-y-4">
              <div className="grid gap-1.5">
                <Label className={labelClasses}>Product Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setValue("category", value, { shouldValidate: true });
                    setValue("subcategory", "", { shouldDirty: true });
                  }}
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-[15px] focus-visible:border-emerald-400 focus-visible:ring-emerald-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError("category")}
              </div>

              {subcategories.length > 0 && (
                <div className="grid gap-1.5">
                  <Label className={labelClasses}>Product Sub Category</Label>
                  <Select
                    value={subcategory}
                    onValueChange={(value) =>
                      setValue("subcategory", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-[15px] focus-visible:border-emerald-400 focus-visible:ring-emerald-100">
                      <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldError("subcategory")}
                </div>
              )}

              {addingSubcategory ? (
                <div className="flex gap-2">
                  <Input
                    autoFocus
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        confirmAddSubcategory();
                      }
                      if (e.key === "Escape") setAddingSubcategory(false);
                    }}
                    placeholder="New sub category name"
                    className={inputClasses}
                  />
                  <Button
                    type="button"
                    onClick={confirmAddSubcategory}
                    className="h-12 bg-emerald-600 px-5 text-white shadow-sm hover:bg-emerald-700"
                  >
                    Add
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddingSubcategory(true)}
                  className="h-11 w-full cursor-pointer border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Plus className="size-4" />
                  Add Sub Category
                </Button>
              )}

              {addingCategory ? (
                <div className="flex gap-2">
                  <Input
                    autoFocus
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        confirmAddCategory();
                      }
                      if (e.key === "Escape") setAddingCategory(false);
                    }}
                    placeholder="New category name"
                    className={inputClasses}
                  />
                  <Button
                    type="button"
                    onClick={confirmAddCategory}
                    className="h-12 bg-emerald-600 px-5 text-white shadow-sm hover:bg-emerald-700"
                  >
                    Add
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddingCategory(true)}
                  className="h-11 w-full cursor-pointer border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Plus className="size-4" />
                  Add Category
                </Button>
              )}
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
