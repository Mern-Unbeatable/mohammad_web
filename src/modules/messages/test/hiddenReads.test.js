import { describe, expect, it } from 'vitest';
import { createHiddenReadTracker } from '../utils/hiddenReads';

const incoming = (overrides = {}) => ({
  conversationId: 'c1',
  activeConversationId: 'c1',
  fromSelf: false,
  visible: true,
  ...overrides,
});

describe('createHiddenReadTracker', () => {
  it('marks the open conversation read immediately while the tab is visible', () => {
    const tracker = createHiddenReadTracker();
    expect(tracker.noteIncoming(incoming())).toBe(true);
    expect(tracker.takeOnVisible('c1')).toBe(false);
  });

  it('defers the read until the hidden tab becomes visible again', () => {
    const tracker = createHiddenReadTracker();
    expect(tracker.noteIncoming(incoming({ visible: false }))).toBe(false);
    expect(tracker.takeOnVisible('c1')).toBe(true);
    expect(tracker.takeOnVisible('c1')).toBe(false);
  });

  it('ignores own messages and other conversations', () => {
    const tracker = createHiddenReadTracker();
    expect(tracker.noteIncoming(incoming({ visible: false, fromSelf: true }))).toBe(false);
    expect(tracker.noteIncoming(incoming({ visible: false, conversationId: 'c2' }))).toBe(false);
    expect(tracker.takeOnVisible('c1')).toBe(false);
  });

  it('does not mark a conversation the user navigated away from while hidden', () => {
    const tracker = createHiddenReadTracker();
    tracker.noteIncoming(incoming({ visible: false }));
    expect(tracker.takeOnVisible('c2')).toBe(false);
    expect(tracker.takeOnVisible(null)).toBe(false);
  });
});
