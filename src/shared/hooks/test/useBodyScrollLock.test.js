import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/*
 * The suite runs in node without a DOM renderer, so `useEffect` is captured
 * and replayed by hand: `mount` renders a host component once, runs its effect and returns the cleanup, the
 * same lifecycle React drives (including Strict Mode's mount → cleanup → mount).
 */
const effects = vi.hoisted(() => []);

vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal()),
  useEffect: (effect) => effects.push(effect),
}));

const { useBodyScrollLock } = await import('../useBodyScrollLock');

const LockHost = ({ locked, options }) => {
  useBodyScrollLock(locked, options);
  return null;
};

const mount = (locked, options) => {
  effects.length = 0;
  LockHost({ locked, options });
  return effects[0]() ?? (() => {});
};

describe('useBodyScrollLock', () => {
  beforeEach(() => {
    globalThis.document = {
      body: { style: { overflow: 'auto' } },
      documentElement: { style: { overflow: '' } },
    };
  });

  afterEach(() => {
    delete globalThis.document;
  });

  const body = () => document.body.style.overflow;
  const root = () => document.documentElement.style.overflow;

  it('does nothing while unlocked', () => {
    mount(false)();
    expect(body()).toBe('auto');
  });

  it('locks on mount and restores the original inline style on unmount', () => {
    const unmount = mount(true);
    expect(body()).toBe('hidden');
    unmount();
    expect(body()).toBe('auto');
  });

  it('survives the Strict Mode mount → cleanup → mount cycle', () => {
    mount(true)();
    const unmount = mount(true);
    expect(body()).toBe('hidden');
    unmount();
    expect(body()).toBe('auto');
  });

  it('keeps the page locked until the last of two overlapping overlays closes', () => {
    const closeDrawer = mount(true);
    const closeModal = mount(true);
    closeModal();
    expect(body()).toBe('hidden');
    closeDrawer();
    expect(body()).toBe('auto');
  });

  it('restores correctly when the first overlay unmounts before the second', () => {
    const closeDrawer = mount(true);
    const closeModal = mount(true);
    closeDrawer();
    expect(body()).toBe('hidden');
    closeModal();
    expect(body()).toBe('auto');
  });

  it('does not leak locks across repeated open / close cycles', () => {
    for (let i = 0; i < 50; i += 1) mount(true)();
    expect(body()).toBe('auto');
    document.body.style.overflow = 'scroll';
    const unmount = mount(true);
    expect(body()).toBe('hidden');
    unmount();
    expect(body()).toBe('scroll');
  });

  it('locks and restores <html> too when includeRoot is set', () => {
    const unmount = mount(true, { includeRoot: true });
    expect(body()).toBe('hidden');
    expect(root()).toBe('hidden');
    unmount();
    expect(body()).toBe('auto');
    expect(root()).toBe('');
  });

  it('leaves <html> alone for a body-only lock stacked on a root lock', () => {
    const closeChat = mount(true, { includeRoot: true });
    const closeModal = mount(true);
    closeChat();
    expect(body()).toBe('hidden');
    expect(root()).toBe('');
    closeModal();
    expect(body()).toBe('auto');
  });
});
