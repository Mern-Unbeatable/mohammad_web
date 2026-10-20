import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import EditMessageModal from '@/components/modals/messages/EditMessageModal';

const render = (props) => renderToStaticMarkup(<EditMessageModal open {...props} />);

describe('EditMessageModal', () => {
  it('renders nothing while closed', () => {
    expect(renderToStaticMarkup(<EditMessageModal open={false} initialText="Hi" />)).toBe('');
  });

  it('opens as a dialog with the text, formatting toolbar and actions', () => {
    const html = render({ initialText: 'Hello\n- item' });

    expect(html).toMatch(/role="dialog"[^>]*aria-labelledby="edit-message-title"/);
    expect(html).toContain('Edit message</h2>');
    expect(html).toMatch(/<textarea[^>]*aria-label="Edit message"[^>]*>Hello\n- item<\/textarea>/);
    expect(html).toContain('aria-label="Bold (Ctrl+B)"');
    expect(html).toContain('aria-label="Numbered list"');
    expect(html).toContain('12 / 5,000');
    expect(html).toMatch(/<button[^>]*>Cancel<\/button>/);
    // Nothing changed yet, so saving is disabled.
    expect(html).toMatch(/<button type="button" disabled=""[^>]*>Save changes<\/button>/);
  });

  it('warns when a text-only message would be emptied', () => {
    expect(render({ initialText: '' })).toContain("A message can&#x27;t be empty.");
    expect(render({ initialText: '', canBeEmpty: true })).not.toContain('be empty');
  });
});
