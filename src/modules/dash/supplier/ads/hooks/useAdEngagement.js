import { useState } from "react";
import { createLocalComment, toggleCommentLike } from "../utils/localComments";

/** Reaction, share flag and comments on the ad detail page; all kept in memory. */
export const useAdEngagement = () => {
  const [comments, setComments] = useState([]);
  const [reactionId, setReactionId] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [shared, setShared] = useState(false);

  return {
    comments,
    reactionId,
    commentsOpen,
    shared,
    react: setReactionId,
    toggleComments: () => setCommentsOpen((open) => !open),
    share: () => setShared(true),
    addComment: (text) => setComments((prev) => [createLocalComment(text), ...prev]),
    likeComment: (commentId) => setComments((prev) => toggleCommentLike(prev, commentId)),
  };
};
