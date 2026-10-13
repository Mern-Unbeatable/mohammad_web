import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ImagePlus, X } from "lucide-react";
import Card from "@/components/ui/Card";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import {
  panelPrimaryBtn,
  panelSecondaryBtn,
} from "@/shared/layout/PanelLayout/panelPageTheme";
import {
  blogsApi,
  createBlogPost,
  updateBlogPost,
} from "@/features/admin/blogs";
import { BLOG_CATEGORY_OPTIONS } from "@/features/admin/blogs/blogsMappers";

const labelClass = "mb-1.5 block text-[14px] font-medium text-deep-blue";
const inputClass =
  "w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/15";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

const revokeIfBlob = (url) => {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
};

const AdminCreateBlogView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const editing = location.state?.article;
  const { saving } = useSelector((state) => state.adminBlogs);
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState(
    editing?.category ?? BLOG_CATEGORY_OPTIONS[0],
  );
  const [excerpt, setExcerpt] = useState(editing?.excerpt ?? "");
  const [body, setBody] = useState(editing?.body ?? editing?.excerpt ?? "");
  const [imageUrl, setImageUrl] = useState(editing?.image ?? "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editing?.image ?? "");
  const [readTime, setReadTime] = useState(editing?.readTime ?? "5 min read");
  const [publish, setPublish] = useState(
    editing ? Boolean(editing?.publishedAt) : true,
  );
  const [uploading, setUploading] = useState(false);

  const busy = saving || uploading;

  useEffect(() => {
    return () => revokeIfBlob(imagePreview);
  }, [imagePreview]);

  const validateImage = (file) => {
    if (!file) return false;
    if (file.size > MAX_FILE_BYTES) {
      toast.error(`Image must be ${MAX_FILE_MB}MB or less`);
      return false;
    }
    if (!IMAGE_MIME.has(file.type)) {
      toast.error("Use JPG, PNG, WebP, or GIF");
      return false;
    }
    return true;
  };

  const handlePickImage = (file) => {
    if (busy || !validateImage(file)) return;
    revokeIfBlob(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUrl("");
  };

  const handleClearImage = () => {
    if (busy) return;
    revokeIfBlob(imagePreview);
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;

    const payload = {
      title: title.trim(),
      category: category.trim(),
      excerpt: excerpt.trim(),
      body: body.trim() || excerpt.trim(),
      readTime: readTime.trim() || undefined,
      publish,
    };

    setUploading(true);
    try {
      let nextImageUrl = imageUrl.trim();

      if (imageFile) {
        const uploaded = await blogsApi.uploadFile(imageFile);
        nextImageUrl = uploaded.url;
      }

      if (nextImageUrl) {
        payload.image = nextImageUrl;
      }

      const result = editing?.id
        ? await dispatch(
            updateBlogPost({
              blogId: editing.id,
              payload,
            }),
          )
        : await dispatch(createBlogPost(payload));

      const matched = editing?.id
        ? updateBlogPost.fulfilled.match(result)
        : createBlogPost.fulfilled.match(result);

      if (matched) {
        toast.success(editing?.id ? "Blog updated" : "Blog published");
        navigate("/admin/blogs");
        return;
      }

      toast.error(result.payload || "Failed to save blog");
    } catch (err) {
      toast.error(blogsApi.getApiErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <PanelPage>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
        Blogs
      </p>

      <PanelPageHeader
        title={editing ? "Edit Blog Post" : "Create New Blog Post"}
        subtitle="Fill in the details to publish or save as draft."
      />

      <Card className="p-4 sm:p-5">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="blog-headline" className={labelClass}>
              Headline
            </label>
            <input
              id="blog-headline"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Write title"
              className={inputClass}
              required
              disabled={busy}
            />
          </div>

          <div>
            <label htmlFor="blog-category" className={labelClass}>
              Category
            </label>
            <select
              id="blog-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClass}
              required
              disabled={busy}
            >
              {BLOG_CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="blog-description" className={labelClass}>
              Excerpt
            </label>
            <textarea
              id="blog-description"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Short summary shown on cards"
              rows={3}
              className={`${inputClass} resize-none`}
              required
              disabled={busy}
            />
          </div>

          <div>
            <label htmlFor="blog-body" className={labelClass}>
              Body
            </label>
            <textarea
              id="blog-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Full article content"
              rows={8}
              className={`${inputClass} resize-y`}
              required
              disabled={busy}
            />
          </div>

          <div>
            <p className={labelClass}>Cover image</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="hidden"
              disabled={busy}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) handlePickImage(file);
              }}
            />

            {imagePreview ? (
              <div className="overflow-hidden rounded-xl border border-[#D0D5DD] bg-[#F9FAFB]">
                <img
                  src={imagePreview}
                  alt=""
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="flex gap-2 border-t border-[#E4E7EC] p-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 rounded-md border border-[#D0D5DD] px-3 py-2 text-[12px] font-semibold text-[#475467] hover:bg-white disabled:opacity-50"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleClearImage}
                    className="inline-flex items-center justify-center rounded-md border border-[#D0D5DD] px-3 py-2 text-[#CC1016] hover:bg-white disabled:opacity-50"
                    aria-label="Remove cover image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-8 text-center transition-colors hover:border-primary hover:bg-secondary/40 disabled:opacity-50 sm:px-6 sm:py-10"
              >
                <ImagePlus className="mb-3 h-8 w-8 text-[#98A2B3]" />
                <span className="text-[14px] font-semibold text-deep-blue">
                  Click to upload cover image
                </span>
                <span className="mt-1 text-[12px] text-[#64748B]">
                  JPG, PNG, WebP or GIF — up to {MAX_FILE_MB} MB
                </span>
              </button>
            )}

            {!imageFile ? (
              <div className="mt-3">
                <label htmlFor="blog-image-url" className={labelClass}>
                  Or paste image URL
                </label>
                <input
                  id="blog-image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(event) => {
                    const next = event.target.value;
                    setImageUrl(next);
                    setImageFile(null);
                    revokeIfBlob(imagePreview);
                    setImagePreview(next.trim());
                  }}
                  placeholder="https://…"
                  className={inputClass}
                  disabled={busy}
                />
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="blog-read-time" className={labelClass}>
                Read time
              </label>
              <input
                id="blog-read-time"
                type="text"
                value={readTime}
                onChange={(event) => setReadTime(event.target.value)}
                placeholder="5 min read"
                className={inputClass}
                disabled={busy}
              />
            </div>
            <label className="mt-7 flex items-center gap-2 text-[14px] text-deep-blue">
              <input
                type="checkbox"
                checked={publish}
                onChange={(event) => setPublish(event.target.checked)}
                className="h-4 w-4 rounded border-[#D0D5DD] text-primary focus:ring-primary"
                disabled={busy}
              />
              Publish immediately
            </label>
          </div>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
            <button
              type="submit"
              disabled={busy}
              className={`${panelPrimaryBtn} w-full sm:w-auto disabled:opacity-60`}
            >
              {uploading
                ? "Uploading…"
                : saving
                  ? "Saving…"
                  : editing
                    ? "Update"
                    : publish
                      ? "Publish"
                      : "Save draft"}
            </button>
            <Link
              to="/admin/blogs"
              className={`${panelSecondaryBtn} w-full sm:w-auto ${busy ? "pointer-events-none opacity-60" : ""}`}
            >
              Cancel
            </Link>
          </div>
        </form>
      </Card>
    </PanelPage>
  );
};

export default AdminCreateBlogView;
