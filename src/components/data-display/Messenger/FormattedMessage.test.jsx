import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import FormattedMessage from "./FormattedMessage";

const render = (text, tone) => renderToStaticMarkup(<FormattedMessage text={text} tone={tone} />);

describe("FormattedMessage", () => {
  it("renders formatting, lists and safe external links", () => {
    const html = render("Hi **team**\n- _one_\n- `two`\n3. see https://lab.eu");

    expect(html).toContain('<strong class="font-semibold">team</strong>');
    expect(html).toMatch(/<ul class="[^"]*list-disc[^"]*"><li[^>]*><em>one<\/em><\/li><li[^>]*><code[^>]*>two<\/code><\/li><\/ul>/);
    expect(html).toMatch(/<ol[^>]*><li[^>]*><span[^>]*>3\.<\/span><span[^>]*>see <a/);
    expect(html).toMatch(/<a href="https:\/\/lab.eu\/" target="_blank" rel="noopener noreferrer nofollow"[^>]*>https:\/\/lab.eu<\/a>/);
  });

  it("keeps line breaks inside a paragraph", () => {
    expect(render("line one\nline two")).toMatch(
      /<p class="whitespace-pre-wrap"><span>line one<\/span><span>\nline two<\/span><\/p>/,
    );
  });

  it("escapes HTML instead of rendering it", () => {
    const html = render('<script>alert(1)</script> <a href="javascript:x">x</a>');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('href="javascript');
    expect(html).toContain("&lt;script&gt;");
  });

  it("styles code and links for the sender's own bubble", () => {
    const html = render("`x` www.lab.eu", "me");
    expect(html).toContain("bg-white/20");
    expect(html).toMatch(/<a[^>]*class="[^"]*text-white/);
  });
});
