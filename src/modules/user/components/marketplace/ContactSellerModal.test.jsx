import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { toListingDetailModel } from '@/features/user/marketplace';
import ContactSellerModal from './ContactSellerModal';

const listing = toListingDetailModel({
  id: 'listing-1',
  title: 'Benchtop Centrifuge',
  price: 500,
  status: 'ACTIVE',
  images: ['https://cdn.example.com/centrifuge.jpg'],
  seller: {
    id: 'seller-1',
    firstName: 'Ana',
    lastName: 'Lab',
    title: 'Lab Manager',
    company: 'BioCore',
    avatar: 'https://cdn.example.com/ana.jpg',
  },
});

const render = (props = {}) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <ContactSellerModal
        open
        listing={listing}
        onClose={() => {}}
        onSend={async () => {}}
        {...props}
      />
    </MemoryRouter>,
  );

describe('ContactSellerModal', () => {
  it('renders nothing while closed', () => {
    expect(render({ open: false })).toBe('');
  });

  it('shows the seller the message goes to', () => {
    const html = render();
    expect(html).toContain('role="dialog"');
    expect(html).toContain('Ana Lab');
    expect(html).toContain('Lab Manager · BioCore');
    expect(html).toContain('src="https://cdn.example.com/ana.jpg"');
  });

  it('shows the listing the message is about', () => {
    const html = render();
    expect(html).toContain('Benchtop Centrifuge');
    expect(html).toContain('src="https://cdn.example.com/centrifuge.jpg"');
    expect(html).toMatch(/€\s?500/);
  });

  it('starts with an empty message and a disabled Send button', () => {
    const html = render();
    expect(html).toMatch(/<textarea[^>]*id="contact-seller-message"[^>]*><\/textarea>/);
    expect(html).toMatch(/<button type="submit" disabled=""[^>]*>.*Send Message<\/button>/);
  });

  it('caps the message at the API limit', () => {
    expect(render()).toContain('maxLength="5000"');
  });
});
