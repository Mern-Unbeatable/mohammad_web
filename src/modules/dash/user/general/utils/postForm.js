import { formToCreatePayload } from '@/features/dash/user/general';

/**
 * Builds the API payload from the post modal form.
 * Returns `{ error }` for the first problem, or `{ payload }`. On edit an empty
 * cover image is sent as null so the backend clears it.
 */
export const buildPostPayload = (form, { isEdit = false } = {}) => {
  const payload = formToCreatePayload(form);
  if (!payload.title) return { error: 'Title is required' };
  if (payload.type === 'DOCUMENT' && !payload.documentUrl) {
    return { error: 'Document URL is required' };
  }
  if (isEdit && !form.imageUrl) payload.imageUrl = null;
  return { payload };
};
