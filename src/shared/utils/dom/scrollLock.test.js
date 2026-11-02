import { describe, expect, it } from 'vitest';
import { acquireScrollLock } from './scrollLock';

const makeElement = (overflow = '') => ({ style: { overflow } });

describe('acquireScrollLock', () => {
  it('hides overflow and restores the previous inline value on release', () => {
    const el = makeElement('auto');
    const release = acquireScrollLock(el);
    expect(el.style.overflow).toBe('hidden');
    release();
    expect(el.style.overflow).toBe('auto');
  });

  it('keeps the element locked until every overlapping holder releases', () => {
    const el = makeElement('');
    const releaseDrawer = acquireScrollLock(el);
    const releaseModal = acquireScrollLock(el);

    releaseDrawer();
    expect(el.style.overflow).toBe('hidden');

    releaseModal();
    expect(el.style.overflow).toBe('');
  });

  it('restores correctly when holders release out of order', () => {
    const el = makeElement('scroll');
    const first = acquireScrollLock(el);
    const second = acquireScrollLock(el);
    const third = acquireScrollLock(el);
    second();
    first();
    expect(el.style.overflow).toBe('hidden');
    third();
    expect(el.style.overflow).toBe('scroll');
  });

  it('ignores repeated calls to the same release function', () => {
    const el = makeElement('');
    const a = acquireScrollLock(el);
    const b = acquireScrollLock(el);
    a();
    a();
    expect(el.style.overflow).toBe('hidden');
    b();
    expect(el.style.overflow).toBe('');
  });

  it('tracks elements independently', () => {
    const body = makeElement('');
    const root = makeElement('visible');
    const releaseBody = acquireScrollLock(body);
    const releaseRoot = acquireScrollLock(root);
    releaseRoot();
    expect(root.style.overflow).toBe('visible');
    expect(body.style.overflow).toBe('hidden');
    releaseBody();
    expect(body.style.overflow).toBe('');
  });

  it('is a no-op without an element', () => {
    expect(() => acquireScrollLock(null)()).not.toThrow();
  });
});
