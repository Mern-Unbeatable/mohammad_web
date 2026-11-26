import { useEffect } from 'react';

const upsertMeta = (attr, key, content) => {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertLink = (rel, href) => {
  if (!href) return;
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

/**
 * Lightweight document head updates for public SEO pages (no extra dependency).
 * Restores the previous title on unmount.
 */
const DocumentMeta = ({
  title,
  description,
  canonicalPath,
  image,
  type = 'website',
  noindex = false,
}) => {
  useEffect(() => {
    const previousTitle = document.title;
    const absoluteUrl = canonicalPath
      ? new URL(canonicalPath, window.location.origin).toString()
      : window.location.href;
    const fullTitle = title?.includes('Lab Unity') ? title : `${title} | Lab Unity`;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', absoluteUrl);
    if (image) upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertLink('canonical', absoluteUrl);

    return () => {
      document.title = previousTitle || 'Lab Unity';
    };
  }, [title, description, canonicalPath, image, type, noindex]);

  return null;
};

export default DocumentMeta;
