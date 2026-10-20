import { describe, expect, it } from "vitest";
import { matchRoutes } from "react-router";
import AuthLayout from "@/layouts/AuthLayout";
import NotFoundLayout from "@/layouts/NotFoundLayout";
import PanelNotFound from "@/modules/error/PanelNotFound";
import ContactSupportView from "@/modules/auth/contact-support/pages/ContactSupportView";
import { CONTACT_SUPPORT_PATH } from "@/shared/constants/support";
import { appRoutes } from "../routes/app.routes";

const resolve = (pathname) => matchRoutes(appRoutes, pathname) || [];
const leafType = (pathname) => resolve(pathname).at(-1)?.route.element?.type ?? null;

describe("app route tree", () => {
  it.each(["/does-not-exist", "/feed/unknown/deep", "/supplierx"])(
    "sends unknown root URL %s to the role-aware NotFoundLayout",
    (path) => {
      expect(leafType(path)).toBe(NotFoundLayout);
    },
  );

  it.each(["/supplier/nope", "/admin/nope"])("keeps %s on the in-panel 404", (path) => {
    expect(leafType(path)).toBe(PanelNotFound);
  });

  it("shares one AuthLayout route across the guest pages", () => {
    const authLayoutRoute = (path) =>
      resolve(path).find((m) => m.route.element?.type === AuthLayout)?.route;
    const layout = authLayoutRoute("/login");
    expect(layout).toBeDefined();
    for (const path of ["/join", "/forgot-password", "/reset-password"]) {
      expect(authLayoutRoute(path)).toBe(layout);
    }
  });

  it("keeps contact support in the auth shell but outside GuestOnly", () => {
    const matches = resolve(CONTACT_SUPPORT_PATH);
    expect(matches.at(-1).route.element.type).toBe(ContactSupportView);
    expect(matches.some((m) => m.route.element?.type === AuthLayout)).toBe(true);
    expect(matches.some((m) => m.route.handle?.guestOnly)).toBe(false);
  });
});
