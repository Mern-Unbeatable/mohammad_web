import Container from '@/components/ui/Container';
import Messenger from '@/components/data-display/Messenger/Messenger';
import { useMessengerDrafts } from '../../hooks/useMessengerDrafts';
import { useMobileChatLayout } from '../../hooks/useMobileChatLayout';

/**
 * Messenger layout shell. Data comes from MessagesContainer; drafts and
 * pending attachments live in `useMessengerDrafts`.
 */
const MessagesPageContent = ({
  variant = 'dashboard',
  activeChatId,
  mobilePanel = 'list',
  onSend,
  onTyping,
  onTypingStop,
  onUploadFile,
  pendingListing = null,
  ...messengerProps
}) => {
  const isPanel = variant === 'panel';
  const isMobileChat = mobilePanel === 'chat';
  useMobileChatLayout({ isPanel, mobilePanel });
  const {
    draft,
    setDraft,
    attachments,
    handleAddFiles,
    handleRemoveAttachment,
    handleSend,
  } = useMessengerDrafts({
    activeChatId,
    onSend,
    onTyping,
    onTypingStop,
    onUploadFile,
    pendingListing,
  });

  const messenger = (
    <Messenger
      {...messengerProps}
      activeChatId={activeChatId}
      mobilePanel={mobilePanel}
      draft={draft}
      onDraftChange={setDraft}
      onSend={handleSend}
      attachments={attachments}
      pendingListing={pendingListing}
      onAddFiles={handleAddFiles}
      onRemoveAttachment={handleRemoveAttachment}
      heightClass={
        isPanel ? 'h-full min-h-0' : 'h-full xl:h-[calc(100dvh-200px)] xl:min-h-[520px]'
      }
    />
  );

  if (isPanel) {
    return <div className="flex min-h-0 flex-1 flex-col">{messenger}</div>;
  }

  return (
    <div
      className={`fixed inset-x-0 top-(--dashboard-header-h) z-20 flex flex-col overflow-hidden bg-[#F3F4F6] xl:static xl:z-auto xl:block xl:overflow-visible xl:py-8 ${
        isMobileChat ? 'bottom-0' : 'bottom-safe-nav sm:bottom-0'
      }`}
    >
      <Container className="flex h-full min-h-0 flex-col max-xl:!px-0">{messenger}</Container>
    </div>
  );
};

export default MessagesPageContent;
