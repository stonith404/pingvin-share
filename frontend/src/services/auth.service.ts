import { getCookie, setCookies } from "cookies-next";
import * as jose from "jose";
import api from "./api.service";

const signIn = async (emailOrUsername: string, password: string) => {
  const emailOrUsernameBody = emailOrUsername.includes("@")
    ? { email: emailOrUsername }
    : { username: emailOrUsername };

  const response = await api.post("auth/signIn", {
    ...emailOrUsernameBody,
    password,
  });
  setCookies("access_token", response.data.accessToken);
  setCookies("refresh_token", response.data.refreshToken);
  return response;
};

const signUp = async (email: string, username: string, password: string) => {
  return await api.post("auth/signUp", { email, username, password });
};

const signOut = () => {
  setCookies("access_token", null);
  setCookies("refresh_token", null);
  window.location.reload();
};

const refreshAccessToken = async () => {
  try {
    const currentAccessToken = getCookie("access_token") as string;
    if (
      currentAccessToken &&
      (jose.decodeJwt(currentAccessToken).exp ?? 0) * 1000 <
        Date.now() + 2 * 60 * 1000
    ) {
      const refreshToken = getCookie("refresh_token");

      const response = await api.post("auth/token", { refreshToken });
      setCookies("access_token", response.data.accessToken);
    }
  } catch {
    console.info("Refresh token invalid or expired");
  }
};

export default {
  signIn,
  signUp,
  signOut,
  refreshAccessToken,
};
