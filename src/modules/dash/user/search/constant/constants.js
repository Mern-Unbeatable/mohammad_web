import {
  BookOpen,
  Briefcase,
  LayoutGrid,
  Newspaper,
  Store,
  Users,
} from "lucide-react";

/* ---------- Routes and URL ---------- */

export const SEARCH_PATH = "/search";
export const QUERY_PARAM = "q";
export const TAB_PARAM = "tab";

/* ---------- Tabs and groups ---------- */

export const DEFAULT_SEARCH_TAB = "all";

export const SEARCH_TABS = [
  { id: "all", label: "All" },
  { id: "users", label: "People" },
  { id: "jobs", label: "Jobs" },
  { id: "blogs", label: "Blogs" },
  { id: "listings", label: "Listings" },
];

/** Result groups in display order: [type, label]. Posts have no tab of their own. */
export const SEARCH_GROUPS = [
  ["users", "People"],
  ["jobs", "Jobs"],
  ["listings", "Listings"],
  ["posts", "Posts"],
  ["blogs", "Blogs"],
];

export const SEARCH_TYPE_ICONS = {
  all: LayoutGrid,
  users: Users,
  jobs: Briefcase,
  listings: Store,
  posts: Newspaper,
  blogs: BookOpen,
};

export const SEARCH_TILE_STYLES = {
  jobs: "bg-amber-50 text-amber-600",
  listings: "bg-emerald-50 text-emerald-600",
  blogs: "bg-violet-50 text-violet-600",
};

/* ---------- Search page ---------- */

/** Results fetched per type on the /search page. */
export const PAGE_FETCH_LIMIT = 20;
/** Rows per group on the "All" tab before "See all". */
export const ALL_TAB_GROUP_LIMIT = 5;
