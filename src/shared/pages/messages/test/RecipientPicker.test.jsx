import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RecipientPicker from '../components/recipients/RecipientPicker';
import { emptyResultsText } from '../utils/recipientPickerText';
import CreateGroupModal from '../components/modals/CreateGroupModal';

describe('RecipientPicker empty states', () => {
  it('names the search term when nobody matches', () => {
    expect(emptyResultsText({ term: 'ana', hasHiddenResults: false, emptyText: 'x' })).toBe(
      'No members match "ana".',
    );
  });

  it('shows the plain empty text before searching', () => {
    const html = renderToStaticMarkup(<RecipientPicker />);
    expect(html).toContain('No members found.');
    expect(html).not.toContain('connect');
  });

  it('says everyone is already a member when matches are all excluded', () => {
    expect(emptyResultsText({ term: '', hasHiddenResults: true })).toBe(
      'Everyone here is already a member.',
    );
    expect(emptyResultsText({ term: 'ana', hasHiddenResults: true })).toBe(
      'Everyone matching "ana" is already a member.',
    );

    const html = renderToStaticMarkup(
      <RecipientPicker recipients={[{ id: 'u1', name: 'Ana Lab' }]} excludeIds={['u1']} />,
    );
    expect(html).toContain('Everyone here is already a member.');
  });

  it('lists recipients without any empty-state text', () => {
    const html = renderToStaticMarkup(
      <RecipientPicker recipients={[{ id: 'u1', name: 'Ana Lab' }]} />,
    );
    expect(html).toContain('Ana Lab');
    expect(html).not.toContain('No members');
  });
});

describe('CreateGroupModal member search', () => {
  it('lists any member returned by the search', () => {
    const html = renderToStaticMarkup(
      <CreateGroupModal open recipients={[{ id: 'u2', name: 'Bruno Stranger' }]} />,
    );
    expect(html).toContain('Create Group Chat');
    expect(html).toContain('Bruno Stranger');
  });
});
