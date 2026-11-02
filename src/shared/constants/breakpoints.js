/** Tailwind's default breakpoints (index.css defines no custom ones), in px. */
export const BREAKPOINTS = Object.freeze({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
});

/** Matches the same widths as the Tailwind `{name}:` variant. */
export const minWidthQuery = (name) => `(min-width: ${BREAKPOINTS[name]}px)`;

/** Matches the same widths as the Tailwind `max-{name}:` variant. */
export const maxWidthQuery = (name) => `(max-width: ${BREAKPOINTS[name] - 1}px)`;
