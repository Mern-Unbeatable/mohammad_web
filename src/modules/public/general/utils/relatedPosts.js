import { RELATED_POSTS_LIMIT } from '../constant/constants';

/** Other posts from the list, excluding the one being read. */
export const pickRelatedPosts = (posts, currentId, limit = RELATED_POSTS_LIMIT) =>
  (posts || []).filter((post) => post?.id && post.id !== currentId).slice(0, limit);
