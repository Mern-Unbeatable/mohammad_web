import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth";
import { supplierRecruitmentReducer } from "@/features/dash/supplier/recruitment";
import SupplierRecruitmentView from "../pages/SupplierRecruitmentView";
import SupplierMyJobsView from "../pages/SupplierMyJobsView";
import SupplierJobDetailView from "../pages/SupplierJobDetailView";
import SupplierPostJobView from "../pages/SupplierPostJobView";

const ME = "s1";

const render = (
  element,
  { path = "/supplier/recruitment", route = "/supplier/recruitment", state = {} } = {},
) => {
  const store = configureStore({
    reducer: { auth: authReducer, supplierRecruitment: supplierRecruitmentReducer },
    preloadedState: {
      auth: {
        ...authReducer(undefined, { type: "@@init" }),
        user: { id: ME, role: "SUPPLIER" },
        isAuthenticated: true,
        sessionReady: true,
      },
      supplierRecruitment: {
        ...supplierRecruitmentReducer(undefined, { type: "@@init" }),
        ...state,
      },
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

const job = (id, extra = {}) => ({
  id,
  title: `Job ${id}`,
  company: "Lab Co",
  location: "Ghent",
  status: "OPEN",
  owner: { id: "other", firstName: "Ana", lastName: "Silva" },
  ...extra,
});

describe("SupplierRecruitmentView", () => {
  it("renders the header actions and public jobs linking to supplier routes", () => {
    const html = render(<SupplierRecruitmentView />, {
      state: { jobs: [job("j1")], jobsMeta: { total: 1, totalPages: 1 } },
    });
    expect(html).toContain("Public Job Posts");
    expect(html).toContain('href="/supplier/recruitment/my-jobs"');
    expect(html).toContain('href="/supplier/recruitment/create"');
    expect(html).toContain('href="/supplier/recruitment/j1"');
  });

  it("shows the empty state without jobs", () => {
    expect(render(<SupplierRecruitmentView />)).toContain("No jobs found");
  });
});

describe("SupplierMyJobsView", () => {
  it("shows the unfiltered empty state", () => {
    const html = render(<SupplierMyJobsView />, {
      path: "/supplier/recruitment/my-jobs",
      route: "/supplier/recruitment/my-jobs",
    });
    expect(html).toContain("My Job Posts");
    expect(html).toContain("No job posts yet");
  });
});

describe("SupplierJobDetailView", () => {
  const renderDetail = (selectedJob) =>
    render(<SupplierJobDetailView />, {
      path: "/supplier/recruitment/j1",
      route: "/supplier/recruitment/:jobId",
      state: { selectedJob },
    });

  it("renders the back link for someone else's job", () => {
    const html = renderDetail(job("j1"));
    expect(html).toContain("Back to Jobs");
    expect(html).toContain("Job j1");
    expect(html).not.toContain('href="/supplier/recruitment/j1/edit"');
  });

  it("offers editing to the owner", () => {
    const html = renderDetail(job("j1", { owner: { id: ME, firstName: "Me" } }));
    expect(html).toContain('href="/supplier/recruitment/j1/edit"');
  });
});

describe("SupplierPostJobView", () => {
  it("renders the create form", () => {
    const html = render(<SupplierPostJobView />, {
      path: "/supplier/recruitment/create",
      route: "/supplier/recruitment/create",
    });
    expect(html).toContain("Post a Job");
    expect(html).toContain("Publish Job");
  });
});
