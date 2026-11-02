import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { userSubscriptionsReducer } from '@/features/dash/user/subscriptions';
import { userProfileReducer } from '@/features/dash/user/profile';
import { isPremiumPath } from '@/shared/constants/subscriptionAccess';
import SubscriptionLimitCard from '../SubscriptionLimitCard';
import SubscriptionGate from '../SubscriptionGate';

const renderCard = (props = {}) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <SubscriptionLimitCard {...props} />
    </MemoryRouter>,
  );

const renderGate = ({ path = '/marketplace', subscription } = {}) => {
  const store = configureStore({
    reducer: {
      userSubscriptions: userSubscriptionsReducer,
      userProfile: userProfileReducer,
    },
    preloadedState: {
      userProfile: {
        ...userProfileReducer(undefined, { type: '@@init' }),
        user: subscription ? { subscription } : null,
      },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <SubscriptionGate>
          <div>FEATURE_CONTENT</div>
        </SubscriptionGate>
      </MemoryRouter>
    </Provider>,
  );
};

describe('SubscriptionLimitCard', () => {
  it('shows the lock heading, default message and pricing button', () => {
    const html = renderCard();
    expect(html).toContain('Limit Reached');
    expect(html).toContain('View Pricing Plans');
    expect(html).toContain('current plan');
  });

  it('renders usage when a max is provided', () => {
    const html = renderCard({ current: 5, max: 5, unit: 'listings' });
    expect(html).toContain('5/5 listings used');
  });

  it('omits usage when no max is provided', () => {
    expect(renderCard()).not.toContain('used');
  });

  it('accepts a custom title and message', () => {
    const html = renderCard({ title: 'No connections left', message: 'Upgrade to add more.' });
    expect(html).toContain('No connections left');
    expect(html).toContain('Upgrade to add more.');
  });
});

describe('isPremiumPath', () => {
  it.each(['/feed', '/marketplace', '/marketplace/create', '/recruitment/5', '/chat/messages/1'])(
    'treats %s as premium',
    (path) => expect(isPremiumPath(path)).toBe(true),
  );

  it.each(['/subscription', '/profile', '/blogs', '/notifications', '/dashboard'])(
    'treats %s as non-premium',
    (path) => expect(isPremiumPath(path)).toBe(false),
  );
});

describe('SubscriptionGate', () => {
  it('locks a premium route for an expired member', () => {
    const html = renderGate({ path: '/marketplace', subscription: { status: 'EXPIRED', isActive: false } });
    expect(html).toContain('Limit Reached');
    expect(html).not.toContain('FEATURE_CONTENT');
  });

  it('locks a premium route for a past-due member', () => {
    const html = renderGate({ path: '/recruitment', subscription: { status: 'PAST_DUE', isActive: false } });
    expect(html).toContain('View Pricing Plans');
    expect(html).not.toContain('FEATURE_CONTENT');
  });

  it('lets an active member through', () => {
    const html = renderGate({ path: '/marketplace', subscription: { status: 'ACTIVE', isActive: true } });
    expect(html).toContain('FEATURE_CONTENT');
    expect(html).not.toContain('Limit Reached');
  });

  it('lets a trial member through', () => {
    const html = renderGate({ path: '/feed', subscription: { status: 'TRIAL', isActive: true } });
    expect(html).toContain('FEATURE_CONTENT');
  });

  it('does not lock non-premium routes even when expired', () => {
    const html = renderGate({ path: '/subscription', subscription: { status: 'EXPIRED', isActive: false } });
    expect(html).toContain('FEATURE_CONTENT');
    expect(html).not.toContain('Limit Reached');
  });

  it('does not lock while the subscription is still loading', () => {
    const html = renderGate({ path: '/marketplace', subscription: undefined });
    expect(html).toContain('FEATURE_CONTENT');
  });
});
