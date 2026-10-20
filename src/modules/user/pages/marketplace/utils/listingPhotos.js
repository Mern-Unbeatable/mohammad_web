import { IMAGE_MIME, MAX_FILE_BYTES, MAX_FILE_MB, MAX_PHOTOS } from '../constant/constants';

export const makePhotoId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const revokeIfBlob = (url) => {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
};

export const existingPhoto = (url) => ({
  id: makePhotoId(),
  file: null,
  url,
  previewUrl: url,
  name: 'Existing photo',
});

/**
 * Splits picked files into accepted files and per-file errors, honouring the
 * photo limit. `limitNotice` is set when some files were dropped for the limit.
 */
export const screenPhotoFiles = (files, currentCount) => {
  const remaining = MAX_PHOTOS - currentCount;
  if (remaining <= 0) {
    return { accepted: [], errors: [`You can upload up to ${MAX_PHOTOS} photos`], limitNotice: null };
  }

  const accepted = [];
  const errors = [];
  for (const file of files.slice(0, remaining)) {
    if (!IMAGE_MIME.has(file.type)) {
      errors.push(`${file.name}: use JPG, PNG, WebP, or GIF`);
    } else if (file.size > MAX_FILE_BYTES) {
      errors.push(`${file.name}: max ${MAX_FILE_MB}MB per file`);
    } else {
      accepted.push(file);
    }
  }

  const limitNotice =
    files.length > remaining ? `Only ${remaining} more photo(s) can be added` : null;
  return { accepted, errors, limitNotice };
};

export const splitPhotos = (photos) => ({
  existingUrls: photos.filter((p) => p.url && !p.file).map((p) => p.url),
  newFiles: photos.filter((p) => p.file).map((p) => p.file),
});
