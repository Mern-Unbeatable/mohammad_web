export const emptyResultsText = ({ term, hasHiddenResults, emptyText }) => {
  if (hasHiddenResults) {
    return term
      ? `Everyone matching "${term}" is already a member.`
      : "Everyone here is already a member.";
  }
  return term ? `No members match "${term}".` : emptyText;
};
