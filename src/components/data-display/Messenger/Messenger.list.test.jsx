import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import Messenger from './Messenger';

const chat = (id, extra = {}) => ({
  id,
  name: `Chat ${id}`,
  initials: 'CH',
  preview: 'Hello',
  time: '10:00',
  unreadCount: 0,
  isGroup: false,
  ...extra,
});

const render = (props) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <Messenger mobilePanel="list" {...props} />
    </MemoryRouter>,
  );

const listOf = (html) => html.match(/<div class="min-h-0 flex-1 overflow-y-auto[^"]*">.*?<\/aside>/s)?.[0] ?? '';

describe('Messenger conversation list states', () => {
  it('shows a loading skeleton, not an empty message, while the first page loads', () => {
    const list = listOf(render({ tab: 'groups', chats: [], loading: true }));
    expect(list).toContain('animate-pulse');
    expect(list).not.toContain('No groups yet');
  });

  it('shows the Messages list', () => {
    const list = listOf(render({ tab: 'messages', chats: [chat('d1'), chat('d2')] }));
    expect(list).toContain('Chat d1');
    expect(list).toContain('Chat d2');
  });

  it('shows the Groups list', () => {
    const list = listOf(render({ tab: 'groups', chats: [chat('g1', { isGroup: true })] }));
    expect(list).toContain('Chat g1');
  });

  it('shows the right empty state for each tab', () => {
    expect(listOf(render({ tab: 'messages', chats: [] }))).toContain(
      'No conversations yet. Start a new message.',
    );
    expect(listOf(render({ tab: 'groups', chats: [] }))).toContain(
      'No groups yet. Create one to get started.',
    );
  });

  it('shows the error with a retry button when the list failed to load', () => {
    const list = listOf(
      render({
        tab: 'groups',
        chats: [],
        listError: 'Failed to load conversations',
        onRetryList: () => {},
      }),
    );
    expect(list).toContain('role="alert"');
    expect(list).toContain('Failed to load conversations');
    expect(list).toMatch(/<button type="button"[^>]*>Try again<\/button>/);
    expect(list).not.toContain('No groups yet');
  });

  it('prefers the loading skeleton over a previous error while retrying', () => {
    const list = listOf(
      render({ tab: 'groups', chats: [], loading: true, listError: 'Failed to load conversations' }),
    );
    expect(list).toContain('animate-pulse');
    expect(list).not.toContain('role="alert"');
  });
});
