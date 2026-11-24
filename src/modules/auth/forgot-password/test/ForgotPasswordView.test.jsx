import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth';
import ForgotPasswordView from '../pages/ForgotPasswordView';
import LinkSentState from '../components/LinkSentState';

const renderView = (entry = '/forgot-password') => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[entry]}>
        <ForgotPasswordView />
      </MemoryRouter>
    </Provider>,
  );
};

const renderSent = (props) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <LinkSentState email="ana@lab.eu" loading={false} secondsLeft={0} {...props} />
    </MemoryRouter>,
  );

describe('ForgotPasswordView', () => {
  it('starts with the email form', () => {
    const html = renderView();
    expect(html).toContain('Forgot password?');
    expect(html).toContain('Send reset link');
    expect(html).toContain('href="/login"');
  });

  it('prefills the email passed in history state', () => {
    const html = renderView({ pathname: '/forgot-password', state: { email: 'ana@lab.eu' } });
    expect(html).toContain('value="ana@lab.eu"');
  });
});

describe('LinkSentState', () => {
  it('names the address and allows a resend after the cooldown', () => {
    const html = renderSent();
    expect(html).toContain('ana@lab.eu');
    expect(html).toMatch(/<button type="button" class="[^"]*">resend the link<\/button>/);
  });

  it('disables the resend during the cooldown', () => {
    const html = renderSent({ secondsLeft: 42 });
    expect(html).toMatch(/<button type="button" disabled="" class="[^"]*">resend the link in 42s<\/button>/);
  });
});
