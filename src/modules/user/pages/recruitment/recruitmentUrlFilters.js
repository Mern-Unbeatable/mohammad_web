import { RECRUITMENT_LEVEL_OPTIONS } from "@/features/user/recruitment";
import {
  SEARCH_PARAM,
  createUrlFilters,
  parseOptionParam,
  parseSearchParam,
} from "@/shared/utils/urlFilters";

export const LEVEL_PARAM = "level";
export const DEFAULT_LEVEL = RECRUITMENT_LEVEL_OPTIONS[0];

export const parseLevelParam = (value) =>
  parseOptionParam(value, RECRUITMENT_LEVEL_OPTIONS, DEFAULT_LEVEL);

export const recruitmentFilters = createUrlFilters({
  [LEVEL_PARAM]: { parse: parseLevelParam, fallback: DEFAULT_LEVEL },
  [SEARCH_PARAM]: { parse: parseSearchParam, fallback: "" },
});
