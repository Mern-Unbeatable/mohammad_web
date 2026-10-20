import { useState } from 'react';
import { MAX_ATTACHMENTS } from '../constant/constants';
import {
  acceptFiles,
  patchAttachment,
  readyAttachments,
  toPendingEntry,
} from '../utils/attachments';

/** Per-conversation composer drafts and pending attachment uploads. */
export function useMessengerDrafts({
  activeChatId,
  onSend,
  onTyping,
  onTypingStop,
  onUploadFile,
  pendingListing,
}) {
  const [drafts, setDrafts] = useState({});
  const [pending, setPending] = useState({});

  const chatKey = activeChatId || 'none';
  const draft = drafts[chatKey] || '';
  const attachments = pending[chatKey] || [];

  const setDraft = (value) => {
    setDrafts((prev) => ({ ...prev, [chatKey]: value }));
    if (value.trim()) onTyping?.();
    else onTypingStop?.();
  };

  const updateAttachment = (key, localId, patch) =>
    setPending((prev) => ({ ...prev, [key]: patchAttachment(prev[key], localId, patch) }));

  const handleAddFiles = (files) => {
    if (!onUploadFile) return;
    const key = chatKey;
    const accepted = acceptFiles(files, attachments.length, MAX_ATTACHMENTS);
    const entries = accepted.map(toPendingEntry);
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
    const ready = readyAttachments(attachments);
    const body = draft.trim();
    const listingId = pendingListing && !pendingListing.loading ? pendingListing.id : undefined;
    if (!body && ready.length === 0 && !listingId) return;

    const ok = await onSend?.({ body, attachments: ready, listingId });
    if (ok) {
      setDrafts((prev) => ({ ...prev, [key]: '' }));
      setPending((prev) => ({ ...prev, [key]: [] }));
    }
  };

  return {
    draft,
    setDraft,
    attachments,
    handleAddFiles: onUploadFile ? handleAddFiles : undefined,
    handleRemoveAttachment,
    handleSend,
  };
}
