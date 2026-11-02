import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import JobDetailCard from "./JobDetailCard";

const render = (about, props = { showApplyButton: false }) =>
  renderToStaticMarkup(
    <JobDetailCard
      {...props}
      job={{
        title: "Lab Technician",
        company: "Acme",
        location: "Dhaka",
        employmentType: "Full-time",
        level: "Senior",
        salary: "—",
        postedAgo: "Posted today",
        about,
        requirements: [],
      }}
    />,
  );

describe("JobDetailCard apply button", () => {
  it("is enabled until the member applies", () => {
    const html = render("About", { onApply: () => {} });
    expect(html).toContain("Apply for this Position");
    expect(html).not.toContain("disabled");
  });

  it("is disabled once the member has applied, even with an external link", () => {
    const html = render("About", { applyHref: "https://jobs.example.com", applied: true });
    expect(html).toContain("Already applied");
    expect(html).toContain("disabled");
    expect(html).not.toContain("https://jobs.example.com");
  });
});

describe("JobDetailCard edit link", () => {
  it("shows an Edit link when an edit href is given", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <JobDetailCard
          showApplyButton={false}
          editHref="/recruitment/j1/edit"
          job={{ title: "T", about: "", requirements: [] }}
        />
      </MemoryRouter>,
    );
    expect(html).toContain('href="/recruitment/j1/edit"');
    expect(html).toContain("Edit");
  });

  it("has no Edit link otherwise", () => {
    expect(render("About")).not.toContain("/edit");
  });
});

describe("JobDetailCard description", () => {
  it("keeps paragraphs and line breaks", () => {
    const html = render("First paragraph\nsecond line\n\nNext paragraph");
    expect(html).toContain('<p class="whitespace-pre-wrap">');
    expect(html.match(/<span>\n/g)).toHaveLength(3);
  });

  it("renders lists, bold text and links", () => {
    const html = render("Duties:\n- Run assays\n- **Calibrate** kit\n\nSee https://example.com");
    expect(html).toContain("<ul");
    expect(html).toContain("<strong");
    expect(html).toContain('href="https://example.com');
  });
});
