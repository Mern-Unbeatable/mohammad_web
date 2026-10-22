import { MessageCircle, Share2, User } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { getReaction } from "@/modules/dash/user/data/reactions";
import { ACTION_BUTTON_CLASS } from "./actionButtonClass";
import ReactionButton from "./ReactionButton";

const countLabel = (count, word) => `${count.toLocaleString()} ${word}${count === 1 ? "" : "s"}`;

/** Reaction emojis and counts; zero counts are left out, and nothing renders when all are zero. */
export const PostStats = ({
  stats,
  reactionCounts,
  reactors,
  onCommentsClick,
  onReactionsClick,
}) => {
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

  const ReactionsSummary = onReactionsClick ? "button" : "span";

  return (
    <div className="flex items-center justify-between gap-3 px-3 pb-2.5 text-[12px] text-[#64748B] sm:px-4">
      {reactions > 0 ? (
        <ReactionsSummary
          {...(onReactionsClick
            ? {
                type: "button",
                onClick: onReactionsClick,
                "aria-haspopup": "dialog",
                className:
                  "group inline-flex min-w-0 items-center gap-1.5 rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              }
            : { className: "inline-flex min-w-0 items-center gap-1.5" })}
        >
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
          <span className="truncate group-hover:underline">
            {countLabel(reactions, "reaction")}
          </span>
          <span className="ml-0.5 flex -space-x-1.5" aria-hidden>
            {reactors?.length
              ? reactors.slice(0, 3).map((person) => (
                  <Avatar
                    key={person.id}
                    src={person.avatar}
                    alt={person.name || ""}
                    initials={person.initials}
                    size="xs"
                    className="ring-[1.5px] ring-white"
                  />
                ))
              : Array.from({ length: Math.min(reactions, 3) }, (_, i) => (
                  <span
                    key={i}
                    className="flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] border-white bg-[#E8F3FB]"
                  >
                    <User className="h-2.5 w-2.5 text-primary" strokeWidth={2.5} />
                  </span>
                ))}
          </span>
        </ReactionsSummary>
      ) : (
        <span />
      )}

      <span className="flex shrink-0 items-center gap-2">
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
        {comments > 0 && shares > 0 ? (
          <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-[#98A2B3]" />
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
