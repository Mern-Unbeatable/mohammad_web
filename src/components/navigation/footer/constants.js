import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { ABOUT_PATH } from "@/modules/public/about";
import { CONTACT_PATH } from "@/modules/public/contact";
import { PUBLIC_GENERAL_PATH } from "@/modules/public/general";
import { PRIVACY_PATH, TERMS_PATH } from "@/modules/public/legal";
import {
  JOIN_PATH,
  PRICING_PATH,
} from "@/modules/public/pricing/constant/constants";

export const FOOTER_TAGLINE =
  "Lab Unity connects laboratory professionals, organisations, and suppliers so the industry can collaborate with clarity and confidence.";

/** Social destinations shown under the brand column. */
export const FOOTER_SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

/** Company column links. */
export const FOOTER_COMPANY_LINKS = [
  { to: ABOUT_PATH, label: "About" },
  { to: PUBLIC_GENERAL_PATH, label: "General posts" },
  { to: JOIN_PATH, label: "Join free" },
];

/** Help column links. */
export const FOOTER_HELP_LINKS = [
  { to: CONTACT_PATH, label: "Contact & support" },
  {
    to: TERMS_PATH,
    label: "Terms & conditions",
    fullLabel: "Terms of Use and Sale",
  },
  { to: PRIVACY_PATH, label: "Privacy policy", fullLabel: "Privacy Policy" },
];

/** Compact authenticated-dashboard footer links. */
export const AUTH_FOOTER_LINKS = [
  { to: ABOUT_PATH, label: "About" },
  { to: PUBLIC_GENERAL_PATH, label: "General" },
  { to: TERMS_PATH, label: "Terms of Use and Sale" },
  { to: PRIVACY_PATH, label: "Privacy Policy" },
  { to: CONTACT_PATH, label: "Contact Us" },
];
