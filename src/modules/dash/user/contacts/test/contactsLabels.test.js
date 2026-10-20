import { describe, expect, it } from 'vitest';
import { countLabel, emptyMessage, plural, statusLabel } from '../utils/contactsLabels';
import { DEFAULT_COUNTRY } from '../constant/constants';

describe('contacts labels', () => {
  it('pluralises', () => {
    expect(plural(1, 'member')).toBe('1 member');
    expect(plural(0, 'member')).toBe('0 members');
  });

  it.each([
    ['people', 2, '2 members found'],
    ['connected', 1, '1 connection'],
    ['pending', 3, '3 requests sent'],
    ['requests', 1, '1 request to confirm'],
  ])('counts %s', (filter, total, label) => {
    expect(countLabel(filter, total)).toBe(label);
  });

  it('prefers loading, then error, then the count', () => {
    expect(statusLabel({ loading: true, error: 'x', filter: 'people', total: 1 })).toBe('Loading…');
    expect(statusLabel({ loading: false, error: 'x', filter: 'people', total: 1 })).toBe(
      'Contacts unavailable',
    );
    expect(statusLabel({ loading: false, error: null, filter: 'people', total: 1 })).toBe(
      '1 member found',
    );
  });

  it('uses the filtered empty message when search or country narrows the list', () => {
    const base = { filter: 'pending', search: '', country: DEFAULT_COUNTRY };
    expect(emptyMessage(base)).toBe('You have no pending sent requests.');
    expect(emptyMessage({ ...base, search: 'ann' })).toBe('No sent requests match your search.');
    expect(emptyMessage({ ...base, country: 'France' })).toBe('No sent requests match your search.');
  });
});
