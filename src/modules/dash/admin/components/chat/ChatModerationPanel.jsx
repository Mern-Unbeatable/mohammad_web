import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { ArrowLeft, FileText, Loader2, MessageSquare, Search, Trash2, Users } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';
import FormattedMessage from '@/components/data-display/Messenger/FormattedMessage';
import {
  clearAdminMessagesError,
  fetchModerationConversation,
  fetchModerationConversations,
  fetchModerationThread,
  moderateDeleteConversation,
  moderateDeleteMessage,
  selectModerationConversation,
} from '@/features/dash/admin/messages';
import {
  formatBubbleTime,
  formatEventTime,
  formatMessageTime,
  isImageAttachment,
} from '@/features/messages';

const SEARCH_DEBOUNCE_MS = 300;

const TYPE_OPTIONS = [
  { id: '', label: 'All' },
  { id: 'direct', label: 'Direct' },
  { id: 'group', label: 'Groups' },
];

/** Read-only view of every conversation on the platform, with removal tools. */
const ChatModerationPanel = () => {
  const dispatch = useDispatch();
  const {
    conversations,
    meta,
    listLoading,
    loadingMore,
    selectedId,
    selected,
    messages,
    hasMore,
    threadLoading,
    olderLoading,
    deleting,
    error,
  } = useSelector((state) => state.adminMessages);

  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [pendingMessageId, setPendingMessageId] = useState(null);
  const [confirmDeleteConversation, setConfirmDeleteConversation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    dispatch(fetchModerationConversations({ page: 1, search, type }));
  }, [dispatch, search, type]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    dispatch(clearAdminMessagesError());
  }, [error, dispatch]);

  const openConversation = (id) => {
    dispatch(selectModerationConversation(id));
    dispatch(fetchModerationConversation(id));
    dispatch(fetchModerationThread({ conversationId: id }));
  };

  const handleDeleteMessage = async () => {
    const messageId = pendingMessageId;
    setPendingMessageId(null);
    const result = await dispatch(
      moderateDeleteMessage({ conversationId: selectedId, messageId }),
    );
    if (moderateDeleteMessage.fulfilled.match(result)) toast.success('Message removed');
  };

  const handleDeleteConversation = async () => {
    const result = await dispatch(moderateDeleteConversation(selectedId));
    setConfirmDeleteConversation(false);
    if (moderateDeleteConversation.fulfilled.match(result)) {
      toast.success('Conversation deleted');
    }
  };

  const hasMoreConversations = (meta?.page ?? 1) < (meta?.totalPages ?? 1);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white xl:grid xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside
        className={`min-h-0 flex-col border-[#E4E7EC] xl:flex xl:border-r ${
          selectedId ? 'hidden' : 'flex flex-1'
        }`}
      >
        <div className="shrink-0 space-y-3 border-b border-[#E4E7EC] p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by member or group name..."
              className="w-full rounded-full border border-[#E4E7EC] bg-[#F9FAFB] py-2.5 pl-10 pr-4 text-[13px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="flex gap-1 rounded-xl bg-[#F3F4F6] p-1">
            {TYPE_OPTIONS.map((option) => (
              <button
                key={option.id || 'all'}
                type="button"
                onClick={() => setType(option.id)}
                className={`flex-1 rounded-lg px-3 py-2 text-[12px] font-semibold ${
                  type === option.id ? 'bg-white text-primary shadow-sm' : 'text-[#64748B]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-[#64748B]">
            {meta?.total ?? 0} conversation{meta?.total === 1 ? '' : 's'}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {listLoading && conversations.length === 0 ? (
            <div className="flex justify-center py-10 text-[#98A2B3]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="px-4 py-10 text-center text-[13px] text-[#64748B]">
              No conversations found.
            </p>
          ) : (
            <>
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => openConversation(conversation.id)}
                  className={`flex w-full items-start gap-3 border-b border-[#F2F4F7] px-4 py-3 text-left ${
                    conversation.id === selectedId ? 'bg-secondary' : 'hover:bg-[#F9FAFB]'
                  }`}
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F3FB] text-primary">
                    {conversation.isGroup ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[14px] font-semibold text-deep-blue">
                        {conversation.name}
                      </span>
                      <span className="shrink-0 text-[11px] text-[#98A2B3]">
                        {formatMessageTime(conversation.time)}
                      </span>
                    </span>
                    <span className="block truncate text-[12px] text-[#64748B]">
                      {conversation.preview || 'No messages'}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#98A2B3]">
                      {conversation.participants.length} member
                      {conversation.participants.length === 1 ? '' : 's'} ·{' '}
                      {conversation.messageCount} message
                      {conversation.messageCount === 1 ? '' : 's'}
                    </span>
                  </span>
                </button>
              ))}
              {hasMoreConversations ? (
                <div className="p-3">
                  <button
                    type="button"
                    disabled={loadingMore}
                    onClick={() =>
                      dispatch(
                        fetchModerationConversations({
                          page: (meta?.page ?? 1) + 1,
                          search,
                          type,
                        }),
                      )
                    }
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#E4E7EC] px-4 py-2 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
                  >
                    {loadingMore ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    Load more
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </aside>

      <section className={`min-h-0 flex-col ${selectedId ? 'flex flex-1' : 'hidden xl:flex'}`}>
        {selected ? (
          <>
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#E4E7EC] px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-start gap-2">
                <button
                  type="button"
                  onClick={() => dispatch(selectModerationConversation(null))}
                  className="-ml-1 rounded-lg p-2 text-[#64748B] hover:bg-[#F9FAFB] xl:hidden"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-deep-blue">{selected.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {selected.participants.map((participant) => (
                      <span
                        key={participant.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F4F6] py-0.5 pl-0.5 pr-2 text-[11px] text-[#475467]"
                      >
                        <Avatar
                          src={participant.avatar}
                          alt={participant.name}
                          initials={participant.initials}
                          size="sm"
                          className="!h-5 !w-5 !text-[9px]"
                        />
                        {participant.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDeleteConversation(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#FDA29B] px-3 py-2 text-[12px] font-semibold text-[#CC1016] hover:bg-[#FEF3F2]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete conversation
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
              {hasMore ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    disabled={olderLoading}
                    onClick={() =>
                      dispatch(
                        fetchModerationThread({
                          conversationId: selectedId,
                          before: messages[0]?.time,
                        }),
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EC] px-3 py-1.5 text-[12px] font-medium text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
                  >
                    {olderLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    Load older messages
                  </button>
                </div>
              ) : null}

              {threadLoading && messages.length === 0 ? (
                <div className="flex justify-center py-10 text-[#98A2B3]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <p className="py-10 text-center text-[13px] text-[#98A2B3]">No messages.</p>
              ) : (
                messages.map((message) => message.type === "SYSTEM" ? (
                  <div key={message.id} className="flex flex-col items-center px-2 py-1.5 text-center" role="note">
                    <p className="max-w-[90%] rounded-2xl bg-[#F2F4F7] px-3.5 py-1.5 text-[12px] text-[#475467] break-words">
                      {message.body}
                    </p>
                    <span className="mt-1 text-[10px] text-[#98A2B3]">{formatEventTime(message.time)}</span>
                  </div>
                ) : (
                  <div key={message.id} className="group flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-[#F9FAFB]">
                    <Avatar
                      src={message.senderAvatar}
                      alt={message.sender}
                      initials={message.senderInitials}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px]">
                        <span className="font-semibold text-deep-blue">{message.sender}</span>
                        <span className="ml-2 text-[#98A2B3]">{formatBubbleTime(message.time)}</span>
                      </p>
                      {message.body ? (
                        <div className="mt-0.5 space-y-1.5 break-words text-[13px] text-[#334155]">
                          <FormattedMessage text={message.body} tone="plain" />
                        </div>
                      ) : null}
                      {message.attachments?.length ? (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {message.attachments.map((attachment) => (
                            <a
                              key={attachment.url}
                              href={attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E7EC] px-2 py-1 text-[12px] text-primary hover:bg-white"
                            >
                              {isImageAttachment(attachment) ? null : <FileText className="h-3.5 w-3.5" />}
                              {attachment.name}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingMessageId(message.id)}
                      aria-label="Remove message"
                      className="rounded-md p-1.5 text-[#98A2B3] opacity-0 hover:bg-[#FEF3F2] hover:text-[#CC1016] group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
            <MessageSquare className="h-6 w-6 text-[#98A2B3]" />
            <p className="text-[14px] font-semibold text-deep-blue">Select a conversation</p>
            <p className="max-w-xs text-[13px] text-[#64748B]">
              Review messages and remove content that breaks the platform rules.
            </p>
          </div>
        )}
      </section>

      <ConfirmModal
        open={Boolean(pendingMessageId)}
        title="Remove message?"
        description="The message will be deleted for every participant."
        confirmLabel="Remove"
        confirming={deleting}
        onClose={() => setPendingMessageId(null)}
        onConfirm={handleDeleteMessage}
      />
      <ConfirmModal
        open={confirmDeleteConversation}
        title="Delete conversation?"
        description="All messages in this conversation will be permanently deleted for every participant."
        confirmLabel="Delete"
        confirming={deleting}
        onClose={() => setConfirmDeleteConversation(false)}
        onConfirm={handleDeleteConversation}
      />
    </div>
  );
};

export default ChatModerationPanel;
