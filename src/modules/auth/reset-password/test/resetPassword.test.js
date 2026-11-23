import { describe, expect, it } from 'vitest';
import {
  isValidTokenFormat,
  readToken,
  resolveStatus,
  toCheck,
  validatePasswords,
} from '../utils/resetPassword';
import { PASSWORD_MISMATCH_MESSAGE, PASSWORD_RULES_MESSAGE } from '../constant/constants';

const TOKEN = 'a'.repeat(64);

describe('isValidTokenFormat', () => {
  it('accepts 64 hex characters only', () => {
    expect(isValidTokenFormat(TOKEN)).toBe(true);
    expect(isValidTokenFormat('F'.repeat(64))).toBe(true);
    expect(isValidTokenFormat('a'.repeat(63))).toBe(false);
    expect(isValidTokenFormat('z'.repeat(64))).toBe(false);
    expect(isValidTokenFormat('')).toBe(false);
  });
});

describe('readToken', () => {
  it('prefers the trimmed URL token', () => {
    expect(readToken(new URLSearchParams(`token=%20${TOKEN}%20`), { resetToken: 'old' })).toEqual({
      urlToken: TOKEN,
      token: TOKEN,
    });
  });

  it('falls back to history state, then empty', () => {
    expect(readToken(new URLSearchParams(), { resetToken: TOKEN })).toEqual({ urlToken: '', token: TOKEN });
    expect(readToken(new URLSearchParams(), null)).toEqual({ urlToken: '', token: '' });
  });
});

describe('toCheck', () => {
  it('maps ok, 400 and other failures', () => {
    expect(toCheck('t', { ok: true, expiresAt: 'x' })).toEqual({
      token: 't',
      status: 'valid',
      message: '',
      expiresAt: 'x',
    });
    expect(toCheck('t', { ok: false, status: 400, error: 'Expired' })).toEqual({
      token: 't',
      status: 'invalid',
      message: 'Expired',
      expiresAt: null,
    });
    expect(toCheck('t', { ok: false, status: 500, error: 'Down' }).status).toBe('error');
  });
});

describe('resolveStatus', () => {
  const check = { token: TOKEN, status: 'valid' };

  it('orders done, bad format, matching check, checking', () => {
    expect(resolveStatus({ done: true, hasValidFormat: false, check, token: TOKEN })).toBe('done');
    expect(resolveStatus({ done: false, hasValidFormat: false, check, token: TOKEN })).toBe('invalid');
    expect(resolveStatus({ done: false, hasValidFormat: true, check, token: TOKEN })).toBe('valid');
    expect(
      resolveStatus({ done: false, hasValidFormat: true, check: { token: null }, token: TOKEN }),
    ).toBe('checking');
  });
});

describe('validatePasswords', () => {
  it('checks strength before the match', () => {
    expect(validatePasswords('weak', 'other')).toBe(PASSWORD_RULES_MESSAGE);
    expect(validatePasswords('Str0ng!pass', 'Str0ng!pas')).toBe(PASSWORD_MISMATCH_MESSAGE);
    expect(validatePasswords('Str0ng!pass', 'Str0ng!pass')).toBe('');
  });
});
