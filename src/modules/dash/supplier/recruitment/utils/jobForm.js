import {
  EMPLOYMENT_TYPE_OPTIONS,
  RECRUITMENT_LEVEL_OPTIONS,
} from "@/features/dash/supplier/recruitment";
import { DEFAULT_WORKPLACE_TYPE } from "@/features/recruitment/jobWorkplace";

/** Experience levels a job can be posted with (no "All"). */
export const JOB_LEVEL_OPTIONS = RECRUITMENT_LEVEL_OPTIONS.filter((item) => item !== "All");

export const emptyJobForm = () => ({
  title: "",
  company: "",
  applyLink: "",
  location: "",
  salary: "",
  employmentType: EMPLOYMENT_TYPE_OPTIONS[0],
  workplaceType: DEFAULT_WORKPLACE_TYPE,
  level: JOB_LEVEL_OPTIONS[1] || JOB_LEVEL_OPTIONS[0],
  description: "",
  requirements: "",
  imageUrl: "",
});

/** First validation message for a create/update payload, or null when valid. */
export const jobPayloadError = (payload) => {
  if (!payload.title || !payload.company || !payload.location || !payload.about) {
    return "Please fill in all required fields";
  }
  if (!payload.requirements.length) return "Add at least one requirement";
  return null;
};
