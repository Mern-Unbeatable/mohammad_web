import { beforeEach, describe, expect, it, vi } from "vitest";
import { getConversation } from "./messagesApi";
import {
  parseLegacyChatLink,
  resolveLegacyChatLink,
  resolveNotificationLink,
} from "./chatLinks";

vi.mock("./messagesApi", () => ({ getConversation: vi.fn() }));

describe("parseLegacyChatLink", () => {
  it("reads conversation and user ids from every legacy inbox path", () => {
    expect(parseLegacyChatLink("/messages?conversation=c1")).toEqual({ conversationId: "c1" });
    expect(parseLegacyChatLink("/supplier/messages?conversation=c1")).toEqual({
      conversationId: "c1",
    });
    expect(parseLegacyChatLink("/admin/chat?conversation=c1")).toEqual({ conversationId: "c1" });
    expect(parseLegacyChatLink("/chat?user=u2")).toEqual({ userId: "u2" });
  });

  it("ignores route links and non-chat links", () => {
    expect(parseLegacyChatLink("/chat/messages/u2")).toBeNull();
    expect(parseLegacyChatLink("/chat/group/g1")).toBeNull();
    expect(parseLegacyChatLink("/orders?conversation=c1")).toBeNull();
    expect(parseLegacyChatLink("/messages")).toBeNull();
    expect(parseLegacyChatLink(null)).toBeNull();
  });
});

describe("resolveLegacyChatLink", () => {
  beforeEach(() => {
    getConversation.mockReset();
  });

  it("maps a direct conversation to the other member's route", async () => {
    getConversation.mockResolvedValue({ id: "c1", isGroup: false, otherUserId: "u2" });
    await expect(resolveLegacyChatLink("/messages?conversation=c1", "/chat")).resolves.toBe(
      "/chat/messages/u2",
    );
    expect(getConversation).toHaveBeenCalledWith("c1");
  });

  it("maps a group conversation under the given role base", async () => {
    getConversation.mockResolvedValue({ id: "g1", isGroup: true });
    await expect(
      resolveLegacyChatLink("/admin/chat?conversation=g1", "/admin/chat"),
    ).resolves.toBe("/admin/chat/group/g1");
  });

  it("resolves ?user= without a request", async () => {
    await expect(resolveLegacyChatLink("/messages?user=u2", "/supplier/chat")).resolves.toBe(
      "/supplier/chat/messages/u2",
    );
    expect(getConversation).not.toHaveBeenCalled();
  });

  it("returns null for links that are not legacy chat links", async () => {
    await expect(resolveLegacyChatLink("/chat/group/g1", "/chat")).resolves.toBeNull();
  });
});

describe("resolveNotificationLink", () => {
  beforeEach(() => {
    getConversation.mockReset();
  });

  it("passes other links through unchanged", async () => {
    await expect(resolveNotificationLink("/orders/1", "/chat")).resolves.toEqual({
      to: "/orders/1",
      failed: false,
    });
  });

  it("falls back to the inbox when the conversation can't be loaded", async () => {
    getConversation.mockRejectedValue(new Error("403"));
    await expect(
      resolveNotificationLink("/messages?conversation=gone", "/chat"),
    ).resolves.toEqual({ to: "/chat/messages", failed: true });
  });
});
