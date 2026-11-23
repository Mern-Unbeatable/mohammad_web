import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { userMarketplaceReducer } from '@/features/user/marketplace';
import MarketplaceView from './MarketplaceView';

const listing = (id) => ({
  id,
  title: `Listing ${id}`,
  price: 100,
  category: 'MICROSCOPY',
  condition: 'GOOD',
  seller: { id: 's1', firstName: 'Ana', lastName: 'Lab' },
});

const render = (url, marketplaceState = {}) => {
  const store = configureStore({
    reducer: { userMarketplace: userMarketplaceReducer },
    preloadedState: {
      userMarketplace: {
        ...userMarketplaceReducer(undefined, { type: '@@init' }),
        ...marketplaceState,
      },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[url]}>
        <MarketplaceView />
      </MemoryRouter>
    </Provider>,
  );
};

const loadedPage = (page, totalPages = 3) => ({
  listings: [listing(`p${page}-a`), listing(`p${page}-b`)],
  listingsMeta: { page, pageSize: 8, total: totalPages * 8, totalPages },
});

describe('MarketplaceView pagination', () => {
  it("highlights the page from the URL and shows that page's listings", () => {
    const html = render('/marketplace?page=2', loadedPage(2));

    expect(html).toContain('aria-label="Page 2" aria-current="page"');
    expect(html).not.toContain('aria-label="Page 1" aria-current="page"');
    expect(html).toContain('Listing p2-a');
  });

  it('disables Previous on the first page and Next on the last page', () => {
    const first = render('/marketplace?page=1', loadedPage(1));
    expect(first).toMatch(/aria-label="Previous page"[^>]*disabled/);
    expect(first).not.toMatch(/aria-label="Next page"[^>]*disabled/);

    const last = render('/marketplace?page=3', loadedPage(3));
    expect(last).toMatch(/aria-label="Next page"[^>]*disabled/);
    expect(last).not.toMatch(/aria-label="Previous page"[^>]*disabled/);
  });

  it.each(['/marketplace', '/marketplace?page=abc', '/marketplace?page=0', '/marketplace?page=-4'])(
    'treats %s as page 1',
    (url) => {
      const html = render(url, loadedPage(1));
      expect(html).toContain('aria-label="Page 1" aria-current="page"');
    },
  );

  it('shows a loading state instead of an empty page for an out-of-range page', () => {
    const html = render('/marketplace?page=9', { ...loadedPage(9), listings: [] });

    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain('No listings found');
  });

  it('shows the empty state when there are no listings', () => {
    const html = render('/marketplace?page=1&category=Safety', {
      listings: [],
      listingsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
    });
    expect(html).toContain('No listings found');
  });

  it('restores the category and search from the URL', () => {
    const html = render('/marketplace?page=2&category=Microscopy&q=leica', loadedPage(2));

    expect(html).toMatch(/aria-pressed="true"[^>]*>Microscopy</);
    expect(html).toMatch(/aria-pressed="false"[^>]*>All</);
    expect(html).toContain('value="leica"');
    expect(html).toContain('aria-label="Page 2" aria-current="page"');
  });

  it('falls back to All for an unknown category', () => {
    const html = render('/marketplace?category=Rockets', loadedPage(1));
    expect(html).toMatch(/aria-pressed="true"[^>]*>All</);
  });

  it('shows an error state with a retry when the list fails', () => {
    const html = render('/marketplace?page=2', { listingsError: 'Network Error' });

    expect(html).toContain('Couldn&#x27;t load listings');
    expect(html).toContain('Try again');
    expect(html).not.toContain('No listings found');
  });
});
