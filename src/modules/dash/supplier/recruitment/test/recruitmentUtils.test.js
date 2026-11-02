import { describe, expect, it } from "vitest";
import { toApplicationModel } from "../utils/applications";
import { JOB_LEVEL_OPTIONS, emptyJobForm, jobPayloadError } from "../utils/jobForm";

describe("toApplicationModel", () => {
  it("maps the job and falls back to jobId and PENDING", () => {
    const row = toApplicationModel({ id: "a1", jobId: "j9", createdAt: null });
    expect(row).toMatchObject({ id: "a1", status: "PENDING", job: null, jobId: "j9" });
  });

  it("takes the id from the nested job", () => {
    const row = toApplicationModel({
      id: "a2",
      status: "APPLIED",
      job: { id: "j1", title: "QC Analyst" },
    });
    expect(row.jobId).toBe("j1");
    expect(row.job.title).toBe("QC Analyst");
  });
});

describe("job form helpers", () => {
  const valid = {
    title: "QC Analyst",
    company: "Lab Co",
    location: "Ghent",
    about: "Run assays",
    requirements: ["BSc"],
  };

  it("offers levels without All and defaults new posts to the second level", () => {
    expect(JOB_LEVEL_OPTIONS).not.toContain("All");
    expect(emptyJobForm().level).toBe(JOB_LEVEL_OPTIONS[1] || JOB_LEVEL_OPTIONS[0]);
  });

  it("validates required fields and requirements", () => {
    expect(jobPayloadError(valid)).toBeNull();
    expect(jobPayloadError({ ...valid, company: "" })).toBe("Please fill in all required fields");
    expect(jobPayloadError({ ...valid, requirements: [] })).toBe("Add at least one requirement");
  });
});
