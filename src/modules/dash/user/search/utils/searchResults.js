import { formatPrice } from "@/modules/dash/user/data/marketplace";
import { DEFAULT_SEARCH_TAB, SEARCH_GROUPS } from "../constant/constants";

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
