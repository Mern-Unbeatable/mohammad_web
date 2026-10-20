import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Calendar, MapPin, Share2 } from "lucide-react";
import { GeneralPostDetailSkeleton } from "@/components/common/Skeleton";
import PanelPage from "@/components/navigation/panel/PanelPage";
import PanelBackButton from "@/components/navigation/panel/PanelBackButton";
import NotFound from "@/modules/error/NotFound";
import {
  fetchGeneralPostDetails,
  clearSelectedPost,
} from "@/features/dash/admin/general";
import { toGeneralPostModel } from "@/features/dash/admin/general/generalMappers";

const typeStyles = {
  news: "bg-[#FEF3E8] text-[#E67E22]",
  document: "bg-pink-secondary text-pink-light",
};

const AdminGeneralPostDetailView = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();

  const { selectedPost, selectedPostLoading, error } = useSelector(
    (state) => state.adminGeneral,
  );

  useEffect(() => {
    if (postId) {
      dispatch(fetchGeneralPostDetails(postId));
    }
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, postId]);

  const post = useMemo(
    () => toGeneralPostModel(selectedPost),
    [selectedPost],
  );

  if (selectedPostLoading) {
    return (
      <PanelPage>
        <GeneralPostDetailSkeleton />
      </PanelPage>
    );
  }

  if ((error && !selectedPost) || !post) return <NotFound />;

  return (
    <PanelPage>
      <PanelBackButton fallback="/admin/general" />

      {post.image ? (
        <img
          src={post.image}
          alt=""
          className="aspect-[21/9] w-full rounded-2xl object-cover sm:aspect-[16/7]"
        />
      ) : null}

      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
          typeStyles[post.type] || typeStyles.news
        }`}
      >
        {post.type === "news" ? "News" : "Document"}
      </span>

      <h1 className="text-[24px] font-bold leading-tight text-deep-blue sm:text-[28px]">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#98A2B3]">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {post.displayDate}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {post.category}
        </span>
      </div>

      <div className="space-y-4">
        {post.body.map((paragraph, index) => (
          <p
            key={`${index}-${paragraph.slice(0, 24)}`}
            className="text-[14px] leading-[1.75] text-[#475467]"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {post.type === "document" && post.documentUrl ? (
          <a
            href={post.documentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0] sm:flex-none sm:min-w-[200px]"
          >
            Download
          </a>
        ) : null}
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </PanelPage>
  );
};

export default AdminGeneralPostDetailView;
