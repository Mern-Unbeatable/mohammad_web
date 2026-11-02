import { describe, expect, it } from 'vitest';
import { buildListingsQuery, buildMineQuery, buildSavedQuery } from '../utils/listingQueries';
import { LISTINGS_PAGE_SIZE, PERSONAL_LISTINGS_PAGE_SIZE } from '../constant/constants';

describe('buildListingsQuery', () => {
  it('omits search and category when unset', () => {
    expect(buildListingsQuery({ page: 2, query: '  ', category: 'All' })).toEqual({
      page: 2,
      pageSize: LISTINGS_PAGE_SIZE,
      sort: 'desc',
    });
  });

  it('trims the search and maps the category', () => {
    const params = buildListingsQuery({ page: 1, query: ' hplc ', category: 'Chromatography' });
    expect(params.search).toBe('hplc');
    expect(params.category).toBeTruthy();
    expect(params.category).not.toBe('Chromatography');
  });
});

describe('personal listing queries', () => {
  it('loads my listings on one larger page', () => {
    expect(buildMineQuery({ query: '', category: 'All' })).toEqual({
      page: 1,
      pageSize: PERSONAL_LISTINGS_PAGE_SIZE,
      sort: 'desc',
      mine: true,
    });
  });

  it('loads saved listings with the search applied', () => {
    expect(buildSavedQuery({ query: 'pump', category: 'All' })).toEqual({
      page: 1,
      pageSize: PERSONAL_LISTINGS_PAGE_SIZE,
      sort: 'desc',
      saved: true,
      search: 'pump',
    });
  });
});
