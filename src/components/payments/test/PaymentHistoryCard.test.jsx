import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import InvoiceButtons from '../InvoiceButtons';
import PaymentHistoryCard from '../PaymentHistoryCard';

const never = () => new Promise(() => {});

describe('PaymentHistoryCard', () => {
  it('renders its heading and a loading state before the first response', () => {
    const html = renderToStaticMarkup(
      <PaymentHistoryCard title="Billing history" subtitle="Your invoices." fetcher={never} />,
    );
    expect(html).toContain('Billing history');
    expect(html).toContain('Your invoices.');
    expect(html).toContain('aria-label="Loading payments"');
  });
});

describe('InvoiceButtons', () => {
  const payment = { id: 'p1', invoiceNumber: 'ABC-1' };
  const render = (overrides) =>
    renderToStaticMarkup(
      <InvoiceButtons payment={{ ...payment, ...overrides }} openingKey={null} onOpen={() => {}} />,
    );

  it('offers the invoice page and PDF for invoiced payments', () => {
    const html = render({ hasInvoice: true });
    expect(html).toContain('Invoice');
    expect(html).toContain('PDF');
    expect(html).not.toContain('Receipt');
  });

  it('offers the card receipt for older payments without an invoice', () => {
    const html = render({ hasInvoice: false, hasReceipt: true });
    expect(html).toContain('Receipt');
    expect(html).not.toContain('PDF');
  });

  it('renders nothing when Stripe has no document', () => {
    expect(render({ hasInvoice: false, hasReceipt: false })).toBe('');
  });
});
