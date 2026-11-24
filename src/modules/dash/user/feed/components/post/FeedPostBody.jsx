import ExpandableText from "@/components/common/ExpandableText/ExpandableText";
import AttachmentCard from "./AttachmentCard";
import PostImageGallery from "./PostImageGallery";
import RepostedPostCard from "./RepostedPostCard";

const TEXT_CLASS = "text-[15px] leading-relaxed text-[#344054] sm:text-base";
const PROMO_TAG_CLASS =
  "absolute left-3 rounded-md bg-[#E67E22] px-2 py-1 text-[11px] font-bold text-white";

const PromoImage = ({ post }) => (
  <div className="relative mt-3 overflow-hidden rounded-lg">
    <img
      src={post.image}
      alt=""
      className="aspect-[16/9] w-full object-cover"
      loading="lazy"
    />
    {post.discount && (
      <>
        <span className={`${PROMO_TAG_CLASS} top-3`}>{post.discount}</span>
        <span className={`${PROMO_TAG_CLASS} bottom-3`}>Ends in 29 days</span>
      </>
    )}
  </div>
);

const PromoPricing = ({ post }) => (
  <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
    <div className="flex items-baseline gap-2">
      <span className="text-[28px] font-bold text-green-primary">{post.price}</span>
      {post.originalPrice && (
        <span className="text-[14px] text-[#98A2B3] line-through">
          {post.originalPrice}
        </span>
      )}
    </div>
    <div className="text-right">
      {post.discount && (
        <span className="inline-flex rounded-md bg-[#FEF3E8] px-2 py-0.5 text-[11px] font-semibold text-[#E67E22]">
          {post.discount}
        </span>
      )}
      {post.validUntil && (
        <p className="mt-1 text-[11px] text-[#64748B]">{post.validUntil}</p>
      )}
    </div>
  </div>
);

const RepostBody = ({ post }) => (
  <div className="p-3 sm:p-4">
    {post.content ? <ExpandableText text={post.content} className={TEXT_CLASS} /> : null}
    {post.attachment && <AttachmentCard attachment={post.attachment} />}
    <PostImageGallery images={post.images} image={post.image} />
    <RepostedPostCard post={post.sharedPost} />
  </div>
);

const OriginalBody = ({ post }) => {
  const isPromo = post.type === "promo";

  return (
    <div className="p-3 sm:p-4">
      {post.title && (
        <h4 className="mb-2 text-[16px] font-bold text-deep-blue">{post.title}</h4>
      )}
      <ExpandableText text={post.content} className={TEXT_CLASS} />

      {post.attachment && <AttachmentCard attachment={post.attachment} />}

      {isPromo ? (
        post.image && <PromoImage post={post} />
      ) : (
        <PostImageGallery images={post.images} image={post.image} />
      )}

      {post.type === "sponsored" && post.price && (
        <p className="mt-3 text-[22px] font-bold text-green-primary">{post.price}</p>
      )}

      {isPromo && <PromoPricing post={post} />}

      {post.cta && (
        <button
          type="button"
          className="mt-4 w-full rounded-md bg-pink-light py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          {post.cta}
        </button>
      )}
    </div>
  );
};

const FeedPostBody = ({ post }) =>
  post.isRepost ? <RepostBody post={post} /> : <OriginalBody post={post} />;

export default FeedPostBody;
