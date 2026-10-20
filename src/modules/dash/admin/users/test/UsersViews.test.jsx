import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth";
import { adminUsersReducer } from "@/features/dash/admin/users";
import { userFeedReducer } from "@/features/dash/user/feed";
import { userSubscriptionsReducer } from "@/features/dash/user/subscriptions";
import AdminUsersView from "../pages/AdminUsersView";
import AdminUserDetailView from "../pages/AdminUserDetailView";
import AccountDetailsCard from "../components/detail/AccountDetailsCard";
import ProfileActivityTabs from "../components/detail/ProfileActivityTabs";

const render = (element, { path = "/admin/users", route = path, state = {} } = {}) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      adminUsers: adminUsersReducer,
      userFeed: userFeedReducer,
      userSubscriptions: userSubscriptionsReducer,
    },
    preloadedState: {
      auth: { ...authReducer(undefined, { type: "@@init" }), user: { id: "admin-1", role: "ADMIN" } },
      adminUsers: { ...adminUsersReducer(undefined, { type: "@@init" }), ...state },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={route} element={element} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

const apiUser = {
  id: "u1",
  email: "ana@biolab.eu",
  role: "USER",
  status: "ACTIVE",
  profile: { firstName: "Ana", lastName: "Lee", company: "BioLab" },
  subscription: { plan: "MONTHLY" },
};

describe("AdminUsersView", () => {
  it("renders the header, tabs, filters and rows", () => {
    const html = render(<AdminUsersView />, {
      state: { users: [apiUser], usersMeta: { total: 1, page: 1, pageSize: 10 }, usersLoading: false },
    });
    expect(html).toContain("Users &amp; Subscriptions");
    expect(html).toContain("1 Total Customers");
    expect(html).toContain("All Users");
    expect(html).toContain("All Subscription");
    expect(html).toContain("Ana Lee");
    expect(html).toContain("BioLab");
    expect(html).toContain("Monthly");
  });

  it("hides the subscription filter on the supplier tab", () => {
    const html = render(<AdminUsersView />, {
      path: "/admin/users?tab=supplier",
      route: "/admin/users",
      state: { users: [], usersLoading: false },
    });
    expect(html).not.toContain("All Subscription");
    expect(html).toContain("All Statuses");
  });

  it("shows the store error when not loading", () => {
    const html = render(<AdminUsersView />, { state: { error: "Server down", usersLoading: false } });
    expect(html).toContain("Server down");
  });
});

describe("AdminUserDetailView", () => {
  const detail = { path: "/admin/users/u1", route: "/admin/users/:userId" };

  it("shows the error card", () => {
    const html = render(<AdminUserDetailView />, { ...detail, state: { error: "User not found" } });
    expect(html).toContain("User not found");
  });

  it("renders the profile with the account card", () => {
    const html = render(<AdminUserDetailView />, {
      ...detail,
      state: { selectedUser: { ...apiUser, profileType: "LABORATORY" } },
    });
    expect(html).toContain("Account details");
    expect(html).toContain("Suspend user");
  });
});

describe("AccountDetailsCard", () => {
  it("offers activation for suspended users", () => {
    const html = renderToStaticMarkup(
      <AccountDetailsCard user={{ status: "SUSPENDED", role: "USER" }} updating={false} />,
    );
    expect(html).toContain("Suspended");
    expect(html).toContain("Activate user");
    expect(html).not.toContain("Suspend user");
  });
});

describe("ProfileActivityTabs", () => {
  const renderTabs = (path, props) =>
    renderToStaticMarkup(
      <MemoryRouter initialEntries={[path]}>
        <ProfileActivityTabs posts={<p>POSTS</p>} postsTotal={2} {...props} />
      </MemoryRouter>,
    );

  it("shows posts by default", () => {
    expect(renderTabs("/admin/users/u1", {})).toContain("POSTS");
  });

  it("opens the tab named in ?tab=", () => {
    const html = renderTabs("/admin/users/u1?tab=ads", {
      kinds: ["advertisements", "listings", "jobs"],
      content: { advertisements: { total: 0, items: [] } },
    });
    expect(html).not.toContain("POSTS");
    expect(html).toContain("No advertisements yet.");
  });
});
