import { useLocalStorageState } from "@/shared/hooks/useLocalStorageState";
import { VIEW_MODE, VIEW_MODE_STORAGE_KEY } from "../constant/constants";

const isViewMode = (value) => value === VIEW_MODE.LIST || value === VIEW_MODE.GRID;

/** List/grid preference persisted in localStorage. */
export function useViewMode(storageKey = VIEW_MODE_STORAGE_KEY) {
  return useLocalStorageState(storageKey, VIEW_MODE.LIST, { isValid: isViewMode });
}
