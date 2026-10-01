import { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';
import Messenger from '@/components/data-display/Messenger/Messenger';
import { useLayoutChrome } from '@/shared/context/LayoutChromeContext';

const MAX_ATTACHMENTS = 10;

let localIdCounter = 0;
const nextLocalId = () => {
  localIdCounter += 1;
  return `local-${localIdCounter}`;
};

/**
 * Messenger layout shell. Data comes from MessagesContainer; this component
 * owns only per-conversation drafts and pending attachments.
 */
const MessagesPageContent = ({
  variant = 'dashboard',
  activeChatId,
  mobilePanel = 'list',
  onSend,
  onUploadFile,
  pendingListing = null,
  ...messengerProps
}) => {
  const { setBottomNavHidden } = useLayoutChrome();
  const [drafts, setDrafts] = useState({});
  const [pending, setPending] = useState({});

  const isPanel = variant === 'panel';
  const isMobileChat = mobilePanel === 'chat';
  const chatKey = activeChatId || 'none';
  const draft = drafts[chatKey] || '';
  const attachments = pending[chatKey] || [];

  useEffect(() => {
    if (isPanel) return undefined;

    const media = window.matchMedia('(max-width: 1279px)');

    const syncLayout = () => {
      const isMobile = media.matches;
      setBottomNavHidden(isMobile && mobilePanel === 'chat');
      document.documentElement.style.overflow = isMobile ? 'hidden' : '';
      document.body.style.overflow = isMobile ? 'hidden' : '';
    };

    syncLayout();
    media.addEventListener('change', syncLayout);

    return () => {
      media.removeEventListener('change', syncLayout);
      setBottomNavHidden(false);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [mobilePanel, setBottomNavHidden, isPanel]);

  const setDraft = (value) => setDrafts((prev) => ({ ...prev, [chatKey]: value }));

  const updateAttachment = (key, localId, patch) =>
    setPending((prev) => ({
      ...prev,
      [key]: (prev[key] || []).flatMap((item) =>
        item.localId !== localId ? [item] : patch ? [{ ...item, ...patch }] : [],
      ),
    }));

  const handleAddFiles = (files) => {
    if (!onUploadFile) return;
    const key = chatKey;
    const room = MAX_ATTACHMENTS - attachments.length;
    const accepted = files.slice(0, Math.max(0, room));
    const entries = accepted.map((file) => ({
      localId: nextLocalId(),
      name: file.name,
      mimeType: file.type,
      size: file.size,
      uploading: true,
    }));
    setPending((prev) => ({ ...prev, [key]: [...(prev[key] || []), ...entries] }));

    accepted.forEach(async (file, index) => {
      const uploaded = await onUploadFile(file);
      updateAttachment(
        key,
        entries[index].localId,
        uploaded ? { ...uploaded, uploading: false } : null,
      );
    });
  };

  const handleRemoveAttachment = (index) => {
    const target = attachments[index];
    if (target) updateAttachment(chatKey, target.localId, null);
  };

  const handleSend = async () => {
    const key = chatKey;
    const ready = attachments
      .filter((a) => a.url && !a.uploading)
      .map(({ url, name, mimeType, size }) => ({ url, name, mimeType, size }));
    const body = draft.trim();
    const listingId = pendingListing && !pendingListing.loading ? pendingListing.id : undefined;
    if (!body && ready.length === 0 && !listingId) return;

    const ok = await onSend?.({ body, attachments: ready, listingId });
    if (ok) {
      setDrafts((prev) => ({ ...prev, [key]: '' }));
      setPending((prev) => ({ ...prev, [key]: [] }));
    }
  };

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
      onAddFiles={onUploadFile ? handleAddFiles : undefined}
      onRemoveAttachment={handleRemoveAttachment}
      heightClass={isPanel ? 'h-full min-h-0' : 'h-full xl:h-[680px]'}
    />
  );

  if (isPanel) {
    return <div className="flex min-h-0 flex-1 flex-col">{messenger}</div>;
  }

  return (
    <main
      className={`fixed inset-x-0 top-14 z-20 flex flex-col overflow-hidden bg-[#F3F4F6] xl:static xl:z-auto xl:block xl:overflow-visible xl:py-8 ${
        isMobileChat
          ? 'bottom-0'
          : 'bottom-[calc(3.5rem+env(safe-area-inset-bottom))] sm:bottom-0'
      }`}
    >
      <Container className="flex h-full min-h-0 flex-col max-xl:!px-0">{messenger}</Container>
    </main>
  );
};

export default MessagesPageContent;
