import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import AppliedCandidatesPanel from "../components/candidates/AppliedCandidatesPanel";

const applications = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: `app-${index}`,
    status: index === 0 ? "REJECTED" : "APPLIED",
    appliedAt: new Date(2026, 9, index + 1).toISOString(),
    applicant: { id: `u-${index}`, name: `Person ${index}` },
  }));

const rowCount = (html) => (html.match(/&#x27;s application/g) || []).length;

describe("AppliedCandidatesPanel", () => {
  it("previews six candidates and offers the rest in a modal", () => {
    const html = renderToStaticMarkup(
      <AppliedCandidatesPanel applications={applications(8)} />,
    );
    expect(rowCount(html)).toBe(6);
    expect(html).toContain("See all 8 candidates (+2 more)");
  });

  it("hides the see-all button when everyone fits", () => {
    const html = renderToStaticMarkup(
      <AppliedCandidatesPanel applications={applications(6)} />,
    );
    expect(rowCount(html)).toBe(6);
    expect(html).not.toContain("See all");
  });

  it("colours rejected applications red", () => {
    const html = renderToStaticMarkup(
      <AppliedCandidatesPanel applications={applications(1)} />,
    );
    expect(html).toMatch(/text-\[#D92D20\][^>]*>REJECTED</);
  });
});
