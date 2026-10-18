/** Map API jobs onto JobCard / JobDetailCard / create form props. */

import { workplaceLabel, workplaceToApi } from "@/shared/constants/jobWorkplace";

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

const EMPLOYMENT_API = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACT",
  Internship: "INTERNSHIP",
};

export const RECRUITMENT_LEVEL_OPTIONS = [
  "All",
  "Entry-level",
  "Mid-level",
  "Senior",
];

export const EMPLOYMENT_TYPE_OPTIONS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

export const levelToApi = (label) => LEVEL_API[label];
export const employmentToApi = (label) => EMPLOYMENT_API[label] || "FULL_TIME";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&h=200&fit=crop";

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
    image: job.imageUrl || job.image || PLACEHOLDER_IMAGE,
    about: job.about || "",
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    applyLink: job.applyLink || null,
  };
}

export function toJobDetailModel(job) {
  return toJobCardModel(job);
}

/**
 * Build create payload from SupplierPostJobView form state.
 */
export function formToCreatePayload(form) {
  const requirements = String(form.requirements || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const payload = {
    title: String(form.title || "").trim(),
    company: String(form.company || "").trim(),
    location: String(form.location || "").trim(),
    employmentType: employmentToApi(form.employmentType),
    workplaceType: workplaceToApi(form.workplaceType),
    level: LEVEL_API[form.level] || "MID_LEVEL",
    about: String(form.description || "").trim(),
    requirements,
  };

  if (form.salary?.trim()) payload.salary = form.salary.trim();
  if (form.applyLink?.trim()) payload.applyLink = form.applyLink.trim();
  if (form.imageUrl) payload.imageUrl = form.imageUrl;

  return payload;
}
