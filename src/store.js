import { create } from 'zustand';

export const useGeneralStore = create((set) => ({
  animationComplete: false,
  setAnimationComplete: (value) => set({ animationComplete: value }),

  tree1Mat: null,
  setTree1Mat: (value) => set({ tree1Mat: value }),

  tree2Mat: null,
  setTree2Mat: (value) => set({ tree2Mat: value }),

  tree3Mat: null,
  setTree3Mat: (value) => set({ tree3Mat: value }),

  houseMat: null,
  setHouseMat: (value) => set({ houseMat: value }),

  groundMat: null,
  setGroundMat: (value) => set({ groundMat: value }),
}));
