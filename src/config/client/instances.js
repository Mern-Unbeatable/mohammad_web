import axios from "axios";

/** Must match Postman `baseUrl` (includes `/api/v1`). */
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

const createClient = () =>
  axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    // Send/receive the httpOnly auth cookies on every request.
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

/** Authenticated client; interceptors are attached in `./index.js`. */
export const axiosInstance = createClient();

/**
 * Bare client for token refresh / logout — no auth or 401 interceptors.
 * Callers receive the raw Axios response (`response.data` is the envelope).
 */
export const bareAuthClient = createClient();
