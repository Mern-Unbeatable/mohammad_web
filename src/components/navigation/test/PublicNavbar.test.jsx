import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth";
import PublicNavbar from "../components/public-navbar/PublicNavbar";

const render = (auth = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { ...authReducer(undefined, { type: "@@init" }), ...auth },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter>
        <PublicNavbar />
      </MemoryRouter>
    </Provider>,
  );
};

describe("PublicNavbar", () => {
  it("shows section links and guest actions (desktop + mobile)", () => {
    const html = render();
    expect(html.match(/href="\/#community"/g)).toHaveLength(2);
    expect(html.match(/>Log in</g)).toHaveLength(2);
    expect(html).toContain('href="/join"');
    expect(html).toContain('aria-label="Open menu"');
  });

  it("links signed-in users to the feed", () => {
    const html = render({
      isAuthenticated: true,
      user: { id: "u1", role: "USER" },
    });
    expect(html).toContain("Logout");
    expect(html).toContain('href="/feed"');
    expect(html).not.toContain(">Dashboard<");
  });

  it("links suppliers to their dashboard", () => {
    const html = render({
      isAuthenticated: true,
      user: { id: "s1", role: "SUPPLIER" },
    });
    expect(html).toContain(">Dashboard<");
    expect(html).not.toContain('href="/feed"');
  });
});
