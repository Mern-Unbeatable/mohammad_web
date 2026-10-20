/**
 * Returns a safe in-app path for post-login redirects.
 * Rejects protocol-relative URLs, absolute URLs, and non-path values.
 */
export function getSafeRedirectPath(candidate, fallback = '/') {
  if (typeof candidate !== 'string') return fallback;

  const path = candidate.trim();
  if (!path.startsWith('/')) return fallback;
  if (path.startsWith('//')) return fallback;
  if (path.includes('://')) return fallback;

  return path;
}
