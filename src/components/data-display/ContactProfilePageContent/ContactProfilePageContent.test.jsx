import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import ContactProfilePageContent from "./ContactProfilePageContent";
import { fetchAuthorPosts, toFeedPostModel, userFeedReducer } from "@/features/user/feed";
import { userProfileReducer } from "@/features/user/profile";
import { originalPost } from "@/features/user/feed/feedRepostFixtures";

const contact = {
  id: "anna",
  name: "Anna Berg",
  about: "Lab manager",
  company: "Berg Labs",
  country: "Sweden",
  email: "anna@example.com",
  phone: "",
};

/** A store filled only from the profile-posts API response, as after visiting the page. */
const profileWith = (posts, totalPages = 1) => {
  const store = configureStore({
    reducer: { userFeed: userFeedReducer, userProfile: userProfileReducer },
  });
  const arg = { authorId: contact.id };
  store.dispatch(fetchAuthorPosts.pending("author", arg));
  store.dispatch(
    fetchAuthorPosts.fulfilled(
      { data: posts, meta: { page: 1, pageSize: 10, total: posts.length, totalPages } },
      "author",
      arg,
    ),
  );
  return store;
};

const render = (store, props = {}) => {
  const { authorPosts, authorPostsMeta } = store.getState().userFeed;
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter>
        <ContactProfilePageContent
          contact={contact}
          posts={authorPosts.map(toFeedPostModel)}
          hasMorePosts={authorPostsMeta.page < authorPostsMeta.totalPages}
          onLoadMorePosts={() => {}}
          {...props}
        />
      </MemoryRouter>
    </Provider>,
  );
};

describe("ContactProfilePageContent activity", () => {
  it("shows the member's posts instead of the empty state", () => {
    const html = render(profileWith([originalPost()]));

    expect(html).toContain("Which centrifuge do you recommend?");
    expect(html).toContain("Anna Berg");
    expect(html).not.toContain("No activity yet");
    expect(html).not.toContain("Show more posts");
  });

  it("offers older posts when the member has more pages", () => {
    const html = render(profileWith([originalPost()], 2));
    expect(html).toContain("Show more posts");
  });

  it("shows a loading skeleton, not the empty state, while posts load", () => {
    const html = render(profileWith([]), { posts: [], postsLoading: true });
    expect(html).not.toContain("No activity yet");
  });

  it("shows the empty state for a member without posts", () => {
    const html = render(profileWith([]));
    expect(html).toContain("No activity yet");
    expect(html).toContain("Anna hasn&#x27;t shared any posts");
  });
});
