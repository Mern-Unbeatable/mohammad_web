import { beforeEach, describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

vi.mock("./feedApi", () => ({
  getFeed: vi.fn(),
  getApiErrorMessage: (_err, fallback) => fallback,
}));

import * as feedApi from "./feedApi";
import reducer from "./feedSlice";
import {
  addComment,
  createPost,
  fetchAuthorPosts,
  fetchFeed,
  fetchMoreFeed,
  fetchMoreMyPosts,
  fetchMyPosts,
  reactToPost,
  removePost,
} from "./feedThunks";
import { logoutUser } from "@/features/auth/authThunks";

const ME = "viewer";
const ALICE = "alice";
const BOB = "bob";

const post = (id, authorId = ALICE) => ({
  id,
  author: { id: authorId, name: authorId },
  content: `post ${id}`,
  comments: [],
  stats: { reactions: 0, comments: 0, shares: 0 },
});

const page = (ids, pageNumber, totalPages, authorId) => ({
  data: ids.map((id) => post(id, authorId)),
  meta: { page: pageNumber, pageSize: ids.length, total: totalPages * 2, totalPages },
});

const ids = (list) => list.map((row) => row.id);

const init = () => reducer(undefined, { type: "@@init" });

const feedLoaded = (state = init()) => {
  state = reducer(state, fetchFeed.pending("feed-1", { page: 1 }));
  return reducer(state, fetchFeed.fulfilled(page(["p1", "p2"], 1, 3), "feed-1", { page: 1 }));
};

const authorLoaded = (authorId = ALICE, state = init()) => {
  const arg = { authorId };
  state = reducer(state, fetchAuthorPosts.pending("author-1", arg));
  return reducer(
    state,
    fetchAuthorPosts.fulfilled(page(["a1", "a2"], 1, 2, authorId), "author-1", arg),
  );
};

describe("home feed pagination", () => {
  it("appends the next page and reports whether more pages remain", () => {
    let state = feedLoaded();
    const arg = { page: 2 };
    state = reducer(state, fetchMoreFeed.pending("more-1", arg));
    expect(state.postsLoadingMore).toBe(true);

    state = reducer(state, fetchMoreFeed.fulfilled(page(["p3", "p4"], 2, 3), "more-1", arg));

    expect(ids(state.posts)).toEqual(["p1", "p2", "p3", "p4"]);
    expect(state.postsMeta).toMatchObject({ page: 2, totalPages: 3 });
    expect(state.postsLoadingMore).toBe(false);
  });

  it("skips posts already shown when a new post shifted the next page", () => {
    let state = feedLoaded();
    state = reducer(state, fetchMoreFeed.pending("more-1", { page: 2 }));
    state = reducer(
      state,
      fetchMoreFeed.fulfilled(page(["p2", "p3"], 2, 3), "more-1", { page: 2 }),
    );

    expect(ids(state.posts)).toEqual(["p1", "p2", "p3"]);
  });

  it("ignores a next page that arrives after the filter changed", () => {
    let state = feedLoaded();
    state = reducer(state, fetchMoreFeed.pending("more-1", { page: 2 }));
    state = reducer(state, fetchFeed.pending("feed-2", { page: 1, type: "question" }));
    state = reducer(
      state,
      fetchFeed.fulfilled(page(["q1"], 1, 1), "feed-2", { page: 1, type: "question" }),
    );
    state = reducer(
      state,
      fetchMoreFeed.fulfilled(page(["p3", "p4"], 2, 3), "more-1", { page: 2 }),
    );

    expect(ids(state.posts)).toEqual(["q1"]);
    expect(state.postsMeta.totalPages).toBe(1);
    expect(state.postsLoadingMore).toBe(false);
  });
});

describe("own profile pagination", () => {
  it("appends older posts after the first page", () => {
    let state = reducer(init(), fetchMyPosts.fulfilled(page(["m1", "m2"], 1, 2, ME), "mine"));
    state = reducer(state, fetchMoreMyPosts.pending("mine-2"));
    expect(state.myPostsLoadingMore).toBe(true);

    state = reducer(
      state,
      fetchMoreMyPosts.fulfilled(page(["m2", "m3"], 2, 2, ME), "mine-2"),
    );

    expect(ids(state.myPosts)).toEqual(["m1", "m2", "m3"]);
    expect(state.myPostsMeta.page).toBe(2);
    expect(state.myPostsLoadingMore).toBe(false);
  });
});

describe("member profile posts", () => {
  it("loads the member's first page and appends later pages without duplicates", () => {
    let state = authorLoaded();
    expect(state.authorPostsAuthorId).toBe(ALICE);
    expect(ids(state.authorPosts)).toEqual(["a1", "a2"]);

    const arg = { authorId: ALICE, page: 2 };
    state = reducer(state, fetchAuthorPosts.pending("author-2", arg));
    expect(state.authorPostsLoadingMore).toBe(true);
    state = reducer(
      state,
      fetchAuthorPosts.fulfilled(page(["a2", "a3"], 2, 2, ALICE), "author-2", arg),
    );

    expect(ids(state.authorPosts)).toEqual(["a1", "a2", "a3"]);
    expect(state.authorPostsMeta.page).toBe(2);
  });

  it("clears the previous member's posts and ignores their late response", () => {
    let state = init();
    state = reducer(state, fetchAuthorPosts.pending("alice", { authorId: ALICE }));
    state = authorLoaded(BOB, state);
    state = reducer(
      state,
      fetchAuthorPosts.fulfilled(page(["a1"], 1, 1, ALICE), "alice", { authorId: ALICE }),
    );

    expect(state.authorPostsAuthorId).toBe(BOB);
    expect(state.authorPosts.every((row) => row.author.id === BOB)).toBe(true);
  });

  it("starts empty when switching to another member", () => {
    let state = authorLoaded(ALICE);
    state = reducer(state, fetchAuthorPosts.pending("bob", { authorId: BOB }));

    expect(state.authorPosts).toEqual([]);
    expect(state.authorPostsLoading).toBe(true);
  });

  it("keeps reactions and comments in sync on profile posts", () => {
    let state = authorLoaded();
    state = reducer(
      state,
      reactToPost.fulfilled(
        { postId: "a1", type: "like", data: { myReaction: "like", reactionCount: 1 } },
        "react",
        { postId: "a1", type: "like" },
      ),
    );
    state = reducer(
      state,
      addComment.fulfilled(
        { postId: "a1", comment: { id: "c1", content: "Nice" }, parentCommentId: null },
        "comment",
        { postId: "a1", body: "Nice" },
      ),
    );

    const [first] = state.authorPosts;
    expect(first).toMatchObject({ myReaction: "like", stats: { reactions: 1, comments: 1 } });
    expect(ids(first.comments)).toEqual(["c1"]);
  });

  it("adds the viewer's new post only to their own profile list", () => {
    const created = post("new", ME);

    const onOwnList = reducer(authorLoaded(ME), createPost.fulfilled(created, "create", {}));
    const onOtherList = reducer(authorLoaded(ALICE), createPost.fulfilled(created, "create", {}));

    expect(ids(onOwnList.authorPosts)).toEqual(["new", "a1", "a2"]);
    expect(ids(onOtherList.authorPosts)).toEqual(["a1", "a2"]);
  });

  it("drops a deleted post from the profile list", () => {
    const state = reducer(authorLoaded(), removePost.fulfilled({ postId: "a1" }, "rm", "a1"));
    expect(ids(state.authorPosts)).toEqual(["a2"]);
  });

  it("forgets profile posts when the viewer signs out", () => {
    const state = reducer(authorLoaded(), logoutUser.fulfilled(undefined, "logout"));
    expect(state.authorPosts).toEqual([]);
    expect(state.authorPostsAuthorId).toBeNull();
  });
});

describe("feed thunks", () => {
  const makeStore = () => configureStore({ reducer: { userFeed: reducer } });

  beforeEach(() => {
    feedApi.getFeed.mockReset();
  });

  it("requests one member's posts by author id, newest first", async () => {
    feedApi.getFeed.mockResolvedValue(page(["a1"], 1, 1, ALICE));
    const store = makeStore();

    await store.dispatch(fetchAuthorPosts({ authorId: ALICE }));

    expect(feedApi.getFeed).toHaveBeenCalledWith({
      authorId: ALICE,
      page: 1,
      pageSize: 10,
      sort: "desc",
    });
    expect(ids(store.getState().userFeed.authorPosts)).toEqual(["a1"]);
  });

  it("does not request posts without an author id", async () => {
    await makeStore().dispatch(fetchAuthorPosts({ authorId: undefined }));
    expect(feedApi.getFeed).not.toHaveBeenCalled();
  });

  it("requests the page after the last one loaded for the own profile", async () => {
    feedApi.getFeed
      .mockResolvedValueOnce(page(["m1"], 1, 2, ME))
      .mockResolvedValueOnce(page(["m2"], 2, 2, ME));
    const store = makeStore();

    await store.dispatch(fetchMyPosts());
    await store.dispatch(fetchMoreMyPosts());

    expect(feedApi.getFeed).toHaveBeenLastCalledWith(
      expect.objectContaining({ mine: true, page: 2 }),
    );
    expect(ids(store.getState().userFeed.myPosts)).toEqual(["m1", "m2"]);
  });

  it("does not load more while the first feed page is still loading", async () => {
    let resolveFirst;
    feedApi.getFeed.mockImplementationOnce(
      () => new Promise((resolve) => (resolveFirst = resolve)),
    );
    const store = makeStore();

    const first = store.dispatch(fetchFeed({ page: 1 }));
    await store.dispatch(fetchMoreFeed({ page: 2 }));
    expect(feedApi.getFeed).toHaveBeenCalledTimes(1);

    resolveFirst(page(["p1"], 1, 2));
    await first;
  });
});
