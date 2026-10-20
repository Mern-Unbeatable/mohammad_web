import { describe, expect, it } from "vitest";
import { JOB_LEVEL_OPTIONS, emptyJobForm, jobPayloadError } from "../utils/jobForm";

const valid = {
  title: "QC Analyst",
  company: "Lab Co",
  location: "Ghent",
  about: "Run assays",
  requirements: ["BSc"],
};

describe("job form helpers", () => {
  it("offers levels without All and defaults new posts to Mid-level", () => {
    expect(JOB_LEVEL_OPTIONS).not.toContain("All");
    expect(emptyJobForm().level).toBe("Mid-level");
  });

  it("accepts a complete payload", () => {
    expect(jobPayloadError(valid)).toBeNull();
  });

  it.each(["title", "company", "location", "about"])("requires %s", (field) => {
    expect(jobPayloadError({ ...valid, [field]: "" })).toBe(
      "Please fill in all required fields",
    );
  });

  it("requires at least one requirement", () => {
    expect(jobPayloadError({ ...valid, requirements: [] })).toBe(
      "Add at least one requirement",
    );
  });
});
