import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import ApplicantDetailsModal from "@/components/modals/recruitment/ApplicantDetailsModal";

const render = (application) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <ApplicantDetailsModal application={application} onClose={() => {}} />
    </MemoryRouter>,
  );

const candidate = (overrides = {}) => ({
  id: "a1",
  name: "Laura Martin",
  status: "ACCEPTED",
  appliedLabel: "Applied 2 weeks ago",
  profileHref: "/contacts/u1",
  coverLetter: "I use HPLC daily.\nAvailable now.",
  applicant: {
    id: "u1",
    email: "laura@example.com",
    phone: "+33 1 23",
    title: "Research Assistant",
    company: "Lyon BioScience",
    location: "Lyon, France",
  },
  ...overrides,
});

describe("ApplicantDetailsModal", () => {
  it("renders nothing when no application is selected", () => {
    expect(render(null)).toBe("");
  });

  it("shows the applicant's info, status and cover letter", () => {
    const html = render(candidate());
    expect(html).toContain('role="dialog"');
    expect(html).toContain("Laura Martin");
    expect(html).toContain("Research Assistant · Lyon BioScience");
    expect(html).toContain("ACCEPTED");
    expect(html).toContain("Applied 2 weeks ago");
    expect(html).toContain('href="mailto:laura@example.com"');
    expect(html).toContain('href="tel:+33 1 23"');
    expect(html).toContain("Lyon, France");
    expect(html).toContain("I use HPLC daily.\nAvailable now.");
    expect(html).toContain('href="/contacts/u1"');
  });

  it("handles applicants with sparse profiles", () => {
    const html = render(
      candidate({ coverLetter: null, profileHref: null, applicant: {} }),
    );
    expect(html).toContain("No cover letter was included.");
    expect(html).not.toContain("mailto:");
    expect(html).not.toContain("View full profile");
  });
});
