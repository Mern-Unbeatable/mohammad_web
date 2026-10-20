const ConversationSkeleton = () => (
  <div className="space-y-1 p-3" aria-hidden="true">
    {[0, 1, 2].map((row) => (
      <div key={row} className="flex items-center gap-3 px-1 py-2.5">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-[#EEF2F6]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 animate-pulse rounded bg-[#EEF2F6]" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-[#EEF2F6]" />
        </div>
      </div>
    ))}
  </div>
);

export default ConversationSkeleton;
