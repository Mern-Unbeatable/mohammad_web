import { describe, expect, it } from 'vitest';
import { INVOICE_LINK, formatMoney, pickInvoiceUrl, toPaymentModel } from './paymentsMappers';

describe('formatMoney', () => {
  it('formats euros, including €0 coupon payments', () => {
    expect(formatMoney(9.99, 'EUR')).toMatch(/9[.,]99/);
    expect(formatMoney(9.99, 'EUR')).toContain('€');
    expect(formatMoney(0, 'EUR')).toMatch(/0[.,]00/);
  });

  it('shows a dash for missing amounts', () => {
    expect(formatMoney(undefined)).toBe('—');
  });
});

describe('toPaymentModel', () => {
  const base = {
    id: 'p1',
    kind: 'SUBSCRIPTION',
    status: 'PAID',
    amount: 9.99,
    currency: 'EUR',
    description: '1 × Membership (at €9.99 / month)',
    invoiceNumber: 'ABC-0001',
    issuedAt: '2026-11-01T10:00:00.000Z',
    paidAt: '2026-11-01T10:05:00.000Z',
    periodStart: '2026-11-01T00:00:00.000Z',
    periodEnd: '2026-12-01T00:00:00.000Z',
    hasInvoice: true,
    hasReceipt: false,
  };

  it('builds the row for a paid membership invoice', () => {
    const model = toPaymentModel(base);
    expect(model).toMatchObject({
      title: '1 × Membership (at €9.99 / month)',
      kindLabel: 'Membership',
      statusLabel: 'Paid',
      statusTone: 'success',
      invoiceNumber: 'ABC-0001',
      hasInvoice: true,
    });
    expect(model.date).toBe('Nov 1, 2026');
    expect(model.period).toContain('Dec 1, 2026');
  });

  it('names the advertisement for ad fees', () => {
    const model = toPaymentModel({
      ...base,
      kind: 'ADVERTISEMENT',
      advertisement: { id: 'ad1', title: 'Summer promo' },
    });
    expect(model.title).toBe('Advertisement: Summer promo');
    expect(model.advertisementId).toBe('ad1');
  });

  it('maps unpaid statuses to warning / danger tones', () => {
    expect(toPaymentModel({ ...base, status: 'OPEN' })).toMatchObject({
      statusLabel: 'Due',
      statusTone: 'warning',
    });
    expect(toPaymentModel({ ...base, status: 'FAILED' }).statusTone).toBe('danger');
  });

  it('falls back to the kind when Stripe gave no description', () => {
    expect(toPaymentModel({ ...base, description: null, kind: 'OTHER' }).title).toBe('Invoice');
  });
});

describe('pickInvoiceUrl', () => {
  const links = {
    hostedInvoiceUrl: 'https://invoice.stripe.com/i/1',
    invoicePdfUrl: 'https://pay.stripe.com/invoice/1/pdf',
    receiptUrl: null,
  };

  it('returns the requested link', () => {
    expect(pickInvoiceUrl(links, INVOICE_LINK.VIEW)).toBe(links.hostedInvoiceUrl);
    expect(pickInvoiceUrl(links, INVOICE_LINK.PDF)).toBe(links.invoicePdfUrl);
  });

  it('falls back to what exists, or null', () => {
    expect(pickInvoiceUrl({ receiptUrl: 'https://r' }, INVOICE_LINK.VIEW)).toBe('https://r');
    expect(pickInvoiceUrl({}, INVOICE_LINK.PDF)).toBeNull();
  });
});
