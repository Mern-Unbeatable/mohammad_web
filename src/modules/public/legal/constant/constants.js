export const TERMS_PATH = '/terms';

export const PRIVACY_PATH = '/privacy';

export const LEGAL_LAST_UPDATED = 'October 11, 2026';

/** Section counts as "current" once its top passes 24px and until it leaves the top 35%. */
/** Top inset clears the sticky public navbar (up to 84px) plus breathing room. */
export const ACTIVE_SECTION_ROOT_MARGIN = '-112px 0px -60% 0px';
/** How long TOC clicks pin the active item while the smooth scroll runs (fallback when `scrollend` is unsupported). */
export const TOC_SCROLL_LOCK_MS = 1200;

export const SECTION_BODY_CLASS =
  'mt-3 space-y-3 text-[15px] leading-[1.75] text-[#475467] [&_a]:font-medium [&_a]:text-primary [&_a:hover]:underline [&_strong]:font-semibold [&_strong]:text-deep-blue [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5';
