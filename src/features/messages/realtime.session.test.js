import { beforeEach, describe, expect, it, vi } from "vitest";

const { fakeSocket, crudGet } = vi.hoisted(() => {
  const listeners = new Map();
  const fakeSocket = {
    connected: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: (event, fn) => {
      listeners.set(event, [...(listeners.get(event) ?? []), fn]);
      return fakeSocket;
    },
    off: vi.fn(),
    fire: (event, ...args) => (listeners.get(event) ?? []).forEach((fn) => fn(...args)),
  };
  return { fakeSocket, crudGet: vi.fn() };
});

vi.mock("socket.io-client", () => ({ io: () => fakeSocket }));
vi.mock("@/config", () => ({
  crudService: { get: crudGet },
  tokenService: { getToken: () => "token" },
  API_ENDPOINTS: { AUTH: { ME: "/auth/me" } },
}));

const { acquireSocket } = await import("./realtime.js");

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("socket session handling", () => {
  beforeEach(() => {
    fakeSocket.connect.mockClear();
    crudGet.mockReset();
    fakeSocket.connected = false;
    acquireSocket();
  });

  it("refreshes the token and reconnects after the server expires the session", async () => {
    crudGet.mockResolvedValue({});
    fakeSocket.fire("session:expired", {});
    fakeSocket.fire("disconnect", "io server disconnect");
    await flush();

    expect(crudGet).toHaveBeenCalledWith("/auth/me");
    expect(fakeSocket.connect).toHaveBeenCalledTimes(1);
  });

  it("stays disconnected after the server revokes the session", async () => {
    fakeSocket.fire("session:revoked", {});
    fakeSocket.fire("disconnect", "io server disconnect");
    await flush();

    expect(crudGet).not.toHaveBeenCalled();
    expect(fakeSocket.connect).not.toHaveBeenCalled();
  });

  it("does not reconnect when the token refresh fails", async () => {
    crudGet.mockRejectedValue(new Error("refresh failed"));
    fakeSocket.fire("session:expired", {});
    fakeSocket.fire("disconnect", "io server disconnect");
    await flush();

    expect(fakeSocket.connect).not.toHaveBeenCalled();
  });
});
