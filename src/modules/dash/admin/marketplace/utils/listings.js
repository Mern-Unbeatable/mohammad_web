import { categoryToApi } from "@/features/dash/admin/marketplace";
import { MARKETPLACE_PAGE_SIZE } from "../constant/constants";

/** List query; "All" sends no category filter. */
export const buildListingsQuery = ({ page, category }) => {
  const params = { page, pageSize: MARKETPLACE_PAGE_SIZE };
  const apiCategory = categoryToApi(category);
  if (apiCategory) params.category = apiCategory;
  return params;
};

/** Gallery images, falling back to the single cover image. */
export const listingImages = (listing) =>
  listing.images?.length ? listing.images : [listing.image];

/** The seller can be messaged when known and not the signed-in admin. */
export const canContactSeller = (listing, userId) =>
  Boolean(listing.seller.id) && listing.seller.id !== userId;
