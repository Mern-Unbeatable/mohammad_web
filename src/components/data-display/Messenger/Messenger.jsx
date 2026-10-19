import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Check,
  Copy,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  LogOut,
  MessageSquare,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Dots from "@/components/ui/Dots";
import {
  MAX_MESSAGE_LENGTH,
  applyComposerFormat,
  continueList,
  formatShortcutFor,
} from "@/features/messages/composerFormat";
import ChatListingCard from "./ChatListingCard";
import EditMessageModal from "./EditMessageModal";
import FormatToolbar, { ComposerToolButton } from "./FormatToolbar";
import FormattedMessage from "./FormattedMessage";

const FILE_ACCEPT =
  "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,video/mp4,video/quicktime";

const isImage = (attachment) =>
  String(attachment?.mimeType || "").startsWith("image/");

const formatSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ChatAvatar = ({ chat, size = "md" }) =>
  chat.avatar ? (
    <Avatar
      src={chat.avatar}
      alt={chat.name}
      initials={chat.initials}
      size={size}
    />
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

const PresenceDot = ({ online }) => (
  <span
    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
      online ? "bg-green-primary" : "bg-[#98A2B3]"
    }`}
    aria-label={online ? "Online" : "Offline"}
  />
);

const typingLabelFor = (chat) => {
  const names = chat.typingNames || [];
  if (names.length === 0) return null;
  if (!chat.isGroup) return "typing";
  if (names.length === 1) return `${names[0]} is typing`;
  return `${names.length} people are typing`;
};

const TypingText = ({ label, className = "" }) => (
  <p
    className={`flex min-w-0 items-baseline gap-1 font-medium text-green-primary ${className}`}
    aria-live="polite"
  >
    <span className="truncate">{label}</span>
    <Dots className="w-3.5 shrink-0" label={null} aria-hidden="true" />
  </p>
);

const ConversationItem = ({ chat, active, onClick, showOnline = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-3 border-b border-[#E4E7EC] px-4 py-3.5 text-left transition-colors last:border-b-0 xl:border-b-0 xl:py-3 ${
      active ? "bg-secondary" : "bg-white hover:bg-[#F9FAFB]"
    }`}
  >
    <div className="relative shrink-0">
      <ChatAvatar chat={chat} />
      {showOnline && !chat.isGroup ? <PresenceDot online={chat.online} /> : null}
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <ChatName
          chat={chat}
          className="text-[14px] font-semibold text-deep-blue"
        />
        <span className="shrink-0 text-[11px] text-[#98A2B3]">{chat.time}</span>
      </div>
      {typingLabelFor(chat) ? (
        <TypingText label={typingLabelFor(chat)} className="mt-0.5 text-[12px]" />
      ) : (
        <p
          className={`mt-0.5 truncate text-[12px] ${
            chat.unread > 0 ? "font-semibold text-deep-blue" : "text-[#64748B]"
          }`}
        >
          {chat.preview}
        </p>
      )}
    </div>

    {chat.unread > 0 ? (
      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#CC1016] px-1.5 text-[10px] font-bold text-white">
        {chat.unread > 99 ? "99+" : chat.unread}
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
              isMe
                ? "bg-white/15 text-white hover:bg-white/25"
                : "bg-white text-deep-blue hover:bg-[#F9FAFB]"
            }`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{attachment.name}</span>
            <span className="shrink-0 opacity-70">
              {formatSize(attachment.size)}
            </span>
          </a>
        ),
      )}
    </div>
  );
};

const messageActionClass =
  "rounded-md p-1 text-[#98A2B3] transition-colors hover:bg-[#F2F4F7]";

/** Copies the message text as written (formatting marks included, so it re-pastes formatted). */
const CopyMessageButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Message copied");
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy the message");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy message"}
      title={copied ? "Copied" : "Copy"}
      className={`${messageActionClass} ${copied ? "text-green-primary" : "hover:text-deep-blue"}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
};

const MessageBubble = ({
  message,
  showAvatar,
  chat,
  onDeleteMessage,
  onStartEdit,
  getListingHref,
}) => {
  const isMe = message.from === "me";
  const text = message.text || message.body || "";
  const timeLabel = (
    <>
      {message.time}
      {message.edited ? <span className="ml-1">· edited</span> : null}
    </>
  );
  const listingCard = message.listing ? (
    <ChatListingCard
      listing={message.listing}
      href={getListingHref?.(message.listing.id)}
      tone={isMe ? "me" : "them"}
      className={text ? "mb-1" : ""}
    />
  ) : null;
  const senderChat = {
    name: message.sender || chat.name,
    avatar: chat.isGroup ? message.senderAvatar : chat.avatar,
    initials: chat.isGroup
      ? message.senderInitials || chat.initials
      : chat.initials,
    avatarClass: chat.avatarClass,
  };

  if (isMe) {
    return (
      <div className="group flex flex-col items-end">
        <div className="relative max-w-[min(85%,560px)] sm:max-w-[min(100%,560px)]">
          {listingCard ? (
            <div className="flex justify-end">{listingCard}</div>
          ) : null}
          {text ? (
            <div className="space-y-1.5 rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-[13px] leading-relaxed break-words text-white">
              <FormattedMessage text={text} tone="me" />
            </div>
          ) : null}
          <AttachmentList attachments={message.attachments} isMe />
          {text || onDeleteMessage ? (
            <div className="absolute right-full top-1 mr-1 hidden items-center gap-0.5 group-hover:flex [@media(hover:none)]:flex">
              {text ? <CopyMessageButton text={text} /> : null}
              {onStartEdit && text ? (
                <button
                  type="button"
                  onClick={onStartEdit}
                  aria-label="Edit message"
                  title="Edit"
                  className={`${messageActionClass} hover:text-primary`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              ) : null}
              {onDeleteMessage ? (
                <button
                  type="button"
                  onClick={() => onDeleteMessage(message.id)}
                  aria-label="Delete message"
                  title="Delete"
                  className="rounded-md p-1 text-[#98A2B3] transition-colors hover:bg-[#FEF3F2] hover:text-[#CC1016]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        <span className="mt-1 px-1 text-[10px] text-[#98A2B3]">{timeLabel}</span>
      </div>
    );
  }

  const showName = chat.isGroup && message.sender && showAvatar;
  return (
    <div className="flex items-start gap-2">
      {showAvatar ? (
        <div className="shrink-0 pt-0.5">
          <ChatAvatar chat={senderChat} size="sm" />
        </div>
      ) : (
        <div className="w-9 shrink-0" aria-hidden="true" />
      )}
      <div className="min-w-0 max-w-[min(85%,560px)] sm:max-w-[min(100%,560px)]">
        {showName ? (
          <p className="mb-1 flex h-4 items-center text-[12px] font-semibold text-[#475467]">
            {message.sender}
          </p>
        ) : null}
        {listingCard}
        {text ? (
          <div className="group relative">
            <div className="space-y-1.5 rounded-2xl rounded-bl-sm bg-[#E8ECF0] px-4 py-2.5 text-[13px] leading-relaxed break-words text-[#334155]">
              <FormattedMessage text={text} tone="them" />
            </div>
            <div className="absolute left-full top-1 ml-1 hidden items-center group-hover:flex [@media(hover:none)]:flex">
              <CopyMessageButton text={text} />
            </div>
          </div>
        ) : null}
        <AttachmentList attachments={message.attachments} />
        <span className="mt-1 block px-1 text-[10px] text-[#98A2B3]">{timeLabel}</span>
      </div>
    </div>
  );
};

/** Centered group activity line (member added/removed/left, renamed, created) with its date and time. */
const SystemNotice = ({ message, getProfileHref }) => (
  <div className="flex flex-col items-center px-2 text-center" role="note">
    <p className="max-w-[90%] rounded-2xl bg-[#F2F4F7] px-3.5 py-1.5 text-[12px] leading-relaxed text-[#475467] break-words">
      {message.textParts
        ? message.textParts.map((part, index) => {
            if (typeof part === "string") return part;
            const href = part.userId ? getProfileHref?.(part.userId) : null;
            return href ? (
              <Link
                key={index}
                to={href}
                title={`View ${part.text}'s profile`}
                className="font-medium text-[#344054] hover:text-[#1D4ED8] hover:underline focus-visible:underline focus-visible:outline-none"
              >
                {part.text}
              </Link>
            ) : (
              <span key={index} className="font-medium text-[#344054]">
                {part.text}
              </span>
            );
          })
        : message.text}
    </p>
    {message.eventTime ? (
      <time
        dateTime={message.createdAt || undefined}
        className="mt-1 text-[10px] text-[#98A2B3]"
      >
        {message.eventTime}
      </time>
    ) : null}
  </div>
);

/** Keeps the thread pinned to the newest message, and stable when older ones load. */
const useThreadScroll = (messages, chatId) => {
  const containerRef = useRef(null);
  const snapshot = useRef({
    chatId: null,
    firstId: null,
    lastId: null,
    height: 0,
  });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const firstId = messages[0]?.id ?? null;
    const lastId = messages[messages.length - 1]?.id ?? null;
    const prev = snapshot.current;

    const olderPrepended =
      prev.chatId === chatId &&
      prev.lastId === lastId &&
      prev.firstId !== firstId;
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
/** Avatar, name and status of the open chat; links to the other member's profile in direct chats. */
const ChatHeaderIdentity = ({ chat, profileHref }) => {
  const typingLabel = typingLabelFor(chat);
  const content = (
    <>
      <div className="relative shrink-0">
        <ChatAvatar chat={chat} />
        {!chat.isGroup ? <PresenceDot online={chat.online} /> : null}
      </div>

      <div className="min-w-0">
        <ChatName
          chat={chat}
          className={`text-[14px] font-semibold text-deep-blue sm:text-[15px] ${
            profileHref ? "group-hover:text-primary group-hover:underline" : ""
          }`}
        />
        {typingLabel ? (
          <TypingText label={typingLabel} className="text-[11px] sm:text-[12px]" />
        ) : (
          <p className="truncate text-[11px] text-[#64748B] sm:text-[12px]">
            {!chat.isGroup && chat.online ? "Online" : chat.subtitle}
          </p>
        )}
      </div>
    </>
  );

  return profileHref ? (
    <Link
      to={profileHref}
      title={`View ${chat.name}'s profile`}
      className="group flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:gap-3"
    >
      {content}
    </Link>
  ) : (
    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">{content}</div>
  );
};

const Messenger = ({
  tab = "messages",
  onTabChange,
  chats = [],
  activeChat,
  activeChatId,
  onSelectChat,
  query = "",
  onSearchChange,
  draft = "",
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
  onEditMessage,
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
  getProfileHref,
  seen = false,
  mobilePanel = "list",
  onMobileBack,
  className = "",
  heightClass = "h-[620px]",
}) => {
  const displayChat = activeChat || null;
  const isMobileChat = mobilePanel === "chat";
  const messages = displayChat?.messages || [];
  const threadRef = useThreadScroll(messages, displayChat?.id ?? activeChatId);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const composerRef = useRef(null);
  const [editing, setEditing] = useState({ chatId: null, messageId: null });
  const editingMessageId =
    editing.chatId === (displayChat?.id ?? null) ? editing.messageId : null;
  const setEditingMessageId = (messageId) =>
    setEditing({ chatId: displayChat?.id ?? null, messageId });
  const editingMessage = editingMessageId
    ? messages.find((m) => m.id === editingMessageId && m.from === "me") || null
    : null;

  useLayoutEffect(() => {
    const el = composerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft, displayChat?.id]);

  const replaceDraft = (next, selectionStart, selectionEnd = selectionStart) => {
    if (next.length > MAX_MESSAGE_LENGTH) return;
    onDraftChange?.(next);
    requestAnimationFrame(() => {
      const el = composerRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const applyFormat = (kind) => {
    const el = composerRef.current;
    if (!el) return;
    const next = applyComposerFormat(draft, el.selectionStart, el.selectionEnd, kind);
    replaceDraft(next.value, next.selectionStart, next.selectionEnd);
  };

  const handleComposerKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return;
    const shortcut = formatShortcutFor(e);
    if (shortcut) {
      e.preventDefault();
      applyFormat(shortcut);
      return;
    }
    if (e.key !== "Enter") return;
    if (!e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend?.();
      return;
    }
    const el = e.currentTarget;
    if (el.selectionStart !== el.selectionEnd) return;
    const next = continueList(draft, el.selectionStart);
    if (!next) return;
    e.preventDefault();
    replaceDraft(next.value, next.caret);
  };

  const uploading = attachments.some((a) => a.uploading);
  const listingLoading = Boolean(pendingListing?.loading);
  const canSend =
    Boolean(displayChat) &&
    !sending &&
    !uploading &&
    !listingLoading &&
    (draft.trim().length > 0 ||
      attachments.some((a) => a.url) ||
      Boolean(pendingListing));

  const handleFiles = (event) => {
    if (event.target.files?.length)
      onAddFiles?.(Array.from(event.target.files));
    event.target.value = "";
  };

  const lastMineIndex = messages.reduce(
    (found, message, index) => (message.from === "me" ? index : found),
    -1,
  );

  return (
    <div
      className={`flex min-h-0 w-full flex-col overflow-hidden bg-white xl:grid xl:grid-cols-[340px_minmax(0,1fr)] xl:rounded-2xl xl:border xl:border-[#E4E7EC] ${heightClass} ${className}`}
    >
      <aside
        className={`flex min-h-0 w-full flex-col border-[#E4E7EC] bg-white xl:h-full xl:border-r ${
          isMobileChat ? "hidden xl:flex" : "flex flex-1 xl:flex-none"
        }`}
      >
        <div className="shrink-0 border-b border-[#E4E7EC] p-[11px]">
          <div className="flex rounded-xl bg-[#F3F4F6] p-1">
            {[
              { id: "messages", label: "Messages" },
              { id: "groups", label: "Groups" },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange?.(id)}
                className={`flex-1 rounded-lg px-3 py-2.5 text-[12px] font-semibold transition-all ${
                  tab === id
                    ? "bg-white text-primary shadow-sm"
                    : "text-[#64748B] hover:text-deep-blue"
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
                  showOnline={showOnlineIndicator && tab === "messages"}
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
                    {loadingMoreChats ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : null}
                    Load more
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <p className="px-4 py-10 text-center text-[13px] text-[#64748B]">
              {query
                ? "No conversations found."
                : tab === "groups"
                  ? "No groups yet. Create one to get started."
                  : "No conversations yet. Start a new message."}
            </p>
          )}
        </div>
      </aside>

      <section
        className={`flex min-h-0 min-w-0 flex-col bg-white xl:h-full ${
          mobilePanel === "list" ? "hidden xl:flex" : "flex flex-1 xl:flex-none"
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

                <ChatHeaderIdentity
                  chat={displayChat}
                  profileHref={
                    displayChat.isGroup
                      ? null
                      : getProfileHref?.(displayChat.otherUserId) || null
                  }
                />
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
                    {olderLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : null}
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
                    message.from === "them" &&
                    (!prev ||
                      prev.from !== "them" ||
                      prev.senderId !== message.senderId);
                  if (message.from === "system") {
                    return (
                      <SystemNotice
                        key={message.id}
                        message={message}
                        getProfileHref={getProfileHref}
                      />
                    );
                  }
                  return (
                    <div key={message.id}>
                      <MessageBubble
                        message={message}
                        showAvatar={showAvatar}
                        chat={displayChat}
                        onDeleteMessage={onDeleteMessage}
                        onStartEdit={
                          onEditMessage ? () => setEditingMessageId(message.id) : undefined
                        }
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

            <div className="shrink-0 border-t border-[#E4E7EC]/70 bg-[#F4F6F9]/80 px-3 pb-3 pt-2.5 backdrop-blur-md sm:px-5 sm:py-4">
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

              <div className="rounded-2xl border border-[#E4E7EC] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-shadow focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10">
                <textarea
                  ref={composerRef}
                  rows={1}
                  value={draft}
                  onChange={(e) => onDraftChange?.(e.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  maxLength={5000}
                  aria-label="Message"
                  placeholder={
                    pendingListing
                      ? "Ask the seller about this listing..."
                      : "Write a message..."
                  }
                  className="block max-h-48 min-h-[44px] w-full resize-none overflow-y-auto bg-transparent px-4 pb-1 pt-3 text-[14px] leading-6 text-deep-blue outline-none [scrollbar-width:thin] placeholder:text-[#98A2B3]"
                />
                <div className="flex items-center gap-0.5 px-2 pb-2 pt-1">
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
                      <ComposerToolButton
                        label="Attach file"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                      </ComposerToolButton>
                      <ComposerToolButton
                        label="Attach image"
                        onClick={() => imageInputRef.current?.click()}
                        className="text-green-primary"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </ComposerToolButton>
                      <span className="mx-1 h-5 w-px bg-[#E4E7EC]" aria-hidden="true" />
                    </>
                  ) : null}
                  <FormatToolbar onFormat={applyFormat} />
                  <span className="ml-auto hidden shrink-0 whitespace-nowrap pl-2 pr-2 text-[11px] text-[#98A2B3] md:inline">
                    <kbd className="font-sans font-semibold">Shift + Enter</kbd> new line
                  </span>
                  <button
                    type="button"
                    aria-label="Send message"
                    onClick={onSend}
                    disabled={!canSend}
                    className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-[#066BB0] disabled:bg-[#B2CCFF] md:ml-0"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
              <MessageSquare className="h-5 w-5" />
            </span>
            <p className="text-[14px] font-semibold text-deep-blue">
              No conversation selected
            </p>
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

      <EditMessageModal
        key={editingMessage?.id || "closed"}
        open={Boolean(editingMessage)}
        initialText={editingMessage?.text || editingMessage?.body || ""}
        canBeEmpty={
          Boolean(editingMessage?.listing) || editingMessage?.attachments?.length > 0
        }
        onSave={(body) => onEditMessage?.(editingMessage.id, body)}
        onClose={() => setEditingMessageId(null)}
      />
    </div>
  );
};

export default Messenger;
