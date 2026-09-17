import api from "@/lib/api.utils";

export type PackagePricingType = "PER_PERSON" | "PER_PACKAGE";
export type PackageStatus = "draft" | "active" | "inactive" | "archived";

export type PackageDay = {
  dayOrder: number;
  subject: string;
  description: string;
};

export type PackageImage = {
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isCover?: boolean;
};

export type PackageItem = {
  title: string;
  sortOrder: number;
};

export type TourPackage = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  destinationId: string | null;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  pricingType: PackagePricingType;
  status: PackageStatus;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  days: PackageDay[];
  images: PackageImage[];
  inclusions: PackageItem[];
  exclusions: PackageItem[];
};

export type CreatePackagePayload = {
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  destinationId?: string;
  durationDays?: number;
  durationNights?: number;
  basePrice?: number;
  pricingType?: PackagePricingType;
  status?: PackageStatus;
  isPublic?: boolean;
  isFeatured?: boolean;
  days: PackageDay[];
  images?: PackageImage[];
  inclusions?: { title: string; sortOrder?: number }[];
  exclusions?: { title: string; sortOrder?: number }[];
};

export type UpdatePackagePayload = Partial<CreatePackagePayload>;

export async function apiSearchPackages(name?: string, destinationId?: string) {
  const { data } = await api.get<TourPackage[]>("/packages", {
    params: { name: name || undefined, destinationId: destinationId || undefined },
  });
  return Array.isArray(data) ? data : [];
}

export async function apiGetPackage(id: string) {
  const { data } = await api.get<TourPackage>(`/packages/${id}`);
  return data;
}

export async function apiCreatePackage(data: CreatePackagePayload) {
  const { data: saved } = await api.post<TourPackage>("/packages", data);
  return saved;
}

export async function apiUpdatePackage(id: string, data: UpdatePackagePayload) {
  const { data: saved } = await api.patch<TourPackage>(`/packages/${id}`, data);
  return saved;
}

export async function apiDeletePackage(id: string) {
  await api.delete(`/packages/${id}`);
}