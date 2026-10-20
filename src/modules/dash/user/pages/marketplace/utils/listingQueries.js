import { categoryToApi } from '@/features/user/marketplace';
import { LISTINGS_PAGE_SIZE, PERSONAL_LISTINGS_PAGE_SIZE } from '../constant/constants';

const withFilters = (params, { query, category }) => {
  const q = query?.trim();
  if (q) params.search = q;
  const categoryApi = categoryToApi(category);
  if (categoryApi) params.category = categoryApi;
  return params;
};

export const buildListingsQuery = ({ page, query, category }) =>
  withFilters({ page, pageSize: LISTINGS_PAGE_SIZE, sort: 'desc' }, { query, category });

export const buildMineQuery = ({ query, category }) =>
  withFilters(
    { page: 1, pageSize: PERSONAL_LISTINGS_PAGE_SIZE, sort: 'desc', mine: true },
    { query, category },
  );

export const buildSavedQuery = ({ query, category }) =>
  withFilters(
    { page: 1, pageSize: PERSONAL_LISTINGS_PAGE_SIZE, sort: 'desc', saved: true },
    { query, category },
  );
