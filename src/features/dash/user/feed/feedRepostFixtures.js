/** API-shaped feed posts shared by the repost tests. */

export const anna = { id: "anna", firstName: "Anna", lastName: "Berg" };
export const sam = { id: "sam", firstName: "Sam", lastName: "Reed" };

export const originalPost = (overrides = {}) => ({
  id: "orig",
  type: "QUESTION",
  content: "Which centrifuge do you recommend?",
  imageUrl: null,
  documentUrl: null,
  createdAt: "2026-10-01T10:00:00.000Z",
  author: anna,
  isRepost: false,
  sharedPostId: null,
  sharedPost: null,
  sharedByMe: false,
  myReaction: null,
  stats: { reactions: 0, comments: 0, shares: 0 },
  comments: [],
  ...overrides,
});

export const repostOf = (original, overrides = {}) => ({
  id: "rep",
  type: original.type,
  content: "Worth a read",
  imageUrl: null,
  documentUrl: null,
  createdAt: "2026-10-11T10:00:00.000Z",
  author: sam,
  isRepost: true,
  sharedPostId: original.id,
  sharedPost: {
    id: original.id,
    type: original.type,
    content: original.content,
    imageUrl: original.imageUrl,
    imageUrls: original.imageUrls ?? (original.imageUrl ? [original.imageUrl] : []),
    documentUrl: original.documentUrl,
    createdAt: original.createdAt,
    author: original.author,
  },
  sharedByMe: true,
  myReaction: null,
  stats: { reactions: 0, comments: 0, shares: 0 },
  comments: [],
  ...overrides,
});
