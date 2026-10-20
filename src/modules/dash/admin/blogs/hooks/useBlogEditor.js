import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { blogsApi, createBlogPost, updateBlogPost } from "@/features/dash/admin/blogs";
import { BLOGS_PATH } from "../constant/constants";
import {
  buildBlogPayload,
  imageFileError,
  initialBlogFields,
  revokeIfBlob,
} from "../utils/blogForm";

/**
 * Create, or edit the article passed as `location.state.article`: text fields,
 * cover image (upload or URL, with a local preview) and submit.
 */
export const useBlogEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const editing = location.state?.article;
  const saving = useSelector((state) => state.adminBlogs.saving);
  const fileInputRef = useRef(null);

  const [fields, setFields] = useState(() => initialBlogFields(editing));
  const [imageUrl, setImageUrl] = useState(editing?.image ?? "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editing?.image ?? "");
  const [uploading, setUploading] = useState(false);

  const busy = saving || uploading;

  useEffect(() => () => revokeIfBlob(imagePreview), [imagePreview]);

  const setField = (key) => (value) => setFields((prev) => ({ ...prev, [key]: value }));

  const pickImage = (file) => {
    if (busy || !file) return;
    const invalid = imageFileError(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    revokeIfBlob(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUrl("");
  };

  const clearImage = () => {
    if (busy) return;
    revokeIfBlob(imagePreview);
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
  };

  const changeImageUrl = (next) => {
    setImageUrl(next);
    setImageFile(null);
    revokeIfBlob(imagePreview);
    setImagePreview(next.trim());
  };

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;

    const payload = buildBlogPayload(fields);

    setUploading(true);
    try {
      let nextImageUrl = imageUrl.trim();
      if (imageFile) {
        const uploaded = await blogsApi.uploadFile(imageFile);
        nextImageUrl = uploaded.url;
      }
      if (nextImageUrl) payload.image = nextImageUrl;

      const result = editing?.id
        ? await dispatch(updateBlogPost({ blogId: editing.id, payload }))
        : await dispatch(createBlogPost(payload));
      const ok = editing?.id
        ? updateBlogPost.fulfilled.match(result)
        : createBlogPost.fulfilled.match(result);

      if (ok) {
        toast.success(editing?.id ? "Blog updated" : "Blog published");
        navigate(BLOGS_PATH);
        return;
      }
      toast.error(result.payload || "Failed to save blog");
    } catch (err) {
      toast.error(blogsApi.getApiErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploading(false);
    }
  };

  return {
    isEdit: Boolean(editing),
    fields,
    setField,
    fileInputRef,
    imageUrl,
    imageFile,
    imagePreview,
    pickImage,
    clearImage,
    changeImageUrl,
    saving,
    uploading,
    busy,
    submit,
  };
};
