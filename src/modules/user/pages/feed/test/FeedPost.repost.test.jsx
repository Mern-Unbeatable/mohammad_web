import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import ActivitySection from "@/components/data-display/ActivitySection/ActivitySection";
import { fetchFeed, fetchMyPosts, toFeedPostModel, userFeedReducer } from "@/features/user/feed";
import { userProfileReducer } from "@/features/user/profile";
import { originalPost, repostOf } from "@/features/user/feed/feedRepostFixtures";

const meta = { page: 1, pageSize: 5, total: 1, totalPages: 1 };

/** Simulates a page reload: a fresh store filled only from API responses. */
const reloadWith = ({ feed = [], mine = [] }) => {
  const store = configureStore({
    reducer: { userFeed: userFeedReducer, userProfile: userProfileReducer },
  });
  store.dispatch(fetchFeed.pending("feed", {}));
  store.dispatch(fetchFeed.fulfilled({ data: feed, meta }, "feed", {}));
  store.dispatch(fetchMyPosts.fulfilled({ data: mine, meta }, "mine"));
  return store;
};

const render = (store, list) =>
  renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter>
        <ActivitySection posts={store.getState().userFeed[list].map(toFeedPostModel)} />
      </MemoryRouter>
    </Provider>,
  );

describe("FeedPost reposts after reload", () => {
  it("shows the repost on the profile with attribution, caption and the original", () => {
    const store = reloadWith({ mine: [repostOf(originalPost())] });
    const html = render(store, "myPosts");

    expect(html).toContain("Sam Reed");
    expect(html).toContain("shared a post");
    expect(html).toContain("Worth a read");
    expect(html).toContain('aria-label="Original post by Anna Berg"');
    expect(html).toContain("Which centrifuge do you recommend?");
    expect(html).toContain("Question");
    expect(html).toContain(">Shared<");
  });

  it("shows the persisted share count and shared state on the original in the feed", () => {
    const store = reloadWith({
      feed: [originalPost({ sharedByMe: true, stats: { reactions: 0, comments: 0, shares: 2 } })],
    });
    const html = render(store, "posts");

    expect(html).toContain("2 shares");
    expect(html).toContain(">Shared<");
    expect(html).not.toContain("shared a post");
  });

  it("shows a placeholder when the original post was deleted", () => {
    const store = reloadWith({
      mine: [repostOf(originalPost(), { sharedPostId: null, sharedPost: null, sharedByMe: false })],
    });
    const html = render(store, "myPosts");

    expect(html).toContain("shared a post");
    expect(html).toContain("This post is no longer available");
    expect(html).not.toContain("Which centrifuge do you recommend?");
  });

  it("keeps an unshared post's button as Share", () => {
    const store = reloadWith({ feed: [originalPost()] });
    const html = render(store, "posts");

    expect(html).toContain("0 shares");
    expect(html).not.toContain(">Shared<");
  });
});
