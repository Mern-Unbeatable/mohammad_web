/**
 * Admin settings feature public API.
 *
 * - settingsApi      → HTTP
 * - settingsThunks   → async actions
 * - settingsSlice    → state + sync reducers
 * - settingsDefaults → keys + UI defaults
 */

export { default as adminSettingsReducer } from "./settingsSlice";
export { clearSettingsError } from "./settingsSlice";
export { fetchAdminSettings, saveAdminSetting } from "./settingsThunks";
export * as settingsApi from "./settingsApi";
export {
  SETTINGS_KEYS,
  SUBSCRIPTION_FEATURES,
  DEFAULT_MARKETPLACE_CATEGORIES,
  DEFAULT_GENERAL_CATEGORIES,
} from "./settingsDefaults";
