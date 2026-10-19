import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PostComments from "../components/comments/PostComments";

const comment = (id, authorId, overrides = {}) => ({
  id,
  author: { id: authorId, name: authorId === "me" ? "Me Author" : "Other Author" },
  content: `Comment ${id}`,
  time: "2h",
  liked: false,
  likeCount: 0,
  replies: [],
  ...overrides,
});

const comments = [
  comment("mine", "me", { replies: [comment("their-reply", "other")] }),
  comment("theirs", "other", { replies: [comment("my-reply", "me")] }),
];

const noop = async () => true;
const render = (props = {}) =>
  renderToStaticMarkup(
    <PostComments
      comments={comments}
      currentUser={{ id: "me", name: "Me Author" }}
      onAddComment={noop}
      onLikeComment={noop}
      onEditComment={noop}
      onDeleteComment={noop}
      {...props}
    />,
  );

const menuCount = (html) => html.split('aria-label="Comment options"').length - 1;

describe("PostComments owner actions", () => {
  it("shows the comment menu only on the viewer's own comments and replies", () => {
    expect(menuCount(render())).toBe(2);
  });

  it("shows no menu to a viewer who owns none of the comments", () => {
    expect(menuCount(render({ currentUser: { id: "visitor" } }))).toBe(0);
    expect(menuCount(render({ currentUser: null }))).toBe(0);
  });

  it("shows no menu when edit and delete aren't supported", () => {
    expect(
      menuCount(render({ onEditComment: undefined, onDeleteComment: undefined })),
    ).toBe(0);
  });

  it("does not render the delete dialog until a delete is requested", () => {
    expect(render()).not.toContain("Delete comment?");
  });
});

describe("PostComments preview", () => {
  const roots = (count) =>
    Array.from({ length: count }, (_, i) =>
      comment(`c${i + 1}`, "other", {
        replies: i === 0 ? [comment("reply-of-c1", "me")] : [],
      }),
    );
  const shown = (html) => [...html.matchAll(/Comment (c\d+|reply-of-c1)/g)].map((m) => m[1]);
  const preview = (count, props = {}) =>
    render({ comments: roots(count), previewLimit: 4, onShowAll: noop, ...props });

  it("shows nothing extra for a post with no comments", () => {
    const html = preview(0);
    expect(shown(html)).toEqual([]);
    expect(html).not.toContain("See more comments");
    expect(html).toContain("Add a professional comment");
  });

  it("shows 1-4 comments in full without a See more comments button", () => {
    expect(shown(preview(1))).toEqual(["c1", "reply-of-c1"]);
    const html = preview(4);
    expect(shown(html)).toEqual(["c1", "reply-of-c1", "c2", "c3", "c4"]);
    expect(html).not.toContain("See more comments");
  });

  it("limits longer threads to the 4 oldest comments, keeping their replies, and offers the rest", () => {
    const html = preview(7);
    expect(shown(html)).toEqual(["c1", "reply-of-c1", "c2", "c3", "c4"]);
    expect(html).toContain("See more comments");
  });

  it("shows every comment, in order, without the button when not previewing", () => {
    const html = render({ comments: roots(7) });
    expect(shown(html)).toEqual(["c1", "reply-of-c1", "c2", "c3", "c4", "c5", "c6", "c7"]);
    expect(html).not.toContain("See more comments");
  });

  it("shows the empty message only where requested", () => {
    expect(render({ comments: [], emptyText: "No comments yet." })).toContain("No comments yet.");
    expect(render({ comments: [] })).not.toContain("No comments yet.");
    expect(render({ comments: roots(2), emptyText: "No comments yet." })).not.toContain(
      "No comments yet.",
    );
  });
});
