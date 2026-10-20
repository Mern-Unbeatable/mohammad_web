import { formatDateTime } from '@/shared/utils/dates/date';

const formatFullDate = (value) =>
  formatDateTime(value, { format: { dateStyle: 'medium', timeStyle: 'short' } }) || undefined;

/** Country · time · Edited line under a post author's name. */
const PostMeta = ({ post, className = '' }) => {
  const parts = [
    post.author?.meta,
    post.postedAgo ? (
      <time
        key="time"
        dateTime={post.createdAt || undefined}
        title={formatFullDate(post.createdAt)}
      >
        {post.postedAgo}
      </time>
    ) : null,
    post.edited ? 'Edited' : null,
  ].filter(Boolean);

  if (!parts.length) return null;

  return (
    <p className={`truncate text-[12px] text-[#98A2B3] ${className}`}>
      {parts.map((part, index) => (
        <span key={index}>
          {index > 0 ? ' · ' : null}
          {part}
        </span>
      ))}
    </p>
  );
};

export default PostMeta;
