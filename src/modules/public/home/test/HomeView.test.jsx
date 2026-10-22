import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth';
import HomeView from '../pages/HomeView';
import DiscoverTag from '../components/DiscoverTag';
import { DISCOVER_TAGS } from '../constant/constants';

const render = (auth = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { ...authReducer(undefined, { type: '@@init' }), ...auth } },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter>
        <HomeView />
      </MemoryRouter>
    </Provider>,
  );
};

describe('HomeView', () => {
  it('renders the anchored sections the navbar links to', () => {
    const html = render();
    expect(html).toContain('id="platform"');
    expect(html).toContain('id="community"');
    expect(html).toContain('id="marketplace"');
    expect(html).toContain('href="/#community"');
  });

  it('invites guests to join', () => {
    const html = render();
    expect(html).toContain('Join Lab Unity');
    expect(html).toContain('Create your free account');
    expect(html.match(/href="\/join"/g)).toHaveLength(2);
    expect(html).not.toContain('Go to Dashboard');
  });

  it('sends signed-in users to their feed', () => {
    const html = render({ isAuthenticated: true, user: { id: 'u1', role: 'USER' } });
    expect(html).toContain('Go to feed');
    expect(html).not.toContain('Dashboard');
    expect(html).not.toContain('href="/join"');
  });

  it('sends suppliers and admins to their dashboard', () => {
    const html = render({ isAuthenticated: true, user: { id: 's1', role: 'SUPPLIER' } });
    expect(html).toContain('>Dashboard<');
    expect(html).toContain('Go to Dashboard');
    expect(html).not.toContain('href="/join"');
  });
});

describe('DiscoverTag', () => {
  it('renders every tag with its colours', () => {
    const html = renderToStaticMarkup(<DiscoverTag {...DISCOVER_TAGS[0]} />);
    expect(html).toContain('Research');
    expect(html).toContain('bg-[#FDF0F6] text-pink-light');
    expect(html).toContain('<svg');
  });
});
