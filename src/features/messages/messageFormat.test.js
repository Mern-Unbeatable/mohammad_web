import { describe, expect, it } from "vitest";
import { parseInline, parseMessage, stripFormatting } from "./messageFormat";

describe("parseInline", () => {
  it("parses bold, italic, strike and code", () => {
    expect(parseInline("a **b** _c_ *d* ~~e~~ `f **g**` __h__")).toEqual([
      "a ",
      { type: "bold", children: ["b"] },
      " ",
      { type: "italic", children: ["c"] },
      " ",
      { type: "italic", children: ["d"] },
      " ",
      { type: "strike", children: ["e"] },
      " ",
      { type: "code", text: "f **g**" },
      " ",
      { type: "bold", children: ["h"] },
    ]);
  });

  it("nests italic inside bold", () => {
    expect(parseInline("**very _important_**")).toEqual([
      { type: "bold", children: ["very ", { type: "italic", children: ["important"] }] },
    ]);
  });

  it("leaves snake_case, math and lone markers alone", () => {
    expect(parseInline("file_name_here 2 * 3 * 4 ** x")).toEqual(["file_name_here 2 * 3 * 4 ** x"]);
    expect(parseInline("** not bold **")).toEqual(["** not bold **"]);
  });

  it("links http(s) and www URLs, keeping trailing punctuation outside", () => {
    expect(parseInline("See https://lab.eu/a_b_c, or www.lab.eu.")).toEqual([
      "See ",
      { type: "link", href: "https://lab.eu/a_b_c", text: "https://lab.eu/a_b_c" },
      ", or ",
      { type: "link", href: "https://www.lab.eu/", text: "www.lab.eu" },
      ".",
    ]);
    expect(parseInline("(https://en.wikipedia.org/wiki/Pipette_(tool))")[1]).toMatchObject({
      text: "https://en.wikipedia.org/wiki/Pipette_(tool)",
    });
  });

  it("never links other schemes and keeps markup as text", () => {
    expect(parseInline("javascript:alert(1) <img src=x onerror=alert(1)>")).toEqual([
      "javascript:alert(1) <img src=x onerror=alert(1)>",
    ]);
  });
});

describe("parseMessage", () => {
  it("groups paragraphs, bullet lists and numbered lists, keeping line breaks", () => {
    const blocks = parseMessage("Hi team\nPlease check:\n- **pH** meter\n* scale\n\n2. calibrate\n3) log it\nThanks");
    expect(blocks.map((b) => b.type)).toEqual(["p", "ul", "p", "ol", "p"]);
    expect(blocks[0].items).toEqual([["Hi team"], ["Please check:"]]);
    expect(blocks[1].items).toEqual([[{ type: "bold", children: ["pH"] }, " meter"], ["scale"]]);
    expect(blocks[3]).toMatchObject({ markers: ["2.", "3)"], items: [["calibrate"], ["log it"]] });
  });

  it("keeps numbered markers in any script, as typed", () => {
    const [block] = parseMessage("৩. Listing Image Cropping\n৪. Resize");
    expect(block).toMatchObject({ type: "ol", markers: ["৩.", "৪."] });
  });

  it("does not treat *italic* at the start of a line as a bullet", () => {
    expect(parseMessage("*urgent* today")[0]).toMatchObject({ type: "p" });
  });
});

describe("stripFormatting", () => {
  it("returns one plain line for previews", () => {
    expect(stripFormatting("**Implementation** notes:\n- use `npm ci`\n- see www.lab.eu")).toBe(
      "Implementation notes: use npm ci see www.lab.eu",
    );
    expect(stripFormatting("")).toBe("");
    expect(stripFormatting(undefined)).toBe("");
  });
});
