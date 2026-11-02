import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchSupplierBlogBySlug,
  fetchSupplierLatestBlogs,
  clearSelectedBlog,
  clearBlogsError,
  toBlogDetailModel,
} from "@/features/dash/supplier/blogs";
import { popularPosts } from "../utils/blogCards";
import { POPULAR_POSTS_LIMIT } from "../constant/constants";

export const useBlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { selectedBlog, selectedBlogLoading, latestBlogs, error } = useSelector(
    (state) => state.supplierBlogs,
  );
  /** Slug whose fetch was rejected; any other slug is not (yet) known to be missing. */
  const [missingSlug, setMissingSlug] = useState(null);

  useEffect(() => {
    if (!slug) return undefined;
    dispatch(clearBlogsError());
    dispatch(fetchSupplierBlogBySlug(slug)).then((result) => {
      if (fetchSupplierBlogBySlug.rejected.match(result)) setMissingSlug(slug);
    });
    dispatch(fetchSupplierLatestBlogs({ pageSize: POPULAR_POSTS_LIMIT }));
    return () => {
      dispatch(clearSelectedBlog());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (error && !selectedBlogLoading) toast.error(error);
  }, [error, selectedBlogLoading]);

  const detail = useMemo(() => toBlogDetailModel(selectedBlog), [selectedBlog]);
  const posts = useMemo(() => popularPosts(latestBlogs, slug), [latestBlogs, slug]);

  return {
    notFound: Boolean(slug) && missingSlug === slug,
    loading: selectedBlogLoading || (!detail && !error),
    detail,
    popularPosts: posts,
  };
};
