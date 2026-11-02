/** Shapes an Axios error into the `{ status, message, data, details, code, raw }` contract. */
export const normalizeAxiosError = (error) => {
  const payload =
    error?.response?.data?.error || error?.response?.data || error;
  const message =
    payload?.message ||
    (typeof payload === "string" ? payload : null) ||
    error?.message ||
    "Something went wrong";

  return {
    status: error?.response?.status,
    message,
    data: error?.response?.data,
    details: payload?.details || error?.response?.data?.errors || null,
    code: payload?.code || null,
    raw: error,
  };
};

/**
 * Formats API error payloads into a user-facing message.
 * Prefers Zod-style `details[]` over the generic top-level message.
 */
export const getApiErrorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
  const details =
    err?.details ||
    err?.error?.details ||
    err?.errors ||
    err?.response?.data?.error?.details ||
    err?.response?.data?.errors ||
    err?.raw?.response?.data?.error?.details;

  if (Array.isArray(details) && details.length > 0) {
    const messages = details
      .map((item) => (typeof item === 'string' ? item : item?.message))
      .filter(Boolean);

    if (messages.length > 0) {
      return [...new Set(messages)].join('. ');
    }
  }

  return (
    err?.message ||
    err?.error?.message ||
    err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    err?.payload ||
    fallback
  );
};
