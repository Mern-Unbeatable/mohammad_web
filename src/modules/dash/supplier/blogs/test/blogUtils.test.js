import { describe, expect, it } from "vitest";
import { buildBlogsQuery, buildLatestBlogsQuery } from "../utils/blogQueries";
import { popularPosts, toBlogCards } from "../utils/blogCards";
import { BLOGS_PAGE_SIZE, POPULAR_POSTS_LIMIT } from "../constant/constants";

const blog = (n) => ({ id: `b${n}`, slug: `post-${n}`, title: `Post ${n}` });

describe("blog queries", () => {
  it("sends no search for a blank query", () => {
    expect(buildLatestBlogsQuery("   ")).toEqual({});
    expect(buildBlogsQuery({ page: 3, query: "" })).toEqual({
      page: 3,
      pageSize: BLOGS_PAGE_SIZE,
      sort: "desc",
    });
  });

  it("trims the search into both queries", () => {
    expect(buildLatestBlogsQuery(" qc ")).toEqual({ search: "qc" });
    expect(buildBlogsQuery({ page: 1, query: " qc " }).search).toBe("qc");
  });
});

describe("blog cards", () => {
  it("maps blogs, drops empty entries and handles a missing list", () => {
    expect(toBlogCards([blog(1), null, blog(2)]).map((c) => c.slug)).toEqual(["post-1", "post-2"]);
    expect(toBlogCards(undefined)).toEqual([]);
  });

  it("excludes the current post from popular posts and caps the list", () => {
    const blogs = Array.from({ length: POPULAR_POSTS_LIMIT + 2 }, (_, i) => blog(i + 1));
    const posts = popularPosts(blogs, "post-1");
    expect(posts).toHaveLength(POPULAR_POSTS_LIMIT);
    expect(posts.map((p) => p.slug)).not.toContain("post-1");
  });
});
