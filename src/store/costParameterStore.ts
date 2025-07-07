import { create } from "zustand";
import { CostParameter } from "@/types/parameter";

interface CostParameterState {
  data: CostParameter[];
  setData: (data: CostParameter[]) => void;
  deleteItem: (id: string) => void;
}

export const useCostParameterStore = create<CostParameterState>((set) => ({
  data: [],
  setData: (data) => set({ data }),
  deleteItem: (id) =>
    set((state) => ({
      data: state.data.filter((item) => item.id !== id),
    })),
}));
