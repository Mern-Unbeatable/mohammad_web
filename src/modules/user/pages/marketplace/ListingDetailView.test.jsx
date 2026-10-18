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

const descriptionParagraph = (html) =>
  html.match(/<p class="([^"]*)">([^<]*Line one[^<]*)<\/p>/) ?? [];

describe('ListingDetailView description', () => {
  const text =
    'Line one\nLine two\n\nSecond  paragraph with   spaces\n\n' +
    `URL: https://example.com/${'a'.repeat(120)}`;

  const render_ = () =>
    render({
      selectedListing: { ...listing({ id: OTHER, firstName: 'Ana' }), description: text },
    });

  it('renders the stored text unchanged as plain text', () => {
    const [, , rendered] = descriptionParagraph(render_());
    expect(rendered).toBe(text);
  });

  it('keeps line and paragraph breaks and wraps long words', () => {
    const [, className] = descriptionParagraph(render_());
    expect(className).toContain('whitespace-pre-line');
    expect(className).toContain('[overflow-wrap:anywhere]');
  });

  it('uses the full card width', () => {
    const [, className] = descriptionParagraph(render_());
    expect(className).not.toContain('max-w-');
  });

  it('does not interpret markdown or HTML in the description', () => {
    const html = render({
      selectedListing: {
        ...listing({ id: OTHER, firstName: 'Ana' }),
        description: 'Line one **bold** <b>tag</b>',
      },
    });
    expect(html).toContain('Line one **bold** &lt;b&gt;tag&lt;/b&gt;');
    expect(html).not.toContain('<strong>');
  });
});

describe('ListingDetailView image slider', () => {
  const withImages = (count) =>
    render({
      selectedListing: {
        ...listing({ id: OTHER, firstName: 'Ana' }),
        images: Array.from({ length: count }, (_, i) => `https://cdn.example.com/${i}.jpg`),
      },
    });

  it('puts every thumbnail in one scrollable row', () => {
    const html = withImages(5);
    expect(html).toContain('overflow-x-auto');
    expect(html).not.toContain('grid grid-cols-4');
    expect(html.match(/aria-label="View image \d"/g)).toHaveLength(5);
  });

  it('shows image arrows, a counter and thumbnail arrows when there are more than four', () => {
    const html = withImages(5);
    expect(html).toContain('aria-label="Previous image"');
    expect(html).toContain('aria-label="Next image"');
    expect(html).toMatch(/>1(?:<!-- -->)? \/ (?:<!-- -->)?5</);
    expect(html).toContain('aria-label="Scroll thumbnails right"');
  });

  it('hides thumbnail arrows when all thumbnails fit', () => {
    const html = withImages(3);
    expect(html).toContain('aria-label="Next image"');
    expect(html).not.toContain('Scroll thumbnails');
  });

  it('offers a full-screen view button on the main image, closed by default', () => {
    const html = withImages(3);
    expect(html).toContain('aria-label="View full screen"');
    expect(html).toContain('group-hover:opacity-100');
    expect(html).not.toContain('aria-modal="true"');
  });

  it('has no full-screen button when the listing has no image', () => {
    expect(withImages(0)).not.toContain('View full screen');
  });

  it('shows no slider controls for a single image', () => {
    const html = withImages(1);
    expect(html).not.toContain('Next image');
    expect(html).not.toContain('View image');
  });
});

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
