import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import JobPostForm from "./JobPostForm";

const form = {
  title: "",
  company: "",
  applyLink: "",
  location: "",
  salary: "",
  employmentType: "Full-time",
  workplaceType: "Hybrid",
  level: "Mid-level",
  description: "",
  requirements: "",
};

const render = (props = {}) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <JobPostForm
        form={form}
        onFieldChange={() => () => {}}
        onSubmit={() => {}}
        employmentOptions={["Full-time", "Part-time"]}
        levelOptions={["Entry-level", "Mid-level"]}
        submitLabel="Publish Job"
        savingLabel="Publishing…"
        cancelHref="/recruitment/my-jobs"
        {...props}
      />
    </MemoryRouter>,
  );

describe("JobPostForm", () => {
  it("groups fields into sections in order, with the apply link last", () => {
    const html = render();
    const order = ["Job basics", "Compensation &amp; level", "Job details", "How to apply"].map(
      (title) => html.indexOf(title),
    );
    expect(order.every((index) => index >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(html.indexOf('id="applyLink"')).toBeGreaterThan(html.indexOf('id="requirements"'));
  });

  it("marks salary and apply link as optional, and does not require them", () => {
    const html = render();
    expect(html.match(/Optional/g)).toHaveLength(2);
    expect(html).not.toMatch(/id="applyLink"[^>]*required/);
    expect(html).not.toMatch(/id="salary"[^>]*required/);
  });

  it("uses help text instead of a placeholder for the description", () => {
    const html = render();
    expect(html).not.toMatch(/id="description"[^>]*placeholder="/);
    expect(html).toContain("one requirement per line");
  });

  it("offers On-site, Remote and Hybrid with the current one selected", () => {
    const html = render();
    expect(html).toContain("Workplace type");
    expect(html.match(/name="workplaceType"/g)).toHaveLength(3);
    expect(html).toContain('checked="" value="Hybrid"');
    expect(html.match(/checked=""/g)).toHaveLength(1);
  });

  it("shows the job image upload field when uploads are supported", () => {
    const empty = render({ onUploadImage: async () => "", onImageChange: () => {} });
    expect(empty).toContain("Company logo");
    expect(empty).toContain("Upload logo");
    expect(empty).toContain('accept="image/jpeg,image/png,image/webp"');

    const withImage = render({
      form: { ...form, imageUrl: "https://cdn.test/job.png" },
      onUploadImage: async () => "",
      onImageChange: () => {},
    });
    expect(withImage).toContain('src="https://cdn.test/job.png"');
    expect(withImage).toContain("Change logo");
    expect(withImage).toContain("Remove");
  });

  it("disables inputs and shows the saving label while saving", () => {
    const html = render({ saving: true });
    expect(html).toContain("Publishing…");
    expect(html).toMatch(/id="title"[^>]*disabled/);
  });
});
