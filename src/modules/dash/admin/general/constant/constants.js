export const GENERAL_PATH = "/admin/general";
export const postDetailPath = (postId) => `${GENERAL_PATH}/${postId}`;

export const GENERAL_PAGE_SIZE = 8;
export const DEFAULT_CATEGORY = "All";
export const POST_GRID_CLASS = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export const POST_TYPE = { NEWS: "news", DOCUMENT: "document" };

export const TYPE_STYLES = {
  [POST_TYPE.NEWS]: "bg-[#FEF3E8] text-[#E67E22]",
  [POST_TYPE.DOCUMENT]: "bg-pink-secondary text-pink-light",
};
