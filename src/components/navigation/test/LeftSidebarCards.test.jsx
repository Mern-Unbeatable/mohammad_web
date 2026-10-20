import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import ProfileCard from '../components/left-sidebar/ProfileCard';
import TrialCard from '../components/left-sidebar/TrialCard';
import QuickLinksCard from '../components/left-sidebar/QuickLinksCard';

const render = (node) => renderToStaticMarkup(<MemoryRouter>{node}</MemoryRouter>);

describe('left sidebar cards', () => {
  it('shows a loading profile card without a user', () => {
    expect(render(<ProfileCard user={null} />)).toContain('Loading profile…');
  });

  it('renders the profile card', () => {
    const html = render(
      <ProfileCard
        user={{ id: 'u1', name: 'Ana Lee', initials: 'AL', title: 'Chemist', company: 'Lab', connections: 7 }}
      />,
    );
    expect(html).toContain('Ana Lee');
    expect(html).toContain('Chemist');
    expect(html).toContain('href="/profile"');
    expect(html).toContain('>7<');
  });

  it('renders trial and upgrade cards', () => {
    const trial = render(
      <TrialCard user={{ membershipStatus: 'trial', trialDaysTotal: 90, trialDaysLeft: 30 }} />,
    );
    expect(trial).toContain('30 of 90 days remaining');
    expect(trial).toContain('href="/subscription"');

    const expired = render(<TrialCard user={{ membershipStatus: 'expired' }} />);
    expect(expired).toContain('Your membership has expired.');

    expect(render(<TrialCard user={{ membershipStatus: 'active', isActive: true }} />)).toBe('');
  });

  it('renders quick links', () => {
    const html = render(<QuickLinksCard />);
    expect(html).toContain('href="/marketplace/create"');
    expect(html).toContain('Post a job');
    expect(html).toContain('Grow your network');
  });
});
