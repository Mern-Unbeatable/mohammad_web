/** Map API blogs onto BlogAdminCard / create form props. */

export function formatBlogDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
