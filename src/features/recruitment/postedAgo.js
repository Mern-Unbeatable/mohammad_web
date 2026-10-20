import { formatDate, toDate } from "@/shared/utils/date";

const DAY_MS = 86_400_000;

/** Posted today · Posted 3 days ago · Posted 2 weeks ago · Oct 20, 2026 */
export function formatPostedAgo(dateValue) {
  const posted = toDate(dateValue);
  if (!posted) return "";

  const days = Math.floor((Date.now() - posted.getTime()) / DAY_MS);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  if (days < 7) return `Posted ${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "Posted 1 week ago";
  if (weeks < 5) return `Posted ${weeks} weeks ago`;
  return formatDate(posted, { format: "short" });
}
