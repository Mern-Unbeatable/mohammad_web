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

describe("toFeedPostModel media URLs", () => {
  it("names a document from its URL, ignoring the query string", () => {
    const model = toFeedPostModel(
      originalPost({ documentUrl: "https://cdn.test/uploads/Lab%20report.pdf?v=2" }),
    );
    expect(model.attachment).toEqual({
      name: "Lab report.pdf",
      meta: "Document",
      url: "https://cdn.test/uploads/Lab%20report.pdf?v=2",
    });
  });

  it("doesn't throw on a malformed %-escape in a document URL", () => {
    const url = "https://cdn.test/uploads/report%E0%A4%A.pdf";
    const model = toFeedPostModel(originalPost({ documentUrl: url }));
    expect(model.attachment).toMatchObject({ name: "report%E0%A4%A.pdf", url });
  });

  it("drops non-http(s) document and image URLs", () => {
    const model = toFeedPostModel(
      originalPost({
        documentUrl: "javascript:alert(1)",
        imageUrls: ["data:image/svg+xml,<svg/>", "https://cdn.test/a.png", "/uploads/b.png"],
      }),
    );
    expect(model.attachment).toBeNull();
    expect(model.images).toEqual(["https://cdn.test/a.png", "/uploads/b.png"]);
    expect(model.image).toBe("https://cdn.test/a.png");
  });

  it("clears an unsafe URL on a provided attachment but keeps its name", () => {
    const model = toFeedPostModel(
      originalPost({ attachment: { name: "x.pdf", meta: "1 KB", url: "javascript:alert(1)" } }),
    );
    expect(model.attachment).toEqual({ name: "x.pdf", meta: "1 KB", url: null });
  });

  it("applies the same rules to the original inside a repost", () => {
    const model = toFeedPostModel(
      repostOf(originalPost({ documentUrl: "javascript:alert(1)" })),
    );
    expect(model.sharedPost.attachment).toBeNull();
  });
});
