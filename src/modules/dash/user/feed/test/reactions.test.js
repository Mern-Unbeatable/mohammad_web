import { describe, expect, it } from "vitest";
import {
  applyReaction,
  nextReactionTotal,
  planReaction,
  reactionFromResponse,
  reconcileReaction,
  rollbackReaction,
  toApiReaction,
  visibleReactors,
} from "../utils/reactions";

describe("visibleReactors", () => {
  const me = { id: "me", name: "Me" };
  const people = ["a", "b", "c"].map((id) => ({ id, name: id }));

  it("puts the viewer first while they have a reaction and caps the stack", () => {
    expect(visibleReactors(people, me, true).map((p) => p.id)).toEqual(["me", "a", "b"]);
  });

  it("drops the viewer once their reaction is removed", () => {
    expect(visibleReactors([me, ...people], me, false).map((p) => p.id)).toEqual(["a", "b", "c"]);
  });

  it("handles a post without reactor data", () => {
    expect(visibleReactors(undefined, me, false)).toEqual([]);
  });
});

const engagement = (overrides = {}) => ({
  reactionId: null,
  stats: { reactions: 3, comments: 2, shares: 0 },
  reactionCounts: null,
  comments: [{ id: "c1" }],
  ...overrides,
});

describe("toApiReaction", () => {
  it("maps current and legacy ids, defaulting to like", () => {
    expect(toApiReaction("love")).toBe("love");
    expect(toApiReaction("celebrate")).toBe("haha");
    expect(toApiReaction("curious")).toBe("angry");
    expect(toApiReaction("unknown")).toBe("like");
  });
});

describe("planReaction", () => {
  it("adds, switches and removes like the server's toggle", () => {
    expect(planReaction(null, "like")).toEqual({ nextId: "like", apiType: "like" });
    expect(planReaction("like", "love")).toEqual({ nextId: "love", apiType: "love" });
    expect(planReaction("love", "love")).toEqual({ nextId: null, apiType: "love" });
  });

  it("removes with the current type when the button clears (picked = null)", () => {
    expect(planReaction("wow", null)).toEqual({ nextId: null, apiType: "wow" });
  });

  it("sends nothing when clearing without a reaction", () => {
    expect(planReaction(null, null).apiType).toBeNull();
  });
});

describe("nextReactionTotal", () => {
  it("counts adds and removals but not switches", () => {
    expect(nextReactionTotal(3, null, "like")).toBe(4);
    expect(nextReactionTotal(3, "like", null)).toBe(2);
    expect(nextReactionTotal(3, "like", "love")).toBe(3);
    expect(nextReactionTotal(0, "like", null)).toBe(0);
  });
});

describe("reaction state transitions", () => {
  it("applies an optimistic reaction", () => {
    const next = applyReaction(engagement(), "like");
    expect(next.reactionId).toBe("like");
    expect(next.stats).toEqual({ reactions: 4, comments: 2, shares: 0 });
  });

  it("rolls back only the reaction fields, keeping newer comments and counts", () => {
    const previous = engagement();
    const optimistic = applyReaction(previous, "like");
    const meanwhile = {
      ...optimistic,
      comments: [{ id: "c1" }, { id: "c2" }],
      stats: { ...optimistic.stats, comments: 3 },
    };

    const rolledBack = rollbackReaction(meanwhile, previous);
    expect(rolledBack.reactionId).toBeNull();
    expect(rolledBack.stats).toEqual({ reactions: 3, comments: 3, shares: 0 });
    expect(rolledBack.comments).toHaveLength(2);
  });

  it("takes the server's reaction, total and per-type counts", () => {
    const counts = { like: 4, love: 1 };
    const next = reconcileReaction(applyReaction(engagement(), "like"), {
      myReaction: "LOVE",
      reactionCount: 5,
      reactionCounts: counts,
    });
    expect(next.reactionId).toBe("love");
    expect(next.stats.reactions).toBe(5);
    expect(next.reactionCounts).toBe(counts);
  });

  it("keeps the optimistic values when the response omits them", () => {
    const optimistic = applyReaction(engagement(), "like");
    expect(reconcileReaction(optimistic, {})).toMatchObject({
      reactionId: null,
      stats: { reactions: 4 },
    });
    expect(reconcileReaction(optimistic, undefined)).toBe(optimistic);
  });
});

describe("reactionFromResponse", () => {
  it("reads myReaction, the legacy reacted/type pair, or nothing", () => {
    expect(reactionFromResponse({ myReaction: null })).toBeNull();
    expect(reactionFromResponse({ reacted: true, type: "SAD" })).toBe("sad");
    expect(reactionFromResponse({ reacted: false, type: "sad" })).toBeNull();
    expect(reactionFromResponse(undefined)).toBeUndefined();
  });
});
