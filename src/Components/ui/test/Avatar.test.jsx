import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Avatar from "./Avatar";

const render = (props) => renderToStaticMarkup(<Avatar {...props} />);
const hasIcon = (html) => html.includes("<svg");
const hasImage = (html) => html.includes("<img");

describe("Avatar", () => {
  it("renders the uploaded picture when a valid URL is set", () => {
    const html = render({ src: "https://cdn.example.com/a.png", alt: "Jane Doe", initials: "JD" });
    expect(hasImage(html)).toBe(true);
    expect(html).toContain('src="https://cdn.example.com/a.png"');
  });

  it.each([undefined, null, "", "   ", "null", "undefined"])(
    "shows the first letter of the name when no picture was uploaded (%s)",
    (src) => {
      const html = render({ src, alt: "jane Doe", initials: "JD" });
      expect(hasImage(html)).toBe(false);
      expect(hasIcon(html)).toBe(false);
      expect(html).toMatch(/>J<\/span>/);
    },
  );

  it("falls back to the initials when no name is given", () => {
    expect(render({ initials: "TV" })).toMatch(/>T<\/span>/);
  });

  it.each(["javascript:alert(1)", "data:text/html,hi", "http://[bad"])(
    "shows the default user icon for an unusable URL (%s)",
    (src) => {
      const html = render({ src, alt: "Jane Doe", initials: "JD" });
      expect(hasImage(html)).toBe(false);
      expect(hasIcon(html)).toBe(true);
    },
  );

  it("shows the default user icon when there is neither a picture nor a name", () => {
    expect(hasIcon(render({}))).toBe(true);
  });
});
