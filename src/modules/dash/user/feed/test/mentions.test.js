import { describe, expect, it } from 'vitest';
import { splitHighlights } from '@/components/common/ExpandableText/splitHighlights';
import { MENTION_PATTERN } from '../utils/mentions';

const mentions = (text) =>
  splitHighlights(text, MENTION_PATTERN)
    .filter((part) => part.highlight)
    .map((part) => part.text);

describe('comment mentions', () => {
  it('highlights only the mentioned first name, not the next word', () => {
    expect(splitHighlights('@Nayem Hello this is right', MENTION_PATTERN)).toEqual([
      { text: '@Nayem', highlight: true },
      { text: ' Hello this is right' },
    ]);
  });

  it('handles accented names, several mentions and trailing punctuation', () => {
    expect(mentions('@Élises thanks, and @Nayem, ok?')).toEqual(['@Élises', '@Nayem']);
    expect(mentions('cc @Jean-Luc.')).toEqual(['@Jean-Luc']);
  });

  it('ignores e-mail addresses and a lone @', () => {
    expect(mentions('write to lab@unity.com or @ me')).toEqual([]);
  });

  it('keeps the full text when put back together', () => {
    const text = 'Hi @Anna,\nsee @Élises notes — mail a@b.co';
    expect(
      splitHighlights(text, MENTION_PATTERN)
        .map((part) => part.text)
        .join(''),
    ).toBe(text);
  });
});
