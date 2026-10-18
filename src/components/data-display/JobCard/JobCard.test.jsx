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

describe("JobCard new applications badge", () => {
  it("shows the count on my job's View Details button", () => {
    const html = render({ job: job("OPEN"), variant: "mine", newApplications: 3 });
    expect(html).toContain("View details, 3 new applications");
    expect(html).toContain(">3<");
  });

  it("shows nothing when there are no new applications", () => {
    const html = render({ job: job("OPEN"), variant: "mine" });
    expect(html).not.toContain('role="status"');
  });
});

describe("JobCard image", () => {
  const withImage = {
    ...job("OPEN"),
    image: "https://cdn.test/job.png",
    owner: { id: "u1", avatar: "https://cdn.test/a.png" },
  };

  it("shows the job's details-page image on public cards, not the poster's picture", () => {
    const html = render({ job: withImage });
    expect(html).toContain('src="https://cdn.test/job.png"');
    expect(html).not.toContain("a.png");
  });

  it("renders no image when the job has none", () => {
    const html = render({ job: job("OPEN") });
    expect(html).not.toContain("<img");
  });

  it("keeps my job cards without an image", () => {
    const html = render({ job: withImage, variant: "mine" });
    expect(html).not.toContain("<img");
  });
});
