import { describe, expect, it } from "vitest";
import reducer from "./feedSlice";
import {
  fetchFeed,
  fetchMyPosts,
  removePost,
  repostPost,
  undoRepost,
} from "./feedThunks";
import { originalPost, repostOf } from "./feedRepostFixtures";

const meta = { page: 1, pageSize: 20, total: 1, totalPages: 1 };

const loaded = (posts = [originalPost()], myPosts = []) => {
  let state = reducer(undefined, { type: "@@init" });
  state = reducer(state, fetchFeed.pending("feed", {}));
  state = reducer(state, fetchFeed.fulfilled({ data: posts, meta }, "feed", {}));
  return reducer(state, fetchMyPosts.fulfilled({ data: myPosts, meta }, "mine"));
};

const byId = (list, id) => list.find((post) => post.id === id);

const reposted = (state) =>
  reducer(
    reducer(state, repostPost.pending("r1", { postId: "orig" })),
    repostPost.fulfilled(
      { reposted: true, originalPostId: "orig", shares: 1, post: repostOf(originalPost()) },
      "r1",
      { postId: "orig" },
    ),
  );

describe("feed repost state", () => {
  it("tracks the post being reposted while the request is pending", () => {
    const state = reducer(loaded(), repostPost.pending("r1", { postId: "orig" }));
    expect(state.repostingId).toBe("orig");
  });

  it("adds the saved repost to the feed and profile and uses the server count", () => {
    const state = reposted(loaded());

    expect(state.repostingId).toBeNull();
    expect(state.posts[0].id).toBe("rep");
    expect(byId(state.posts, "orig")).toMatchObject({
      sharedByMe: true,
      stats: { shares: 1 },
    });
    expect(state.myPosts[0].id).toBe("rep");
    expect(state.myPostsStale).toBe(true);
    expect(state.postsMeta.total).toBe(2);
  });

  it("does not duplicate the repost when the server returns an existing one", () => {
    const state = reposted(reposted(loaded()));
    expect(state.posts.filter((post) => post.id === "rep")).toHaveLength(1);
    expect(byId(state.posts, "orig").stats.shares).toBe(1);
  });

  it("leaves counts untouched when the server rejects the repost", () => {
    let state = reducer(loaded(), repostPost.pending("r1", { postId: "orig" }));
    state = reducer(
      state,
      repostPost.rejected(null, "r1", { postId: "orig" }, "Post not found"),
    );

    expect(state.repostingId).toBeNull();
    expect(state.error).toBeNull();
    expect(state.posts).toHaveLength(1);
    expect(byId(state.posts, "orig")).toMatchObject({
      sharedByMe: false,
      stats: { shares: 0 },
    });
  });

  it("removes the repost and restores the count on undo", () => {
    let state = reposted(loaded());
    state = reducer(
      state,
      undoRepost.fulfilled(
        { reposted: false, originalPostId: "orig", repostId: "rep", shares: 0 },
        "u1",
        { postId: "orig" },
      ),
    );

    expect(byId(state.posts, "rep")).toBeUndefined();
    expect(byId(state.myPosts, "rep")).toBeUndefined();
    expect(byId(state.posts, "orig")).toMatchObject({
      sharedByMe: false,
      stats: { shares: 0 },
    });
  });

  it("marks every card of the same original as shared", () => {
    const friendRepost = repostOf(originalPost(), { id: "friend-rep", sharedByMe: false });
    const state = reposted(loaded([originalPost(), friendRepost]));
    expect(byId(state.posts, "friend-rep").sharedByMe).toBe(true);
  });

  it("replaces local state with persisted counts after a reload", () => {
    const state = loaded(
      [originalPost({ sharedByMe: true, stats: { reactions: 0, comments: 0, shares: 3 } })],
      [repostOf(originalPost())],
    );
    expect(byId(state.posts, "orig")).toMatchObject({ sharedByMe: true, stats: { shares: 3 } });
    expect(state.myPosts.map((post) => post.id)).toEqual(["rep"]);
  });

  it("updates the original when the reposter deletes their repost", () => {
    const state = reducer(
      reposted(loaded()),
      removePost.fulfilled({ postId: "rep" }, "d1", "rep"),
    );
    expect(byId(state.posts, "rep")).toBeUndefined();
    expect(byId(state.posts, "orig")).toMatchObject({
      sharedByMe: false,
      stats: { shares: 0 },
    });
  });

  it("keeps reposts as unavailable when their original is deleted", () => {
    const state = reducer(
      loaded([originalPost(), repostOf(originalPost(), { sharedByMe: false })]),
      removePost.fulfilled({ postId: "orig" }, "d1", "orig"),
    );
    expect(byId(state.posts, "rep")).toMatchObject({
      isRepost: true,
      sharedPostId: null,
      sharedPost: null,
    });
  });
});
