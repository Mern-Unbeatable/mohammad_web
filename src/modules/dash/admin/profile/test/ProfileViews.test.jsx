import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { adminProfileReducer } from "@/features/dash/admin/profile";
import AdminProfileView from "../pages/AdminProfileView";
import AdminAccountForm from "../components/form/AdminAccountForm";

const form = {
  name: "Root Admin",
  email: "root@lab.test",
  displayName: "Root Admin",
  displayEmail: "root@lab.test",
  avatar: null,
  initials: "RA",
};

const renderView = (state = {}) => {
  const store = configureStore({
    reducer: { adminProfile: adminProfileReducer },
    preloadedState: {
      adminProfile: { ...adminProfileReducer(undefined, { type: "@@init" }), ...state },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <AdminProfileView />
    </Provider>,
  );
};

describe("AdminProfileView", () => {
  it("renders the account and password forms with the loaded values", () => {
    const html = renderView({ form });
    expect(html).toContain("My Profile");
    expect(html).toContain('value="root@lab.test"');
    expect(html).toContain("Update Profile");
    expect(html).toContain("Confirm New Password");
  });

  it("shows the skeleton instead of the form while loading", () => {
    expect(renderView({ form, loading: true })).not.toContain("Update Profile");
  });
});

describe("AdminAccountForm", () => {
  const passwords = { current: "", next: "", confirm: "" };

  it("disables the avatar picker and hides the hint without onAvatarChange", () => {
    const html = renderToStaticMarkup(
      <AdminAccountForm profileValues={form} passwordValues={passwords} />,
    );
    expect(html).toMatch(/aria-label="Change profile photo"[^>]*disabled|disabled=""[^>]*aria-label="Change profile photo"/);
    expect(html).not.toContain("Click the photo to change it");
  });

  it("shows the uploading hint", () => {
    const html = renderToStaticMarkup(
      <AdminAccountForm
        profileValues={form}
        passwordValues={passwords}
        onAvatarChange={() => {}}
        avatarUploading
      />,
    );
    expect(html).toContain("Uploading photo…");
  });
});
