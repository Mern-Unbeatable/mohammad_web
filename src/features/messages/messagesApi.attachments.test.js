import { describe, expect, it, vi } from "vitest";

const { upload } = vi.hoisted(() => ({ upload: vi.fn() }));

vi.mock("@/config", () => ({
  crudService: { upload },
  API_ENDPOINTS: { MESSAGES: { UPLOAD: "/messages/attachments" } },
  unwrapApiData: (response) => response?.data,
  getApiErrorMessage: vi.fn(),
}));

const { uploadAttachment } = await import("./messagesApi.js");

describe("uploadAttachment", () => {
  it("uploads to the private chat endpoint and keeps the returned key", async () => {
    upload.mockResolvedValue({
      data: { key: "u1/1-abc.pdf", name: "Report.pdf", mimeType: "application/pdf", size: 42 },
    });
    const file = { name: "local.pdf", type: "application/x-pdf", size: 40 };

    const result = await uploadAttachment(file);

    expect(upload).toHaveBeenCalledWith("/messages/attachments", expect.any(FormData), undefined);
    expect(result).toEqual({
      key: "u1/1-abc.pdf",
      name: "Report.pdf",
      mimeType: "application/pdf",
      size: 42,
    });
    expect(result).not.toHaveProperty("url");
  });
});
