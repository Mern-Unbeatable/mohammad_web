import { Share2 } from "lucide-react";

/** Download (documents with a file only) and Share. */
const PostActions = ({ downloadUrl }) => (
  <div className="flex flex-wrap gap-2">
    {downloadUrl ? (
      <a
        href={downloadUrl}
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
);

export default PostActions;
