import { useLocalStorageState } from "@/shared/hooks/useLocalStorageState";

export const VIEW_MODE = { LIST: "list", GRID: "grid" };

const isViewMode = (value) => value === VIEW_MODE.LIST || value === VIEW_MODE.GRID;

/** List/grid preference persisted in localStorage under `storageKey`. */
export const useViewMode = (storageKey) =>
  useLocalStorageState(storageKey, VIEW_MODE.LIST, { isValid: isViewMode });
