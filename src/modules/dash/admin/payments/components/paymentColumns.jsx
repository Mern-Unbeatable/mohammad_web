import { Link } from 'react-router';
import { InvoiceButtons, PaymentStatusBadge } from '@/components/payments';
import { userDetailPath } from '../constant/constants';

/** Admin payments table columns; the last column opens Stripe invoices. */
export const getPaymentColumns = ({ openingKey, onOpen }) => [
  { key: 'date', header: 'Date' },
  {
    key: 'user',
    header: 'Member',
    render: (user) =>
      user ? (
        <Link to={userDetailPath(user.id)} className="block min-w-0 hover:text-primary">
          <span className="block truncate font-semibold">{user.name}</span>
          <span className="block truncate text-[12px] text-[#64748B]">{user.email}</span>
        </Link>
      ) : (
        '—'
      ),
  },
  { key: 'kindLabel', header: 'Type' },
  {
    key: 'title',
    header: 'Description',
    wrap: true,
    className: 'min-w-[200px] max-w-[280px]',
  },
  { key: 'invoiceNumber', header: 'Invoice #', render: (value) => value || '—' },
  { key: 'amount', header: 'Amount', className: 'font-semibold' },
  {
    key: 'statusLabel',
    header: 'Status',
    render: (label, row) => <PaymentStatusBadge label={label} tone={row.statusTone} />,
  },
  {
    key: 'id',
    header: 'Invoice',
    render: (_id, row) =>
      row.hasInvoice || row.hasReceipt ? (
        <InvoiceButtons payment={row} openingKey={openingKey} onOpen={onOpen} />
      ) : (
        <span className="text-[12px] text-[#98A2B3]">—</span>
      ),
  },
];
