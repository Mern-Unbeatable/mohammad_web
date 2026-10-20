import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const auth = vi.hoisted(() => ({ current: {} }));

vi.mock("@/modules/auth", () => ({ useAuth: () => auth.current }));
vi.mock("../UserLayout", () => ({
  default: ({ children }) => <div data-shell="user">{children}</div>,
}));
vi.mock("../RootLayout", () => ({
  default: ({ children }) => <div data-shell="public">{children}</div>,
}));
vi.mock("@/modules/error/PanelNotFound", () => ({ default: () => <p>panel-404</p> }));
vi.mock("@/modules/error/NotFound", () => ({ default: () => <p>public-404</p> }));
vi.mock("@/components/loader/fallbacks/SessionCheckingFallback", () => ({
  default: () => <p>checking-session</p>,
}));

const { default: NotFoundLayout } = await import("../NotFoundLayout");

const render = () => renderToStaticMarkup(<NotFoundLayout />);

describe("NotFoundLayout", () => {
  beforeEach(() => {
    auth.current = { sessionReady: true, isAuthenticated: false, role: null };
  });

  it("waits for the session before choosing a shell", () => {
    auth.current = { sessionReady: false };
    expect(render()).toBe("<p>checking-session</p>");
  });

  it("shows the public 404 to guests", () => {
    const html = render();
    expect(html).toContain('data-shell="public"');
    expect(html).toContain("public-404");
  });

  it("keeps signed-in members inside the dashboard shell", () => {
    auth.current = { sessionReady: true, isAuthenticated: true, role: "USER" };
    const html = render();
    expect(html).toContain('data-shell="user"');
    expect(html).toContain("panel-404");
  });

  it.each(["SUPPLIER", "ADMIN"])("leaves %s users on the public 404 at unknown root URLs", (role) => {
    auth.current = { sessionReady: true, isAuthenticated: true, role };
    expect(render()).toContain('data-shell="public"');
  });
});
