import Avatar from "@/components/ui/Avatar";
import { VISIBLE_REPLIES } from "../../constants";
import CommentBody from "./CommentBody";

const LINE = "bg-[#D0D5DD]";
/** Horizontal centre of the 36px avatar column, where the thread spine runs. */
const SPINE_X = 18;
const BRANCH_W = 30;
/** Matches the `pt-3` / `space-y-3` spacing between the comment and its replies. */
const THREAD_GAP = 12;
const AVATAR_W = 36;
const AVATAR_GAP = 12;

const CommentAvatar = ({ author }) => (
  <div className="relative z-10 w-9 shrink-0 self-start rounded-full bg-white">
    <Avatar src={author?.avatar} alt={author?.name} initials={author?.initials} size="sm" />
  </div>
);

const ThreadLine = ({ className, style }) => (
  <span
    className={`pointer-events-none absolute z-0 ${LINE} ${className}`}
    style={style}
    aria-hidden
  />
);

const ReplyRow = ({ isLast, children }) => (
  <div className="relative">
    <ThreadLine
      className="w-px -translate-x-1/2"
      style={{
        left: SPINE_X,
        top: -THREAD_GAP,
        ...(isLast ? { height: THREAD_GAP + SPINE_X } : { bottom: 0 }),
      }}
    />
    <ThreadLine className="h-px" style={{ left: SPINE_X, top: SPINE_X, width: BRANCH_W }} />
    <div className="flex gap-3" style={{ paddingLeft: BRANCH_W }}>
      {children}
    </div>
  </div>
);

const repliesToggleLabel = (expanded, hiddenCount) => {
  if (expanded) return "Hide replies";
  return `View ${hiddenCount} more ${hiddenCount === 1 ? "reply" : "replies"}`;
};

/** A top-level comment with its replies, joined by thread lines. */
const CommentThread = ({
  comment,
  currentUser,
  likingCommentId,
  onLike,
  reply,
  manage,
}) => {
  const replies = Array.isArray(comment.replies) ? comment.replies : [];
  const expanded = reply.expandedRoots.has(comment.id);
  const visibleReplies = expanded ? replies : replies.slice(0, VISIBLE_REPLIES);
  const hiddenCount = Math.max(0, replies.length - VISIBLE_REPLIES);
  const hasReplies = replies.length > 0;

  const bodyProps = { currentUser, onLike, reply, manage };

  return (
    <div className="relative">
      <div className="relative z-[1] flex gap-3">
        {hasReplies || reply.targetId === comment.id ? (
          <ThreadLine
            className="bottom-0 top-10 w-px -translate-x-1/2"
            style={{ left: SPINE_X }}
          />
        ) : null}
        <CommentAvatar author={comment.author} />
        <CommentBody
          {...bodyProps}
          comment={comment}
          liking={likingCommentId === comment.id}
        />
      </div>

      {hasReplies ? (
        <div className="relative space-y-2 pt-3">
          {visibleReplies.map((item, index) => (
            <ReplyRow key={item.id} isLast={index === visibleReplies.length - 1}>
              <CommentAvatar author={item.author} />
              <CommentBody
                {...bodyProps}
                comment={item}
                liking={likingCommentId === item.id}
              />
            </ReplyRow>
          ))}

          {hiddenCount > 0 ? (
            <div
              className="relative"
              style={{ paddingLeft: BRANCH_W + AVATAR_W + AVATAR_GAP }}
            >
              <button
                type="button"
                onClick={() => reply.toggleThread(comment.id)}
                className="text-[12px] font-semibold text-primary hover:underline"
              >
                {repliesToggleLabel(expanded, hiddenCount)}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default CommentThread;
