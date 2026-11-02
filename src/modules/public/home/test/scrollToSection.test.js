import { afterEach, describe, expect, it, vi } from 'vitest';
import { scrollToSection } from '../utils/scrollToSection';

const originalDocument = globalThis.document;
const originalWindow = globalThis.window;

afterEach(() => {
  globalThis.document = originalDocument;
  globalThis.window = originalWindow;
});

const setup = (element) => {
  globalThis.document = { getElementById: vi.fn(() => element) };
  globalThis.window = { history: { replaceState: vi.fn() } };
  return { preventDefault: vi.fn() };
};

describe('scrollToSection', () => {
  it('scrolls, prevents navigation and updates the hash', () => {
    const element = { scrollIntoView: vi.fn() };
    const event = setup(element);
    scrollToSection('community')(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(element.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '#community');
  });

  it('lets the link navigate when the section is missing', () => {
    const event = setup(null);
    scrollToSection('community')(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(window.history.replaceState).not.toHaveBeenCalled();
  });
});
