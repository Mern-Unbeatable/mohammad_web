import { describe, expect, it } from 'vitest';
import {
  acceptFiles,
  nextLocalId,
  patchAttachment,
  readyAttachments,
  toPendingEntry,
} from '../utils/attachments';

describe('attachments utils', () => {
  it('issues unique local ids', () => {
    expect(nextLocalId()).not.toBe(nextLocalId());
  });

  it('accepts only files that fit under the limit', () => {
    expect(acceptFiles([1, 2, 3], 8, 10)).toEqual([1, 2]);
    expect(acceptFiles([1, 2], 12, 10)).toEqual([]);
  });

  it('creates an uploading entry from a file', () => {
    const entry = toPendingEntry({ name: 'a.png', type: 'image/png', size: 5 });
    expect(entry).toMatchObject({ name: 'a.png', mimeType: 'image/png', size: 5, uploading: true });
    expect(entry.localId).toMatch(/^local-/);
  });

  it('patches or removes an entry by local id', () => {
    const items = [{ localId: 'x', uploading: true }, { localId: 'y' }];
    expect(patchAttachment(items, 'x', { uploading: false })).toEqual([
      { localId: 'x', uploading: false },
      { localId: 'y' },
    ]);
    expect(patchAttachment(items, 'x', null)).toEqual([{ localId: 'y' }]);
    expect(patchAttachment(undefined, 'x', null)).toEqual([]);
  });

  it('keeps only uploaded attachments, sending the private key and name', () => {
    expect(
      readyAttachments([
        { localId: '1', key: 'u1/1-abc.pdf', name: 'n', mimeType: 'm', size: 1, uploading: false },
        { localId: '2', uploading: true },
        { localId: '3', key: 'u1/2-def.pdf', name: 'still going', uploading: true },
      ]),
    ).toEqual([{ key: 'u1/1-abc.pdf', name: 'n' }]);
  });

  it('still sends legacy url-based attachments by reference only', () => {
    expect(
      readyAttachments([{ localId: '1', url: 'u', name: 'n', mimeType: 'm', size: 1 }]),
    ).toEqual([{ url: 'u', name: 'n' }]);
  });
});
