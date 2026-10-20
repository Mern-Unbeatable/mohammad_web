import {
  categoryFromApi,
  categoryToApi,
  conditionFromApi,
  MARKETPLACE_CATEGORY_OPTIONS,
} from '@/features/dash/user/marketplace';
import { conditions, years } from '@/modules/dash/user/data/marketplace';
import { currentUser } from '@/modules/dash/user/data/dashboard';
import {
  CONDITION_TO_API,
  DEFAULT_CONDITION_INDEX,
  DEFAULT_YEAR_INDEX,
  DESCRIPTION_MAX_LENGTH,
  MAX_YEAR,
  MIN_YEAR,
  TITLE_MAX_LENGTH,
} from '../constant/constants';

/** Category choices for a listing; "All" is only a browse filter. */
export const LISTING_CATEGORY_OPTIONS = MARKETPLACE_CATEGORY_OPTIONS.filter(
  (item) => item !== 'All',
);

export const emptyListingForm = () => ({
  title: '',
  description: '',
  category: LISTING_CATEGORY_OPTIONS[0],
  condition: conditions[DEFAULT_CONDITION_INDEX],
  year: years[DEFAULT_YEAR_INDEX],
  price: '',
});

/** Form values for editing an API listing. */
export const listingToForm = (listing) => ({
  title: listing.title || '',
  description: listing.description || '',
  category: categoryFromApi(listing.category),
  condition: conditionFromApi(listing.condition),
  year: listing.year != null ? String(listing.year) : years[DEFAULT_YEAR_INDEX],
  price: listing.price != null && listing.price !== '' ? String(listing.price) : '',
});

export const listingImageUrls = (listing) =>
  Array.isArray(listing.images)
    ? listing.images.filter(Boolean)
    : listing.image
      ? [listing.image]
      : [];

/** Seller line shown on the form, from the profile or auth user with demo fallbacks. */
export const listingSeller = (sourceUser) => {
  const profile = sourceUser?.profile || {};
  return {
    name:
      profile.name ||
      [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
      sourceUser?.email ||
      currentUser.name,
    company: profile.company || currentUser.company,
    location: profile.location || profile.country || currentUser.location || '',
  };
};

/**
 * Validates the form and maps it to API fields.
 * Returns `{ error }` with the first problem, or `{ values }` without images or location.
 */
export const validateListingForm = (form) => {
  const title = form.title.trim();
  const description = form.description.trim();
  const category = categoryToApi(form.category);
  const condition = CONDITION_TO_API[form.condition];
  const year = Number(form.year);
  const price = Number(form.price);

  if (!title) return { error: 'Product name is required' };
  if (title.length > TITLE_MAX_LENGTH) {
    return { error: `Product name must be ${TITLE_MAX_LENGTH} characters or less` };
  }
  if (!description) return { error: 'Description is required' };
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return { error: `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less` };
  }
  if (!category || !condition) {
    return { error: 'Please select a valid category and condition' };
  }
  if (!Number.isFinite(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return { error: 'Please select a valid year' };
  }
  if (!Number.isFinite(price) || price < 0) {
    return { error: 'Please enter a valid price' };
  }

  return { values: { title, description, category, condition, year, price } };
};

export const listingSubmitLabel = ({ uploading, saving, isEdit }) => {
  if (uploading) return 'Uploading photos…';
  if (saving) return isEdit ? 'Saving…' : 'Publishing…';
  return isEdit ? 'Save changes' : 'Publish listing';
};
