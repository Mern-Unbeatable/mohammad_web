import { describe, expect, it } from "vitest";
import {
  CHAT_BASE_PATHS,
  CHAT_SECTIONS,
  chatBaseForRole,
  chatPath,
  chatTargetFor,
  listingChatPath,
  toRoleChatPath,
} from "./chat";
import { marketplaceListingPath } from "./marketplace";

describe("marketplace links", () => {
  it("opens the seller chat with the listing in the composer", () => {
    expect(listingChatPath(CHAT_BASE_PATHS.USER, "s1", "l1")).toBe("/chat/messages/s1?listing=l1");
    expect(listingChatPath(CHAT_BASE_PATHS.ADMIN, "s1", "l1")).toBe(
      "/admin/chat/messages/s1?listing=l1",
    );
  });

  it("points each role at its own listing page", () => {
    expect(marketplaceListingPath("USER", "l1")).toBe("/marketplace/l1");
    expect(marketplaceListingPath("admin", "l1")).toBe("/admin/marketplace/l1");
    expect(marketplaceListingPath("SUPPLIER", "l1")).toBeNull();
    expect(marketplaceListingPath("USER", null)).toBeNull();
  });
});

describe("chat route helpers", () => {
  it("builds section and conversation paths", () => {
    expect(chatPath("/chat")).toBe("/chat/messages");
    expect(chatPath("/chat", { id: "u1" })).toBe("/chat/messages/u1");
    expect(chatPath("/admin/chat", { section: CHAT_SECTIONS.GROUP, id: "g1" })).toBe(
      "/admin/chat/group/g1",
    );
  });

  it("maps roles to their chat base", () => {
    expect(chatBaseForRole("ADMIN")).toBe(CHAT_BASE_PATHS.ADMIN);
    expect(chatBaseForRole("supplier")).toBe(CHAT_BASE_PATHS.SUPPLIER);
    expect(chatBaseForRole(undefined)).toBe(CHAT_BASE_PATHS.USER);
  });

  it("addresses direct chats by the other user and groups by conversation", () => {
    expect(chatTargetFor({ id: "c1", isGroup: false, otherUserId: "u2" })).toEqual({
      section: CHAT_SECTIONS.DIRECT,
      id: "u2",
    });
    expect(chatTargetFor({ id: "g1", isGroup: true })).toEqual({
      section: CHAT_SECTIONS.GROUP,
      id: "g1",
    });
    expect(chatTargetFor({ id: "c1", isGroup: false, otherUserId: null })).toBeNull();
    expect(chatTargetFor(null)).toBeNull();
  });

  it("rewrites a chat location to another role's base", () => {
    expect(toRoleChatPath("/chat/group/g1", "ADMIN")).toBe("/admin/chat/group/g1");
    expect(toRoleChatPath("/admin/chat/messages/u1", "USER")).toBe("/chat/messages/u1");
    expect(toRoleChatPath("/supplier/chat", "USER")).toBe("/chat");
    expect(toRoleChatPath("/admin/chat/moderation", "SUPPLIER")).toBe(
      "/supplier/chat/moderation",
    );
    expect(toRoleChatPath("/chatter", "ADMIN")).toBeNull();
    expect(toRoleChatPath("/feed", "ADMIN")).toBeNull();
  });
});
