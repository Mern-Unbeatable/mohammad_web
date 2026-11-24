import { describe, expect, it } from "vitest";
import reducer from "./marketplaceSlice";
import { fetchListings } from "./marketplaceThunks";

const initial = reducer(undefined, { type: "@@init" });
const page = (n) => ({
  data: [{ id: `p${n}` }],
  meta: { page: n, pageSize: 8, total: 20, totalPages: 3 },
});

describe("marketplace listings pagination state", () => {
  it("shows the latest requested page even if an older response arrives last", () => {
    let state = reducer(initial, fetchListings.pending("req-1", { page: 1 }));
    state = reducer(state, fetchListings.pending("req-2", { page: 2 }));
    state = reducer(state, fetchListings.fulfilled(page(2), "req-2", { page: 2 }));
    state = reducer(state, fetchListings.fulfilled(page(1), "req-1", { page: 1 }));

    expect(state.listings).toEqual([{ id: "p2" }]);
    expect(state.listingsMeta.page).toBe(2);
    expect(state.listingsLoading).toBe(false);
  });

  it("records list failures and clears them on the next request", () => {
    let state = reducer(initial, fetchListings.pending("req-1", { page: 2 }));
    state = reducer(state, fetchListings.rejected(null, "req-1", { page: 2 }, "Network Error"));
    expect(state.listingsError).toBe("Network Error");
    expect(state.listingsLoading).toBe(false);

    state = reducer(state, fetchListings.pending("req-2", { page: 2 }));
    expect(state.listingsError).toBeNull();
  });

  it("ignores a failure from a request the user already left", () => {
    let state = reducer(initial, fetchListings.pending("req-1", { page: 1 }));
    state = reducer(state, fetchListings.pending("req-2", { page: 2 }));
    state = reducer(state, fetchListings.rejected(null, "req-1", { page: 1 }, "Network Error"));

    expect(state.listingsError).toBeNull();
    expect(state.listingsLoading).toBe(true);
  });
});
