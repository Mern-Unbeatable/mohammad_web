/**
 * Supplier recruitment feature public API.
 *
 * - recruitmentApi     → HTTP
 * - recruitmentThunks  → async actions
 * - recruitmentSlice   → state + sync reducers
 * - recruitmentMappers → card / detail / form models
 */

export { default as supplierRecruitmentReducer } from "./recruitmentSlice";
export {
  clearRecruitmentError,
  clearSelectedJob,
  invalidateJobsList,
} from "./recruitmentSlice";
export {
  fetchSupplierJobs,
  fetchSupplierJobDetails,
  createSupplierJob,
  removeSupplierJob,
} from "./recruitmentThunks";
export {
  RECRUITMENT_LEVEL_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  levelToApi,
  employmentToApi,
  toJobCardModel,
  toJobDetailModel,
  formToCreatePayload,
  formatPostedAgo,
} from "./recruitmentMappers";
export * as recruitmentApi from "./recruitmentApi";
