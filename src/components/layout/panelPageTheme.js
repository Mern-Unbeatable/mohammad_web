export const panelPageTheme = {
  page: "space-y-4",
  title: "text-[22px] font-bold leading-tight text-deep-blue sm:text-[26px]",
  subtitle: "mt-0.5 text-[14px] leading-snug text-[#64748B] sm:text-[16px]",
  sectionGap: "space-y-3",
  cardTitle:
    "text-[15px] font-bold text-deep-blue sm:text-[16px] lg:text-[17px]",
  cardSubtitle: "text-[13px] text-[#64748B] sm:text-[14px] lg:text-[15px]",
  cardEyebrow:
    "text-[12px] font-bold uppercase tracking-wide text-primary sm:text-[13px] lg:text-[14px]",
  cardBody: "text-[13px] text-deep-blue sm:text-[14px] lg:text-[15px]",
};

/** `fill` and `bleed` read the `.panel-shell` variables set by PanelLayout (index.css). */
export const panelPageLayouts = {
  stack: "",
  fill: "panel-fill-height flex flex-col",
  bleed: "panel-bleed",
};

export const panelPageWidths = {
  full: "",
  narrow: "mx-auto max-w-[760px]",
  small: "mx-auto max-w-[880px]",
  wide: "mx-auto max-w-[1160px]",
};

export const panelPrimaryBtn =
  "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#066BB0]";

export const panelSecondaryBtn =
  "inline-flex items-center justify-center rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#64748B] transition-colors hover:bg-[#F9FAFB]";
