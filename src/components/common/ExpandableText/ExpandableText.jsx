import { Fragment, useEffect, useRef, useState } from 'react';
import { splitHighlights } from './splitHighlights';

const ELLIPSIS = '\u2026';
/** How far back (in characters) the cut may move to land on a word boundary. */
const WORD_BACKTRACK = 24;

const clampStyle = (lines) => ({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lines,
  overflow: 'hidden',
});

/**
 * Facebook-style "See more / See less" for long plain-text content.
 *
 * Collapsed, the text is cut so that "… See more" ends exactly on the last of
 * `lines` lines, with the toggle inline right after the dots. The cut is found
 * with a binary search on an invisible copy of the paragraph (same width and
 * classes) and recomputed whenever the width changes. Until the first
 * measurement, CSS line-clamp keeps the text at `lines` lines.
 *
 * `highlight` ({ pattern, className }) wraps matching parts (e.g. @mentions) in a
 * styled span, in both the visible text and the measuring copy. Keep `pattern`
 * stable (module-level) so it doesn't re-trigger measuring on every render.
 */
const ExpandableText = ({
  text,
  lines = 2,
  className = '',
  moreLabel = 'See more',
  lessLabel = 'See less',
  highlight,
}) => {
  const textRef = useRef(null);
  const measureRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  /** `undefined` = not measured yet, `null` = fits, number = characters to keep. */
  const [cut, setCut] = useState(undefined);
  const highlightPattern = highlight?.pattern;
  const highlightClass = highlight?.className || '';

  useEffect(() => {
    const box = measureRef.current;
    if (!box || !text) return undefined;

    const body = document.createElement('span');
    const label = document.createElement('span');
    label.className = 'font-semibold';
    label.textContent = moreLabel;
    const suffix = document.createElement('span');
    suffix.append(`${ELLIPSIS} `, label);
    box.replaceChildren(body, suffix);

    const fill = (value) => {
      body.replaceChildren(
        ...splitHighlights(value, highlightPattern).map((part) => {
          if (!part.highlight) return document.createTextNode(part.text);
          const span = document.createElement('span');
          span.className = highlightClass;
          span.textContent = part.text;
          return span;
        }),
      );
    };

    const measure = () => {
      const style = getComputedStyle(box);
      const lineHeight =
        parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
      const maxHeight = lineHeight * lines + 1;

      fill(text);
      suffix.hidden = true;
      if (box.scrollHeight <= maxHeight) {
        setCut(null);
        return;
      }

      suffix.hidden = false;
      const fits = (count) => {
        fill(text.slice(0, count).trimEnd());
        return box.scrollHeight <= maxHeight;
      };
      let low = 0;
      let high = text.length;
      while (low < high) {
        const mid = Math.ceil((low + high) / 2);
        if (fits(mid)) low = mid;
        else high = mid - 1;
      }

      const head = text.slice(0, low);
      const wordEnd = head.lastIndexOf(' ');
      const onSameLine = wordEnd > head.lastIndexOf('\n');
      setCut(
        wordEnd > 0 && onSameLine && low - wordEnd <= WORD_BACKTRACK
          ? wordEnd
          : low,
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [text, lines, moreLabel, highlightPattern, highlightClass]);

  const collapse = () => {
    setExpanded(false);
    const el = textRef.current;
    if (!el) return;
    const headerOffset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    if (el.getBoundingClientRect().top < headerOffset) {
      el.scrollIntoView({ block: 'start' });
    }
  };

  if (!text) return null;

  const toggleClass =
    'inline cursor-pointer font-semibold text-primary hover:underline focus-visible:underline focus-visible:outline-none';

  const renderText = (value) =>
    splitHighlights(value, highlightPattern).map((part, index) =>
      part.highlight ? (
        <span key={index} className={highlightClass}>
          {part.text}
        </span>
      ) : (
        <Fragment key={index}>{part.text}</Fragment>
      ),
    );

  let content = renderText(text);
  if (expanded) {
    content = (
      <>
        {renderText(text)}{' '}
        <button type="button" onClick={collapse} aria-expanded className={toggleClass}>
          {lessLabel}
        </button>
      </>
    );
  } else if (typeof cut === 'number') {
    content = (
      <>
        {renderText(text.slice(0, cut).trimEnd())}
        {`${ELLIPSIS} `}
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-expanded={false}
          className={toggleClass}
        >
          {moreLabel}
        </button>
      </>
    );
  }

  return (
    <div className="relative">
      <p
        ref={textRef}
        className={`scroll-mt-20 whitespace-pre-wrap break-words ${className}`}
        style={!expanded && cut === undefined ? clampStyle(lines) : undefined}
      >
        {content}
      </p>
      <p
        ref={measureRef}
        aria-hidden="true"
        className={`pointer-events-none invisible absolute inset-x-0 top-0 whitespace-pre-wrap break-words ${className}`}
      />
    </div>
  );
};

export default ExpandableText;
