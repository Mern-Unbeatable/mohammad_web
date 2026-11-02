import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth";
import { supplierRecruitmentReducer } from "@/features/dash/supplier/recruitment";
import { jobClosedNotice } from "@/features/recruitment/jobStatus";
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
        jobsLoading: false,
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
  it("renders the view tabs, filters, layout toggle and supplier job links", () => {
    const html = render(<SupplierRecruitmentView />, {
      state: { jobs: [job("j1")], jobsMeta: { page: 1, total: 1, totalPages: 1 } },
    });
    expect(html).toContain("Public Job Posts");
    expect(html).toContain('href="/supplier/recruitment/my-jobs"');
    expect(html).toContain('href="/supplier/recruitment/j1"');
    expect(html).toContain("All job types");
    expect(html).toContain("All workplaces");
    expect(html).toContain('aria-label="Grid view"');
  });

  it("reads filters from the URL", () => {
    const html = render(<SupplierRecruitmentView />, {
      path: "/supplier/recruitment?q=assay",
    });
    expect(html).toContain('value="assay"');
  });

  it("shows the empty state without jobs", () => {
    expect(render(<SupplierRecruitmentView />)).toContain("No jobs found");
  });

  it("offers a retry when loading failed", () => {
    const html = render(<SupplierRecruitmentView />, { state: { jobsError: "boom" } });
    expect(html).toContain("Try again");
  });
});

describe("SupplierMyJobsView", () => {
  const renderMine = (state) =>
    render(<SupplierMyJobsView />, {
      path: "/supplier/recruitment/my-jobs",
      route: "/supplier/recruitment/my-jobs",
      state,
    });

  it("shows the empty state, Post Job and My Applications", () => {
    const html = renderMine();
    expect(html).toContain("My Job Posts");
    expect(html).toContain("No job posts yet");
    expect(html).toContain('href="/supplier/recruitment/create"');
    expect(html).toContain("My Applications");
  });

  it("badges My Job Posts with unseen applications", () => {
    const html = renderMine({ newApplications: { total: 2, byJob: { j1: 2 } } });
    expect(html).toContain("My Job Posts, 2 new applications");
  });

  it("links applications to supplier job pages", () => {
    const html = renderMine({
      applications: [{ id: "a1", status: "APPLIED", job: job("j7") }],
      applicationsMeta: { total: 1 },
    });
    expect(html).toContain('href="/supplier/recruitment/j7"');
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

  it("explains a closed job", () => {
    const html = renderDetail(job("j1", { status: "CLOSED" }));
    expect(html).toContain(jobClosedNotice("CLOSED", false));
  });
});

describe("SupplierPostJobView", () => {
  it("renders the create form with a link back to my jobs", () => {
    const html = render(<SupplierPostJobView />, {
      path: "/supplier/recruitment/create",
      route: "/supplier/recruitment/create",
    });
    expect(html).toContain("Post a Job");
    expect(html).toContain("Publish Job");
    expect(html).toContain("Back to my jobs");
  });
});
