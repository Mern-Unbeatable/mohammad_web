import { describe, expect, it } from 'vitest';
import {
  LISTING_CATEGORY_OPTIONS,
  emptyListingForm,
  listingImageUrls,
  listingSubmitLabel,
  listingToForm,
  validateListingForm,
} from '../utils/listingForm';

const validForm = () => ({
  ...emptyListingForm(),
  title: ' Centrifuge ',
  description: ' Works well ',
  price: '500',
});

describe('validateListingForm', () => {
  it('returns trimmed API values for a valid form', () => {
    const { error, values } = validateListingForm(validForm());
    expect(error).toBeUndefined();
    expect(values).toMatchObject({ title: 'Centrifuge', description: 'Works well', price: 500 });
    expect(values.condition).toBe('GOOD');
    expect(Number.isFinite(values.year)).toBe(true);
  });

  it.each([
    [{ title: '  ' }, 'Product name is required'],
    [{ title: 'x'.repeat(201) }, 'Product name must be 200 characters or less'],
    [{ description: '' }, 'Description is required'],
    [{ description: 'x'.repeat(5001) }, 'Description must be 5000 characters or less'],
    [{ condition: 'Broken' }, 'Please select a valid category and condition'],
    [{ year: '1970' }, 'Please select a valid year'],
    [{ price: '-1' }, 'Please enter a valid price'],
  ])('rejects %o', (changes, message) => {
    expect(validateListingForm({ ...validForm(), ...changes }).error).toBe(message);
  });
});

describe('listing form helpers', () => {
  it('excludes the All filter from category options', () => {
    expect(LISTING_CATEGORY_OPTIONS).not.toContain('All');
    expect(emptyListingForm().category).toBe(LISTING_CATEGORY_OPTIONS[0]);
  });

  it('maps an API listing to form strings', () => {
    const form = listingToForm({ title: 'A', year: 2015, price: 0 });
    expect(form).toMatchObject({ title: 'A', description: '', year: '2015', price: '0' });
  });

  it('collects image urls from images or the single image', () => {
    expect(listingImageUrls({ images: ['a', null, 'b'] })).toEqual(['a', 'b']);
    expect(listingImageUrls({ image: 'c' })).toEqual(['c']);
    expect(listingImageUrls({})).toEqual([]);
  });

  it('labels the submit button by state', () => {
    expect(listingSubmitLabel({ uploading: true, saving: true, isEdit: true })).toBe('Uploading photos…');
    expect(listingSubmitLabel({ saving: true, isEdit: false })).toBe('Publishing…');
    expect(listingSubmitLabel({ isEdit: true })).toBe('Save changes');
  });
});
