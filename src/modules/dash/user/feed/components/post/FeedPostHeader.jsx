import { Briefcase, Repeat2, Tag } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { POST_BADGES } from "../../constants";
import AuthorLink from "./AuthorLink";
import OwnerActionsMenu from "./OwnerActionsMenu";
import PostMeta from "./PostMeta";

const PostMenu = ({ post, isOwner, onReport, onEdit, onDelete }) => {
  if (isOwner && (onEdit || onDelete)) {
    return (
      <OwnerActionsMenu
        className="-mr-1.5 -mt-1"
        label="Post options"
        editLabel="Edit post"
        deleteLabel="Delete post"
        onEdit={onEdit ? () => onEdit(post) : undefined}
        onDelete={onDelete ? () => onDelete(post) : undefined}
      />
    );
  }

  if (!onReport) return null;

  return (
    <OwnerActionsMenu
      className="-mr-1.5 -mt-1"
      label="Post options"
      reportLabel="Report post"
      onReport={() => onReport(post)}
    />
  );
};

const FeedPostHeader = ({
  post,
  onReport,
  onEdit,
  onDelete,
  isOwner,
  showActions = true,
}) => {
  const { author } = post;
  const badge = POST_BADGES[post.type];

  return (
    <div className="flex items-start gap-2.5 p-3 pb-0 sm:gap-3 sm:p-4 sm:pb-0">
      <AuthorLink
        author={author}
        decorative
        className="shrink-0 rounded-full transition-opacity hover:opacity-90"
      >
        <Avatar
          src={author.avatar}
          alt={author.name}
          initials={author.initials}
          size="md"
        />
      </AuthorLink>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <h3 className="min-w-0 break-words text-[14px] font-bold leading-5 text-deep-blue">
            <AuthorLink
              author={author}
              className="rounded-sm hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {author.name}
            </AuthorLink>
          </h3>
          {post.isRepost && (
            <span className="inline-flex items-center gap-1 text-[13px] text-[#64748B]">
              <Repeat2 className="h-3.5 w-3.5" />
              shared a post
            </span>
          )}
          {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
          {post.type === "promo" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-secondary px-2 py-0.5 text-[10px] font-semibold text-pink-light">
              <Tag className="h-3 w-3" />
              Promotional Offer
            </span>
          )}
        </div>
        {author.subtitle ? (
          <p
            className="flex min-w-0 items-center gap-1 text-[12px] text-[#475467]"
            title={author.subtitle}
          >
            <Briefcase className="h-3 w-3 shrink-0 text-[#98A2B3]" aria-hidden="true" />
            {author.subtitle.split(" · ").map((part, index) => (
              <span key={index} className="inline-flex min-w-0 items-center gap-1.5">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="ml-0.5 h-1 w-1 shrink-0 rounded-full bg-[#98A2B3]"
                  />
                ) : null}
                <span className="truncate">
                  {index > 0 ? <span className="sr-only">, </span> : null}
                  {part}
                </span>
              </span>
            ))}
          </p>
        ) : null}
        <PostMeta post={post} />
      </div>

      {showActions && (
        <PostMenu
          post={post}
          isOwner={isOwner}
          onReport={onReport}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default FeedPostHeader;
