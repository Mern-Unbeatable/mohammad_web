import { Ban } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import ExpandableText from '@/components/common/ExpandableText/ExpandableText';
import AttachmentCard from './AttachmentCard';
import AuthorLink from './AuthorLink';
import PostImageGallery from './PostImageGallery';
import PostMeta from './PostMeta';

const RepostedPostCard = ({ post }) => {
  if (!post) {
    return (
      <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#98A2B3]">
          <Ban className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-deep-blue">This post is no longer available</p>
          <p className="text-[12px] text-[#64748B]">The original post was deleted by its author.</p>
        </div>
      </div>
    );
  }

  return (
    <article
      className="mt-3 overflow-hidden rounded-lg border border-[#E4E7EC]"
      aria-label={`Original post by ${post.author.name}`}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <AuthorLink
            author={post.author}
            decorative
            className="shrink-0 rounded-full transition-opacity hover:opacity-90"
          >
            <Avatar
              src={post.author.avatar}
              alt={post.author.name}
              initials={post.author.initials}
              size="sm"
            />
          </AuthorLink>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold text-deep-blue">
              <AuthorLink
                author={post.author}
                className="rounded-sm hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {post.author.name}
              </AuthorLink>
            </p>
            <p className="truncate text-[12px] text-[#64748B]">{post.author.subtitle}</p>
            <PostMeta post={post} />
          </div>
        </div>

        {post.content ? (
          <ExpandableText
            text={post.content}
            className="mt-3 text-[14px] leading-relaxed text-[#475467]"
          />
        ) : null}

        {post.attachment && <AttachmentCard attachment={post.attachment} />}

        <PostImageGallery images={post.images} image={post.image} />
      </div>
    </article>
  );
};

export default RepostedPostCard;
