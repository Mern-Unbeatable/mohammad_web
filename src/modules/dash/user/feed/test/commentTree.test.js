import { describe, expect, it } from "vitest";
import {
  findComment,
  findRootId,
  removeComment,
  selectPreview,
  updateComment,
} from "../utils/commentTree";

const reply = (id) => ({ id, content: id, replies: [] });
const thread = () => [
  { id: "a", content: "a", replies: [reply("a1"), reply("a2")], replyCount: 2 },
  { id: "b", content: "b", replies: [], replyCount: 0 },
];

describe("findComment", () => {
  it("finds top-level comments and replies", () => {
    expect(findComment(thread(), "b").id).toBe("b");
    expect(findComment(thread(), "a2").id).toBe("a2");
  });

  it("returns null for unknown ids or a missing list", () => {
    expect(findComment(thread(), "zz")).toBeNull();
    expect(findComment(undefined, "a")).toBeNull();
  });
});

describe("findRootId", () => {
  it("maps a reply to its top-level comment", () => {
    expect(findRootId(thread(), "a2")).toBe("a");
    expect(findRootId(thread(), "b")).toBe("b");
  });

  it("falls back to the id itself when it isn't in the tree", () => {
    expect(findRootId(thread(), "zz")).toBe("zz");
  });
});

describe("updateComment", () => {
  it("updates a nested reply without mutating the input", () => {
    const before = thread();
    const after = updateComment(before, "a1", (c) => ({ ...c, content: "edited" }));
    expect(after[0].replies[0].content).toBe("edited");
    expect(before[0].replies[0].content).toBe("a1");
    expect(after[1]).toBe(before[1]);
  });
});

describe("removeComment", () => {
  it("removes a top-level comment and counts its replies", () => {
    const { comments, removedCount } = removeComment(thread(), "a");
    expect(comments.map((c) => c.id)).toEqual(["b"]);
    expect(removedCount).toBe(3);
  });

  it("removes a reply and updates the parent's reply count", () => {
    const { comments, removedCount } = removeComment(thread(), "a1");
    expect(comments[0].replies.map((r) => r.id)).toEqual(["a2"]);
    expect(comments[0].replyCount).toBe(1);
    expect(removedCount).toBe(1);
  });

  it("leaves the tree unchanged for unknown ids", () => {
    const { comments, removedCount } = removeComment(thread(), "zz");
    expect(comments).toEqual(thread());
    expect(removedCount).toBe(0);
  });
});

describe("selectPreview", () => {
  const list = ["c1", "c2", "c3", "c4", "c5", "c6"].map((id) => ({ id }));
  const ids = (items) => items.map((c) => c.id);

  it("returns everything without a limit or when under it", () => {
    expect(selectPreview(list, undefined)).toBe(list);
    expect(selectPreview(list.slice(0, 3), 4)).toHaveLength(3);
  });

  it("keeps the oldest `limit` comments", () => {
    expect(ids(selectPreview(list, 4))).toEqual(["c1", "c2", "c3", "c4"]);
  });

  it("also keeps the newest comments added from this preview", () => {
    expect(ids(selectPreview(list, 4, 1))).toEqual(["c1", "c2", "c3", "c4", "c6"]);
    expect(ids(selectPreview(list, 4, 5))).toEqual(ids(list));
  });
});
