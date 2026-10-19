import { Activity } from 'lucide-react';
import Card from '@/components/ui/Card';
import { CardSkeleton } from '@/components/common/Skeleton';
import { FeedPost, LoadMorePosts } from '@/modules/user/pages/feed';

const EmptyActivity = ({ name }) => (
  <Card>
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
        <Activity className="h-6 w-6" />
      </div>
      <h3 className="text-[16px] font-semibold text-deep-blue">No activity yet</h3>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[#64748B]">
        {name} hasn&apos;t shared any posts on Lab Unity. Connect to stay updated when they
        publish questions, insights or updates.
      </p>
    </div>
  </Card>
);

const ActivitySection = ({
  posts = [],
  loading = false,
  onReport,
  onEdit,
  onDelete,
  emptyName = 'This member',
  title = 'Activity',
  className = '',
  hasMore = false,
  loadingMore = false,
  onLoadMore,
}) => (
  <section className={className}>
    {title ? (
      <h2 className="mb-4 px-1 text-[18px] font-bold text-deep-blue">{title}</h2>
    ) : null}
    <div className="space-y-4">
      {loading && !posts.length ? (
        <CardSkeleton variant="feedPost" count={2} className="space-y-4" />
      ) : posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <FeedPost
              key={post.id}
              post={post}
              onReport={onReport}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {hasMore && onLoadMore ? (
            <LoadMorePosts onClick={onLoadMore} loading={loadingMore} />
          ) : null}
        </>
      ) : (
        <EmptyActivity name={emptyName} />
      )}
    </div>
  </section>
);

export default ActivitySection;
export { EmptyActivity };
