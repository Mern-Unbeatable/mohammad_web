import { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchSupplierGeneralPosts,
  clearGeneralError,
  invalidateGeneralPostsList,
} from "@/features/dash/supplier/general";
import { buildPostsQuery } from "../utils/generalQueries";
import { DEFAULT_CATEGORY } from "../constant/constants";

/**
 * Category + page for a posts list (all posts, or `mine`). Changing either
 * clears the current cards so skeletons show instead of stale posts.
 */
export const usePostsListing = ({ mine = false } = {}) => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [page, setPage] = useState(1);

  useLayoutEffect(() => {
    dispatch(clearGeneralError());
    dispatch(fetchSupplierGeneralPosts(buildPostsQuery({ page, category, mine })));
  }, [dispatch, page, category, mine]);

  const changeCategory = (next) => {
    if (next === category) return;
    dispatch(invalidateGeneralPostsList());
    setCategory(next);
    setPage(1);
  };

  const changePage = (next) => {
    if (next === page) return;
    dispatch(invalidateGeneralPostsList());
    setPage(next);
  };

  /** After creating a post: reload page 1 of the current category. */
  const reloadFirstPage = () => {
    dispatch(invalidateGeneralPostsList());
    dispatch(fetchSupplierGeneralPosts(buildPostsQuery({ page: 1, category, mine })));
    setPage(1);
  };

  return { category, changeCategory, page, changePage, reloadFirstPage };
};
