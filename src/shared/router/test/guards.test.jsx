import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const state = vi.hoisted(() => ({ auth: {}, matches: [], pathname: "/" }));

vi.mock("@/modules/auth", () => ({ useAuth: () => state.auth }));
vi.mock("@/components/loader/fallbacks/SessionCheckingFallback", () => ({
  default: () => <p>checking</p>,
}));
vi.mock("react-router", () => ({
  Navigate: ({ to }) => <p data-redirect={to} />,
  Outlet: () => <p>outlet</p>,
  useLocation: () => ({ pathname: state.pathname, search: "" }),
  useMatches: () => state.matches,
}));

const { default: GuestOnly } = await import("../guards/GuestOnly");
const { default: RequireRole } = await import("../guards/RequireRole");

const signedIn = (role) => ({
  sessionReady: true,
  isAuthenticated: true,
  user: { id: "u1", role },
  role,
  homePath: { USER: "/feed", SUPPLIER: "/supplier", ADMIN: "/admin" }[role],
});
const guest = { sessionReady: true, isAuthenticated: false, user: null, role: null };

describe("GuestOnly", () => {
  beforeEach(() => {
    state.auth = guest;
  });

  it("waits for the session", () => {
    state.auth = { sessionReady: false };
    expect(renderToStaticMarkup(<GuestOnly />)).toContain("checking");
  });

  it("renders guest pages for visitors", () => {
    expect(renderToStaticMarkup(<GuestOnly />)).toContain("outlet");
  });

  it.each([
    ["USER", "/feed"],
    ["SUPPLIER", "/supplier"],
    ["ADMIN", "/admin"],
  ])("sends a signed-in %s to %s", (role, home) => {
    state.auth = signedIn(role);
    expect(renderToStaticMarkup(<GuestOnly />)).toContain(`data-redirect="${home}"`);
  });
});

describe("RequireRole", () => {
  beforeEach(() => {
    state.auth = guest;
    state.matches = [];
    state.pathname = "/feed";
  });

  const render = (roles) => renderToStaticMarkup(<RequireRole allowedRoles={roles} />);

  it("sends visitors to login", () => {
    expect(render(["USER"])).toContain('data-redirect="/login"');
  });

  it("renders the outlet for the allowed role", () => {
    state.auth = signedIn("USER");
    expect(render(["USER"])).toContain("outlet");
  });

  it("sends other roles to their home", () => {
    state.auth = signedIn("SUPPLIER");
    expect(render(["USER"])).toContain('data-redirect="/supplier"');
  });

  it("uses a matched roleRedirect when one exists", () => {
    state.auth = signedIn("ADMIN");
    state.pathname = "/chat/group/g1";
    state.matches = [{ handle: { roleRedirect: (path) => `/admin${path}` } }];
    expect(render(["USER"])).toContain('data-redirect="/admin/chat/group/g1"');
  });
});
