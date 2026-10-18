import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import JobDetailCard from "./JobDetailCard";

const render = (about) =>
  renderToStaticMarkup(
    <JobDetailCard
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
      showApplyButton={false}
    />,
  );

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
