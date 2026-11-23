export const PAYMENTS_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 350;
export const ALL = 'all';

export const KIND_FILTER_OPTIONS = [
  { value: ALL, label: 'All Types' },
  { value: 'subscription', label: 'Membership' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other invoices' },
];

export const STATUS_FILTER_OPTIONS = [
  { value: ALL, label: 'All Statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'open', label: 'Due' },
  { value: 'failed', label: 'Failed' },
  { value: 'void', label: 'Void' },
  { value: 'uncollectible', label: 'Uncollectible' },
];

export const userDetailPath = (userId) => `/admin/users/${userId}`;

export const MESSAGES = {
  SYNCED: (result) =>
    `Synced from Stripe: ${result.invoicesRecorded ?? 0} invoices, ${result.adPaymentsRecorded ?? 0} older ad payments.`,
  SYNC_FAILED: 'Could not sync payments from Stripe',
};
