import { describe, expect, it } from 'vitest';
import { marketplaceFilters, parseCategoryParam } from '../utils/marketplaceUrlFilters';

const params = (query) => new URLSearchParams(query);

describe('marketplace URL filters', () => {
  it('reads category and search, falling back to defaults', () => {
    expect(marketplaceFilters.read(params('category=Microscopy&q=leica'))).toEqual({
      category: 'Microscopy',
      q: 'leica',
    });
    expect(marketplaceFilters.read(params(''))).toEqual({ category: 'All', q: '' });
    expect(parseCategoryParam('Rockets')).toBe('All');
  });

  it('sets a category and resets to page 1, keeping the search', () => {
    const next = marketplaceFilters.apply(params('page=3&q=hplc'), { category: 'Weighing' });
    expect(Object.fromEntries(next)).toEqual({ page: '1', q: 'hplc', category: 'Weighing' });
  });

  it('drops default values so the URL stays minimal', () => {
    const next = marketplaceFilters.apply(params('page=2&category=Safety&q=hood'), {
      category: 'All',
      q: '',
    });
    expect(next.toString()).toBe('page=1');
  });

  it('removes an unknown category and trims an over-long search', () => {
    expect(marketplaceFilters.normalize(params('page=2&category=Safety&q=ok'))).toBeNull();

    const fixed = marketplaceFilters.normalize(
      params(`page=2&category=Rockets&q=${'x'.repeat(250)}`),
    );
    expect(fixed.get('category')).toBeNull();
    expect(fixed.get('q')).toHaveLength(200);
    expect(fixed.get('page')).toBe('2');
  });
});
