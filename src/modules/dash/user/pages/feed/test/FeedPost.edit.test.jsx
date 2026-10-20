import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import FeedPost from "../components/post/FeedPost";
import CreatePostModal from "@/components/modals/feed/CreatePostModal";
import { toFeedPostModel, userFeedReducer } from "@/features/dash/user/feed";
import { userProfileReducer } from "@/features/dash/user/profile";
import { anna, originalPost, repostOf } from "@/features/dash/user/feed/feedRepostFixtures";

const storeFor = (viewer) =>
  configureStore({
    reducer: { userFeed: userFeedReducer, userProfile: userProfileReducer },
    preloadedState: {
      userProfile: { ...userProfileReducer(undefined, { type: "@@init" }), user: viewer },
    },
  });

const renderPost = (post, { viewer = anna, ...props } = {}) =>
  renderToStaticMarkup(
    <Provider store={storeFor(viewer)}>
      <MemoryRouter>
        <FeedPost post={toFeedPostModel(post)} {...props} />
      </MemoryRouter>
    </Provider>,
  );

const renderEditor = (post) =>
  renderToStaticMarkup(
    <CreatePostModal open mode="edit" post={toFeedPostModel(post)} user={{ name: "Anna Berg" }} />,
  );

const noop = () => {};

describe("FeedPost edit entry point", () => {
  it("gives the author a post menu when editing is available", () => {
    const html = renderPost(originalPost(), { onEdit: noop });
    expect(html).toContain('aria-label="Post options"');
    expect(html).not.toContain('aria-label="Report post"');
  });

  it("shows other members the report button instead", () => {
    const html = renderPost(originalPost(), {
      viewer: { id: "someone-else", firstName: "Sam" },
      onEdit: noop,
      onDelete: noop,
    });
    expect(html).toContain('aria-label="Report post"');
    expect(html).not.toContain('aria-label="Post options"');
  });

  it("labels edited posts", () => {
    expect(renderPost(originalPost({ editedAt: "2026-10-12T09:00:00.000Z" }))).toContain(
      "Edited",
    );
    expect(renderPost(originalPost())).not.toContain("Edited");
  });
});

describe("CreatePostModal edit mode", () => {
  it("starts from the post and can't be saved until something changes", () => {
    const html = renderEditor(
      originalPost({ content: "Hello lab", imageUrl: "https://cdn.test/a.png" }),
    );
    expect(html).toContain("Edit Post");
    expect(html).toContain("Hello lab");
    expect(html).toContain('src="https://cdn.test/a.png"');
    expect(html).toContain('aria-label="Remove image 1"');
    expect(html).not.toContain("aria-pressed");
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Save<\/button>/);
  });

  it("shows every existing image with its own remove button", () => {
    const urls = ["a", "b", "c"].map((name) => `https://cdn.test/${name}.png`);
    const html = renderEditor(originalPost({ imageUrl: urls[0], imageUrls: urls }));

    urls.forEach((url) => expect(html).toContain(`src="${url}"`));
    expect(html).toContain('aria-label="Remove image 3"');
    expect(html).not.toContain('aria-label="Remove image 4"');
    expect(html).toContain("3 / 10 images");
  });

  it("lets the image picker select several files", () => {
    const html = renderToStaticMarkup(
      <CreatePostModal open user={{ name: "Anna Berg" }} />,
    );
    expect(html).toMatch(/<input[^>]*accept="image\/jpeg[^"]*"[^>]*multiple=""/);
  });

  it("lets a repost add, replace or remove its own attachments", () => {
    const html = renderEditor(
      repostOf(originalPost(), { documentUrl: "https://cdn.test/specs.pdf" }),
    );
    expect(html).toContain("Worth a read");
    expect(html).toContain('placeholder="Add a caption (optional)"');
    expect(html).toContain(">Image<");
    expect(html).toContain(">Document<");
    expect(html).toContain("specs.pdf");
    expect(html).toContain('aria-label="Remove document"');
  });
});

describe("FeedPost repost attachments", () => {
  it("shows the repost's own image and document above the original", () => {
    const html = renderPost(
      repostOf(originalPost(), {
        imageUrl: "https://cdn.test/mine.png",
        documentUrl: "https://cdn.test/notes.pdf",
      }),
      { viewer: { id: "sam", firstName: "Sam" } },
    );
    const original = html.indexOf('aria-label="Original post by Anna Berg"');
    expect(html.indexOf('src="https://cdn.test/mine.png"')).toBeGreaterThan(-1);
    expect(html.indexOf('src="https://cdn.test/mine.png"')).toBeLessThan(original);
    expect(html.indexOf("notes.pdf")).toBeGreaterThan(-1);
    expect(html.indexOf("notes.pdf")).toBeLessThan(original);
  });
});

describe("FeedPost image gallery", () => {
  const urls = (count) => Array.from({ length: count }, (_, i) => `https://cdn.test/p${i}.png`);

  it("shows up to four images and a +N tile for the rest", () => {
    const images = urls(6);
    const html = renderPost(originalPost({ imageUrl: images[0], imageUrls: images }));

    images.slice(0, 4).forEach((url) => expect(html).toContain(`src="${url}"`));
    expect(html).not.toContain(`src="${images[4]}"`);
    expect(html).toContain(">+2</span>");
    expect(html).toContain('aria-label="View 2 more images"');
  });

  it("shows both images of a two-image post side by side", () => {
    const images = urls(2);
    const html = renderPost(originalPost({ imageUrl: images[0], imageUrls: images }));

    images.forEach((url) => expect(html).toContain(`src="${url}"`));
    expect(html).toContain("grid-cols-2");
    expect(html).not.toContain("more images");
  });

  it("shows several images on the original inside a repost", () => {
    const images = urls(3);
    const html = renderPost(
      repostOf(originalPost({ imageUrl: images[0], imageUrls: images })),
      { viewer: { id: "sam", firstName: "Sam" } },
    );
    images.forEach((url) => expect(html).toContain(`src="${url}"`));
  });
});

describe("FeedPost author links", () => {
  const authorLinks = (html) =>
    [...html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map(([tag, href, inner]) => ({
      href,
      decorative: tag.includes('tabindex="-1"') && tag.includes('aria-hidden="true"'),
      text: inner.replace(/<[^>]+>/g, ""),
    }));

  it("links another member's picture and name to their contact profile", () => {
    const html = renderPost(originalPost(), { viewer: { id: "sam", firstName: "Sam" } });

    expect(authorLinks(html)).toEqual([
      { href: "/contacts/anna", decorative: true, text: "A" },
      { href: "/contacts/anna", decorative: false, text: "Anna Berg" },
    ]);
  });

  it("links your own picture and name to your profile page", () => {
    const html = renderPost(originalPost(), { viewer: anna });

    expect(authorLinks(html).map((l) => l.href)).toEqual(["/profile", "/profile"]);
  });

  it("links the reposter and the original author to their own profiles", () => {
    const html = renderPost(repostOf(originalPost()), { viewer: { id: "viewer", firstName: "Vi" } });

    expect(authorLinks(html).filter((l) => !l.decorative)).toEqual([
      { href: "/contacts/sam", decorative: false, text: "Sam Reed" },
      { href: "/contacts/anna", decorative: false, text: "Anna Berg" },
    ]);
  });

  it("leaves the name as plain text when the author id is missing", () => {
    const html = renderPost(originalPost({ author: { firstName: "Ghost", lastName: "User" } }), {
      viewer: { id: "sam", firstName: "Sam" },
    });

    expect(html).toContain("Ghost User");
    expect(html).not.toContain('href="/contacts/');
  });
});
