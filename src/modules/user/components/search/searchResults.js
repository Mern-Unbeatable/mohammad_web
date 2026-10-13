import {
  BookOpen,
  Briefcase,
  LayoutGrid,
  Newspaper,
  Store,
  Users,
} from "lucide-react";
import { formatPrice } from "@/modules/user/data/marketplace";

export const SEARCH_PATH = "/search";
export const DEFAULT_SEARCH_TAB = "all";

export const SEARCH_TABS = [
  { id: "all", label: "All" },
  { id: "users", label: "People" },
  { id: "jobs", label: "Jobs" },
  { id: "blogs", label: "Blogs" },
  { id: "listings", label: "Listings" },
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

const SEARCH_GROUPS = [
  ["users", "People"],
  ["jobs", "Jobs"],
  ["listings", "Listings"],
  ["posts", "Posts"],
  ["blogs", "Blogs"],
];

export const isSearchTab = (id) => SEARCH_TABS.some((tab) => tab.id === id);

export const searchTabLabel = (id) =>
  SEARCH_TABS.find((tab) => tab.id === id)?.label ?? "";

export const buildSearchPath = (query, tab = DEFAULT_SEARCH_TAB) => {
  const params = new URLSearchParams({ q: query.trim() });
  if (tab && tab !== DEFAULT_SEARCH_TAB && isSearchTab(tab)) {
    params.set("tab", tab);
  }
  return `${SEARCH_PATH}?${params}`;
};

/** Non-empty result groups, in display order, from a `toSearchResultsModel` model. */
export const toSearchGroups = (model) =>
  SEARCH_GROUPS.map(([type, label]) => ({
    type,
    label,
    items: model?.[type] || [],
  })).filter((group) => group.items.length > 0);

/** "All" shows every group capped at `allTabLimit`; other tabs show one full group. */
export const filterSearchGroups = (groups, tab, allTabLimit) =>
  tab === DEFAULT_SEARCH_TAB
    ? groups.map((group) => ({
        ...group,
        items: group.items.slice(0, allTabLimit),
      }))
    : groups.filter((group) => group.type === tab);

export const searchResultHref = (item, type) => {
  if (type === "users") return `/contacts/${item.id}`;
  if (type === "jobs") return `/recruitment/${item.id}`;
  if (type === "listings") return `/marketplace/${item.id}`;
  if (type === "posts") return "/feed";
  if (type === "blogs") return `/blogs/${item.slug || item.id}`;
  return "#";
};

const joinDetails = (...parts) => parts.filter(Boolean).join(" · ");

const personName = (person) =>
  person?.name ||
  [person?.firstName, person?.lastName].filter(Boolean).join(" ") ||
  person?.email ||
  "Member";

/** Title, one-line details and (for people/posts) the avatar to show in a search row. */
export const searchResultDisplay = (item, type) => {
  if (type === "users") {
    const name = personName(item);
    return {
      title: name,
      subtitle: joinDetails(item.title, item.company) || item.country,
      avatar: { src: item.avatar, name, initials: item.initials },
    };
  }
  if (type === "posts") {
    const name = personName(item.author);
    return {
      title: name,
      subtitle: item.content,
      avatar: {
        src: item.author?.avatar,
        name,
        initials: item.author?.initials,
      },
    };
  }
  if (type === "jobs") {
    return {
      title: item.title || "Job",
      subtitle: joinDetails(item.company, item.location),
    };
  }
  if (type === "listings") {
    const price = Number(item.price);
    return {
      title: item.title || "Listing",
      subtitle: joinDetails(
        Number.isFinite(price) ? formatPrice(price) : null,
        item.location,
      ),
    };
  }
  if (type === "blogs") {
    return {
      title: item.title || item.slug || "Blog",
      subtitle: item.category || item.excerpt,
    };
  }
  return { title: item.title || item.name || "Result" };
};
