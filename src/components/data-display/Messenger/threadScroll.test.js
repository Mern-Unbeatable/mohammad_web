import { describe, expect, it } from "vitest";
import {
  arrivalAnnouncement,
  isNearBottom,
  newMessagesLabel,
  threadScrollAction,
} from "./threadScroll";

const msg = (id, from = "them") => ({ id, from });
const snapshotOf = (chatId, messages) => ({
  chatId,
  firstId: messages[0]?.id ?? null,
  lastId: messages[messages.length - 1]?.id ?? null,
  count: messages.length,
});

const base = [msg("1"), msg("2", "me"), msg("3")];

describe("threadScrollAction", () => {
  it("jumps to the bottom when a chat opens or switches", () => {
    expect(threadScrollAction(snapshotOf(null, []), base, "c1", { wasNearBottom: false }).type).toBe("bottom");
    expect(threadScrollAction(snapshotOf("c1", base), base, "c2", { wasNearBottom: false }).type).toBe("bottom");
  });

  it("jumps to the bottom when the first messages of a thread arrive", () => {
    expect(threadScrollAction(snapshotOf("c1", []), base, "c1", { wasNearBottom: false }).type).toBe("bottom");
  });

  it("follows new messages while the reader is at the bottom", () => {
    const next = [...base, msg("4")];
    expect(threadScrollAction(snapshotOf("c1", base), next, "c1", { wasNearBottom: true })).toEqual({
      type: "bottom",
      unseen: 0,
    });
  });

  it("does not yank a reader who scrolled up; counts the arrivals instead", () => {
    const next = [...base, msg("4"), msg("5")];
    expect(threadScrollAction(snapshotOf("c1", base), next, "c1", { wasNearBottom: false })).toEqual({
      type: "indicate",
      unseen: 2,
    });
  });

  it("always scrolls for the reader's own message", () => {
    const next = [...base, msg("4", "me")];
    expect(threadScrollAction(snapshotOf("c1", base), next, "c1", { wasNearBottom: false }).type).toBe("bottom");
  });

  it("keeps position when older messages are prepended", () => {
    const next = [msg("0"), ...base];
    expect(threadScrollAction(snapshotOf("c1", base), next, "c1", { wasNearBottom: false }).type).toBe("keep-older");
  });

  it("ignores edits and deletions", () => {
    const edited = base.map((m) => ({ ...m }));
    const lastDeleted = base.slice(0, 2);
    expect(threadScrollAction(snapshotOf("c1", base), edited, "c1", { wasNearBottom: false }).type).toBe("none");
    expect(threadScrollAction(snapshotOf("c1", base), lastDeleted, "c1", { wasNearBottom: false }).type).toBe("none");
  });

  it("does not count system notices as unseen messages", () => {
    const next = [...base, msg("4", "system")];
    expect(threadScrollAction(snapshotOf("c1", base), next, "c1", { wasNearBottom: false }).type).toBe("none");
  });
});

describe("arrivalAnnouncement", () => {
  const prev = snapshotOf("c1", base);

  it("names the sender of a single new message without reading its text", () => {
    const next = [...base, { id: "4", from: "them", sender: "Anna", text: "secret plans" }];
    expect(arrivalAnnouncement(prev, next, "c1")).toBe("New message from Anna");
  });

  it("summarises bursts instead of reading each one", () => {
    const next = [...base, msg("4"), msg("5"), msg("6")];
    expect(arrivalAnnouncement(prev, next, "c1")).toBe("3 new messages");
  });

  it("stays silent for initial loads, chat switches, older pages and own messages", () => {
    expect(arrivalAnnouncement(snapshotOf(null, []), base, "c1")).toBe("");
    expect(arrivalAnnouncement(snapshotOf("c1", []), base, "c1")).toBe("");
    expect(arrivalAnnouncement(prev, base, "c2")).toBe("");
    expect(arrivalAnnouncement(prev, [msg("0"), ...base], "c1")).toBe("");
    expect(arrivalAnnouncement(prev, [...base, msg("4", "me")], "c1")).toBe("");
  });
});

describe("isNearBottom", () => {
  it("treats the last 120px as the bottom", () => {
    expect(isNearBottom({ scrollHeight: 1000, scrollTop: 500, clientHeight: 400 })).toBe(true);
    expect(isNearBottom({ scrollHeight: 1000, scrollTop: 300, clientHeight: 400 })).toBe(false);
  });
});

describe("newMessagesLabel", () => {
  it("pluralises", () => {
    expect(newMessagesLabel(1)).toBe("1 new message");
    expect(newMessagesLabel(3)).toBe("3 new messages");
  });
});
