import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth';
import { userMarketplaceReducer } from '@/features/user/marketplace';
import { userProfileReducer } from '@/features/user/profile';
import CreateListingView from '../CreateListingView';

const render = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      userMarketplace: userMarketplaceReducer,
      userProfile: userProfileReducer,
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/marketplace/create']}>
        <CreateListingView />
      </MemoryRouter>
    </Provider>,
  );
};

describe('CreateListingView category select', () => {
  it('offers Other as the last category, without the All filter', () => {
    const html = render();
    const select = html.match(/<select[^>]*id="category"[^>]*>(.*?)<\/select>/)?.[1] ?? '';
    const options = [...select.matchAll(/<option value="([^"]*)"/g)].map((m) => m[1]);

    expect(options).toContain('Other');
    expect(options.at(-1)).toBe('Other');
    expect(options).not.toContain('All');
  });
});
