import { describe, expect, it } from 'vitest';
import { buildPostsQuery } from '../utils/generalQueries';
import { buildPostPayload } from '../utils/postForm';
import { pickRelatedPosts } from '../utils/postDetail';
import { POSTS_PAGE_SIZE } from '../constant/constants';

describe('pickRelatedPosts', () => {
  it('drops the current post and caps the list', () => {
    const posts = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id }));
    expect(pickRelatedPosts(posts, 'b').map((p) => p.id)).toEqual(['a', 'c', 'd', 'e']);
    expect(pickRelatedPosts(undefined, 'b')).toEqual([]);
  });
});

describe('buildPostsQuery', () => {
  it('sends no type for All and no mine flag by default', () => {
    expect(buildPostsQuery({ page: 2, category: 'All' })).toEqual({
      page: 2,
      pageSize: POSTS_PAGE_SIZE,
      sort: 'desc',
    });
  });

  it('adds mine and maps the category to a type', () => {
    const params = buildPostsQuery({ page: 1, category: 'Document', mine: true });
    expect(params.mine).toBe(true);
    expect(params.type).toBe('document');
  });
});

describe('buildPostPayload', () => {
  const news = { postType: 'news', headline: 'Hello', summary: 'Body' };
  const doc = { postType: 'document', docTitle: 'Spec', description: '', documentUrl: '' };

  it('requires a title', () => {
    expect(buildPostPayload({ ...news, headline: '  ' })).toEqual({ error: 'Title is required' });
  });

  it('requires a document URL for documents', () => {
    expect(buildPostPayload(doc)).toEqual({ error: 'Document URL is required' });
    expect(buildPostPayload({ ...doc, documentUrl: 'https://x/doc.pdf' }).payload).toMatchObject({
      type: 'DOCUMENT',
      documentUrl: 'https://x/doc.pdf',
    });
  });

  it('clears the cover image only when editing', () => {
    expect(buildPostPayload(news).payload).not.toHaveProperty('imageUrl');
    expect(buildPostPayload(news, { isEdit: true }).payload.imageUrl).toBeNull();
    expect(buildPostPayload({ ...news, imageUrl: 'a.png' }, { isEdit: true }).payload.imageUrl).toBe(
      'a.png',
    );
  });
});
