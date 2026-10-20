/**
 * Ad comments are kept in memory only (there is no ads comments API yet);
 * these build and update the comment shape `PostComments` renders.
 */
export const createLocalComment = (text, now = Date.now()) => ({
  id: `c-${now}`,
  author: {
    name: "You",
    initials: "YO",
    subtitle: "Supplier",
    avatar: null,
  },
  content: text,
  time: "now",
  liked: false,
  replies: 0,
});

export const toggleCommentLike = (comments, commentId) =>
  comments.map((comment) =>
    comment.id === commentId ? { ...comment, liked: !comment.liked } : comment,
  );
