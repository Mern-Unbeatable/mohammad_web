import { MessageCircle, Share2 } from "lucide-react";
import { getReaction } from "@/modules/user/data/reactions";
import ReactionButton from "./ReactionButton";

export const PostStats = ({ stats, reactionCounts }) => {
  const topEmojis = reactionCounts
    ? Object.entries(reactionCounts)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => getReaction(id)?.emoji)
        .filter(Boolean)
    : [];

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#E4E7EC] px-3 py-2 text-[12px] text-[#64748B] sm:px-4">
      <span className="inline-flex min-w-0 items-center gap-1.5">
        {topEmojis.length ? (
          <span className="inline-flex items-center" aria-hidden>
            {topEmojis.map((emoji) => (
              <span key={emoji} className="-ml-1 first:ml-0 text-[13px]">
                {emoji}
              </span>
            ))}
          </span>
        ) : null}
        <span className="truncate">
          {stats.reactions} reactions • {stats.comments} comments
        </span>
      </span>
      <span className="shrink-0">{stats.shares} shares</span>
    </div>
  );
};

export const PostActions = ({
  reactionId,
  onReact,
  commentsOpen,
  onToggleComments,
  commentCount = 0,
  onShare,
  shared,
}) => (
  <div className="grid grid-cols-3 divide-x divide-[#E4E7EC]">
    <ReactionButton reactionId={reactionId} onReact={onReact} />

    <button
      type="button"
      onClick={onToggleComments}
      className={`flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap px-1 py-3 text-[13px] font-medium transition-colors hover:bg-[#F9FAFB] sm:gap-2 ${
        commentsOpen ? "text-primary" : "text-[#475467]"
      }`}
    >
      <MessageCircle className="h-4 w-4 shrink-0" />
      Comment
      {commentCount > 0 ? (
        <span className="hidden tabular-nums min-[400px]:inline">
          ({commentCount})
        </span>
      ) : null}
    </button>

    <button
      type="button"
      onClick={onShare}
      className={`flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap px-1 py-3 text-[13px] font-medium transition-colors hover:bg-[#F9FAFB] sm:gap-2 ${
        shared ? "text-primary" : "text-[#475467]"
      }`}
    >
      <Share2 className="h-4 w-4 shrink-0" />
      {shared ? "Shared" : "Share"}
    </button>
  </div>
);
