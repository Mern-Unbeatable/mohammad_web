/** Job workplace type: API enum <-> display label. */

const WORKPLACE_LABEL = {
  ON_SITE: "On-site",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

const WORKPLACE_API = Object.fromEntries(
  Object.entries(WORKPLACE_LABEL).map(([api, label]) => [label, api]),
);

export const WORKPLACE_TYPE_OPTIONS = Object.values(WORKPLACE_LABEL);

export const DEFAULT_WORKPLACE_TYPE = WORKPLACE_LABEL.ON_SITE;

export const workplaceLabel = (value) => WORKPLACE_LABEL[value] || value || "";

export const workplaceToApi = (label) => WORKPLACE_API[label] || "ON_SITE";
