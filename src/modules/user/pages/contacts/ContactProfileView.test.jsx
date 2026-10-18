import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth";
import { userContactsReducer } from "@/features/user/contacts";
import { userFeedReducer } from "@/features/user/feed";
import { userReportsReducer } from "@/features/user/reports";
import ContactProfileView from "./ContactProfileView";

const ME = "11111111-1111-4111-8111-111111111111";
const OTHER = "f8e82337-f5b4-4176-9c23-a9aee20ce570";

const render = ({ contactId = OTHER, user = { id: ME, role: "USER" } } = {}) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      userContacts: userContactsReducer,
      userFeed: userFeedReducer,
      userReports: userReportsReducer,
    },
    preloadedState: {
      auth: {
        ...authReducer(undefined, { type: "@@init" }),
        user,
        isAuthenticated: Boolean(user),
        sessionReady: true,
      },
      userContacts: {
        ...userContactsReducer(undefined, { type: "@@init" }),
        selectedContact: { id: contactId, firstName: "Chiara", lastName: "Bianchi" },
      },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/contacts/${contactId}`]}>
        <Routes>
          <Route path="/contacts/:contactId" element={<ContactProfileView />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

const messageControl = (html) =>
  html.match(/<(a|button)\b[^>]*>(?:(?!<\/?(?:a|button)\b).)*Message<\/\1>/)?.[0] ?? "";

describe("ContactProfileView Message button", () => {
  it("opens the composer on another member's profile instead of navigating", () => {
    const html = render();
    const control = messageControl(html);

    expect(control).toMatch(/^<button type="button" aria-haspopup="dialog"/);
    expect(html).not.toContain(`href="/chat/messages/${OTHER}"`);
    expect(html).not.toContain('role="dialog"');
  });

  it("keeps the plain chat link when the profile is my own", () => {
    const control = messageControl(render({ contactId: ME }));

    expect(control).toContain(`href="/chat/messages/${ME}"`);
  });
});
