import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth';
import { userMarketplaceReducer } from '@/features/user/marketplace';
import ListingDetailView from './ListingDetailView';

const ME = 'user-me';
const OTHER = 'user-other';

const listing = (seller) => ({
  id: 'listing-1',
  title: 'Benchtop Centrifuge',
  price: 500,
  category: 'CENTRIFUGATION',
  condition: 'GOOD',
  images: [],
  seller,
});

const render = ({ user = { id: ME, role: 'USER' }, selectedListing }) => {
  const store = configureStore({
    reducer: { auth: authReducer, userMarketplace: userMarketplaceReducer },
    preloadedState: {
      auth: {
        ...authReducer(undefined, { type: '@@init' }),
        user,
        isAuthenticated: Boolean(user),
        sessionReady: true,
      },
      userMarketplace: {
        ...userMarketplaceReducer(undefined, { type: '@@init' }),
        selectedListing,
      },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/marketplace/listing-1']}>
        <Routes>
          <Route path="/marketplace/:listingId" element={<ListingDetailView />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

const sellerProfileHref = (html) =>
  html.match(/href="([^"]*)"[^>]*>View seller profile</)?.[1] ?? null;

describe('ListingDetailView seller profile link', () => {
  it('opens my own profile when I am the seller', () => {
    const html = render({
      selectedListing: listing({ id: ME, firstName: 'Élise', lastName: 'Moreau' }),
    });

    expect(sellerProfileHref(html)).toBe('/profile');
    expect(html).toContain('Edit listing');
  });

  it("opens the seller's contact profile for someone else's listing", () => {
    const html = render({
      selectedListing: listing({ id: OTHER, firstName: 'Ana', lastName: 'Lab' }),
    });

    expect(sellerProfileHref(html)).toBe(`/contacts/${OTHER}`);
    expect(html).toContain('Contact seller');
  });

  it('opens a dialog from Contact seller instead of linking to the chat', () => {
    const html = render({
      selectedListing: listing({ id: OTHER, firstName: 'Ana', lastName: 'Lab' }),
    });

    expect(html).toMatch(/<button type="button" aria-haspopup="dialog"[^>]*>.*Contact seller<\/button>/);
    expect(html).not.toContain('href="/chat');
    expect(html).not.toContain('role="dialog"');
  });

  it('offers no Contact seller action on my own listing', () => {
    const html = render({ selectedListing: listing({ id: ME, firstName: 'Élise' }) });

    expect(html).not.toContain('Contact seller');
  });

  it('hides the link when the listing has no seller information', () => {
    const html = render({ selectedListing: listing(undefined) });

    expect(html).toContain('Benchtop Centrifuge');
    expect(sellerProfileHref(html)).toBeNull();
  });

  it('hides the link when the signed-in user is not known yet', () => {
    const html = render({
      user: null,
      selectedListing: listing({ id: OTHER, firstName: 'Ana', lastName: 'Lab' }),
    });

    expect(sellerProfileHref(html)).toBeNull();
  });
});
