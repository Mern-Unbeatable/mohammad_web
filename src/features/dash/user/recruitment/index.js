/**
 * User recruitment feature public API.
 *
 * - recruitmentApi     → HTTP
 * - recruitmentThunks  → async actions
 * - recruitmentSlice   → state + sync reducers
 * - recruitmentMappers → card / detail / form models
 */

export { default as userRecruitmentReducer } from "./recruitmentSlice";
export {
  clearRecruitmentError,
  clearSelectedJob,
  invalidateJobsList,
  jobLeftList,
  jobApplicationsSeen,
  selectNewApplicationTotal,
  selectNewApplicationsByJob,
} from "./recruitmentSlice";
export {
  fetchJobs,
  fetchJobDetails,
  createJob,
  updateJob,
  removeJob,
  applyToJob,
  fetchMyApplications,
  fetchNewApplicationCounts,
  withdrawApplication,
} from "./recruitmentThunks";
export {
  RECRUITMENT_LEVEL_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  levelToApi,
  employmentToApi,
  toJobCardModel,
  toJobDetailModel,
  jobToFormValues,
  formToCreatePayload,
  formatPostedAgo,
} from "./recruitmentMappers";
export * as recruitmentApi from "./recruitmentApi";
