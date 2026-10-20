/** Map API blogs onto hub cards / detail UI props. */

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1581093458791-9f302e6d64fb?w=800&h=450&fit=crop";

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
    ? String(blog.readTime).includes("min")
      ? blog.readTime
      : `${blog.readTime}`
    : "5 min read";

  return {
    id: blog.id,
    slug: blog.slug,
    category: blog.category || "Resources",
    title: blog.title,
    excerpt: blog.excerpt || "",
    image: blog.image || PLACEHOLDER_IMAGE,
    date: formatBlogDate(blog.date || blog.publishedAt),
    author: blog.author || "Lab Unity",
    authorInitials: blog.authorInitials || null,
    readTime,
    raw: blog,
  };
}

export function toBlogDetailModel(blog) {
  const card = toBlogCardModel(blog);
  if (!card) return null;

  const bodyText = typeof blog.body === "string" ? blog.body.trim() : "";
  const body = bodyText
    ? bodyText
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : card.excerpt
      ? [card.excerpt]
      : [];

  return {
    ...card,
    authorDisplay: card.author,
    publishedOn: card.date,
    body,
  };
}
