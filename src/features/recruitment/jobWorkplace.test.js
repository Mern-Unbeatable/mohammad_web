import { describe, expect, it } from "vitest";
import {
  WORKPLACE_TYPE_OPTIONS,
  workplaceLabel,
  workplaceToApi,
} from "./jobWorkplace";
import {
  formToCreatePayload,
  jobToFormValues,
  toJobCardModel,
} from "@/features/dash/user/recruitment/recruitmentMappers";

describe("job workplace type", () => {
  it("round-trips every option between label and API value", () => {
    expect(WORKPLACE_TYPE_OPTIONS).toEqual(["On-site", "Remote", "Hybrid"]);
    for (const label of WORKPLACE_TYPE_OPTIONS) {
      expect(workplaceLabel(workplaceToApi(label))).toBe(label);
    }
  });

  it("is sent on create and shown on cards and in the edit form", () => {
    expect(formToCreatePayload({ workplaceType: "Remote" }).workplaceType).toBe("REMOTE");
    expect(toJobCardModel({ workplaceType: "HYBRID" }).workplaceType).toBe("Hybrid");
    expect(jobToFormValues({ workplaceType: "REMOTE" }).workplaceType).toBe("Remote");
  });

  it("sends the uploaded job image and loads it into the edit form", () => {
    expect(formToCreatePayload({ imageUrl: "https://cdn.test/j.png" }).imageUrl).toBe(
      "https://cdn.test/j.png",
    );
    expect(formToCreatePayload({ imageUrl: "" })).not.toHaveProperty("imageUrl");
    expect(jobToFormValues({ imageUrl: "https://cdn.test/j.png" }).imageUrl).toBe(
      "https://cdn.test/j.png",
    );
  });

  it("defaults older jobs without a value to On-site in the edit form", () => {
    expect(jobToFormValues({}).workplaceType).toBe("On-site");
    expect(jobToFormValues(null).workplaceType).toBe("On-site");
  });
});
