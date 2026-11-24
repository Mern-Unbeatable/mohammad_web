import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { adminRecruitmentReducer } from "@/features/dash/admin/recruitment";
import AdminRecruitmentView from "../pages/AdminRecruitmentView";
import AdminJobDetailView from "../pages/AdminJobDetailView";
import DeleteJobModal from "../components/list/DeleteJobModal";

const render = (element, { path = "/admin/recruitment", route = path, state = {} } = {}) => {
  const store = configureStore({
    reducer: { adminRecruitment: adminRecruitmentReducer },
    preloadedState: {
      adminRecruitment: { ...adminRecruitmentReducer(undefined, { type: "@@init" }), ...state },
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

const apiJob = {
  id: "j1",
  title: "Lab Technician",
  company: "BioLab",
  owner: { id: "u1", firstName: "Ana", lastName: "Lee" },
};

describe("AdminRecruitmentView", () => {
  it("renders the header, filters and job cards", () => {
    const html = render(<AdminRecruitmentView />, { state: { jobs: [apiJob], jobsLoading: false } });
    expect(html).toContain("Manage job listings, approvals and applications.");
    expect(html).toContain("All Time");
    expect(html).toContain("Lab Technician");
  });

  it("shows the empty state and the store error", () => {
    const html = render(<AdminRecruitmentView />, {
      state: { jobs: [], jobsLoading: false, error: "Server down" },
    });
    expect(html).toContain("No job listings found for these filters.");
    expect(html).toContain("Server down");
  });
});

describe("AdminJobDetailView", () => {
  it("renders the job with the applicants panel", () => {
    const html = render(<AdminJobDetailView />, {
      path: "/admin/recruitment/j1",
      route: "/admin/recruitment/:jobId",
      state: { selectedJob: apiJob },
    });
    expect(html).toContain("Lab Technician");
    expect(html).toContain("Everyone who applied to this job.");
  });
});

describe("DeleteJobModal", () => {
  it("names the company when known", () => {
    const html = renderToStaticMarkup(
      <DeleteJobModal job={{ title: "Lab Technician", company: "BioLab" }} deleting={false} />,
    );
    expect(html).toMatch(/Lab Technician.*at .*BioLab.*This action cannot be undone/);
  });
});
