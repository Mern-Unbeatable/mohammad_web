import { describe, expect, it } from 'vitest';
import {
  MARKETPLACE_CATEGORY_OPTIONS,
  categoryFromApi,
  categoryToApi,
  toListingCardModel,
} from './marketplaceMappers';
import * as adminMappers from '@/features/dash/admin/marketplace/marketplaceMappers';

describe('marketplace Other category', () => {
  it('is the last selectable category', () => {
    expect(MARKETPLACE_CATEGORY_OPTIONS.at(-1)).toBe('Other');
    expect(adminMappers.MARKETPLACE_CATEGORY_OPTIONS.at(-1)).toBe('Other');
  });

  it('maps between the label and the API value', () => {
    expect(categoryToApi('Other')).toBe('OTHER');
    expect(categoryFromApi('OTHER')).toBe('Other');
    expect(adminMappers.categoryToApi('Other')).toBe('OTHER');
  });

  it('labels OTHER listings as Other on cards', () => {
    const listing = { id: 'l1', title: 'Glassware', category: 'OTHER', condition: 'GOOD' };
    expect(toListingCardModel(listing).category).toBe('Other');
    expect(adminMappers.toListingCardModel(listing).category).toBe('Other');
  });
});
