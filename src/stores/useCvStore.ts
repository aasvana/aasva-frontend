import { create } from "zustand";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";

interface CvState {
  draft: ConfirmationVoucherFormData | null;
  previewOpen: boolean;
  setDraft: (data: ConfirmationVoucherFormData) => void;
  clearDraft: () => void;
  openPreview: () => void;
  closePreview: () => void;
}

export const useCvStore = create<CvState>((set) => ({
  draft: null,
  previewOpen: false,
  setDraft: (data) => set({ draft: data }),
  clearDraft: () => set({ draft: null }),
  openPreview: () => set({ previewOpen: true }),
  closePreview: () => set({ previewOpen: false }),
}));
