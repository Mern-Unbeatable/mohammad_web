/** Map API enums / fields onto JobCard & JobDetailCard props. */

import { workplaceLabel } from "@/shared/constants/jobWorkplace";

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

export const levelToApi = (label) => LEVEL_API[label];
export const timeToApi = (label) => TIME_API[label];

export function formatPostedAgo(dateValue) {
  if (!dateValue) return "";
  const posted = new Date(dateValue);
  if (Number.isNaN(posted.getTime())) return "";

  const days = Math.floor((Date.now() - posted.getTime()) / 86_400_000);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  if (days < 7) return `Posted ${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "Posted 1 week ago";
  if (weeks < 5) return `Posted ${weeks} weeks ago`;
  return posted.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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
    image: job.imageUrl || job.image || "",
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
  };
}
