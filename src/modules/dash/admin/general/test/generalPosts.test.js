import { describe, expect, it } from "vitest";
import {
  buildPostsQuery,
  postDownloadUrl,
  postTypeLabel,
  postTypeStyle,
} from "../utils/generalPosts";
import { TYPE_STYLES } from "../constant/constants";

describe("buildPostsQuery", () => {
  it("sends no type for All", () => {
    expect(buildPostsQuery({ page: 2, category: "All" })).toEqual({ page: 2, pageSize: 8 });
  });

  it("maps the category label to the API type", () => {
    expect(buildPostsQuery({ page: 1, category: "Document" })).toEqual({
      page: 1,
      pageSize: 8,
      type: "document",
    });
  });
});

describe("post type helpers", () => {
  it("styles unknown types like news", () => {
    expect(postTypeStyle("document")).toBe(TYPE_STYLES.document);
    expect(postTypeStyle("other")).toBe(TYPE_STYLES.news);
  });

  it("labels anything but news as Document", () => {
    expect(postTypeLabel("news")).toBe("News");
    expect(postTypeLabel("document")).toBe("Document");
  });

  it("only offers a download for documents with a file", () => {
    expect(postDownloadUrl({ type: "document", documentUrl: "/f.pdf" })).toBe("/f.pdf");
    expect(postDownloadUrl({ type: "document", documentUrl: null })).toBeNull();
    expect(postDownloadUrl({ type: "news", documentUrl: "/f.pdf" })).toBeNull();
  });
});
