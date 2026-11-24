import { toBlogCardModel } from "@/features/dash/supplier/blogs";
import { POPULAR_POSTS_LIMIT } from "../constant/constants";

export const toBlogCards = (blogs) => (blogs || []).map(toBlogCardModel).filter(Boolean);

/** Sidebar posts: latest blogs without the one being read. */
export const popularPosts = (blogs, currentSlug) =>
  toBlogCards(blogs)
    .filter((post) => post.slug !== currentSlug)
    .slice(0, POPULAR_POSTS_LIMIT);
