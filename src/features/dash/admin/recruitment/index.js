/**
 * Admin recruitment feature public API.
 *
 * - recruitmentApi     → HTTP
 * - recruitmentThunks  → async actions
 * - recruitmentSlice   → state + sync reducers
 */

export { default as adminRecruitmentReducer } from "./recruitmentSlice";
export {
  clearRecruitmentError,
  clearSelectedJob,
} from "./recruitmentSlice";
export {
  fetchJobsList,
  fetchJobDetails,
  removeJob,
} from "./recruitmentThunks";
export {
  RECRUITMENT_LEVEL_OPTIONS,
  RECRUITMENT_TIME_OPTIONS,
  levelToApi,
  timeToApi,
  toJobCardModel,
} from "./recruitmentMappers";
export * as recruitmentApi from "./recruitmentApi";
