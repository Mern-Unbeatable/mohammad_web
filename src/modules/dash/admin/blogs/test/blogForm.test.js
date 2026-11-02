import { describe, expect, it } from "vitest";
import { BLOG_CATEGORY_OPTIONS } from "@/features/dash/admin/blogs";
import {
  buildBlogPayload,
  imageFileError,
  initialBlogFields,
  submitLabel,
} from "../utils/blogForm";
import { MAX_FILE_BYTES } from "../constant/constants";

describe("imageFileError", () => {
  it("accepts a small supported image", () => {
    expect(imageFileError({ size: 1024, type: "image/png" })).toBeNull();
  });

  it("rejects oversized files before checking the type", () => {
    expect(imageFileError({ size: MAX_FILE_BYTES + 1, type: "text/plain" })).toBe(
      "Image must be 10MB or less",
    );
  });

  it("rejects unsupported types", () => {
    expect(imageFileError({ size: 10, type: "image/svg+xml" })).toBe("Use JPG, PNG, WebP, or GIF");
  });
});

describe("initialBlogFields", () => {
  it("uses defaults for a new post", () => {
    expect(initialBlogFields(undefined)).toEqual({
      title: "",
      category: BLOG_CATEGORY_OPTIONS[0],
      excerpt: "",
      body: "",
      readTime: "5 min read",
      publish: true,
    });
  });

  it("prefills from the edited article, body falling back to the excerpt", () => {
    const fields = initialBlogFields({ title: "T", category: "C", excerpt: "E", readTime: "3 min" });
    expect(fields).toMatchObject({ title: "T", category: "C", body: "E", readTime: "3 min" });
    expect(fields.publish).toBe(false);
    expect(initialBlogFields({ publishedAt: "2026-01-01" }).publish).toBe(true);
  });
});

describe("buildBlogPayload", () => {
  it("trims values, falls back to the excerpt and drops an empty read time", () => {
    expect(
      buildBlogPayload({
        title: " T ",
        category: " C ",
        excerpt: " E ",
        body: "  ",
        readTime: " ",
        publish: false,
      }),
    ).toEqual({ title: "T", category: "C", excerpt: "E", body: "E", readTime: undefined, publish: false });
  });
});

describe("submitLabel", () => {
  it("prefers progress states, then edit, then publish / draft", () => {
    expect(submitLabel({ uploading: true, saving: true, isEdit: true, publish: true })).toBe("Uploading…");
    expect(submitLabel({ saving: true, isEdit: true })).toBe("Saving…");
    expect(submitLabel({ isEdit: true, publish: false })).toBe("Update");
    expect(submitLabel({ publish: true })).toBe("Publish");
    expect(submitLabel({ publish: false })).toBe("Save draft");
  });
});
