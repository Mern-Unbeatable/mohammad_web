import { describe, expect, it } from 'vitest';
import { screenPhotoFiles, splitPhotos } from '../utils/listingPhotos';
import { MAX_FILE_BYTES, MAX_PHOTOS } from '../constant/constants';

const file = (name, type = 'image/png', size = 100) => ({ name, type, size });

describe('screenPhotoFiles', () => {
  it('accepts valid images and reports bad type or size per file', () => {
    const result = screenPhotoFiles(
      [file('a.png'), file('b.pdf', 'application/pdf'), file('c.png', 'image/png', MAX_FILE_BYTES + 1)],
      0,
    );
    expect(result.accepted.map((f) => f.name)).toEqual(['a.png']);
    expect(result.errors).toEqual(['b.pdf: use JPG, PNG, WebP, or GIF', 'c.png: max 10MB per file']);
    expect(result.limitNotice).toBeNull();
  });

  it('caps files at the remaining slots', () => {
    const result = screenPhotoFiles([file('a.png'), file('b.png')], MAX_PHOTOS - 1);
    expect(result.accepted).toHaveLength(1);
    expect(result.limitNotice).toBe('Only 1 more photo(s) can be added');
  });

  it('rejects everything when full', () => {
    expect(screenPhotoFiles([file('a.png')], MAX_PHOTOS)).toEqual({
      accepted: [],
      errors: [`You can upload up to ${MAX_PHOTOS} photos`],
      limitNotice: null,
    });
  });
});

describe('splitPhotos', () => {
  it('separates stored urls from new files', () => {
    const f = file('n.png');
    expect(
      splitPhotos([
        { url: 'https://x/1.png', file: null },
        { url: null, file: f },
      ]),
    ).toEqual({ existingUrls: ['https://x/1.png'], newFiles: [f] });
  });
});
