import Skeleton from '@/components/loader/common/Skeleton';

/** Matches the conversation rows in the navbar messages preview. */
const ConversationSkeleton = ({ rows = 3 }) => (
  <div className="space-y-1 p-3" aria-hidden="true">
    {Array.from({ length: rows }, (_, row) => (
      <div key={row} className="flex items-center gap-3 px-1 py-2.5">
        <Skeleton tone="muted" rounded="full" className="h-11 w-11 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton tone="muted" rounded="sm" className="h-3 w-2/3" />
          <Skeleton tone="muted" rounded="sm" className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export default ConversationSkeleton;
