import ConversationList from "../components/moderation/ConversationList";
import ThreadPanel from "../components/moderation/ThreadPanel";
import RemovalModals from "../components/moderation/RemovalModals";
import { useChatModeration } from "../hooks/useChatModeration";

/** Read-only view of every conversation on the platform, with removal tools. */
const AdminChatModerationView = () => {
  const { list, thread, removal } = useChatModeration();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white xl:grid xl:grid-cols-[360px_minmax(0,1fr)]">
      <ConversationList list={list} />
      <ThreadPanel open={Boolean(list.selectedId)} thread={thread} />
      <RemovalModals removal={removal} />
    </div>
  );
};

export default AdminChatModerationView;
