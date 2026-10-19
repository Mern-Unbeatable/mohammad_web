import { useCallback, useEffect, useRef, useState } from "react";
import { MdThumbUpOffAlt } from "react-icons/md";
import { getReaction, reactions } from "@/modules/user/data/reactions";

const OPEN_DELAY_MS = 200;
/** Grace period for moving the cursor from the button up to the panel. */
const CLOSE_DELAY_MS = 200;
const LONG_PRESS_MS = 450;

const ReactionButton = ({ reactionId, onReact }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapRef = useRef(null);
  const hoverTimer = useRef(null);
  const longPressTimer = useRef(null);
  const openedByTouch = useRef(false);
  const lastTouchReactAt = useRef(0);
  const selected = getReaction(reactionId);

  const clearHoverTimer = useCallback(() => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  }, []);

  const clearLongPressTimer = () => {
    clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  const scheduleOpen = () => {
    clearHoverTimer();
    if (pickerOpen) return;
    hoverTimer.current = setTimeout(() => setPickerOpen(true), OPEN_DELAY_MS);
  };

  const scheduleClose = () => {
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => setPickerOpen(false), CLOSE_DELAY_MS);
  };

  const handleSelect = (id) => {
    clearHoverTimer();
    setPickerOpen(false);
    onReact(id);
  };

  const handleClick = () => {
    if (Date.now() - lastTouchReactAt.current < 500) return;
    clearHoverTimer();
    setPickerOpen(false);
    onReact(selected ? null : "like");
  };

  const handleTouchStart = () => {
    openedByTouch.current = false;
    clearLongPressTimer();
    longPressTimer.current = setTimeout(() => {
      openedByTouch.current = true;
      setPickerOpen(true);
    }, LONG_PRESS_MS);
  };

  const handleTouchEnd = (e) => {
    clearLongPressTimer();
    if (openedByTouch.current || pickerOpen) return;
    e.preventDefault();
    lastTouchReactAt.current = Date.now();
    onReact(selected ? null : "like");
  };

  useEffect(() => {
    if (!pickerOpen) return undefined;
    const handleOutside = (e) => {
      if (!wrapRef.current?.contains(e.target)) setPickerOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setPickerOpen(false);
    };
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [pickerOpen]);

  useEffect(
    () => () => {
      clearHoverTimer();
      clearLongPressTimer();
    },
    [clearHoverTimer],
  );

  const isLike = selected?.id === "like";
  const buttonColor = !selected
    ? "text-gray-600"
    : isLike
      ? "text-blue-600"
      : selected.color;

  return (
    <div
      ref={wrapRef}
      className="relative flex flex-1"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
    >
      {pickerOpen ? (
        // The ::before strip fills the mb-2 gap so the cursor stays "inside" on its way up.
        <div
          role="menu"
          aria-label="Reactions"
          className="absolute bottom-full left-0 z-50 mb-2 flex origin-bottom-left animate-fade-in-up gap-2 rounded-full border border-gray-100 bg-white p-2 shadow-xl before:absolute before:inset-x-0 before:top-full before:h-2 before:content-['']"
        >
          {reactions.map((reaction) => (
            <button
              key={reaction.id}
              type="button"
              role="menuitem"
              title={reaction.label}
              aria-label={reaction.label}
              onClick={() => handleSelect(reaction.id)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-[22px] transition-transform duration-150 hover:-translate-y-1 hover:scale-125 sm:h-10 sm:w-10 sm:text-[26px] ${
                reaction.id === selected?.id ? "bg-[#F2F4F7]" : ""
              }`}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={clearLongPressTimer}
        onContextMenu={(e) => e.preventDefault()}
        aria-haspopup="menu"
        aria-expanded={pickerOpen}
        aria-pressed={Boolean(selected)}
        className={`flex w-full min-w-0 items-center justify-center gap-1.5 whitespace-nowrap px-1 py-3 text-[13px] font-medium transition-colors hover:bg-[#F9FAFB] sm:gap-2 ${buttonColor}`}
      >
        {!selected ? (
          <MdThumbUpOffAlt aria-hidden="true" className="h-[18px] w-[18px]" />
        ) : (
          <span aria-hidden="true" className="text-[16px] leading-none">
            {selected.emoji}
          </span>
        )}
        {selected ? selected.label : "Like"}
      </button>
    </div>
  );
};

export default ReactionButton;
