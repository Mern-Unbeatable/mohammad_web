import { describe, expect, it } from "vitest";
import { MAX_POST_IMAGES } from "../constants";
import {
  getInitialDraft,
  getShownDocument,
  getSubmitLabel,
  hasDraftChanges,
  mergeUploadedImageUrls,
  pickImageFiles,
} from "../utils/postDraft";

const file = (name, type, size = 2048) => ({ name, type, size });
const png = (name) => file(name, "image/png");

describe("getInitialDraft", () => {
  it("is empty for a new post", () => {
    expect(getInitialDraft(null)).toEqual({ content: "", imageUrls: [], document: null });
  });

  it("starts from the edited post's text, images and document", () => {
    const post = {
      content: "Hello",
      images: ["https://cdn.test/a.png"],
      attachment: { name: "spec.pdf", url: "https://cdn.test/spec.pdf", meta: "Document" },
    };
    expect(getInitialDraft(post)).toEqual({
      content: "Hello",
      imageUrls: ["https://cdn.test/a.png"],
      document: { name: "spec.pdf", url: "https://cdn.test/spec.pdf" },
    });
  });

  it("ignores an attachment without a usable URL", () => {
    expect(getInitialDraft({ attachment: { name: "x", url: null } }).document).toBeNull();
  });
});

describe("pickImageFiles", () => {
  it("accepts supported image types", () => {
    const result = pickImageFiles([png("a.png"), file("b.webp", "image/webp")], 0);
    expect(result.accepted).toHaveLength(2);
    expect(result).toMatchObject({ invalidType: false, overLimit: false });
  });

  it("drops unsupported types and flags them", () => {
    const result = pickImageFiles([png("a.png"), file("x.svg", "image/svg+xml")], 0);
    expect(result.accepted.map((f) => f.name)).toEqual(["a.png"]);
    expect(result.invalidType).toBe(true);
  });

  it("caps the total at the per-post limit", () => {
    const result = pickImageFiles([png("a.png"), png("b.png"), png("c.png")], MAX_POST_IMAGES - 2);
    expect(result.accepted.map((f) => f.name)).toEqual(["a.png", "b.png"]);
    expect(result.overLimit).toBe(true);
    expect(pickImageFiles([png("a.png")], MAX_POST_IMAGES + 1).accepted).toEqual([]);
  });
});

describe("hasDraftChanges", () => {
  const initial = {
    content: "Hello",
    imageUrls: ["u1", "u2"],
    document: { name: "d.pdf", url: "d1" },
  };
  const unchanged = {
    initial,
    content: " Hello ",
    images: [{ id: "u1", url: "u1" }, { id: "u2", url: "u2" }],
    documentFile: null,
    existingDocument: initial.document,
  };

  it("ignores surrounding whitespace only", () => {
    expect(hasDraftChanges(unchanged)).toBe(false);
  });

  it("detects text, image order, new images, and document changes", () => {
    expect(hasDraftChanges({ ...unchanged, content: "Hi" })).toBe(true);
    expect(hasDraftChanges({ ...unchanged, images: [...unchanged.images].reverse() })).toBe(true);
    expect(
      hasDraftChanges({ ...unchanged, images: [...unchanged.images, { id: "n", file: png("n") }] }),
    ).toBe(true);
    expect(hasDraftChanges({ ...unchanged, existingDocument: null })).toBe(true);
    expect(hasDraftChanges({ ...unchanged, documentFile: file("new.pdf", "application/pdf") })).toBe(
      true,
    );
  });
});

describe("getShownDocument", () => {
  it("prefers a newly picked file, then the existing document", () => {
    const existing = { name: "old.pdf", url: "u" };
    expect(getShownDocument(file("new.pdf", "application/pdf", 2048), existing)).toEqual({
      name: "new.pdf",
      meta: "2.0 KB",
    });
    expect(getShownDocument(null, existing)).toEqual({ name: "old.pdf", meta: "Current document" });
    expect(getShownDocument(null, null)).toBeNull();
  });
});

describe("getSubmitLabel", () => {
  it("labels create mode", () => {
    expect(getSubmitLabel({ isEdit: false, uploading: false, busy: false })).toBe("Publish");
    expect(getSubmitLabel({ isEdit: false, uploading: true, busy: true })).toBe("Uploading…");
  });

  it("labels edit mode, only showing Uploading when there is something to upload", () => {
    expect(getSubmitLabel({ isEdit: true, uploading: false, busy: false })).toBe("Save");
    expect(getSubmitLabel({ isEdit: true, uploading: true, busy: true, hasUploads: true })).toBe(
      "Uploading…",
    );
    expect(getSubmitLabel({ isEdit: true, uploading: true, busy: true, hasUploads: false })).toBe(
      "Saving…",
    );
  });
});

describe("mergeUploadedImageUrls", () => {
  it("keeps the user's order, filling new images from the upload response", () => {
    const images = [
      { id: "new-1", file: png("1") },
      { id: "u1", url: "https://cdn.test/old.png" },
      { id: "new-2", file: png("2") },
    ];
    const uploaded = [{ url: "https://cdn.test/1.png" }, { url: "https://cdn.test/2.png" }];
    expect(mergeUploadedImageUrls(images, uploaded)).toEqual([
      "https://cdn.test/1.png",
      "https://cdn.test/old.png",
      "https://cdn.test/2.png",
    ]);
  });
});
