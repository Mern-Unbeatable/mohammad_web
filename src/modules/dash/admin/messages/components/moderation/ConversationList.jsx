import { Loader2 } from "lucide-react";
import Spinner from "../common/Spinner";
import ConversationFilters from "./ConversationFilters";
import ConversationItem from "./ConversationItem";

/** Left column: filters and the conversation rows with Load more. Hidden on small screens while a thread is open. */
const ConversationList = ({ list }) => (
  <aside
    className={`min-h-0 flex-col border-[#E4E7EC] xl:flex xl:border-r ${
      list.selectedId ? "hidden" : "flex flex-1"
    }`}
  >
    <ConversationFilters
      query={list.query}
      onQueryChange={list.setQuery}
      type={list.type}
      onTypeChange={list.setType}
      total={list.total}
    />

    <div className="min-h-0 flex-1 overflow-y-auto">
      {list.loading ? (
        <Spinner />
      ) : list.error && list.conversations.length === 0 ? (
        <div role="alert" className="px-4 py-10 text-center">
          <p className="text-[13px] text-[#B42318]">{list.error}</p>
          {list.retry ? (
            <button
              type="button"
              onClick={list.retry}
              className="mt-3 inline-flex items-center justify-center rounded-lg border border-[#E4E7EC] px-4 py-2 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Try again
            </button>
          ) : null}
        </div>
      ) : list.conversations.length === 0 ? (
        <p className="px-4 py-10 text-center text-[13px] text-[#64748B]">No conversations found.</p>
      ) : (
        <>
          {list.conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === list.selectedId}
              onOpen={list.open}
            />
          ))}
          {list.hasMore ? (
            <div className="p-3">
              <button
                type="button"
                disabled={list.loadingMore}
                onClick={list.loadMore}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#E4E7EC] px-4 py-2 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
              >
                {list.loadingMore ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Load more
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  </aside>
);

export default ConversationList;
