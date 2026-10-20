import { describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

vi.mock("./contactsApi", () => ({
  getContactsList: vi.fn(async () => ({ data: [], meta: { page: 1, total: 0 } })),
  getApiErrorMessage: (_err, fallback) => fallback,
}));

import * as contactsApi from "./contactsApi";
import reducer from "./contactsSlice";
import { fetchContactsList } from "./contactsThunks";

describe("fetchContactsList", () => {
  it("does not send the background flag to the API", async () => {
    const store = configureStore({ reducer: { userContacts: reducer } });
    await store.dispatch(
      fetchContactsList({ page: 2, pageSize: 8, status: "accepted", background: true }),
    );

    expect(contactsApi.getContactsList).toHaveBeenCalledWith({
      page: 2,
      pageSize: 8,
      status: "accepted",
    });
  });
});
