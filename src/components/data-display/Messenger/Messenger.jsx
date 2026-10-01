import { useLayoutEffect, useRef } from 'react';
import {
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  LogOut,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import ChatListingCard from './ChatListingCard';

const FILE_ACCEPT =
  'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,video/mp4,video/quicktime';

const isImage = (attachment) => String(attachment?.mimeType || '').startsWith('image/');

const formatSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ChatAvatar = ({ chat, size = 'md' }) =>
  chat.avatar ? (
    <Avatar src={chat.avatar} alt={chat.name} initials={chat.initials} size={size} />
  ) : (
    <Avatar initials={chat.initials} size={size} className={chat.avatarClass} />
  );

const ChatName = ({ chat, className }) => (
  <span className="flex min-w-0 items-center gap-1.5">
    <span className={`truncate ${className}`}>{chat.name}</span>
    {chat.isAdmin ? (
      <span className="shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-wide text-primary">
        Admin
      </span>
    ) : null}
  </span>
);

const ConversationItem = ({ chat, active, onClick, showOnline = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-3 border-b border-[#E4E7EC] px-4 py-3.5 text-left transition-colors last:border-b-0 xl:border-b-0 xl:py-3 ${
      active ? 'bg-secondary' : 'bg-white hover:bg-[#F9FAFB]'
    }`}
  >
    <div className="relative shrink-0">
      <ChatAvatar chat={chat} />
      {showOnline && chat.online ? (
        <span
          className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-primary"
          aria-label="Online"
        />
      ) : null}
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <ChatName chat={chat} className="text-[14px] font-semibold text-deep-blue" />
        <span className="shrink-0 text-[11px] text-[#98A2B3]">{chat.time}</span>
      </div>
      <p
        className={`mt-0.5 truncate text-[12px] ${
          chat.unread > 0 ? 'font-semibold text-deep-blue' : 'text-[#64748B]'
        }`}
      >
        {chat.preview}
      </p>
    </div>

    {chat.unread > 0 ? (
      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#CC1016] px-1.5 text-[10px] font-bold text-white">
        {chat.unread > 99 ? '99+' : chat.unread}
      </span>
    ) : null}
  </button>
);

const ConversationListSkeleton = () => (
  <div className="space-y-1 p-3" aria-hidden="true">
    {[0, 1, 2, 3, 4].map((row) => (
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

const AttachmentList = ({ attachments, isMe }) => {
  if (!attachments?.length) return null;
  return (
    <div className="mt-1 flex flex-col gap-1.5">
      {attachments.map((attachment) =>
        isImage(attachment) ? (
          <a
            key={attachment.url}
            href={attachment.url}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-xl border border-black/5"
          >
            <img
              src={attachment.url}
              alt={attachment.name}
              className="max-h-60 w-full max-w-[260px] object-cover"
              loading="lazy"
            />
          </a>
        ) : (
          <a
            key={attachment.url}
            href={attachment.url}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] ${
              isMe ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-white text-deep-blue hover:bg-[#F9FAFB]'
            }`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{attachment.name}</span>
            <span className="shrink-0 opacity-70">{formatSize(attachment.size)}</span>
          </a>
        ),
      )}
    </div>
  );
};

const MessageBubble = ({ message, showAvatar, chat, onDeleteMessage, getListingHref }) => {
  const isMe = message.from === 'me';
  const text = message.text || message.body || '';
  const listingCard = message.listing ? (
    <ChatListingCard
      listing={message.listing}
      href={getListingHref?.(message.listing.id)}
      tone={isMe ? 'me' : 'them'}
      className={text ? 'mb-1' : ''}
    />
  ) : null;
  const senderChat = {
    name: message.sender || chat.name,
    avatar: chat.isGroup ? message.senderAvatar : chat.avatar,
    initials: chat.isGroup ? message.senderInitials || chat.initials : chat.initials,
    avatarClass: chat.avatarClass,
  };

  if (isMe) {
    return (
      <div className="group flex flex-col items-end">
        <div className="relative max-w-[min(85%,420px)] sm:max-w-[min(100%,420px)]">
          {listingCard ? <div className="flex justify-end">{listingCard}</div> : null}
          {text ? (
            <div className="rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words text-white">
              {text}
            </div>
          ) : null}
          <AttachmentList attachments={message.attachments} isMe />
          {onDeleteMessage ? (
            <button
              type="button"
              onClick={() => onDeleteMessage(message.id)}
              aria-label="Delete message"
              className="absolute -left-8 top-1/2 hidden -translate-y-1/2 rounded-md p-1 text-[#98A2B3] hover:bg-[#F9FAFB] hover:text-[#CC1016] group-hover:block [@media(hover:none)]:block"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
        <span className="mt-1 px-1 text-[10px] text-[#98A2B3]">{message.time}</span>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      {showAvatar ? (
        <ChatAvatar chat={senderChat} size="sm" />
      ) : (
        <div className="w-9 shrink-0" aria-hidden="true" />
      )}
      <div className="max-w-[min(85%,420px)] sm:max-w-[min(100%,420px)]">
        {chat.isGroup && message.sender && showAvatar ? (
          <p className="mb-1 text-[11px] font-medium text-[#64748B]">{message.sender}</p>
        ) : null}
        {listingCard}
        {text ? (
          <div className="rounded-2xl rounded-bl-sm bg-[#E8ECF0] px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words text-[#334155]">
            {text}
          </div>
        ) : null}
        <AttachmentList attachments={message.attachments} />
        <span className="mt-1 block px-1 text-[10px] text-[#98A2B3]">{message.time}</span>
      </div>
    </div>
  );
};

/** Keeps the thread pinned to the newest message, and stable when older ones load. */
const useThreadScroll = (messages, chatId) => {
  const containerRef = useRef(null);
  const snapshot = useRef({ chatId: null, firstId: null, lastId: null, height: 0 });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const firstId = messages[0]?.id ?? null;
    const lastId = messages[messages.length - 1]?.id ?? null;
    const prev = snapshot.current;

    const olderPrepended =
      prev.chatId === chatId && prev.lastId === lastId && prev.firstId !== firstId;
    if (olderPrepended) {
      el.scrollTop += el.scrollHeight - prev.height;
    } else if (prev.chatId !== chatId || prev.lastId !== lastId) {
      el.scrollTop = el.scrollHeight;
    }
    snapshot.current = { chatId, firstId, lastId, height: el.scrollHeight };
  }, [messages, chatId]);

  return containerRef;
};

/**
 * Two-panel messenger: conversation list + active chat.
 * Parent controls tab, search, draft, attachments and mobile list/chat panel.
 */
const Messenger = ({
  tab = 'messages',
  onTabChange,
  chats = [],
  activeChat,
  activeChatId,
  onSelectChat,
  query = '',
  onSearchChange,
  draft = '',
  onDraftChange,
  onSend,
  sending = false,
  showOnlineIndicator = true,
  showNewMessageButton = false,
  onNewMessage,
  showCreateGroupButton = false,
  onCreateGroup,
  onLeave,
  onDeleteMessage,
  onOpenInfo,
  loading = false,
  threadLoading = false,
  hasMoreMessages = false,
  olderLoading = false,
  onLoadOlder,
  hasMoreChats = false,
  loadingMoreChats = false,
  onLoadMoreChats,
  attachments = [],
  onAddFiles,
  onRemoveAttachment,
  pendingListing = null,
  onRemovePendingListing,
  getListingHref,
  seen = false,
  mobilePanel = 'list',
  onMobileBack,
  className = '',
  heightClass = 'h-[620px]',
}) => {
  const displayChat = activeChat || null;
  const isMobileChat = mobilePanel === 'chat';
  const messages = displayChat?.messages || [];
  const threadRef = useThreadScroll(messages, displayChat?.id ?? activeChatId);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const uploading = attachments.some((a) => a.uploading);
  const listingLoading = Boolean(pendingListing?.loading);
  const canSend =
    Boolean(displayChat) &&
    !sending &&
    !uploading &&
    !listingLoading &&
    (draft.trim().length > 0 || attachments.some((a) => a.url) || Boolean(pendingListing));

  const handleFiles = (event) => {
    if (event.target.files?.length) onAddFiles?.(Array.from(event.target.files));
    event.target.value = '';
  };

  const lastMineIndex = messages.reduce(
    (found, message, index) => (message.from === 'me' ? index : found),
    -1,
  );

  return (
    <div
      className={`flex min-h-0 w-full flex-col overflow-hidden bg-white xl:grid xl:grid-cols-[340px_minmax(0,1fr)] xl:rounded-2xl xl:border xl:border-[#E4E7EC] ${heightClass} ${className}`}
    >
      <aside
        className={`flex min-h-0 w-full flex-col border-[#E4E7EC] bg-white xl:h-full xl:border-r ${
          isMobileChat ? 'hidden xl:flex' : 'flex flex-1 xl:flex-none'
        }`}
      >
        <div className="shrink-0 border-b border-[#E4E7EC] p-3 sm:p-4">
          <div className="flex rounded-xl bg-[#F3F4F6] p-1">
            {[
              { id: 'messages', label: 'Messages' },
              { id: 'groups', label: 'Groups' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange?.(id)}
                className={`flex-1 rounded-lg px-3 py-2.5 text-[12px] font-semibold transition-all ${
                  tab === id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-[#64748B] hover:text-deep-blue'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-b border-[#E4E7EC] p-3 sm:p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="search"
              value={query}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search conversations..."
              className="w-full rounded-full border border-[#E4E7EC] bg-[#F9FAFB] py-2.5 pl-10 pr-4 text-[13px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {showNewMessageButton ? (
            <button
              type="button"
              onClick={onNewMessage}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
            >
              <Plus className="h-4 w-4" />
              New Message
            </button>
          ) : null}

          {showCreateGroupButton ? (
            <button
              type="button"
              onClick={onCreateGroup}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
            >
              <Plus className="h-4 w-4" />
              Create New Group
            </button>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin xl:divide-y xl:divide-[#E4E7EC]">
          {loading && chats.length === 0 ? (
            <ConversationListSkeleton />
          ) : chats.length > 0 ? (
            <>
              {chats.map((chat) => (
                <ConversationItem
                  key={chat.id}
                  chat={chat}
                  active={chat.id === activeChatId}
                  onClick={() => onSelectChat?.(chat.id)}
                  showOnline={showOnlineIndicator && tab === 'messages'}
                />
              ))}
              {hasMoreChats ? (
                <div className="p-3">
                  <button
                    type="button"
                    onClick={onLoadMoreChats}
                    disabled={loadingMoreChats}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#E4E7EC] px-4 py-2 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
                  >
                    {loadingMoreChats ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    Load more
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <p className="px-4 py-10 text-center text-[13px] text-[#64748B]">
              {query
                ? 'No conversations found.'
                : tab === 'groups'
                  ? 'No groups yet. Create one to get started.'
                  : 'No conversations yet. Start a new message.'}
            </p>
          )}
        </div>
      </aside>

      <section
        className={`flex min-h-0 min-w-0 flex-col bg-white xl:h-full ${
          mobilePanel === 'list' ? 'hidden xl:flex' : 'flex flex-1 xl:flex-none'
        }`}
      >
        {displayChat ? (
          <>
            <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-3 py-2.5 sm:px-5 sm:py-3">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                {onMobileBack ? (
                  <button
                    type="button"
                    onClick={onMobileBack}
                    className="-ml-1 rounded-lg p-2 text-[#64748B] hover:bg-[#F9FAFB] xl:hidden"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                ) : null}

                <div className="relative shrink-0">
                  <ChatAvatar chat={displayChat} />
                  {!displayChat.isGroup && displayChat.online ? (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-primary" />
                  ) : null}
                </div>

                <div className="min-w-0">
                  <ChatName
                    chat={displayChat}
                    className="text-[14px] font-semibold text-deep-blue sm:text-[15px]"
                  />
                  <p className="truncate text-[11px] text-[#64748B] sm:text-[12px]">
                    {!displayChat.isGroup && displayChat.online
                      ? 'Online'
                      : displayChat.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                {onLeave && displayChat.isGroup ? (
                  <button
                    type="button"
                    onClick={onLeave}
                    aria-label="Leave group"
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-medium text-[#64748B] transition-colors hover:bg-[#F9FAFB] hover:text-[#CC1016]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Leave
                  </button>
                ) : null}
                {onOpenInfo ? (
                  <button
                    type="button"
                    onClick={onOpenInfo}
                    aria-label="Conversation info"
                    className="rounded-full p-2 text-[#64748B] transition-colors hover:bg-[#F9FAFB] hover:text-deep-blue"
                  >
                    <Info className="h-[18px] w-[18px]" />
                  </button>
                ) : null}
              </div>
            </div>

            <div
              ref={threadRef}
              className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-white px-3 py-4 scrollbar-hide sm:px-6 sm:py-5"
            >
              {hasMoreMessages ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={onLoadOlder}
                    disabled={olderLoading}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EC] px-3 py-1.5 text-[12px] font-medium text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
                  >
                    {olderLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    Load older messages
                  </button>
                </div>
              ) : null}

              {threadLoading && messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-[#98A2B3]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <p className="py-10 text-center text-[13px] text-[#98A2B3]">
                  No messages yet. Say hello!
                </p>
              ) : (
                messages.map((message, index) => {
                  const prev = messages[index - 1];
                  const showAvatar =
                    message.from === 'them' &&
                    (!prev || prev.from !== 'them' || prev.senderId !== message.senderId);
                  return (
                    <div key={message.id}>
                      <MessageBubble
                        message={message}
                        showAvatar={showAvatar}
                        chat={displayChat}
                        onDeleteMessage={onDeleteMessage}
                        getListingHref={getListingHref}
                      />
                      {seen && index === lastMineIndex ? (
                        <p className="mt-0.5 px-1 text-right text-[10px] font-medium text-[#98A2B3]">
                          Seen
                        </p>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>

            <div className="shrink-0 border-t border-[#E4E7EC] bg-white px-3 pb-3 pt-2.5 sm:px-5 sm:py-4">
              {pendingListing ? (
                <ChatListingCard
                  listing={pendingListing}
                  onRemove={onRemovePendingListing}
                  className="mb-2"
                />
              ) : null}
              {attachments.length > 0 ? (
                <div className="mb-2 flex flex-wrap gap-2">
                  {attachments.map((attachment, index) => (
                    <span
                      key={`${attachment.name}-${index}`}
                      className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full border border-[#E4E7EC] bg-[#F9FAFB] py-1 pl-2.5 pr-1 text-[12px] text-[#475467]"
                    >
                      {attachment.uploading ? (
                        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
                      ) : isImage(attachment) ? (
                        <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                      )}
                      <span className="truncate">{attachment.name}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveAttachment?.(index)}
                        aria-label={`Remove ${attachment.name}`}
                        className="rounded-full p-0.5 hover:bg-[#E4E7EC]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="flex items-center gap-1.5 rounded-full border border-[#E4E7EC] bg-[#F3F4F6] py-1.5 pl-2.5 pr-1.5 sm:gap-2 sm:pl-4">
                {onAddFiles ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={FILE_ACCEPT}
                      className="hidden"
                      onChange={handleFiles}
                    />
                    <input
                      ref={imageInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFiles}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Attach file"
                      className="shrink-0 rounded-full p-1.5 text-[#64748B] hover:text-deep-blue"
                    >
                      <Paperclip className="h-[18px] w-[18px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      aria-label="Attach image"
                      className="shrink-0 rounded-full p-1.5 text-green-primary hover:opacity-80"
                    >
                      <ImageIcon className="h-[18px] w-[18px]" />
                    </button>
                  </>
                ) : null}
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => onDraftChange?.(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (canSend) onSend?.();
                    }
                  }}
                  maxLength={5000}
                  placeholder={
                    pendingListing ? 'Ask the seller about this listing...' : 'Write a message...'
                  }
                  className="min-w-0 flex-1 bg-transparent py-2 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3]"
                />
                <button
                  type="button"
                  aria-label="Send message"
                  onClick={onSend}
                  disabled={!canSend}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-[#066BB0] disabled:opacity-50"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
              <MessageSquare className="h-5 w-5" />
            </span>
            <p className="text-[14px] font-semibold text-deep-blue">No conversation selected</p>
            <p className="max-w-xs text-[13px] text-[#64748B]">
              Pick a conversation from the list, or start a new one.
            </p>
            {onMobileBack ? (
              <button
                type="button"
                onClick={onMobileBack}
                className="mt-1 text-[13px] font-semibold text-primary xl:hidden"
              >
                Back to conversations
              </button>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
};

export default Messenger;
