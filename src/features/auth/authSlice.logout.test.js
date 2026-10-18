import { describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./authSlice";
import { logoutUser } from "./authThunks";
import * as authApi from "./authApi";

vi.mock("./authApi", () => ({ logout: vi.fn() }));

const signedIn = { ...reducer(undefined, { type: "@@init" }), user: { id: "u1" }, token: "t", isAuthenticated: true };

describe("logout", () => {
  it("marks the session as logging out until the request settles, then resets", () => {
    let state = reducer(signedIn, logoutUser.pending("r1"));
    expect(state).toMatchObject({ loggingOut: true, isAuthenticated: true });

    state = reducer(state, logoutUser.fulfilled(undefined, "r1"));
    expect(state).toMatchObject({ loggingOut: false, isAuthenticated: false, user: null });
  });

  it("ignores repeat clicks while a logout is in flight", async () => {
    let finish;
    authApi.logout.mockReturnValueOnce(new Promise((resolve) => (finish = resolve)));
    const store = configureStore({ reducer: { auth: reducer }, preloadedState: { auth: signedIn } });

    const first = store.dispatch(logoutUser());
    const second = await store.dispatch(logoutUser());
    expect(second.meta.condition).toBe(true);
    expect(authApi.logout).toHaveBeenCalledTimes(1);
    expect(store.getState().auth.loggingOut).toBe(true);

    finish();
    await first;
    expect(store.getState().auth).toMatchObject({ loggingOut: false, isAuthenticated: false });
  });
});
