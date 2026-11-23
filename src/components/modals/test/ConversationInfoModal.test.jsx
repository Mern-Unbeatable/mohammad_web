import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import ConversationInfoModal from '@/components/modals/messages/ConversationInfoModal';
import { memberProfilePath } from '@/modules/messages/constant/memberProfilePaths';

const group = {
  id: 'g1',
  isGroup: true,
  name: 'Mofasa',
  myRole: 'OWNER',
  participants: [
    { id: 'me', name: 'Élises Moreaux', initials: 'É', role: 'OWNER' },
    { id: 'u-marcus', name: 'Marcus Bauers', initials: 'M', subtitle: 'Sales Director', role: 'MEMBER' },
  ],
};

const render = (props = {}) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <ConversationInfoModal
        open
        conversation={group}
        currentUserId="me"
        onRemoveMember={() => {}}
        getProfileHref={(id) => memberProfilePath('USER', id)}
        {...props}
      />
    </MemoryRouter>,
  );

const memberLink = (html, name) =>
  html.match(new RegExp(`<a[^>]*title="View ${name}&#x27;s profile"[^>]*>.*?</a>`))?.[0] ?? null;

describe('ConversationInfoModal members', () => {
  it("links another member's avatar and name to their profile", () => {
    const link = memberLink(render(), 'Marcus Bauers');

    expect(link).toContain('href="/contacts/u-marcus"');
    expect(link).toContain('Marcus Bauers');
    expect(link).toContain('Sales Director');
  });

  it('keeps the remove button outside the profile link', () => {
    const html = render();
    expect(memberLink(html, 'Marcus Bauers')).not.toContain('Remove Marcus Bauers');
    expect(html).toContain('aria-label="Remove Marcus Bauers"');
  });

  it('does not link the current user', () => {
    const html = render();
    expect(memberLink(html, 'Élises Moreaux')).toBeNull();
    expect(html).not.toContain('href="/contacts/me"');
    expect(html).toMatch(/Moreaux(?:<!-- -->)? \(you\)/);
  });

  it('shows plain rows when no profile route is available', () => {
    expect(render({ getProfileHref: undefined })).not.toContain('<a ');
  });
});
