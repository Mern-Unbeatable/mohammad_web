import Avatar from '@/components/ui/Avatar';
import { POST_TYPE_OPTIONS } from '../../utils/postTypeOptions';

/** "Share an update" box at the top of the feed; each chip opens the modal on that post type. */
const FeedComposer = ({ onCreatePost, user }) => (
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
        onClick={() => onCreatePost()}
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

export default FeedComposer;
