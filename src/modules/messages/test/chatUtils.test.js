import { describe, expect, it } from 'vitest';
import { CHAT_SECTIONS } from '@/features/messages/chatPaths';
import { CHAT_TAB, CONVERSATION_TYPE } from '../constant/constants';
import { sectionForTab, tabForSection, typeForTab } from '../utils/chatTabs';
import {
  findConversation,
  hasMorePages,
  memberNameFor,
  nextPage,
  presenceIdsKey,
  typingNamesFor,
  withTypingNames,
} from '../utils/chatModels';
import { isListingUnavailable } from '../utils/chatListing';

describe('chatTabs', () => {
  it('maps sections, tabs and conversation types', () => {
    expect(tabForSection(CHAT_SECTIONS.GROUP)).toBe(CHAT_TAB.GROUPS);
    expect(tabForSection(CHAT_SECTIONS.DIRECT)).toBe(CHAT_TAB.MESSAGES);
    expect(sectionForTab(CHAT_TAB.GROUPS)).toBe(CHAT_SECTIONS.GROUP);
    expect(sectionForTab(CHAT_TAB.MESSAGES)).toBe(CHAT_SECTIONS.DIRECT);
    expect(typeForTab(CHAT_TAB.GROUPS)).toBe(CONVERSATION_TYPE.GROUP);
    expect(typeForTab(CHAT_TAB.MESSAGES)).toBe(CONVERSATION_TYPE.DIRECT);
  });
});

describe('chatModels', () => {
  const participants = [
    { id: 'a', name: 'Ana' },
    { id: 'b', name: 'Bo' },
  ];

  it('resolves member and typing names with fallbacks', () => {
    expect(memberNameFor(participants, 'b', 'Member')).toBe('Bo');
    expect(memberNameFor(participants, 'z', 'Member')).toBe('Member');
    expect(typingNamesFor(participants, ['a', 'z'])).toEqual(['Ana', 'Someone']);
    expect(typingNamesFor(undefined, undefined)).toEqual([]);
  });

  it('only copies the chat when someone is typing', () => {
    const chat = { id: 'c1', participants };
    expect(withTypingNames(chat, [])).toBe(chat);
    expect(withTypingNames(chat, ['a'])).toEqual({ ...chat, typingNames: ['Ana'] });
  });

  it('finds a conversation in the list or the active detail', () => {
    const list = [{ id: '1' }];
    expect(findConversation(list, null, '1')).toBe(list[0]);
    expect(findConversation(list, { id: '2' }, '2')).toEqual({ id: '2' });
    expect(findConversation(list, { id: '2' }, '3')).toBeNull();
  });

  it('builds a sorted presence key without the current user', () => {
    const conversations = [
      { isGroup: false, otherUserId: 'z' },
      { isGroup: true, participants: [{ id: 'me' }, { id: 'm' }, null] },
    ];
    const active = { participants: [{ id: 'me' }, { id: 'a' }] };
    expect(presenceIdsKey(conversations, active, 'me')).toBe('a,m,z');
    expect(presenceIdsKey([], null, 'me')).toBe('');
  });

  it('pages conversations', () => {
    expect(hasMorePages({ page: 1, totalPages: 2 })).toBe(true);
    expect(hasMorePages({ page: 2, totalPages: 2 })).toBe(false);
    expect(hasMorePages(undefined)).toBe(false);
    expect(nextPage({ page: 3 })).toBe(4);
    expect(nextPage(null)).toBe(2);
  });
});

describe('isListingUnavailable', () => {
  it('rejects missing and inactive listings unless the viewer is the seller', () => {
    expect(isListingUnavailable(null, 'me')).toBe(true);
    expect(isListingUnavailable({ id: 'l', status: 'ACTIVE' }, 'me')).toBe(false);
    expect(isListingUnavailable({ id: 'l' }, 'me')).toBe(false);
    expect(isListingUnavailable({ id: 'l', status: 'SOLD', seller: { id: 'x' } }, 'me')).toBe(true);
    expect(isListingUnavailable({ id: 'l', status: 'SOLD', seller: { id: 'me' } }, 'me')).toBe(
      false,
    );
  });
});
