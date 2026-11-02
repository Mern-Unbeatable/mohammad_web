/** Map API jobs onto JobCard / JobDetailCard / create form props. */

import {
  DEFAULT_WORKPLACE_TYPE,
  workplaceLabel,
  workplaceToApi,
} from "@/features/recruitment/jobWorkplace";
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
    postedAgo: formatPostedAgo(job.postedAt || job.createdAt),
    image: job.imageUrl || job.image || PLACEHOLDER_IMAGE,
    about: job.about || "",
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    applyLink: job.applyLink || null,
  };
}

export function toJobDetailModel(job) {
  return toJobCardModel(job);
}

/** Map API job onto SupplierPostJobView form fields. */
export function jobToFormValues(job) {
  if (!job) {
    return {
      title: "",
      company: "",
      applyLink: "",
      location: "",
      salary: "",
      employmentType: EMPLOYMENT_TYPE_OPTIONS[0],
      workplaceType: DEFAULT_WORKPLACE_TYPE,
      level: RECRUITMENT_LEVEL_OPTIONS[2] || RECRUITMENT_LEVEL_OPTIONS[1],
      description: "",
      requirements: "",
      imageUrl: "",
    };
  }

  return {
    title: job.title || "",
    company: job.company || "",
    applyLink: job.applyLink || "",
    location: job.location || "",
    salary: job.salary || "",
    employmentType:
      EMPLOYMENT_LABEL[job.employmentType] ||
      job.employmentType ||
      EMPLOYMENT_TYPE_OPTIONS[0],
    workplaceType: workplaceLabel(job.workplaceType) || DEFAULT_WORKPLACE_TYPE,
    level:
      LEVEL_LABEL[job.level] ||
      job.level ||
      RECRUITMENT_LEVEL_OPTIONS[2] ||
      RECRUITMENT_LEVEL_OPTIONS[1],
    description: job.about || job.description || "",
    requirements: Array.isArray(job.requirements)
      ? job.requirements.join("\n")
      : String(job.requirements || ""),
    imageUrl: job.imageUrl || "",
  };
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
