import { describe, expect, it } from "vitest";
import { matchRoutes } from "react-router";
import ChatRedirect from "@/shared/layout/ChatLayout/ChatRedirect";
import LegacyChatRedirect from "@/shared/layout/ChatLayout/LegacyChatRedirect";
import { userRoutes } from "./user.routes";
import { adminRoutes } from "./admin.routes";
import { supplierRoutes } from "./supplier.routes";

const routes = [userRoutes, adminRoutes, supplierRoutes];

const resolve = (pathname) => {
  const matches = matchRoutes(routes, pathname) || [];
  const handles = matches.map((m) => m.route.handle || {});
  const findHandle = (key) => handles.findLast((h) => h[key])?.[key] ?? null;
  const leaf = matches.at(-1);
  return {
    matches,
    params: leaf?.params ?? {},
    guard: matches[0]?.route.handle?.requiredRole ?? null,
    chatBase: findHandle("chatBase"),
    section: findHandle("chatSection"),
    leafType: leaf?.route.element?.type ?? null,
  };
};

describe("chat routes", () => {
  it.each([
    ["/chat/messages/u1", "USER", "/chat", "messages", { userId: "u1" }],
    ["/chat/group/g1", "USER", "/chat", "group", { groupId: "g1" }],
    ["/admin/chat/messages/u1", "ADMIN", "/admin/chat", "messages", { userId: "u1" }],
    ["/admin/chat/group/g1", "ADMIN", "/admin/chat", "group", { groupId: "g1" }],
    ["/supplier/chat/messages/u1", "SUPPLIER", "/supplier/chat", "messages", { userId: "u1" }],
    ["/supplier/chat/group/g1", "SUPPLIER", "/supplier/chat", "group", { groupId: "g1" }],
  ])("%s is guarded for %s and nested under %s", (path, role, base, section, params) => {
    const result = resolve(path);
    expect(result.guard).toBe(role);
    expect(result.chatBase).toBe(base);
    expect(result.section).toBe(section);
    expect(result.params).toMatchObject(params);
  });

  it("shares one persistent inbox layout across sections and targets", () => {
    const inboxRoute = (path) => resolve(path).matches.at(-2).route;
    const inbox = inboxRoute("/chat/messages");
    expect(inboxRoute("/chat/messages/u1")).toBe(inbox);
    expect(inboxRoute("/chat/group")).toBe(inbox);
    expect(inboxRoute("/chat/group/g1")).toBe(inbox);
    // The layout's own match sees the child's params (useParams in ChatLayout).
    expect(resolve("/chat/group/g1").matches.at(-2).params).toMatchObject({ groupId: "g1" });
  });

  it("redirects the chat index and unknown chat paths", () => {
    for (const path of ["/chat", "/chat/unknown/x/y", "/admin/chat", "/supplier/chat/nope"]) {
      expect(resolve(path).leafType).toBe(ChatRedirect);
    }
  });

  it("keeps admin moderation inside the admin chat shell", () => {
    const result = resolve("/admin/chat/moderation");
    expect(result.guard).toBe("ADMIN");
    expect(result.chatBase).toBe("/admin/chat");
    expect(result.section).toBeNull();
    expect(result.matches.at(-1).route.path).toBe("moderation");
  });

  it("upgrades legacy inbox URLs", () => {
    expect(resolve("/messages").leafType).toBe(LegacyChatRedirect);
    expect(resolve("/supplier/messages").leafType).toBe(LegacyChatRedirect);
  });

  it("lets the role guard send other roles to their own chat", () => {
    const roleRedirect = resolve("/chat/group/g1").matches.findLast(
      (m) => m.route.handle?.roleRedirect,
    ).route.handle.roleRedirect;
    expect(roleRedirect("/chat/group/g1", "ADMIN")).toBe("/admin/chat/group/g1");
  });
});
