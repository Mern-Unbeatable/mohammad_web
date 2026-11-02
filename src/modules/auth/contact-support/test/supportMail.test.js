import { describe, expect, it } from 'vitest';
import { buildMailto, readSupportState } from '../utils/supportMail';

const decode = (href) => {
  const [address, query] = href.split('?');
  const params = new URLSearchParams(query);
  return { address, subject: params.get('subject'), body: params.get('body'), raw: query };
};

describe('readSupportState', () => {
  it('reads the suspension details with empty fallbacks', () => {
    expect(readSupportState({ email: 'a@b.c', reason: 'Spam', suspended: true })).toEqual({
      accountEmail: 'a@b.c',
      reason: 'Spam',
      isSuspension: true,
    });
    expect(readSupportState(null)).toEqual({ accountEmail: '', reason: '', isSuspension: false });
  });
});

describe('buildMailto', () => {
  it('builds a general request without an email', () => {
    const mail = decode(buildMailto({ email: '', reason: 'ignored' }));
    expect(mail.address).toBe('mailto:support@labunity.com');
    expect(mail.subject).toBe('Support request');
    expect(mail.body).toBe('Hello Lab Unity support,\n');
  });

  it('builds a suspension appeal with the reason', () => {
    const mail = decode(buildMailto({ email: 'ana@lab.eu', reason: 'Spam' }));
    expect(mail.subject).toBe('Account suspension appeal');
    expect(mail.body).toContain('My account (ana@lab.eu) has been suspended.');
    expect(mail.body).toContain('Reason shown: Spam');
    expect(mail.body).toContain('Why I believe this should be reviewed:');
  });

  it('omits the reason line when there is none and encodes spaces as %20', () => {
    const mail = decode(buildMailto({ email: 'ana@lab.eu', reason: '' }));
    expect(mail.body).not.toContain('Reason shown');
    expect(mail.raw).not.toContain('+');
    expect(mail.raw).toContain('%20');
  });
});
