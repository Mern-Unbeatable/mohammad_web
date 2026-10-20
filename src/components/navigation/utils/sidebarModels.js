import { toContactCardModel } from '@/features/user/contacts';
import { toListingCardModel } from '@/features/user/marketplace';
import { toJobCardModel } from '@/features/user/recruitment';
import { SIDEBAR_LIMIT } from '../constant/constants';

export const formatPrice = (price) => {
  const num = Number(price);
  if (Number.isNaN(num)) return '—';
  return `€${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

/** First `SIDEBAR_LIMIT` contacts the user is not connected to yet. */
export const toSuggestedPeople = (rows = []) =>
  rows
    .map(toContactCardModel)
    .filter((c) => c && !c.connected)
    .slice(0, SIDEBAR_LIMIT)
    .map((c) => ({ ...c, to: `/contacts/${c.id}` }));

export const toSidebarListings = (rows = []) =>
  rows
    .map(toListingCardModel)
    .filter(Boolean)
    .map((item) => ({
      id: item.id,
      title: item.title,
      meta: [item.condition, item.location].filter(Boolean).join(' · '),
      price: formatPrice(item.price),
      image: item.image || null,
      to: `/marketplace/${item.id}`,
    }));

export const toSidebarJobs = (rows = []) =>
  rows
    .map(toJobCardModel)
    .filter(Boolean)
    .map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company || '—',
      location: job.location || '—',
      type: job.employmentType || null,
      image: job.image || null,
      to: `/recruitment/${job.id}`,
    }));

export const markPending = (people, personId) =>
  people.map((row) => (row.id === personId ? { ...row, pending: true } : row));
