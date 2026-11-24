import Pagination from '@/components/common/Pagination/Pagination';
import { CardSkeleton } from '@/components/loader';
import { POSTS_GRID_CLASS, POSTS_PAGE_SIZE } from '../../constant/constants';
import PostsEmptyState from './PostsEmptyState';

/** Post cards with skeleton, empty state and pagination. */
const PostsGrid = ({ loading, items, renderCard, page, totalPages, onPageChange }) => {
  if (loading) {
    return (
      <CardSkeleton variant="generalPost" count={POSTS_PAGE_SIZE} className={POSTS_GRID_CLASS} />
    );
  }

  if (!items.length) return <PostsEmptyState />;

  return (
    <>
      <div className={POSTS_GRID_CLASS}>{items.map(renderCard)}</div>
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} className="mt-8" />
    </>
  );
};

export default PostsGrid;
