import { describe, expect, it } from "vitest";
import reducer from "./feedSlice";
import { fetchFeed, fetchMyPosts, updatePost } from "./feedThunks";
import { getPostImageUrls, toFeedPostModel, toUpdatePostPayload } from "./feedMappers";
import { originalPost, repostOf } from "./feedRepostFixtures";

const meta = { page: 1, pageSize: 20, total: 1, totalPages: 1 };
const args = { postId: "orig", payload: { content: "Edited" } };

const loaded = (posts, myPosts = []) => {
  let state = reducer(undefined, { type: "@@init" });
  state = reducer(state, fetchFeed.pending("feed", {}));
  state = reducer(state, fetchFeed.fulfilled({ data: posts, meta }, "feed", {}));
  return reducer(state, fetchMyPosts.fulfilled({ data: myPosts, meta }, "mine"));
};

const edited = (overrides = {}) =>
  originalPost({
    content: "Edited",
    editedAt: "2026-10-12T09:00:00.000Z",
    stats: { reactions: 3, comments: 1, shares: 1 },
    ...overrides,
  });

describe("feed post edit state", () => {
  it("replaces the edited post in place in every list", () => {
    const other = originalPost({ id: "other", content: "Other" });
    let state = loaded([other, originalPost()], [originalPost()]);
    state = reducer(state, updatePost.pending("u1", args));
    expect(state.saving).toBe(true);

    state = reducer(state, updatePost.fulfilled(edited(), "u1", args));
    expect(state.saving).toBe(false);
    expect(state.posts.map((post) => post.id)).toEqual(["other", "orig"]);
    expect(state.posts[1].content).toBe("Edited");
    expect(state.posts[1].stats.reactions).toBe(3);
    expect(state.myPosts[0].content).toBe("Edited");
  });

  it("doesn't add a post that isn't in a list", () => {
    const other = originalPost({ id: "other" });
    const state = reducer(
      loaded([other]),
      updatePost.fulfilled(edited(), "u1", args),
    );
    expect(state.posts.map((post) => post.id)).toEqual(["other"]);
  });

  it("refreshes the original shown inside reposts", () => {
    const state = reducer(
      loaded([repostOf(originalPost()), originalPost()]),
      updatePost.fulfilled(
        edited({ imageUrl: "https://cdn/x.png", imageUrls: ["https://cdn/x.png", "https://cdn/y.png"] }),
        "u1",
        args,
      ),
    );
    const repost = state.posts.find((post) => post.id === "rep");
    expect(repost.content).toBe("Worth a read");
    expect(repost.sharedPost.content).toBe("Edited");
    expect(repost.sharedPost.imageUrls).toEqual(["https://cdn/x.png", "https://cdn/y.png"]);
    expect(repost.sharedPost.author.id).toBe("anna");
  });

  it("leaves the page-level error unset when saving fails", () => {
    let state = reducer(loaded([originalPost()]), updatePost.pending("u1", args));
    state = reducer(
      state,
      updatePost.rejected(new Error("x"), "u1", args, "Post not found"),
    );
    expect(state.saving).toBe(false);
    expect(state.error).toBeNull();
    expect(state.posts[0].content).toBe("Which centrifuge do you recommend?");
  });
});

describe("toFeedPostModel edited flag", () => {
  it("marks posts the server reports as edited", () => {
    expect(toFeedPostModel(edited()).edited).toBe(true);
    expect(toFeedPostModel(originalPost()).edited).toBe(false);
  });
});

describe("post images", () => {
  it("maps every image and keeps the first as the cover", () => {
    const model = toFeedPostModel(
      originalPost({ imageUrl: "https://cdn/a.png", imageUrls: ["https://cdn/a.png", "https://cdn/b.png"] }),
    );
    expect(model.images).toEqual(["https://cdn/a.png", "https://cdn/b.png"]);
    expect(model.image).toBe("https://cdn/a.png");
  });

  it("falls back to the older single imageUrl", () => {
    expect(getPostImageUrls(originalPost({ imageUrl: "https://cdn/old.png" }))).toEqual([
      "https://cdn/old.png",
    ]);
    expect(getPostImageUrls(originalPost())).toEqual([]);
  });
});

describe("toUpdatePostPayload", () => {
  const A = "https://cdn/a.png";
  const B = "https://cdn/b.png";
  const original = originalPost({
    content: "Hello",
    imageUrl: A,
    imageUrls: [A, B],
    documentUrl: "https://cdn/a.pdf",
  });
  const same = { content: "Hello", imageUrls: [A, B], documentUrl: "https://cdn/a.pdf" };

  it("is empty when nothing changed", () => {
    expect(toUpdatePostPayload(original, { ...same, content: "  Hello " })).toEqual({});
  });

  it("sends only the changed fields", () => {
    expect(toUpdatePostPayload(original, { ...same, content: "Hi" })).toEqual({
      content: "Hi",
    });
    expect(
      toUpdatePostPayload(original, { ...same, imageUrls: [A, B, "https://cdn/c.png"] }),
    ).toEqual({ imageUrls: [A, B, "https://cdn/c.png"] });
  });

  it("sends the new list when an image is removed or reordered", () => {
    expect(toUpdatePostPayload(original, { ...same, imageUrls: [B] })).toEqual({ imageUrls: [B] });
    expect(toUpdatePostPayload(original, { ...same, imageUrls: [B, A] })).toEqual({
      imageUrls: [B, A],
    });
  });

  it("sends an empty list and null when every attachment is removed", () => {
    expect(
      toUpdatePostPayload(original, { content: "Hello", imageUrls: [], documentUrl: null }),
    ).toEqual({ imageUrls: [], documentUrl: null });
  });

  it("sends a repost's caption and attachment changes", () => {
    const repost = repostOf(originalPost());
    expect(
      toUpdatePostPayload(repost, {
        content: "",
        imageUrls: [B],
        documentUrl: "https://cdn/b.pdf",
      }),
    ).toEqual({ content: "", imageUrls: [B], documentUrl: "https://cdn/b.pdf" });

    const withImage = repostOf(originalPost(), { imageUrl: B, imageUrls: [B] });
    expect(
      toUpdatePostPayload(withImage, { content: "Worth a read", imageUrls: [] }),
    ).toEqual({ imageUrls: [] });
  });
});
