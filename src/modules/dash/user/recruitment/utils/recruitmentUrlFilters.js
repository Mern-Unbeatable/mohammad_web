import {
  EMPLOYMENT_TYPE_OPTIONS,
  RECRUITMENT_LEVEL_OPTIONS,
} from "@/features/dash/user/recruitment";
import { WORKPLACE_TYPE_OPTIONS } from "@/features/recruitment/jobWorkplace";
import {
  SEARCH_PARAM,
  createUrlFilters,
  parseOptionParam,
  parseSearchParam,
} from "@/shared/utils/urlFilters";

export const LEVEL_PARAM = "level";
export const EMPLOYMENT_PARAM = "type";
export const WORKPLACE_PARAM = "workplace";

export const ALL_OPTION = "All";
export const DEFAULT_LEVEL = RECRUITMENT_LEVEL_OPTIONS[0];
export const EMPLOYMENT_FILTER_OPTIONS = [ALL_OPTION, ...EMPLOYMENT_TYPE_OPTIONS];
export const WORKPLACE_FILTER_OPTIONS = [ALL_OPTION, ...WORKPLACE_TYPE_OPTIONS];

export const parseLevelParam = (value) =>
  parseOptionParam(value, RECRUITMENT_LEVEL_OPTIONS, DEFAULT_LEVEL);

/** `?level=&type=&workplace=&q=` on the Public Job Posts page. */
export const publicJobFilters = createUrlFilters({
  [LEVEL_PARAM]: { parse: parseLevelParam, fallback: DEFAULT_LEVEL },
  [EMPLOYMENT_PARAM]: {
    parse: (value) => parseOptionParam(value, EMPLOYMENT_FILTER_OPTIONS, ALL_OPTION),
    fallback: ALL_OPTION,
  },
  [WORKPLACE_PARAM]: {
    parse: (value) => parseOptionParam(value, WORKPLACE_FILTER_OPTIONS, ALL_OPTION),
    fallback: ALL_OPTION,
  },
  [SEARCH_PARAM]: { parse: parseSearchParam, fallback: "" },
});
