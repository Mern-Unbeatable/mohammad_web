import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CardSkeleton } from "./CardSkeletons";

const countCards = (html) => (html.match(/class="[^"]*p-4 sm:p-5/g) || []).length;

describe("CardSkeleton", () => {
  it("renders `count` skeletons inside a busy wrapper", () => {
    const html = renderToStaticMarkup(
      <CardSkeleton variant="job" count={3} className="space-y-4" />,
    );
    expect(html.startsWith('<div class="space-y-4" aria-busy="true"')).toBe(true);
    expect(countCards(html)).toBe(3);
  });

  it("renders a single skeleton by default", () => {
    expect(countCards(renderToStaticMarkup(<CardSkeleton variant="job" />))).toBe(1);
  });

  it("supports a custom wrapper element and item class", () => {
    const html = renderToStaticMarkup(
      <CardSkeleton variant="sidebarJob" count={2} as="ul" itemClassName="item" />,
    );
    expect(html.startsWith("<ul")).toBe(true);
    expect(html.match(/class="item"/g)).toHaveLength(2);
  });

  it("renders nothing for an unknown variant", () => {
    expect(renderToStaticMarkup(<CardSkeleton variant="nope" />)).toBe("");
  });

  it("shows owner action placeholders only for my job cards", () => {
    const mine = renderToStaticMarkup(<CardSkeleton variant="myJob" />);
    const browse = renderToStaticMarkup(<CardSkeleton variant="job" />);
    expect((mine.match(/h-9 w-9/g) || []).length).toBe(2);
    expect(browse).not.toContain("h-9 w-9");
  });
});
