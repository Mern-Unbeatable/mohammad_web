import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { adminGeneralReducer } from "@/features/dash/admin/general";
import AdminGeneralView from "../pages/AdminGeneralView";
import AdminGeneralPostDetailView from "../pages/AdminGeneralPostDetailView";

const render = (element, { path = "/admin/general", route = path, state = {} } = {}) => {
  const store = configureStore({
    reducer: { adminGeneral: adminGeneralReducer },
    preloadedState: {
      adminGeneral: { ...adminGeneralReducer(undefined, { type: "@@init" }), ...state },
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

const apiPost = {
  id: "p1",
  title: "New lab rules",
  type: "DOCUMENT",
  body: ["First paragraph."],
  documentUrl: "/files/rules.pdf",
};

describe("AdminGeneralView", () => {
  it("renders post cards", () => {
    const html = render(<AdminGeneralView />, { state: { posts: [apiPost], postsLoading: false } });
    expect(html).toContain("New lab rules");
  });

  it("shows the empty state and the store error", () => {
    const html = render(<AdminGeneralView />, {
      state: { posts: [], postsLoading: false, error: "Server down" },
    });
    expect(html).toContain("No general posts found for this filter.");
    expect(html).toContain("Server down");
  });
});

describe("AdminGeneralPostDetailView", () => {
  const renderDetail = (state) =>
    render(<AdminGeneralPostDetailView />, {
      path: "/admin/general/p1",
      route: "/admin/general/:postId",
      state,
    });

  it("renders the post with its download link", () => {
    const html = renderDetail({ selectedPost: apiPost });
    expect(html).toContain("New lab rules");
    expect(html).toContain("First paragraph.");
    expect(html).toContain('href="/files/rules.pdf"');
    expect(html).toContain("Document");
  });

  it("does not render a post while it is missing", () => {
    expect(renderDetail({ selectedPost: null })).not.toContain("New lab rules");
  });
});
