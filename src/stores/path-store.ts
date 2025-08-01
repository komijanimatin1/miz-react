import { create } from 'zustand';

interface PathState {
  basicPath: string | null;
  getBasicPath: () => string | null;
  setBasicPath: (path: string) => void;
}

export const usePathStore = create<PathState>((set, get) => ({
  basicPath: null,

  getBasicPath: () => {
    return get().basicPath;
  },

  setBasicPath: (path) => {
    set({ basicPath: path });
  },
})); 