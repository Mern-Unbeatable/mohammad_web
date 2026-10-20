import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import AddMembersModal from '../components/modals/AddMembersModal';

const recipients = [
  { id: 'u1', name: 'Anna Kowalska' },
  { id: 'u2', name: 'Claire Dubois' },
];

describe('AddMembersModal', () => {
  it('renders nothing while closed', () => {
    expect(renderToStaticMarkup(<AddMembersModal open={false} recipients={recipients} />)).toBe('');
  });

  it('opens as its own dialog with the picker, hiding existing members', () => {
    const html = renderToStaticMarkup(
      <AddMembersModal open groupName="Mofasa" recipients={recipients} memberIds={['u1']} />,
    );

    expect(html).toMatch(/role="dialog"[^>]*aria-labelledby="add-members-title"/);
    expect(html).toContain('Add members');
    expect(html).toContain('to Mofasa');
    expect(html).toContain('Claire Dubois');
    expect(html).not.toContain('Anna Kowalska');
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Add<\/button>/);
  });
});
