import { API_ENDPOINTS } from "../endpoints";
import { tokenService } from "../session/tokenStorage";
import { notifyTokenRefreshed } from "../session/sessionBridge";
import { unwrapApiData } from "../utils/unwrap";
import { bareAuthClient } from "./instances";

/** Refresh tokens without importing authApi (breaks circular import with axios). */
export const refreshAccessToken = async () => {
  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const { data: envelope } = await bareAuthClient.post(
    API_ENDPOINTS.AUTH.REFRESH,
    { refreshToken },
  );
  const data = unwrapApiData(envelope) || envelope;
  const remember = tokenService.getRemember();
  const session = tokenService.persistSession({
    accessToken: data?.accessToken,
    refreshToken: data?.refreshToken,
    user: tokenService.getUser(),
    remember,
  });

  const accessToken = session?.accessToken || data?.accessToken;
  if (!accessToken) {
    throw new Error("Refresh did not return an access token");
  }

  notifyTokenRefreshed(accessToken);
  return accessToken;
};
