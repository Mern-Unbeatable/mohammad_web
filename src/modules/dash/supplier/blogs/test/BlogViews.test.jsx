import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { supplierBlogsReducer } from "@/features/dash/supplier/blogs";
import SupplierBlogsView from "../pages/SupplierBlogsView";
import SupplierBlogDetailView from "../pages/SupplierBlogDetailView";

const render = (
  element,
  { path = "/supplier/blogs", route = "/supplier/blogs", supplierBlogs = {} } = {},
) => {
  const store = configureStore({
    reducer: { supplierBlogs: supplierBlogsReducer },
    preloadedState: {
      supplierBlogs: { ...supplierBlogsReducer(undefined, { type: "@@init" }), ...supplierBlogs },
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

const blog = (n) => ({ id: `b${n}`, slug: `post-${n}`, title: `Post ${n}`, body: "Hello" });

describe("SupplierBlogsView", () => {
  it("renders the hero, latest and archive sections linking to supplier paths", () => {
    const html = render(<SupplierBlogsView />, {
      supplierBlogs: { latestBlogs: [blog(1)], blogs: [blog(2)] },
    });
    expect(html).toContain("Lab Unity Knowledge Hub");
    expect(html).toContain('id="latest-hub"');
    expect(html).toContain('href="/supplier/blogs/post-1"');
    expect(html).toContain('href="/supplier/blogs/post-2"');
  });

  it("keeps showing loaded articles instead of skeletons while refetching", () => {
    const html = render(<SupplierBlogsView />, {
      supplierBlogs: { blogs: [blog(2)], blogsLoading: true },
    });
    expect(html).toContain("Post 2");
  });

  it("shows empty messages without articles", () => {
    expect(render(<SupplierBlogsView />)).toContain("No articles found.");
  });
});

describe("SupplierBlogDetailView", () => {
  const renderDetail = (supplierBlogs) =>
    render(<SupplierBlogDetailView />, {
      path: "/supplier/blogs/post-1",
      route: "/supplier/blogs/:slug",
      supplierBlogs,
    });

  it("renders the article and popular posts without the current one", () => {
    const html = renderDetail({ selectedBlog: blog(1), latestBlogs: [blog(1), blog(2)] });
    expect(html).toContain("Back to Blogs");
    expect(html).toContain('href="/supplier/blogs"');
    expect(html).toContain('href="/supplier/blogs/post-2"');
    expect(html).not.toContain('href="/supplier/blogs/post-1"');
  });

  it("shows the empty sidebar text when there are no other posts", () => {
    expect(renderDetail({ selectedBlog: blog(1), latestBlogs: [] })).toContain(
      "No other articles yet.",
    );
  });
});
