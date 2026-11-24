import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { adminBlogsReducer } from "@/features/dash/admin/blogs";
import AdminBlogsView from "../pages/AdminBlogsView";
import AdminCreateBlogView from "../pages/AdminCreateBlogView";

const render = (element, { entry = "/admin/blogs", state = {} } = {}) => {
  const store = configureStore({
    reducer: { adminBlogs: adminBlogsReducer },
    preloadedState: {
      adminBlogs: { ...adminBlogsReducer(undefined, { type: "@@init" }), ...state },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[entry]}>{element}</MemoryRouter>
    </Provider>,
  );
};

const apiBlog = { id: "b1", title: "Lab safety 101", excerpt: "Basics.", category: "Industry News" };

describe("AdminBlogsView", () => {
  it("renders the header and blog cards", () => {
    const html = render(<AdminBlogsView />, { state: { blogs: [apiBlog], blogsLoading: false } });
    expect(html).toContain("Manage all blog posts from one place.");
    expect(html).toContain("New Blog");
    expect(html).toContain("Lab safety 101");
  });

  it("shows the empty state and the store error", () => {
    const html = render(<AdminBlogsView />, {
      state: { blogs: [], blogsLoading: false, error: "Server down" },
    });
    expect(html).toContain("No blog posts yet. Create your first article.");
    expect(html).toContain("Server down");
  });
});

describe("AdminCreateBlogView", () => {
  it("renders the create form with the upload area", () => {
    const html = render(<AdminCreateBlogView />, { entry: "/admin/blogs/new" });
    expect(html).toContain("Create New Blog Post");
    expect(html).toContain("Click to upload cover image");
    expect(html).toContain("Or paste image URL");
    expect(html).toContain("Publish");
  });

  it("prefills from route state when editing", () => {
    const html = render(<AdminCreateBlogView />, {
      entry: {
        pathname: "/admin/blogs/new",
        state: { article: { ...apiBlog, image: "https://x.test/a.png", publishedAt: "2026-01-01" } },
      },
    });
    expect(html).toContain("Edit Blog Post");
    expect(html).toContain('value="Lab safety 101"');
    expect(html).toContain("Replace");
    expect(html).toContain("Update");
  });
});
