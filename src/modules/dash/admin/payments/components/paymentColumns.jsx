import { Link } from 'react-router';
import Avatar from '@/components/ui/Avatar';
import { InvoiceButtons, PaymentStatusBadge } from '@/components/payments';
import { userDetailPath } from '../constant/constants';

/** Admin payments table columns; the last column opens Stripe invoices. */
export const getPaymentColumns = ({ openingKey, onOpen }) => [
  {
    key: 'user',
    header: 'Member',
    render: (user) =>
      user ? (
        <Link
          to={userDetailPath(user.id)}
          className="flex min-w-0 items-center gap-3 hover:text-primary"
        >
          <Avatar
            src={user.avatar}
            alt={user.name}
            initials={user.initials}
            size="sm"
            className="shrink-0"
          />
          <span className="min-w-0">
            <span className="block truncate font-semibold">{user.name}</span>
            <span className="block truncate text-[12px] text-[#64748B]">{user.email}</span>
          </span>
        </Link>
      ) : (
        '—'
      ),
  },
  { key: 'date', header: 'Date', className: 'font-semibold' },
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
