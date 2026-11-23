import { describe, expect, it } from "vitest";
import { toFeedPostModel } from "./feedMappers";
import { originalPost, repostOf } from "./feedRepostFixtures";

describe("toFeedPostModel reposts", () => {
  it("maps a repost with its caption and the original post", () => {
    const model = toFeedPostModel(repostOf(originalPost()));

    expect(model).toMatchObject({
      id: "rep",
      type: "question",
      filter: "questions",
      isRepost: true,
      sharedByMe: true,
      content: "Worth a read",
      author: { name: "Sam Reed" },
      sharedPost: {
        id: "orig",
        type: "question",
        content: "Which centrifuge do you recommend?",
        author: { name: "Anna Berg", initials: "AB" },
      },
    });
  });

  it("reads the persisted share count", () => {
    const model = toFeedPostModel(
      originalPost({ stats: { reactions: 2, comments: 1, shares: 4 } }),
    );
    expect(model.stats.shares).toBe(4);
    expect(model.isRepost).toBe(false);
    expect(model.sharedPost).toBeNull();
  });

  it("keeps a repost whose original was deleted", () => {
    const model = toFeedPostModel(
      repostOf(originalPost(), { sharedPostId: null, sharedPost: null }),
    );
    expect(model).toMatchObject({ isRepost: true, sharedPost: null });
  });
});
