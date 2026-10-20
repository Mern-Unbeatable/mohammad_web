import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth';
import ResetPasswordView from '../pages/ResetPasswordView';
import ResetPasswordForm from '../components/form/ResetPasswordForm';
import CheckErrorState from '../components/states/CheckErrorState';
import InvalidLinkState from '../components/states/InvalidLinkState';

const renderView = (entry) => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[entry]}>
        <ResetPasswordView />
      </MemoryRouter>
    </Provider>,
  );
};

const inRouter = (element) => renderToStaticMarkup(<MemoryRouter>{element}</MemoryRouter>);

describe('ResetPasswordView', () => {
  it('treats a missing token as an incomplete link', () => {
    const html = renderView('/reset-password');
    expect(html).toContain('Link invalid or expired');
    expect(html).toContain('invalid or incomplete');
    expect(html).toContain('href="/forgot-password"');
  });

  it('shows the checking state for a well-formed token', () => {
    const html = renderView(`/reset-password?token=${'a'.repeat(64)}`);
    expect(html).toContain('Checking your reset link...');
    expect(html).toContain('Verifying link...');
  });

  it('rejects a malformed token without checking it', () => {
    const html = renderView('/reset-password?token=abc');
    expect(html).toContain('This password reset link is invalid or has expired.');
  });
});

describe('reset-password components', () => {
  it('shows the server message on an invalid link', () => {
    expect(inRouter(<InvalidLinkState hasToken message="Link already used" />)).toContain(
      'Link already used',
    );
  });

  it('offers a retry when the check failed', () => {
    const html = inRouter(<CheckErrorState message="" onRetry={() => {}} />);
    expect(html).toContain('Something went wrong. Please try again.');
    expect(html).toContain('Try again');
  });

  it('renders the form with error, loading button and expiry', () => {
    const html = inRouter(
      <ResetPasswordForm password="" confirmPassword="" formError="Passwords do not match." loading expiry="14:30" />,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain('Resetting password...');
    expect(html).toContain('This link is valid until 14:30.');
  });
});
