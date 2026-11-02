import { Clock, MapPin, Pencil } from 'lucide-react';
import { formatDateTime } from '@/shared/utils/dates/date';

const formatFullDate = (value) =>
  formatDateTime(value, { format: { dateStyle: 'medium', timeStyle: 'short' } }) || undefined;

const iconClass = 'h-3 w-3 shrink-0 text-[#98A2B3]';

/** Time · location · Edited line under a post author's name. */
const PostMeta = ({ post, className = '' }) => {
  const location = post.author?.meta;
  if (!location && !post.postedAgo && !post.edited) return null;

  return (
    <p
      className={`mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[12px] text-[#667085] ${className}`}
    >
      {post.postedAgo ? (
        <span className="inline-flex items-center gap-1">
          <Clock className={iconClass} aria-hidden="true" />
          <time dateTime={post.createdAt || undefined} title={formatFullDate(post.createdAt)}>
            {post.postedAgo}
          </time>
        </span>
      ) : null}
      {location ? (
        <span className="inline-flex min-w-0 items-center gap-1">
          <MapPin className={iconClass} aria-hidden="true" />
          <span className="truncate">{location}</span>
        </span>
      ) : null}
      {post.edited ? (
        <span className="inline-flex items-center gap-1">
          <Pencil className={iconClass} aria-hidden="true" />
          Edited
        </span>
      ) : null}
    </p>
  );
};

export default PostMeta;
