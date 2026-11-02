import { describe, expect, it } from 'vitest';
import { cooldownEnd, resendLabel, secondsUntil } from '../utils/cooldown';

describe('cooldown', () => {
  it('ends 60 seconds after sending', () => {
    expect(cooldownEnd(1_000)).toBe(61_000);
  });

  it('rounds up and never goes negative', () => {
    expect(secondsUntil(61_000, 1_000)).toBe(60);
    expect(secondsUntil(61_000, 60_500)).toBe(1);
    expect(secondsUntil(61_000, 70_000)).toBe(0);
    expect(secondsUntil(0, 0)).toBe(0);
  });
});

describe('resendLabel', () => {
  it('prefers loading, then the countdown', () => {
    expect(resendLabel({ loading: true, secondsLeft: 10 })).toBe('Sending...');
    expect(resendLabel({ loading: false, secondsLeft: 10 })).toBe('resend the link in 10s');
    expect(resendLabel({ loading: false, secondsLeft: 0 })).toBe('resend the link');
  });
});
