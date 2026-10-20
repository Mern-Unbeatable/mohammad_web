import { MARKETPLACE_CATEGORY_OPTIONS } from '@/features/user/marketplace';
import {
  SEARCH_PARAM,
  createUrlFilters,
  parseOptionParam,
  parseSearchParam,
} from '@/shared/utils/urlFilters';

export const CATEGORY_PARAM = 'category';
export const DEFAULT_CATEGORY = MARKETPLACE_CATEGORY_OPTIONS[0];

export const parseCategoryParam = (value) =>
  parseOptionParam(value, MARKETPLACE_CATEGORY_OPTIONS, DEFAULT_CATEGORY);

export const marketplaceFilters = createUrlFilters({
  [CATEGORY_PARAM]: { parse: parseCategoryParam, fallback: DEFAULT_CATEGORY },
  [SEARCH_PARAM]: { parse: parseSearchParam, fallback: '' },
});
