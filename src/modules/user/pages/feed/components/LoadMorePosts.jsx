import { ChevronDown, Loader2 } from "lucide-react";

const LoadMorePosts = ({ onClick, loading = false, label = "Show more posts" }) => (
  <div className="flex justify-center pt-1">
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
      className="inline-flex items-center gap-2 rounded-full border border-[#E4E7EC] bg-white px-5 py-2 text-[14px] font-semibold text-deep-blue shadow-sm transition-colors hover:border-primary hover:text-primary disabled:cursor-wait disabled:opacity-70"
    >
      {loading ? (
        <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
      ) : (
        <ChevronDown aria-hidden className="h-4 w-4" />
      )}
      {loading ? "Loading..." : label}
    </button>
  </div>
);

export default LoadMorePosts;
