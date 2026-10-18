import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';
import Pagination from '@/components/common/Pagination/Pagination';
import { CardSkeleton } from '@/components/common/Skeleton';
import Container from '@/components/ui/Container';
import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import MarketplaceToolbar from '@/modules/user/components/marketplace/MarketplaceToolbar';
import {
  fetchListings,
  toggleSaveListing,
  clearMarketplaceError,
  categoryToApi,
  toListingCardModel,
} from '@/features/user/marketplace';
import { GRID_PAGE_SIZE } from '@/shared/hooks/usePaginatedList';
import { usePageParam } from '@/shared/hooks/usePageParam';
import { SEARCH_PARAM } from '@/shared/utils/urlFilters';
import { CATEGORY_PARAM, marketplaceFilters } from './marketplaceUrlFilters';

const buildListingsQuery = ({ page, query, category }) => {
  const params = {
    page,
    pageSize: GRID_PAGE_SIZE,
    sort: 'desc',
  };
  const q = query?.trim();
  if (q) params.search = q;
  const categoryApi = categoryToApi(category);
  if (categoryApi) params.category = categoryApi;
  return params;
};

const MarketplaceView = () => {
  const dispatch = useDispatch();
  const { listings, listingsMeta, listingsLoading, listingsError, error } = useSelector(
    (state) => state.userMarketplace,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const { [CATEGORY_PARAM]: category, [SEARCH_PARAM]: search } =
    marketplaceFilters.read(searchParams);
  const [page, setPage] = usePageParam();

  const [query, setQuery] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);
  // Back/Forward can change `q`; mirror it into the search box.
  if (search !== syncedSearch) {
    setSyncedSearch(search);
    setQuery(search);
  }

  const updateFilters = useCallback(
    (changes, { replace = false } = {}) => {
      setSearchParams((prev) => marketplaceFilters.apply(prev, changes), { replace });
    },
    [setSearchParams],
  );

  useEffect(() => {
    const next = marketplaceFilters.normalize(searchParams);
    if (next) setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = query.trim() ? query : '';
      if (nextSearch === search) return;
      updateFilters({ [SEARCH_PARAM]: nextSearch }, { replace: true });
    }, 350);
    return () => clearTimeout(timer);
  }, [query, search, updateFilters]);

  const loadListings = useCallback(() => {
    dispatch(clearMarketplaceError());
    dispatch(fetchListings(buildListingsQuery({ page, query: search, category })));
  }, [dispatch, page, search, category]);

  // Run before paint so skeletons replace stale cards immediately on filter/page change
  useLayoutEffect(() => {
    loadListings();
  }, [loadListings]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const pageItems = useMemo(
    () => (listings || []).map(toListingCardModel).filter(Boolean),
    [listings],
  );

  const totalPages = Math.max(1, listingsMeta?.totalPages || 1);
  // Only trust totalPages once it belongs to the page in the URL.
  const pageOutOfRange =
    !listingsLoading &&
    !listingsError &&
    Number(listingsMeta?.page) === page &&
    page > totalPages;
  const showSkeleton = listingsLoading || pageOutOfRange;

  useEffect(() => {
    if (pageOutOfRange) setPage(totalPages, { replace: true });
  }, [pageOutOfRange, totalPages, setPage]);

  const handleCategoryChange = (next) => {
    if (next === category) return;
    updateFilters({ [CATEGORY_PARAM]: next });
  };

  const handlePageChange = (next) => {
    if (next === page) return;
    setPage(next);
  };

  const handleToggleSave = async (id) => {
    const result = await dispatch(toggleSaveListing(id));
    if (toggleSaveListing.rejected.match(result)) {
      toast.error(result.payload || 'Failed to update saved listing');
    }
  };

  return (
    <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
      <Container>
        <MarketplaceToolbar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={handleCategoryChange}
          activeView="browse"
        />

        <section className="mt-6">
          <h2 className="mb-4 text-[16px] font-bold text-deep-blue">Featured listings</h2>

          {showSkeleton ? (
            <CardSkeleton
              variant="listing"
              count={GRID_PAGE_SIZE}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          ) : listingsError ? (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">Couldn&apos;t load listings</p>
              <button
                type="button"
                onClick={loadListings}
                className="mt-2 text-[14px] font-semibold text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : pageItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageItems.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  saved={listing.isSaved}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">No listings found</p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Try a different search or category filter.
              </p>
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        </section>
      </Container>
    </main>
  );
};

export default MarketplaceView;
