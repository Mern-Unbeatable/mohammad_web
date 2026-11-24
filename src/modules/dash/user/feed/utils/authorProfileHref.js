/** Own posts open the editable profile; anyone else opens their contact profile. */
export const authorProfileHref = (authorId, viewerId) => {
  if (!authorId) return null;
  return viewerId && authorId === viewerId ? "/profile" : `/contacts/${authorId}`;
};
