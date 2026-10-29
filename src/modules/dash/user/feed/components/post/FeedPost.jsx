import { memo, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Card from "@/components/ui/Card";
import { toProfilePageUser } from "@/features/dash/user/profile";
import { COMMENT_PREVIEW_LIMIT } from "../../constants";
import { usePostCommentActions } from "../../hooks/usePostCommentActions";
import { usePostEngagement } from "../../hooks/usePostEngagement";
import { useRepost } from "../../hooks/useRepost";
import { visibleReactors } from "../../utils/reactions";
import FullCommentsModal from "@/components/modals/feed/FullCommentsModal";
import PostComments from "../comments/PostComments";
import SharePostModal from "@/components/modals/feed/SharePostModal";
import FeedPostBody from "./FeedPostBody";
import FeedPostHeader from "./FeedPostHeader";
import { PostActions, PostStats } from "./PostActionsBar";
import ReactionsModal from "./ReactionsModal";

const FeedPost = ({ post, onReport, onEdit, onDelete, authorPresence = "unknown" }) => {
  const { user } = useSelector((state) => state.userProfile);
  const likingCommentId = useSelector((state) => state.userFeed.likingCommentId);
  const viewer = useMemo(() => toProfilePageUser(user), [user]);
  const isOwner = Boolean(viewer?.id && post.author?.id && viewer.id === post.author.id);

  const engagement = usePostEngagement(post);
  const commentActions = usePostCommentActions(post.id, engagement);
  const repost = useRepost(post, viewer?.id);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [fullCommentsOpen, setFullCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const closeFullComments = useCallback(() => setFullCommentsOpen(false), []);
  const closeReactions = useCallback(() => setReactionsOpen(false), []);
  const openReactions = useCallback(() => setReactionsOpen(true), []);

  const { stats, reactionId, reactionCounts } = engagement;
  const reactors = useMemo(
    () => visibleReactors(post.recentReactors, viewer, Boolean(reactionId)),
    [post.recentReactors, viewer, reactionId],
  );
  const statsBar = (
    <PostStats
      stats={stats}
      reactionId={reactionId}
      reactionCounts={reactionCounts}
      reactors={reactors}
      onReactionsClick={openReactions}
    />
  );
  const commentProps = {
    comments: engagement.comments,
    currentUser: viewer,
    onAddComment: commentActions.add,
    onLikeComment: commentActions.like,
    onEditComment: commentActions.edit,
    onDeleteComment: commentActions.remove,
    likingCommentId,
  };

  return (
    <>
      <Card>
        <FeedPostHeader
          post={post}
          authorPresence={authorPresence}
          onReport={onReport}
          onEdit={onEdit}
          onDelete={onDelete}
          isOwner={isOwner}
        />
        <FeedPostBody post={post} />
        <PostStats
          stats={stats}
          reactionId={reactionId}
          reactionCounts={reactionCounts}
          reactors={reactors}
          onCommentsClick={() => setCommentsOpen(true)}
          onReactionsClick={openReactions}
        />
        <PostActions
          reactionId={reactionId}
          onReact={engagement.react}
          commentsOpen={commentsOpen}
          onToggleComments={() => setCommentsOpen((open) => !open)}
          onShare={() => setShareOpen(true)}
          shared={post.sharedByMe}
        />
        {commentsOpen && (
          <PostComments
            {...commentProps}
            previewLimit={COMMENT_PREVIEW_LIMIT}
            onShowAll={() => setFullCommentsOpen(true)}
          />
        )}
      </Card>

      <FullCommentsModal
        open={fullCommentsOpen}
        title={`${post.author.name}'s post`}
        onClose={closeFullComments}
      >
        <FeedPostHeader post={post} authorPresence={authorPresence} showActions={false} />
        <FeedPostBody post={post} />
        {statsBar}
        <PostComments {...commentProps} emptyText="No comments yet. Start the conversation." />
      </FullCommentsModal>

      {reactionsOpen ? (
        <ReactionsModal
          postId={post.id}
          total={stats?.reactions ?? 0}
          reactionCounts={reactionCounts}
          viewerId={viewer?.id}
          onClose={closeReactions}
        />
      ) : null}

      {shareOpen ? (
        <SharePostModal
          open
          post={post}
          onClose={() => setShareOpen(false)}
          shared={post.sharedByMe}
          reposting={repost.reposting}
          repostUnavailableReason={repost.unavailableReason}
          onRepost={repost.repost}
          onUndoRepost={repost.undo}
        />
      ) : null}
    </>
  );
};

export default memo(FeedPost);
