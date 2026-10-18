import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import Messenger from './Messenger';
import { memberProfilePath } from '@/shared/constants/profile';

const direct = {
  id: 'c1',
  isGroup: false,
  name: 'Ismail Molla',
  initials: 'IM',
  subtitle: 'Sales Director · BauerLab Instruments',
  otherUserId: 'u-ismail',
  messages: [],
};

const render = (props) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <Messenger mobilePanel="chat" {...props} />
    </MemoryRouter>,
  );

const headerLink = (html) => html.match(/<a[^>]*title="View [^"]*profile"[^>]*>.*?<\/a>/)?.[0] ?? null;

describe('Messenger chat header', () => {
  it("links the direct chat's avatar and name to the other member's profile", () => {
    const html = render({
      activeChat: direct,
      getProfileHref: (id) => memberProfilePath('USER', id),
    });
    const link = headerLink(html);

    expect(link).toContain('href="/contacts/u-ismail"');
    expect(link).toContain('Ismail Molla');
    expect(link).toMatch(/rounded-full[^"]*h-11 w-11[^>]*><span>I<\/span>/);
    expect(link).toContain('Sales Director');
  });

  it('does not link group chats', () => {
    const html = render({
      activeChat: { ...direct, isGroup: true, name: 'Lab Team', otherUserId: null },
      getProfileHref: (id) => memberProfilePath('USER', id),
    });
    expect(headerLink(html)).toBeNull();
    expect(html).toContain('Lab Team');
  });

  it('shows a plain header when no profile route is available', () => {
    expect(headerLink(render({ activeChat: direct }))).toBeNull();
    expect(
      headerLink(render({ activeChat: { ...direct, otherUserId: null }, getProfileHref: () => null })),
    ).toBeNull();
  });
});

describe('Messenger group activity notices', () => {
  it('renders notices as a centered line with date and time, without bubble or delete button', () => {
    const html = render({
      activeChat: {
        ...direct,
        isGroup: true,
        name: 'Mofasa',
        messages: [
          {
            id: 's1',
            from: 'system',
            isSystem: true,
            text: 'Nayem Islam added Anna Kowalska',
            eventTime: 'Oct 18, 2026 · 11:37',
            createdAt: '2026-10-18T05:37:00.000Z',
          },
        ],
      },
      onDeleteMessage: () => {},
    });

    const notice = html.match(/<div[^>]*role="note"[^>]*>.*?<\/time><\/div>/)?.[0] ?? '';
    expect(notice).toContain('Nayem Islam added Anna Kowalska');
    expect(notice).toContain('dateTime="2026-10-18T05:37:00.000Z"');
    expect(notice).toContain('Oct 18, 2026 · 11:37');
    expect(html).not.toContain('Delete message');
    expect(html).not.toContain('bg-primary px-4');
  });

  it("links other members' names in a notice to their profiles", () => {
    const html = render({
      activeChat: {
        ...direct,
        isGroup: true,
        name: 'Mofasa',
        messages: [
          {
            id: 's1',
            from: 'system',
            isSystem: true,
            text: 'You removed Sofia Rossi',
            textParts: ['You', ' removed ', { text: 'Sofia Rossi', userId: 'u-sofia' }],
            eventTime: 'Oct 18, 2026 · 11:47',
          },
        ],
      },
      getProfileHref: (id) => memberProfilePath('USER', id),
    });

    const notice = html.match(/<div[^>]*role="note"[^>]*>.*?<\/time><\/div>/)?.[0] ?? '';
    const link = notice.match(/You removed (<a[^>]*>Sofia Rossi<\/a>)/)?.[1] ?? '';
    expect(link).toContain('href="/contacts/u-sofia"');
    expect(link).toContain('title="View Sofia Rossi&#x27;s profile"');
  });

  it('shows names as plain text when no profile route is available', () => {
    const html = render({
      activeChat: {
        ...direct,
        isGroup: true,
        messages: [
          {
            id: 's1',
            from: 'system',
            isSystem: true,
            text: 'Nayem Islam left the group',
            textParts: [{ text: 'Nayem Islam', userId: 'u-nayem' }, ' left the group'],
          },
        ],
      },
    });
    expect(html).toContain('Nayem Islam</span> left the group');
    expect(html).not.toContain('href="/contacts/u-nayem"');
  });
});

describe('Messenger composer and message formatting', () => {
  it('uses a multi-line composer and renders formatted message text', () => {
    const html = render({
      activeChat: {
        ...direct,
        messages: [{ id: 'm1', from: 'them', text: 'Please **review**:\n- item one' }],
      },
    });

    expect(html).toMatch(/<textarea[^>]*rows="1"[^>]*aria-label="Message"/);
    expect(html).toContain('<strong class="font-semibold">review</strong>');
    expect(html).toMatch(/<ul[^>]*><li[^>]*>item one<\/li><\/ul>/);
  });
});

describe('Messenger message editing', () => {
  const mine = { id: 'm1', from: 'me', text: 'Hello team', time: '12:30', edited: true };

  it('offers edit and delete on your own text messages and labels edited ones', () => {
    const html = render({
      activeChat: { ...direct, messages: [mine, { id: 'm2', from: 'them', text: 'Hi', time: '12:31' }] },
      onEditMessage: () => true,
      onDeleteMessage: () => {},
    });

    expect(html.match(/aria-label="Edit message"/g)).toHaveLength(1);
    expect(html.match(/aria-label="Delete message"/g)).toHaveLength(1);
    // Copy is offered on every text message, yours and theirs.
    expect(html.match(/aria-label="Copy message"/g)).toHaveLength(2);
    expect(html).toContain('12:30<span class="ml-1">· edited</span>');
  });

  it('hides the edit action when editing is not available', () => {
    const html = render({ activeChat: { ...direct, messages: [mine] }, onDeleteMessage: () => {} });
    expect(html).not.toContain('Edit message');
    expect(html).toContain('Delete message');
  });
});

describe('memberProfilePath', () => {
  it.each([
    ['USER', '/contacts/u1'],
    ['SUPPLIER', '/supplier/contacts/u1'],
    ['ADMIN', '/admin/users/u1'],
  ])('routes a %s viewer to %s', (role, expected) => {
    expect(memberProfilePath(role, 'u1')).toBe(expected);
  });

  it('returns null without a role or user', () => {
    expect(memberProfilePath(undefined, 'u1')).toBeNull();
    expect(memberProfilePath('USER', null)).toBeNull();
  });
});
