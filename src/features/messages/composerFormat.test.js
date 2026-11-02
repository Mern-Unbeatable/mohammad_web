import { describe, expect, it } from "vitest";
import { applyComposerFormat, continueList } from "./composerFormat";

describe("applyComposerFormat", () => {
  it("wraps the selection and keeps it selected", () => {
    expect(applyComposerFormat("make this bold", 5, 9, "bold")).toEqual({
      value: "make **this** bold",
      selectionStart: 7,
      selectionEnd: 11,
    });
  });

  it("unwraps when the selection is already wrapped", () => {
    expect(applyComposerFormat("make **this** bold", 7, 11, "bold")).toEqual({
      value: "make this bold",
      selectionStart: 5,
      selectionEnd: 9,
    });
  });

  it("inserts empty marks at the caret and keeps spaces outside the marks", () => {
    expect(applyComposerFormat("hi ", 3, 3, "italic")).toEqual({
      value: "hi __",
      selectionStart: 4,
      selectionEnd: 4,
    });
    expect(applyComposerFormat("say hello there", 3, 10, "code").value).toBe("say `hello` there");
  });

  it("turns selected lines into a list, skipping blank lines, and back", () => {
    const text = "Intro\nfirst\n\nsecond";
    const numbered = applyComposerFormat(text, 6, text.length, "numbered");
    expect(numbered.value).toBe("Intro\n1. first\n\n2. second");

    const bulleted = applyComposerFormat(numbered.value, 6, numbered.value.length, "bullet");
    expect(bulleted.value).toBe("Intro\n- first\n\n- second");

    expect(applyComposerFormat(bulleted.value, 6, bulleted.value.length, "bullet").value).toBe(text);
  });

  it("starts a list on an empty line", () => {
    expect(applyComposerFormat("", 0, 0, "bullet")).toMatchObject({ value: "- ", selectionStart: 2 });
  });
});

describe("continueList", () => {
  it("continues bullets and increments numbers", () => {
    expect(continueList("- milk", 6)).toEqual({ value: "- milk\n- ", caret: 9 });
    expect(continueList("  9) step", 9)).toEqual({ value: "  9) step\n  10) ", caret: 16 });
    expect(continueList("৩. ধাপ", 6).value).toBe("৩. ধাপ\n৩. ");
  });

  it("ends the list on an empty item and ignores plain lines", () => {
    expect(continueList("- milk\n- ", 9)).toEqual({ value: "- milk\n", caret: 7 });
    expect(continueList("just text", 9)).toBeNull();
  });
});
