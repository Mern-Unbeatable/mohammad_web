import { FileText } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { POST_TYPE_OPTIONS } from './postTypeOptions';

export { PostStats, PostActions } from './PostActionsBar';

export const AttachmentCard = ({ attachment }) => (
  <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
      <FileText className="h-5 w-5 text-primary" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-[13px] font-semibold text-deep-blue">{attachment.name}</p>
      <p className="text-[12px] text-[#64748B]">{attachment.meta}</p>
    </div>
    {attachment.url ? (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        download={attachment.name}
        className="shrink-0 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
      >
        Download
      </a>
    ) : (
      <button
        type="button"
        className="shrink-0 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
      >
        Download
      </button>
    )}
  </div>
);

export const FeedComposer = ({ onCreatePost, user }) => (
  <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
    <div className="flex gap-3">
      <Avatar
        src={user?.avatar}
        alt={user?.name || 'Member'}
        initials={user?.initials || 'MB'}
        size="md"
      />
      <button
        type="button"
        onClick={onCreatePost}
        className="flex-1 rounded-full border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-2.5 text-left text-[14px] text-[#98A2B3] transition-colors hover:border-[#D0D5DD] hover:bg-white"
      >
        Share an update with the laboratory community...
      </button>
    </div>
    <div className="mt-3 flex flex-wrap gap-2 border-t border-[#E4E7EC] pt-3">
      {POST_TYPE_OPTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onCreatePost(id)}
          className="rounded-full border border-[#E4E7EC] px-3.5 py-1.5 text-[12px] font-semibold text-[#475467] transition-colors hover:border-primary hover:text-primary"
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);

export const FeedFilters = ({ filters, activeFilter, onChange }) => (
  <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
    {filters.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        aria-pressed={activeFilter === id}
        className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors sm:px-4 ${
          activeFilter === id
            ? 'bg-primary text-white'
            : 'border border-[#E4E7EC] bg-white text-[#475467] hover:border-primary/40'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
