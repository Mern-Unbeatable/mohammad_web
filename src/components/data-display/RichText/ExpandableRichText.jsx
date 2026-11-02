import { useEffect, useRef, useState } from "react";
import RichText from "./RichText";

const TOGGLE_CLASS =
  "mt-2 cursor-pointer text-[14px] font-semibold text-primary hover:underline focus-visible:underline focus-visible:outline-none";

/** Bottom of each rendered text line, top to bottom, relative to `box`. */
const lineBottoms = (box) => {
  const lineHeight = parseFloat(getComputedStyle(box).lineHeight) || 0;
  const boxTop = box.getBoundingClientRect().top;
  const range = document.createRange();
  const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
  const rects = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent.trim()) continue;
    range.selectNodeContents(node);
    rects.push(...[...range.getClientRects()].filter((rect) => rect.width > 0));
  }
  rects.sort((a, b) => a.top - b.top);

  const bottoms = [];
  let lastBottom = -Infinity;
  for (const rect of rects) {
    if (rect.top < lastBottom - 1) continue;
    lastBottom = rect.bottom;
    const halfLeading = Math.max(0, (lineHeight - rect.height) / 2);
    bottoms.push(Math.ceil(rect.bottom + halfLeading - boxTop));
  }
  return bottoms;
};

/**
 * `RichText` cut after `lines` text lines with the feed's "See more / See less" toggle.
 * The cut is measured on the rendered lines, so paragraph gaps never split a line.
 */
const ExpandableRichText = ({
  text,
  lines = 5,
  className = "",
  moreLabel = "See more",
  lessLabel = "See less",
}) => {
  const boxRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  /** `undefined` = not measured yet, `null` = fits, number = clamp height in px. */
  const [cutHeight, setCutHeight] = useState(undefined);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || expanded || typeof ResizeObserver === "undefined") return undefined;
    const measure = () => {
      const bottoms = lineBottoms(box);
      setCutHeight(bottoms.length > lines ? bottoms[lines - 1] : null);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [text, lines, expanded]);

  const collapse = () => {
    setExpanded(false);
    const box = boxRef.current;
    if (box && box.getBoundingClientRect().top < 80) box.scrollIntoView({ block: "start" });
  };

  if (!text) return null;

  let clamp;
  if (!expanded && cutHeight !== null) {
    clamp = {
      maxHeight: cutHeight === undefined ? `${lines}lh` : `${cutHeight}px`,
      overflow: "hidden",
    };
  }

  return (
    <div>
      <div ref={boxRef} className={`scroll-mt-20 ${className}`} style={clamp}>
        <RichText text={text} />
      </div>
      {expanded ? (
        <button type="button" onClick={collapse} aria-expanded className={TOGGLE_CLASS}>
          {lessLabel}
        </button>
      ) : typeof cutHeight === "number" ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-expanded={false}
          className={TOGGLE_CLASS}
        >
          {moreLabel}
        </button>
      ) : null}
    </div>
  );
};

export default ExpandableRichText;
