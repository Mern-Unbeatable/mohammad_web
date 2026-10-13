import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";
import { unwrapUser } from "@/api/unwrapApiData";
import { tokenService } from "@/api/cookies";

/**
 * Supplier profile HTTP helpers — no Redux. Used by profileThunks.
 * Uses SUPPLIER.PROFILE endpoints (`/users/me`, `/users/me/password`).
 */

export async function getProfile() {
  const response = await crudService.get(API_ENDPOINTS.SUPPLIER.PROFILE.ME);
  const user = unwrapUser(response) || unwrapApiData(response);
  if (!user) {
    throw new Error("Invalid profile response");
  }
  tokenService.setUser(user);
  return user;
}

export async function updateProfile(payload) {
  const response = await crudService.patch(
    API_ENDPOINTS.SUPPLIER.PROFILE.UPDATE,
    payload,
  );
  const user = unwrapUser(response) || unwrapApiData(response) || response;
  if (user?.id || user?.email) {
    tokenService.setUser(user);
  }
  return user;
}

/**
 * Upload a single file via /uploads.
 * Field name must be `file` (matches multer upload.single("file")).
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await crudService.upload(
    API_ENDPOINTS.SUPPLIER.UPLOADS.SINGLE,
    formData,
    null,
    { timeout: 60000 },
  );
  const data = unwrapApiData(response) || response;
  if (!data?.url) {
    throw new Error("Upload did not return a file URL");
  }
  return data;
}

export async function changePassword(input) {
  const response = await crudService.patch(
    API_ENDPOINTS.SUPPLIER.PROFILE.CHANGE_PASSWORD,
    input,
  );
  return unwrapApiData(response) ?? response;
}

export { getApiErrorMessage };
