import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth";
import { supplierGeneralReducer } from "@/features/dash/supplier/general";
import SupplierGeneralView from "../pages/SupplierGeneralView";
import SupplierMyGeneralPostsView from "../pages/SupplierMyGeneralPostsView";
import SupplierGeneralPostDetailView from "../pages/SupplierGeneralPostDetailView";

const render = (
  element,
  { path = "/supplier/general", route = "/supplier/general", state = {} } = {},
) => {
  const store = configureStore({
    reducer: { auth: authReducer, supplierGeneral: supplierGeneralReducer },
    preloadedState: {
      auth: {
        ...authReducer(undefined, { type: "@@init" }),
        user: { id: "s1", role: "SUPPLIER" },
        isAuthenticated: true,
        sessionReady: true,
      },
      supplierGeneral: { ...supplierGeneralReducer(undefined, { type: "@@init" }), ...state },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={route} element={element} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

const post = (id, extra = {}) => ({ id, type: "NEWS", title: `Post ${id}`, ...extra });

describe("SupplierGeneralView", () => {
  it("links the toolbar and cards to supplier routes", () => {
    const html = render(<SupplierGeneralView />, { state: { posts: [post("p1")] } });
    expect(html).toContain('href="/supplier/general/my-posts"');
    expect(html).toContain('href="/supplier/general/p1"');
  });

  it("shows the empty state without posts", () => {
    expect(render(<SupplierGeneralView />)).toContain("No posts yet");
  });
});

describe("SupplierMyGeneralPostsView", () => {
  it("renders the supplier's posts", () => {
    const html = render(<SupplierMyGeneralPostsView />, {
      path: "/supplier/general/my-posts",
      route: "/supplier/general/my-posts",
      state: { posts: [post("p2")] },
    });
    expect(html).toContain("Post p2");
  });
});

describe("SupplierGeneralPostDetailView", () => {
  it("renders the back link, title and share button", () => {
    const html = render(<SupplierGeneralPostDetailView />, {
      path: "/supplier/general/p1",
      route: "/supplier/general/:postId",
      state: { selectedPost: post("p1", { content: "Hello" }) },
    });
    expect(html).toContain("Back to General");
    expect(html).toContain('href="/supplier/general"');
    expect(html).toContain("Post p1");
    expect(html).toContain("Share");
  });
});
