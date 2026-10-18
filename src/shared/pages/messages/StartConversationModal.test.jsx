import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import StartConversationModal from './StartConversationModal';

const recipient = {
  id: 'seller-1',
  name: 'Ana Lab',
  initials: 'AL',
  title: 'Lab Manager',
  company: 'BioCore',
  avatar: 'https://cdn.example.com/ana.jpg',
};

const listing = {
  id: 'listing-1',
  title: 'Benchtop Centrifuge',
  price: 500,
  status: 'ACTIVE',
  images: ['https://cdn.example.com/centrifuge.jpg'],
};

const render = (props = {}) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <StartConversationModal
        open
        recipient={recipient}
        onClose={() => {}}
        onSend={async () => {}}
        {...props}
      />
    </MemoryRouter>,
  );

describe('StartConversationModal', () => {
  it('renders nothing while closed', () => {
    expect(render({ open: false })).toBe('');
  });

  it('shows who the message goes to', () => {
    const html = render({ title: 'New message', description: 'Start a conversation with Ana Lab.' });
    expect(html).toContain('role="dialog"');
    expect(html).toContain('New message');
    expect(html).toContain('Start a conversation with Ana Lab.');
    expect(html).toContain('Ana Lab');
    expect(html).toContain('Lab Manager · BioCore');
    expect(html).toContain('src="https://cdn.example.com/ana.jpg"');
  });

  it('hides placeholder title/company values', () => {
    const html = render({ recipient: { ...recipient, company: '—' } });
    expect(html).toContain('Lab Manager');
    expect(html).not.toContain('—');
  });

  it('has no listing section when messaging from a profile', () => {
    const html = render();
    expect(html).not.toContain('About this listing');
    expect(html).not.toContain('Marketplace');
  });

  it('shows the listing when contacting a seller', () => {
    const html = render({ title: 'Contact seller', listing });
    expect(html).toContain('About this listing');
    expect(html).toContain('Benchtop Centrifuge');
    expect(html).toContain('src="https://cdn.example.com/centrifuge.jpg"');
    expect(html).toMatch(/€\s?500/);
  });

  it('starts with an empty message and a disabled Send button', () => {
    const html = render();
    expect(html).toMatch(/<textarea[^>]*id="start-conversation-message"[^>]*><\/textarea>/);
    expect(html).toMatch(/<button type="submit" disabled=""[^>]*>.*Send Message<\/button>/);
    expect(html).toContain('maxLength="5000"');
  });
});
