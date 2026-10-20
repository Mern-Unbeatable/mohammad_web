import { describe, expect, it } from "vitest";
import reducer from "./feedSlice";
import { editComment, fetchFeed, fetchMyPosts, removeComment } from "./feedThunks";
import { anna, originalPost, sam } from "./feedRepostFixtures";

const meta = { page: 1, pageSize: 20, total: 1, totalPages: 1 };

const comment = (id, overrides = {}) => ({
  id,
  content: `Comment ${id}`,
  createdAt: "2026-10-02T10:00:00.000Z",
  parentCommentId: null,
  author: anna,
  likeCount: 1,
  liked: true,
  replies: [],
  ...overrides,
});

const postWithThread = () =>
  originalPost({
    stats: { reactions: 0, comments: 4, shares: 0 },
    comments: [
      comment("c1", {
        replies: [
          comment("r1", { parentCommentId: "c1", author: sam }),
          comment("r2", { parentCommentId: "c1" }),
        ],
      }),
      comment("c2"),
    ],
  });

const loaded = () => {
  let state = reducer(undefined, { type: "@@init" });
  state = reducer(state, fetchFeed.pending("feed", {}));
  state = reducer(state, fetchFeed.fulfilled({ data: [postWithThread()], meta }, "feed", {}));
  return reducer(
    state,
    fetchMyPosts.fulfilled({ data: [postWithThread()], meta }, "mine"),
  );
};

const editArgs = (commentId, body) => ({ postId: "orig", commentId, body });

describe("comment edit state", () => {
  it("updates only the edited comment's text, keeping likes and replies", () => {
    const state = reducer(
      loaded(),
      editComment.fulfilled(
        { postId: "orig", commentId: "c1", comment: { id: "c1", content: "Edited root" } },
        "e1",
        editArgs("c1", "Edited root"),
      ),
    );

    for (const post of [state.posts[0], state.myPosts[0]]) {
      const [root, other] = post.comments;
      expect(root).toMatchObject({ content: "Edited root", likeCount: 1, liked: true });
      expect(root.replies.map((r) => r.content)).toEqual(["Comment r1", "Comment r2"]);
      expect(other.content).toBe("Comment c2");
      expect(post.stats.comments).toBe(4);
    }
  });

  it("edits a reply inside its thread", () => {
    const state = reducer(
      loaded(),
      editComment.fulfilled(
        { postId: "orig", commentId: "r2", comment: { id: "r2", content: "Edited reply" } },
        "e1",
        editArgs("r2", "Edited reply"),
      ),
    );
    expect(state.posts[0].comments[0].replies[1].content).toBe("Edited reply");
    expect(state.posts[0].comments[0].content).toBe("Comment c1");
  });

  it("leaves comments and the shared error untouched when the edit fails", () => {
    const before = loaded();
    const state = reducer(
      before,
      editComment.rejected(null, "e1", editArgs("c1", "x"), "You can only edit your own comments"),
    );
    expect(state.posts).toEqual(before.posts);
    expect(state.error).toBeNull();
  });
});

describe("comment delete state", () => {
  const removed = (commentId, commentCount) =>
    removeComment.fulfilled(
      {
        postId: "orig",
        commentId,
        data: commentCount === undefined ? { message: "Comment deleted" } : { commentCount },
      },
      "d1",
      { postId: "orig", commentId },
    );

  it("removes a root comment with its replies and uses the server's count", () => {
    const state = reducer(loaded(), removed("c1", 1));

    expect(state.posts[0].comments.map((c) => c.id)).toEqual(["c2"]);
    expect(state.posts[0].stats.comments).toBe(1);
    expect(state.myPosts[0].stats.comments).toBe(1);
  });

  it("removes a single reply and counts locally without a server count", () => {
    const state = reducer(loaded(), removed("r1"));

    const root = state.posts[0].comments[0];
    expect(root.replies.map((r) => r.id)).toEqual(["r2"]);
    expect(root.replyCount).toBe(1);
    expect(state.posts[0].stats.comments).toBe(3);
  });

  it("keeps the comment when the delete fails", () => {
    const before = loaded();
    const state = reducer(
      before,
      removeComment.rejected(
        null,
        "d1",
        { postId: "orig", commentId: "c1" },
        "You can only delete your own comments",
      ),
    );
    expect(state.posts).toEqual(before.posts);
    expect(state.commenting).toBe(false);
    expect(state.error).toBeNull();
  });
});
