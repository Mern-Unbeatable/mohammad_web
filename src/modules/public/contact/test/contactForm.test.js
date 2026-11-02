import { describe, expect, it } from 'vitest';
import { toContactPayload, validateContactForm } from '../utils/contactForm';
import { EMPTY_CONTACT_FORM } from '../constant/constants';

const filled = {
  ...EMPTY_CONTACT_FORM,
  fullName: '  Jane Doe ',
  email: ' jane@example.com ',
  inquiryType: 'technical',
  message: 'The marketplace upload fails for me.',
};

describe('toContactPayload', () => {
  it('trims values and leaves out empty optional fields', () => {
    expect(toContactPayload({ ...filled, phone: '  ', company: '' })).toEqual({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      inquiryType: 'technical',
      message: 'The marketplace upload fails for me.',
    });
  });

  it('keeps optional fields that were filled in', () => {
    const payload = toContactPayload({ ...filled, phone: '+32 1', company: ' Acme ' });
    expect(payload.phone).toBe('+32 1');
    expect(payload.company).toBe('Acme');
  });
});

describe('validateContactForm', () => {
  it('accepts a complete form', () => {
    expect(validateContactForm(filled)).toBe('');
  });

  it('reports a missing name, a bad email and a short message', () => {
    expect(validateContactForm({ ...filled, fullName: ' ' })).toMatch(/full name/);
    expect(validateContactForm({ ...filled, email: 'jane@' })).toMatch(/valid email/);
    expect(validateContactForm({ ...filled, message: 'Hi there' })).toMatch(/at least 10/);
  });
});
