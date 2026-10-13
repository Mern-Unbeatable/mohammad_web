import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Container from "@/components/ui/Container";
import { CardSkeleton } from "@/components/common/Skeleton";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import ListingCard from "@/components/data-display/ListingCard/ListingCard";
import MarketplaceToolbar from "@/modules/user/components/marketplace/MarketplaceToolbar";
import {
  fetchListings,
  removeListing,
  clearMarketplaceError,
  categoryToApi,
  toListingCardModel,
} from "@/features/user/marketplace";
import { GRID_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const buildMineQuery = ({ query, category }) => {
  const params = {
    page: 1,
    pageSize: GRID_PAGE_SIZE * 3,
    sort: "desc",
    mine: true,
  };
  const q = query?.trim();
  if (q) params.search = q;
  const categoryApi = categoryToApi(category);
  if (categoryApi) params.category = categoryApi;
  return params;
};

const MyListingsView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { listings, listingsLoading, deleting, error } = useSelector(
    (state) => state.userMarketplace,
  );

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    dispatch(clearMarketplaceError());
    dispatch(
      fetchListings(buildMineQuery({ query: debouncedQuery, category })),
    );
  }, [dispatch, debouncedQuery, category]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filtered = useMemo(
    () => (listings || []).map(toListingCardModel).filter(Boolean),
    [listings],
  );

  const handleEdit = (id) => {
    if (!id) return;
    navigate(`/marketplace/${id}/edit`);
  };

  const handleDeleteRequest = (id) => {
    if (deleting) return;
    const listing = filtered.find((item) => item.id === id);
    if (!listing) return;
    setPendingDelete(listing);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(removeListing(pendingDelete.id));
    if (removeListing.fulfilled.match(result)) {
      toast.success("Listing removed");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete listing");
  };

  return (
    <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
      <Container>
        <MarketplaceToolbar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          activeView="mine"
        />

        <section className="mt-6">
          <h2 className="mb-4 text-[16px] font-bold text-deep-blue">
            My listings
          </h2>

          {listingsLoading ? (
            <CardSkeleton
              variant="listing"
              count={GRID_PAGE_SIZE}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  variant="mine"
                  onEdit={handleEdit}
                  onDelete={deleting ? undefined : handleDeleteRequest}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">
                No listings yet
              </p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Create your first listing to sell laboratory equipment to
                verified members.
              </p>
            </div>
          )}
        </section>
      </Container>

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete listing?"
        description={
          pendingDelete ? (
            <p className="text-[14px] leading-relaxed text-[#64748B]">
              This will permanently remove{" "}
              <span className="font-semibold text-deep-blue">
                {pendingDelete.title || "this listing"}
              </span>
              . This action cannot be undone.
            </p>
          ) : null
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirming={deleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
};

export default MyListingsView;
