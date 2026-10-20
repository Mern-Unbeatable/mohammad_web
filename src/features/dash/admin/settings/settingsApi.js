import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Admin settings HTTP helpers — no Redux. Used by settingsThunks.
 */

// ═══════════════════════════════════════════════════════════════════════
// All settings
// ═══════════════════════════════════════════════════════════════════════
export async function getSettings() {
  const response = await crudService.get(API_ENDPOINTS.ADMIN.SETTINGS);
  return unwrapApiData(response) || {};
}

// ═══════════════════════════════════════════════════════════════════════
// Upsert one setting by key
// ═══════════════════════════════════════════════════════════════════════
export async function upsertSetting(key, value) {
  const response = await crudService.put(API_ENDPOINTS.ADMIN.SETTING(key), {
    value,
  });
  return unwrapApiData(response) || { key, value };
}

export { getApiErrorMessage };
