import { describe, expect, it } from 'vitest';
import { popularPosts, toBlogCards } from '../utils/blogCards';
import { POPULAR_POSTS_LIMIT } from '../constant/constants';

const blog = (n) => ({ id: `b${n}`, slug: `post-${n}`, title: `Post ${n}` });

describe('toBlogCards', () => {
  it('maps blogs and drops empty entries', () => {
    const cards = toBlogCards([blog(1), null, blog(2)]);
    expect(cards.map((c) => c.slug)).toEqual(['post-1', 'post-2']);
  });

  it('handles a missing list', () => {
    expect(toBlogCards(undefined)).toEqual([]);
  });
});

describe('popularPosts', () => {
  it('excludes the current post and caps the list', () => {
    const blogs = Array.from({ length: POPULAR_POSTS_LIMIT + 2 }, (_, i) => blog(i + 1));
    const posts = popularPosts(blogs, 'post-1');
    expect(posts).toHaveLength(POPULAR_POSTS_LIMIT);
    expect(posts.map((p) => p.slug)).not.toContain('post-1');
  });
});
