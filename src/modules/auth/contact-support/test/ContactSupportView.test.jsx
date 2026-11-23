import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import ContactSupportView from '../pages/ContactSupportView';

const render = (state) =>
  renderToStaticMarkup(
    <MemoryRouter initialEntries={[{ pathname: '/contact-support', state }]}>
      <ContactSupportView />
    </MemoryRouter>,
  );

describe('ContactSupportView', () => {
  it('renders the general help page', () => {
    const html = render(undefined);
    expect(html).toContain("We&#x27;re here to help with your Lab Unity account.");
    expect(html).toContain('support@labunity.com');
    expect(html).toContain('A short description of what you need help with');
    expect(html).not.toContain('Account suspended');
    expect(html).toContain('subject=Support%20request');
    expect(html).toContain('href="/login"');
  });

  it('renders the suspension appeal with account and reason', () => {
    const html = render({ suspended: true, email: 'ana@lab.eu', reason: 'Spam' });
    expect(html).toContain('Get in touch with our team about your account suspension.');
    expect(html).toContain('Account suspended');
    expect(html).toContain('Account: ana@lab.eu');
    expect(html).toContain('Reason: Spam');
    expect(html).toContain('Why you think the suspension should be reviewed');
    expect(html).toContain('subject=Account%20suspension%20appeal');
  });
});
