import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import JobCard from "./JobCard";

const job = (status) => ({
  id: "j1",
  title: "Lab Technician",
  company: "Acme",
  location: "Dhaka",
  employmentType: "Full-time",
  level: "Senior",
  salary: "—",
  postedAgo: "Posted today",
  status,
});

const render = (props) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <JobCard {...props} />
    </MemoryRouter>,
  );

describe("JobCard status handling", () => {
  it("shows the status and a Close action on my open jobs", () => {
    const html = render({ job: job("OPEN"), variant: "mine", onToggleStatus: () => {} });
    expect(html).toContain(">Open<");
    expect(html).toContain("Close");
  });

  it("offers Reopen on my closed jobs", () => {
    const html = render({ job: job("CLOSED"), variant: "mine", onToggleStatus: () => {} });
    expect(html).toContain(">Closed<");
    expect(html).toContain("Reopen");
  });

  it("does not let owners reopen a job an admin removed", () => {
    const html = render({ job: job("REMOVED"), variant: "mine", onToggleStatus: () => {} });
    expect(html).toContain("Removed by admin");
    expect(html).not.toContain("Reopen");
  });

  it("keeps public cards free of status and management actions", () => {
    const html = render({ job: job("OPEN") });
    expect(html).not.toContain(">Open<");
    expect(html).not.toContain("Edit job");
    expect(html).toContain("View Details");
  });
});
