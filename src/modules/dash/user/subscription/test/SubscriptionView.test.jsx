import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { userSubscriptionsReducer } from '@/features/dash/user/subscriptions';
import { userProfileReducer } from '@/features/dash/user/profile';
import SubscriptionView from '../pages/SubscriptionView';

const PLANS = {
  plans: [
    { id: 'MONTHLY', label: 'Monthly', price: 10, period: 'month' },
    { id: 'YEARLY', label: 'Yearly', price: 100, period: 'year' },
  ],
  features: ['Full directory access'],
};

const render = (subscriptionsState = {}) => {
  const store = configureStore({
    reducer: { userSubscriptions: userSubscriptionsReducer, userProfile: userProfileReducer },
    preloadedState: {
      userSubscriptions: {
        ...userSubscriptionsReducer(undefined, { type: '@@init' }),
        ...subscriptionsState,
      },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/subscription']}>
        <SubscriptionView />
      </MemoryRouter>
    </Provider>,
  );
};

const selectedCycle = (html) =>
  html.match(/<button type="button" class="[^"]*bg-primary text-white shadow-sm[^"]*">([^<]+)</)?.[1];

describe('SubscriptionView', () => {
  it('shows an error message without plans', () => {
    expect(render({ plans: null, plansLoading: false })).toContain(
      'Unable to load subscription plans.',
    );
  });

  it('defaults to monthly for a new member', () => {
    const html = render({ plans: PLANS, plansLoading: false });
    expect(selectedCycle(html)).toBe('Monthly');
    expect(html).toContain('Full directory access');
    expect(html).not.toContain('Cancel subscription');
  });

  it("selects the member's yearly plan and marks it current", () => {
    const html = render({
      plans: PLANS,
      plansLoading: false,
      loading: true,
      subscription: { status: 'ACTIVE', plan: 'YEARLY', isActive: true },
    });
    expect(selectedCycle(html)).toBe('Yearly');
    expect(html).toContain('Current plan');
    expect(html).toContain('Active · Yearly membership');
    expect(html).toContain('Cancel subscription');
  });

  it('warns when Stripe is not configured', () => {
    expect(render({ plans: { ...PLANS, paymentConfigured: false }, plansLoading: false })).toContain(
      'Stripe is not configured on the server.',
    );
  });
});
