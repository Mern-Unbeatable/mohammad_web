import { Share2 } from 'lucide-react';
import { POST_TYPE } from '../../constant/constants';

/** Download (documents with a URL) and Share. */
const PostActions = ({ post, onShare }) => (
  <div className="mt-8 flex flex-wrap gap-2">
    {post.type === POST_TYPE.DOCUMENT && post.documentUrl ? (
      <a
        href={post.documentUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0] sm:flex-none sm:min-w-[200px] sm:text-[14px]"
      >
        Download
      </a>
    ) : null}
    <button
      type="button"
      onClick={onShare}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB] sm:text-[14px]"
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  </div>
);

export default PostActions;
