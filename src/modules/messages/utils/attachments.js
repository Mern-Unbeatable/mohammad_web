let localIdCounter = 0;
export const nextLocalId = () => {
  localIdCounter += 1;
  return `local-${localIdCounter}`;
};

/** Files that still fit under `max`, given `currentCount` already attached. */
export const acceptFiles = (files, currentCount, max) =>
  files.slice(0, Math.max(0, max - currentCount));

export const toPendingEntry = (file) => ({
  localId: nextLocalId(),
  name: file.name,
  mimeType: file.type,
  size: file.size,
  uploading: true,
});

/** Applies `patch` to the entry with `localId`; a null patch removes it. */
export const patchAttachment = (items = [], localId, patch) =>
  items.flatMap((item) =>
    item.localId !== localId ? [item] : patch ? [{ ...item, ...patch }] : [],
  );

/** True once the upload finished and the server returned a reference to send. */
export const isUploadedAttachment = (a) => Boolean((a.key || a.url) && !a.uploading);

/**
 * Uploaded attachments in the shape the send API expects. The server reads
 * type and size from the stored file, so only the reference and name are sent.
 */
export const readyAttachments = (attachments) =>
  attachments
    .filter(isUploadedAttachment)
    .map(({ key, url, name }) => (key ? { key, name } : { url, name }));
