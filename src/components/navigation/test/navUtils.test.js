import { describe, expect, it } from 'vitest';
import { BOTTOM_NAV_TABS, NAV_ITEMS } from '../constant/constants';
import { isBottomTabActive, isNavItemActive } from '@/shared/utils/nav/navActive';
import { buildNavBadges, countLabel, hasMenuAlerts, menuToggleLabel } from '@/shared/utils/nav/badges';
import {
  dropdownMembershipBanner,
  expiredOrUpgradeText,
  profileSubtitle,
  sidebarMembershipCard,
  trialProgress,
} from '@/shared/utils/nav/membership';
import { formatPrice, markPending } from '@/shared/utils/nav/sidebarModels';

const navItem = (id) => NAV_ITEMS.find((item) => item.id === id);
const tab = (id) => BOTTOM_NAV_TABS.find((item) => item.id === id);

describe('navActive', () => {
  it('matches home exactly and sections by prefix', () => {
    expect(isNavItemActive(navItem('home'), '/feed')).toBe(true);
    expect(isNavItemActive(navItem('home'), '/feed/1')).toBe(false);
    expect(isNavItemActive(navItem('marketplace'), '/marketplace/abc')).toBe(true);
    expect(isNavItemActive(navItem('messages'), '/chat/groups/1')).toBe(true);
    expect(isNavItemActive(navItem('blogs'), '/general')).toBe(false);
  });

  it('matches bottom tabs', () => {
    expect(isBottomTabActive(tab('network'), '/contacts/5')).toBe(true);
    expect(isBottomTabActive(tab('jobs'), '/recruitment')).toBe(true);
    expect(isBottomTabActive(tab('post'), '/feed')).toBe(false);
    expect(isBottomTabActive(tab('messages'), '/chat/groups/1')).toBe(true);
  });
});

describe('badges', () => {
  const badges = buildNavBadges({
    pendingRequests: 1,
    newApplications: 0,
    unreadChats: 2,
    unreadNotifications: 3,
  });

  it('pluralises labels', () => {
    expect(countLabel(1, 'unread notification')).toBe('1 unread notification');
    expect(countLabel(0, 'unread notification')).toBe('0 unread notifications');
    expect(badges.contacts.label).toBe('1 pending connection request');
    expect(badges.messages.label).toBe('2 unread conversations');
    expect(badges.recruitment.label).toBe('0 new job applications');
  });

  it('builds the mobile menu toggle label', () => {
    expect(menuToggleLabel(true, badges)).toBe('Close menu');
    expect(menuToggleLabel(false, badges)).toBe(
      'Open menu, 2 unread conversations, 1 pending connection request',
    );
    const quiet = buildNavBadges({
      pendingRequests: 0,
      newApplications: 0,
      unreadChats: 0,
      unreadNotifications: 5,
    });
    expect(hasMenuAlerts(quiet)).toBe(false);
    expect(menuToggleLabel(false, quiet)).toBe('Open menu');
  });
});

describe('membership', () => {
  it('formats the subtitle', () => {
    expect(profileSubtitle({ title: 'Chemist', company: 'Lab' })).toBe('Chemist · Lab');
    expect(profileSubtitle(null)).toBe('');
  });

  it('picks the dropdown banner', () => {
    expect(dropdownMembershipBanner({ membershipStatus: 'trial' })).toBe('trial');
    expect(dropdownMembershipBanner({ isActive: false, membershipStatus: 'active' })).toBe('upgrade');
    expect(dropdownMembershipBanner({ isActive: true, membershipStatus: 'free' })).toBe('upgrade');
    expect(dropdownMembershipBanner({ isActive: true, membershipStatus: 'active' })).toBeNull();
  });

  it('picks the sidebar card', () => {
    expect(sidebarMembershipCard(null)).toBeNull();
    expect(sidebarMembershipCard({ membershipStatus: 'trial' })).toBe('trial');
    expect(sidebarMembershipCard({ membershipStatus: 'cancelled', isActive: false })).toBe('upgrade');
    expect(sidebarMembershipCard({ membershipStatus: 'cancelled', isActive: true })).toBeNull();
    expect(sidebarMembershipCard({ membershipStatus: 'active', isActive: false })).toBeNull();
  });

  it('computes trial progress', () => {
    expect(trialProgress({ trialDaysTotal: 30, trialDaysLeft: 15 })).toEqual({
      total: 30,
      left: 15,
      remainingPercent: 50,
    });
    expect(trialProgress({})).toEqual({ total: 90, left: 0, remainingPercent: 0 });
    expect(expiredOrUpgradeText('expired')).toBe('Your membership has expired.');
    expect(expiredOrUpgradeText('free')).toBe('Upgrade for full Lab Unity access.');
  });
});

describe('sidebarModels', () => {
  it('formats prices', () => {
    expect(formatPrice(12500)).toBe('€12,500');
    expect(formatPrice('abc')).toBe('—');
  });

  it('marks a person pending', () => {
    expect(markPending([{ id: 'a' }, { id: 'b' }], 'b')).toEqual([
      { id: 'a' },
      { id: 'b', pending: true },
    ]);
  });
});
