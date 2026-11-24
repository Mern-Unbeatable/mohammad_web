import { describe, expect, it, vi } from 'vitest';

const { get } = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock('@/config', () => ({
  crudService: { get },
  API_ENDPOINTS: { MESSAGES: { LIST: '/messages' } },
  unwrapApiData: (response) => response?.data,
  getApiErrorMessage: vi.fn(),
}));

const { CHAT_BASE_PATHS, CHAT_SECTIONS, chatPath } = await import('@/features/messages/chatPaths');
const { getConversations } = await import('@/features/messages/messagesApi');
const { sectionForTab, tabForSection, typeForTab } = await import('../utils/chatTabs');
const { CHAT_TAB } = await import('../constant/constants');

describe.each(Object.entries(CHAT_BASE_PATHS))('%s inbox tabs', (_role, base) => {
  it('the Groups tab goes to the group section and loads groups', () => {
    const section = sectionForTab(CHAT_TAB.GROUPS);
    expect(chatPath(base, { section })).toBe(`${base}/group`);
    expect(tabForSection(section)).toBe(CHAT_TAB.GROUPS);
    expect(typeForTab(tabForSection(section))).toBe('group');
  });

  it('the Messages tab goes to the messages section and loads direct chats', () => {
    const section = sectionForTab(CHAT_TAB.MESSAGES);
    expect(chatPath(base, { section })).toBe(`${base}/messages`);
    expect(tabForSection(section)).toBe(CHAT_TAB.MESSAGES);
    expect(typeForTab(tabForSection(section))).toBe('direct');
  });

  it('an open conversation URL keeps its tab', () => {
    expect(tabForSection(CHAT_SECTIONS.GROUP)).toBe(CHAT_TAB.GROUPS);
    expect(tabForSection(CHAT_SECTIONS.DIRECT)).toBe(CHAT_TAB.MESSAGES);
  });
});

describe('conversation list request', () => {
  it('asks the shared endpoint for one type, without empty search or cursor', async () => {
    get.mockResolvedValue({ data: [], meta: { page: 1, pageSize: 30, total: 0, totalPages: 1 } });

    const result = await getConversations({ type: 'group', search: '', page: 1 });

    expect(get).toHaveBeenLastCalledWith('/messages', { page: 1, pageSize: 30, type: 'group' });
    expect(result).toEqual({
      data: [],
      meta: { page: 1, pageSize: 30, total: 0, totalPages: 1 },
    });
  });

  it('passes the cursor for the next page and keeps the server meta', async () => {
    get.mockResolvedValue({
      data: [{ id: 'd2' }],
      meta: { page: 2, pageSize: 30, total: 40, totalPages: 2, hasMore: false, nextCursor: null },
    });

    const result = await getConversations({ type: 'direct', search: 'an', page: 2, cursor: 'c1' });

    expect(get).toHaveBeenLastCalledWith('/messages', {
      page: 2,
      pageSize: 30,
      type: 'direct',
      search: 'an',
      cursor: 'c1',
    });
    expect(result.data).toEqual([{ id: 'd2' }]);
    expect(result.meta.nextCursor).toBeNull();
  });

  it('returns an empty list when the response has no rows', async () => {
    get.mockResolvedValue({ data: null });
    const result = await getConversations({ type: 'group', page: 1 });
    expect(result.data).toEqual([]);
    expect(result.meta.page).toBe(1);
  });

  it('propagates request failures (e.g. an expired session) to the caller', async () => {
    get.mockRejectedValue(Object.assign(new Error('Unauthorized'), { response: { status: 401 } }));
    await expect(getConversations({ type: 'direct', page: 1 })).rejects.toThrow('Unauthorized');
  });
});
