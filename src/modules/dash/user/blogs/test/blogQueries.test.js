import { describe, expect, it } from 'vitest';
import { buildBlogsQuery, buildLatestBlogsQuery } from '../utils/blogQueries';
import { BLOGS_PAGE_SIZE } from '../constant/constants';

describe('blog queries', () => {
  it('sends no search for a blank query', () => {
    expect(buildLatestBlogsQuery('   ')).toEqual({});
    expect(buildBlogsQuery({ page: 3, query: '' })).toEqual({
      page: 3,
      pageSize: BLOGS_PAGE_SIZE,
      sort: 'desc',
    });
  });

  it('trims the search into both queries', () => {
    expect(buildLatestBlogsQuery(' qc ')).toEqual({ search: 'qc' });
    expect(buildBlogsQuery({ page: 1, query: ' qc ' }).search).toBe('qc');
  });
});
