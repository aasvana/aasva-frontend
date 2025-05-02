import { create } from 'zustand';

const useBreadcrumbStore = create((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (newBreadcrumbs: unknown) => set({ breadcrumbs: newBreadcrumbs }),
}));

export default useBreadcrumbStore;