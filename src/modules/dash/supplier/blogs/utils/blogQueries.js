import { BLOGS_PAGE_SIZE } from "../constant/constants";

const withSearch = (params, query) => {
  const search = query?.trim();
  return search ? { ...params, search } : params;
};

export const buildLatestBlogsQuery = (query) => withSearch({}, query);

export const buildBlogsQuery = ({ page, query }) =>
  withSearch({ page, pageSize: BLOGS_PAGE_SIZE, sort: "desc" }, query);
