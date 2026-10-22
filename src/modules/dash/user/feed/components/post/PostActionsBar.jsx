import { MessageCircle, Share2 } from "lucide-react";
import { getReaction } from "@/modules/dash/user/data/reactions";
import { ACTION_BUTTON_CLASS } from "./actionButtonClass";
import ReactionButton from "./ReactionButton";

const countLabel = (count, word) => `${count.toLocaleString()} ${word}${count === 1 ? "" : "s"}`;

/** Reaction emojis and counts; zero counts are left out, and nothing renders when all are zero. */
export const PostStats = ({ stats, reactionCounts, onCommentsClick }) => {
  const reactions = stats?.reactions ?? 0;
  const comments = stats?.comments ?? 0;
  const shares = stats?.shares ?? 0;
  if (!reactions && !comments && !shares) return null;

  const topEmojis = reactionCounts
    ? Object.entries(reactionCounts)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => getReaction(id)?.emoji)
        .filter(Boolean)
    : [];

  return (
    <div className="flex items-center justify-between gap-3 px-3 pb-2.5 text-[12px] text-[#64748B] sm:px-4">
      {reactions > 0 ? (
        <span className="inline-flex min-w-0 items-center gap-1.5">
          {topEmojis.length ? (
            <span className="inline-flex items-center" aria-hidden>
              {topEmojis.map((emoji) => (
                <span
                  key={emoji}
                  className="-ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[12px] ring-2 ring-white first:ml-0"
                >
                  {emoji}
                </span>
              ))}
            </span>
          ) : null}
          <span className="truncate">{countLabel(reactions, "reaction")}</span>
        </span>
      ) : (
        <span />
      )}

      <span className="flex shrink-0 items-center gap-3">
        {comments > 0 ? (
          onCommentsClick ? (
            <button
              type="button"
              onClick={onCommentsClick}
              className="rounded-sm hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {countLabel(comments, "comment")}
            </button>
          ) : (
            <span>{countLabel(comments, "comment")}</span>
          )
        ) : null}
        {shares > 0 ? <span>{countLabel(shares, "share")}</span> : null}
      </span>
    </div>
  );
};

export const PostActions = ({ reactionId, onReact, commentsOpen, onToggleComments, onShare, shared }) => (
  <div className="mx-2 grid grid-cols-3 gap-1 border-t border-[#EEF2F6] py-1 sm:mx-3">
    <ReactionButton reactionId={reactionId} onReact={onReact} />

    <button
      type="button"
      onClick={onToggleComments}
      aria-expanded={commentsOpen}
      className={`${ACTION_BUTTON_CLASS} ${commentsOpen ? "bg-secondary text-primary" : "text-[#475467]"}`}
    >
      <MessageCircle className="h-4 w-4 shrink-0" />
      Comment
    </button>

    <button
      type="button"
      onClick={onShare}
      className={`${ACTION_BUTTON_CLASS} ${shared ? "text-primary" : "text-[#475467]"}`}
    >
      <Share2 className="h-4 w-4 shrink-0" />
      {shared ? "Shared" : "Share"}
    </button>
  </div>
);
