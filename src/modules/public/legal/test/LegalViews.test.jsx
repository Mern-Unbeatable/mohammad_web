import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import PrivacyPolicyView from '../pages/PrivacyPolicyView';
import TermsOfServiceView from '../pages/TermsOfServiceView';
import { PRIVACY_SECTIONS } from '../content/privacyPolicy';
import { TERMS_SECTIONS } from '../content/termsOfService';
import { LEGAL_LAST_UPDATED } from '../constant/constants';

const render = (element) => renderToStaticMarkup(<MemoryRouter>{element}</MemoryRouter>);

describe.each([
  ['Privacy Policy', PrivacyPolicyView, PRIVACY_SECTIONS, '/terms', 'Terms of Service'],
  ['Terms of Service', TermsOfServiceView, TERMS_SECTIONS, '/privacy', 'Privacy Policy'],
])('%s', (title, View, sections, relatedHref, relatedLabel) => {
  const html = render(<View />);

  it('renders the header and last-updated date', () => {
    expect(html).toContain(`>${title}</h1>`);
    expect(html).toContain(`Last updated: ${LEGAL_LAST_UPDATED}`);
  });

  it('lists every section in the TOC and the article, first one active', () => {
    expect(html).toContain(`${sections.length} sections`);
    sections.forEach(({ id }) => {
      expect(html).toContain(`href="#${id}"`);
      expect(html).toContain(`id="${id}"`);
    });
    expect(html).toMatch(new RegExp(`href="#${sections[0].id}" aria-current="location"`));
  });

  it('links to the other legal page and support', () => {
    expect(html).toContain(`href="${relatedHref}"`);
    expect(html).toContain(relatedLabel);
    expect(html).toContain('href="mailto:support@labunity.com"');
  });
});

describe('legal content', () => {
  it('uses unique section ids', () => {
    [PRIVACY_SECTIONS, TERMS_SECTIONS].forEach((sections) => {
      const ids = sections.map(({ id }) => id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
