import { memo, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Card from "@/components/ui/Card";
import { toProfilePageUser } from "@/features/dash/user/profile";
import { COMMENT_PREVIEW_LIMIT } from "../../constants";
import { usePostCommentActions } from "../../hooks/usePostCommentActions";
import { usePostEngagement } from "../../hooks/usePostEngagement";
import { useRepost } from "../../hooks/useRepost";
import FullCommentsModal from "../comments/FullCommentsModal";
import PostComments from "../comments/PostComments";
import SharePostModal from "../modals/SharePostModal";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";
import { PostActions, PostStats } from "./PostActionsBar";

const FeedPost = ({ post, onReport, onEdit, onDelete }) => {
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
  const closeFullComments = useCallback(() => setFullCommentsOpen(false), []);

  const { stats, reactionId, reactionCounts } = engagement;
  const statsBar = (
    <PostStats stats={stats} reactionId={reactionId} reactionCounts={reactionCounts} />
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
        <PostHeader
          post={post}
          onReport={onReport}
          onEdit={onEdit}
          onDelete={onDelete}
          isOwner={isOwner}
        />
        <PostBody post={post} />
        {statsBar}
        <PostActions
          reactionId={reactionId}
          onReact={engagement.react}
          commentsOpen={commentsOpen}
          onToggleComments={() => setCommentsOpen((open) => !open)}
          commentCount={stats?.comments ?? 0}
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
        <PostHeader post={post} showActions={false} />
        <PostBody post={post} />
        {statsBar}
        <PostComments {...commentProps} emptyText="No comments yet. Start the conversation." />
      </FullCommentsModal>

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
