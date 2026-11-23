import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { userRecruitmentReducer } from "@/features/user/recruitment";
import RecruitmentView from "./RecruitmentView";

const job = (id) => ({
  id,
  title: `Job ${id}`,
  company: "Lab Co",
  location: "Ghent",
  employmentType: "FULL_TIME",
  level: "SENIOR",
});

const render = (url, recruitmentState = {}) => {
  const store = configureStore({
    reducer: { userRecruitment: userRecruitmentReducer },
    preloadedState: {
      userRecruitment: {
        ...userRecruitmentReducer(undefined, { type: "@@init" }),
        jobsLoading: false,
        ...recruitmentState,
      },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[url]}>
        <RecruitmentView />
      </MemoryRouter>
    </Provider>,
  );
};

const loadedPage = (page, totalPages = 3) => ({
  jobs: [job(`p${page}-a`), job(`p${page}-b`)],
  jobsMeta: { page, pageSize: 5, total: totalPages * 5, totalPages },
});

describe("RecruitmentView pagination", () => {
  it("highlights the page from the URL and shows that page's jobs", () => {
    const html = render("/recruitment?page=2", loadedPage(2));

    expect(html).toContain('aria-label="Page 2" aria-current="page"');
    expect(html).not.toContain('aria-label="Page 1" aria-current="page"');
    expect(html).toContain("Job p2-a");
  });

  it("disables Previous on the first page and Next on the last page", () => {
    const first = render("/recruitment?page=1", loadedPage(1));
    expect(first).toMatch(/aria-label="Previous page"[^>]*disabled/);
    expect(first).not.toMatch(/aria-label="Next page"[^>]*disabled/);

    const last = render("/recruitment?page=3", loadedPage(3));
    expect(last).toMatch(/aria-label="Next page"[^>]*disabled/);
    expect(last).not.toMatch(/aria-label="Previous page"[^>]*disabled/);
  });

  it.each(["/recruitment", "/recruitment?page=abc", "/recruitment?page=0", "/recruitment?page=-4"])(
    "treats %s as page 1",
    (url) => {
      const html = render(url, loadedPage(1));
      expect(html).toContain('aria-label="Page 1" aria-current="page"');
    },
  );

  it("shows a loading state instead of an empty page for an out-of-range page", () => {
    const html = render("/recruitment?page=9", { ...loadedPage(9), jobs: [] });

    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain("No jobs found");
  });

  it("shows the empty state when there are no jobs", () => {
    const html = render("/recruitment?page=1&level=Senior", {
      jobs: [],
      jobsMeta: { page: 1, pageSize: 5, total: 0, totalPages: 1 },
    });
    expect(html).toContain("No jobs found");
  });

  it("restores the level and search from the URL", () => {
    const html = render("/recruitment?page=2&level=Senior&q=chemist", loadedPage(2));

    expect(html).toMatch(/aria-pressed="true"[^>]*>Senior</);
    expect(html).toMatch(/aria-pressed="false"[^>]*>All</);
    expect(html).toContain('value="chemist"');
    expect(html).toContain('aria-label="Page 2" aria-current="page"');
  });

  it("falls back to All for an unknown level", () => {
    const html = render("/recruitment?level=Director", loadedPage(1));
    expect(html).toMatch(/aria-pressed="true"[^>]*>All</);
  });

  it("shows an error state with a retry when the list fails", () => {
    const html = render("/recruitment?page=2", { jobsError: "Network Error" });

    expect(html).toContain("Couldn&#x27;t load jobs");
    expect(html).toContain("Try again");
    expect(html).not.toContain("No jobs found");
  });
});
