import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";
import { reviveDates } from "@/lib/cv-api";

interface CvState {
  draft: ConfirmationVoucherFormData | null;
  previewOpen: boolean;
  setDraft: (data: ConfirmationVoucherFormData) => void;
  clearDraft: () => void;
  openPreview: () => void;
  closePreview: () => void;
}

export const useCvStore = create<CvState>()(
  persist(
    (set) => ({
      draft: null,
      previewOpen: false,
      setDraft: (data) => set({ draft: data }),
      clearDraft: () => set({ draft: null }),
      openPreview: () => set({ previewOpen: true }),
      closePreview: () => set({ previewOpen: false }),
    }),
    {
      name: "xmerge_cv_draft",
      storage: createJSONStorage(() => localStorage, {
        reviver: reviveDates,
      }),
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
