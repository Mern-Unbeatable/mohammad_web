import { categoryToApi } from '@/features/dash/user/general';
import { POSTS_PAGE_SIZE } from '../constant/constants';

export const buildPostsQuery = ({ page, category, mine = false }) => {
  const params = { page, pageSize: POSTS_PAGE_SIZE, sort: 'desc' };
  if (mine) params.mine = true;
  const type = categoryToApi(category);
  if (type) params.type = type;
  return params;
};
