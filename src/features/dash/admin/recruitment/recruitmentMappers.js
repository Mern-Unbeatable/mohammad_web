/** Map API enums / fields onto JobCard & JobDetailCard props. */

import { workplaceLabel } from "@/features/recruitment/jobWorkplace";
import { formatPostedAgo } from "@/features/recruitment/postedAgo";

const LEVEL_LABEL = {
  ENTRY_LEVEL: "Entry-level",
  MID_LEVEL: "Mid-level",
  SENIOR: "Senior",
};

const LEVEL_API = {
  All: undefined,
  "Entry-level": "ENTRY_LEVEL",
  "Mid-level": "MID_LEVEL",
  Senior: "SENIOR",
};

const EMPLOYMENT_LABEL = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const TIME_API = {
  "All Time": undefined,
  "Last 7 days": "7d",
  "Last 30 days": "30d",
  "Last 90 days": "90d",
};

export const RECRUITMENT_LEVEL_OPTIONS = [
  "All",
  "Entry-level",
  "Mid-level",
  "Senior",
];

export const RECRUITMENT_TIME_OPTIONS = [
  "All Time",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
];

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&h=200&fit=crop";

export const levelToApi = (label) => LEVEL_API[label];
export const timeToApi = (label) => TIME_API[label];

export { formatPostedAgo };

export function toJobCardModel(job) {
  if (!job) return null;
  return {
    ...job,
    employmentType:
      EMPLOYMENT_LABEL[job.employmentType] || job.employmentType,
    workplaceType: workplaceLabel(job.workplaceType),
    level: LEVEL_LABEL[job.level] || job.level,
    salary: job.salary || "—",
    postedAgo: formatPostedAgo(job.postedAt),
    image: job.imageUrl || job.image || PLACEHOLDER_IMAGE,
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
  };
}
