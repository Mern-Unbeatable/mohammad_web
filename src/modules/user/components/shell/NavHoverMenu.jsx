import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

const OPEN_DELAY_MS = 120;
const CLOSE_DELAY_MS = 200;

/**
 * Hover/focus preview panel around a navbar link. Clicking the link still
 * navigates; `onOpen` runs each time the panel opens so content stays fresh.
 * `children` is the trigger, `body` the scrollable content; clicking any link
 * or button inside closes the panel.
 */
const NavHoverMenu = ({
  children,
  title,
  footerLabel,
  footerTo,
  onOpen,
  body,
}) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const show = () => {
    clearTimeout(timerRef.current);
    if (open) return;
    timerRef.current = setTimeout(() => {
      setOpen(true);
      onOpen?.();
    }, OPEN_DELAY_MS);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  const close = () => {
    clearTimeout(timerRef.current);
    setOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
      onClick={(event) => {
        if (event.target.closest("a, button")) close();
      }}
    >
      {children}

      {open ? (
        <div
          role="dialog"
          aria-label={title}
          className="absolute right-0 top-[calc(100%+8px)] z-[80] w-[360px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
        >
          <div className="border-b border-[#E4E7EC] px-4 py-3">
            <p className="text-[15px] font-bold text-deep-blue">{title}</p>
          </div>

          <div className="max-h-[min(420px,calc(100dvh-10rem))] overflow-y-auto overscroll-contain">
            {body}
          </div>

          <Link
            to={footerTo}
            className="block border-t border-[#E4E7EC] px-4 py-2.5 text-center text-[13px] font-semibold text-primary hover:bg-[#F9FAFB]"
          >
            {footerLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default NavHoverMenu;
