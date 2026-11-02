import { describe, expect, it } from 'vitest';
import { listingGalleryImages, listingViewerState, sellerProfileHref } from '../utils/listingDetail';

describe('sellerProfileHref', () => {
  it('links to own profile, a contact, or nothing without both ids', () => {
    expect(sellerProfileHref('me', 'me')).toBe('/profile');
    expect(sellerProfileHref('other', 'me')).toBe('/contacts/other');
    expect(sellerProfileHref(null, 'me')).toBeNull();
    expect(sellerProfileHref('other', undefined)).toBeNull();
  });
});

describe('listingViewerState', () => {
  const listing = { id: 'l1', title: 'Pump', seller: { id: 'seller' } };

  it('hides contact links on your own listing', () => {
    const state = listingViewerState(listing, 'seller');
    expect(state).toMatchObject({
      isOwnListing: true,
      canContact: false,
      emailHref: null,
      whatsAppHref: null,
      editHref: '/marketplace/l1/edit',
    });
  });

  it('allows contact on someone else’s listing', () => {
    expect(listingViewerState(listing, 'me')).toMatchObject({
      isOwnListing: false,
      canContact: true,
      profileHref: '/contacts/seller',
    });
  });
});

describe('listingGalleryImages', () => {
  it('prefers images, falls back to image', () => {
    expect(listingGalleryImages({ images: ['a'] })).toEqual(['a']);
    expect(listingGalleryImages({ images: [], image: 'b' })).toEqual(['b']);
    expect(listingGalleryImages({})).toEqual([]);
  });
});
