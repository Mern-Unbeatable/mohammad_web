import { useState } from "react";
import { Link } from "react-router";
import Avatar from "@/components/ui/Avatar";
import FullCommentsModal from "@/components/modals/feed/FullCommentsModal";
import { getReaction, reactions as REACTIONS } from "@/modules/dash/user/data/reactions";
import { usePostReactions } from "../../hooks/usePostReactions";
import { authorProfileHref } from "../../utils/authorProfileHref";

const ReactorRowSkeleton = () => (
  <li className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
    <span className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#EEF2F6]" />
    <span className="flex-1 space-y-2">
      <span className="block h-3 w-1/3 animate-pulse rounded bg-[#EEF2F6]" />
      <span className="block h-2.5 w-1/2 animate-pulse rounded bg-[#EEF2F6]" />
    </span>
  </li>
);

const ReactorRow = ({ reaction, viewerId, onNavigate }) => {
  const { user } = reaction;
  const emoji = getReaction(reaction.type)?.emoji;
  const href = authorProfileHref(user?.id, viewerId);
  const subtitle = [user?.title, user?.company].filter(Boolean).join(" · ");
  const isSelf = Boolean(viewerId && user?.id === viewerId);

  const content = (
    <>
      <span className="relative shrink-0">
        <Avatar src={user?.avatar} alt={user?.name || ""} initials={user?.initials} size="md" />
        {emoji ? (
          <span
            aria-hidden
            className="absolute -bottom-0.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] shadow-sm ring-1 ring-[#E4E7EC]"
          >
            {emoji}
          </span>
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-semibold text-deep-blue">
          {user?.name || "Member"}
          {isSelf ? <span className="font-normal text-[#667085]"> (You)</span> : null}
        </span>
        {subtitle ? (
          <span className="block truncate text-[12px] text-[#667085]">{subtitle}</span>
        ) : null}
      </span>
    </>
  );

  return (
    <li>
      {href ? (
        <Link
          to={href}
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F9FAFB] focus-visible:bg-[#F9FAFB] focus-visible:outline-none sm:px-5"
        >
          {content}
        </Link>
      ) : (
        <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5">{content}</div>
      )}
    </li>
  );
};

/** Who reacted to a post, with an "All" tab plus one tab per reaction used. */
const ReactionsModal = ({ postId, total, reactionCounts, viewerId, onClose }) => {
  const [activeType, setActiveType] = useState("all");
  const { items, loading, error, hasMore, loadingMore, loadMore } = usePostReactions(
    postId,
    activeType,
  );

  const tabs = [
    { id: "all", label: "All", count: total },
    ...REACTIONS.filter((r) => (reactionCounts?.[r.id] ?? 0) > 0)
      .map((r) => ({ id: r.id, emoji: r.emoji, label: r.label, count: reactionCounts[r.id] }))
      .sort((a, b) => b.count - a.count),
  ];

  return (
    <FullCommentsModal open title="Reactions" onClose={onClose} className="max-w-[480px]">
      <div
        role="tablist"
        aria-label="Filter reactions"
        className="sticky top-0 z-10 flex gap-1 overflow-x-auto overflow-y-hidden bg-white px-3 shadow-[inset_0_-1px_0_#E4E7EC] [scrollbar-width:none] sm:px-4 [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const active = tab.id === activeType;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`${tab.label}, ${tab.count}`}
              onClick={() => setActiveType(tab.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-[#667085] hover:text-deep-blue"
              }`}
            >
              {tab.emoji ? <span aria-hidden>{tab.emoji}</span> : tab.label}
              <span aria-hidden>{tab.count.toLocaleString()}</span>
            </button>
          );
        })}
      </div>

      <ul className="py-1.5" aria-busy={loading}>
        {loading ? (
          Array.from({ length: 4 }, (_, i) => <ReactorRowSkeleton key={i} />)
        ) : error ? (
          <li className="px-5 py-8 text-center text-[13px] text-[#667085]">
            Couldn&apos;t load reactions. Please try again.
          </li>
        ) : items.length ? (
          items.map((reaction) => (
            <ReactorRow
              key={reaction.id}
              reaction={reaction}
              viewerId={viewerId}
              onNavigate={onClose}
            />
          ))
        ) : (
          <li className="px-5 py-8 text-center text-[13px] text-[#667085]">No reactions yet.</li>
        )}
      </ul>

      {hasMore ? (
        <div className="px-4 pb-4 sm:px-5">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full rounded-lg border border-[#E4E7EC] py-2 text-[13px] font-semibold text-primary hover:bg-secondary disabled:opacity-60"
          >
            {loadingMore ? "Loading…" : "Show more"}
          </button>
        </div>
      ) : null}
    </FullCommentsModal>
  );
};

export default ReactionsModal;
