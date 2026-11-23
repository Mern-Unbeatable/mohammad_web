/** Map API blogs onto BlogAdminCard / create form props. */
import { formatDate } from "@/shared/utils/dates/date";

export function formatBlogDate(dateValue) {
  return formatDate(dateValue, { format: "long" });
}

export function toBlogCardModel(blog) {
  if (!blog) return null;

  const readTime = blog.readTime
    ? blog.readTime.includes("min")
      ? blog.readTime
      : `${blog.readTime}`
    : "5 min read";

  return {
    ...blog,
    image: blog.image || "",
    excerpt: blog.excerpt || "",
    author: blog.author || "Admin",
    readTime,
    date: formatBlogDate(blog.date || blog.publishedAt),
  };
}

export const BLOG_CATEGORY_OPTIONS = [
  "Industry News",
  "Research",
  "Laboratory Technology",
  "Equipment",
  "Training",
  "Events",
  "Careers",
  "Resources",
];
