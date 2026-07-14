import { create } from "zustand";

export type FormMode = "create" | "edit";

interface UIState {
  formOpen: boolean;
  formMode: FormMode;
  editId: string | null;
  nonce: number;
  deleteTargetId: string | null;
  openCreate: () => void;
  openEdit: (id: string) => void;
  closeForm: () => void;
  requestDelete: (id: string) => void;
  cancelDelete: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  formOpen: false,
  formMode: "create",
  editId: null,
  nonce: 0,
  deleteTargetId: null,
  openCreate: () =>
    set((s) => ({
      formOpen: true,
      formMode: "create",
      editId: null,
      nonce: s.nonce + 1,
    })),
  openEdit: (id) =>
    set((s) => ({
      formOpen: true,
      formMode: "edit",
      editId: id,
      nonce: s.nonce + 1,
    })),
  closeForm: () => set({ formOpen: false }),
  requestDelete: (id) => set({ deleteTargetId: id }),
  cancelDelete: () => set({ deleteTargetId: null }),
}));
