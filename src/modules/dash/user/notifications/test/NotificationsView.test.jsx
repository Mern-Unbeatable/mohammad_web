import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { userNotificationsReducer } from '@/features/dash/user/notifications';
import NotificationsView from '../pages/NotificationsView';

const render = (notificationsState = {}) => {
  const store = configureStore({
    reducer: { userNotifications: userNotificationsReducer },
    preloadedState: {
      userNotifications: {
        ...userNotificationsReducer(undefined, { type: '@@init' }),
        ...notificationsState,
      },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/notifications']}>
        <NotificationsView />
      </MemoryRouter>
    </Provider>,
  );
};

describe('NotificationsView', () => {
  it('shows the empty state', () => {
    const html = render({ notifications: [], loading: false });
    expect(html).toContain('Notifications');
    expect(html).toContain('No notifications yet.');
  });

  it('shows skeletons only while the first page loads', () => {
    const html = render({ notifications: [], loading: true });
    expect(html).not.toContain('No notifications yet.');
    expect(html).toContain('<ul');
  });

  it('renders rows and marks unread ones', () => {
    const html = render({
      loading: false,
      notifications: [
        { id: 'n1', type: 'CONNECTION_REQUEST', title: 'New request', read: false },
        { id: 'n2', type: 'CONNECTION_REQUEST', title: 'Old news', read: true },
      ],
    });
    expect(html).toContain('New request');
    expect(html).toContain('Old news');
    expect(html.match(/aria-label="Unread"/g)).toHaveLength(1);
  });

  it('disables Mark all as read while an action runs', () => {
    expect(render({ notifications: [], loading: false, actionLoading: true })).toMatch(
      /disabled=""[^>]*>Mark all as read/,
    );
  });
});
