import { getCookie, setCookie } from "cookies-next";
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

  setCookie("access_token", response.data.accessToken);
  setCookie("refresh_token", response.data.refreshToken, {
    maxAge: 60 * 60 * 24 * 30 * 3,
  });

  return response;
};

const signInTotp = async (
  emailOrUsername: string,
  password: string,
  totp: string,
  loginToken: string
) => {
  const emailOrUsernameBody = emailOrUsername.includes("@")
    ? { email: emailOrUsername }
    : { username: emailOrUsername };

  const response = await api.post("auth/signIn/totp", {
    ...emailOrUsernameBody,
    password,
    totp,
    loginToken,
  });

  setCookie("access_token", response.data.accessToken);
  setCookie("refresh_token", response.data.refreshToken, {
    maxAge: 60 * 60 * 24 * 30 * 3,
  });

  return response;
};

const signUp = async (email: string, username: string, password: string) => {
  const response = await api.post("auth/signUp", { email, username, password });

  setCookie("access_token", response.data.accessToken);
  setCookie("refresh_token", response.data.refreshToken, {
    maxAge: 60 * 60 * 24 * 30 * 3,
  });

  return response;
};

const signOut = () => {
  setCookie("access_token", null);
  setCookie("refresh_token", null);
  window.location.reload();
};

const refreshAccessToken = async () => {
  try {
    const accessToken = getCookie("access_token") as string;
    const refreshToken = getCookie("refresh_token");
    if (
      (accessToken &&
        (jose.decodeJwt(accessToken).exp ?? 0) * 1000 <
          Date.now() + 2 * 60 * 1000) ||
      (refreshToken && !accessToken)
    ) {
      const response = await api.post("auth/token", { refreshToken });
      setCookie("access_token", response.data.accessToken);
    }
  } catch {
    console.info("Refresh token invalid or expired");
  }
};

const updatePassword = async (oldPassword: string, password: string) => {
  await api.patch("/auth/password", { oldPassword, password });
};

const enableTOTP = async (password: string) => {
  const { data } = await api.post("/auth/totp/enable", { password });

  return {
    totpAuthUrl: data.totpAuthUrl,
    totpSecret: data.totpSecret,
    qrCode: data.qrCode,
  };
};

const verifyTOTP = async (totpCode: string, password: string) => {
  await api.post("/auth/totp/verify", {
    code: totpCode,
    password,
  });
};

const disableTOTP = async (totpCode: string, password: string) => {
  await api.post("/auth/totp/disable", {
    code: totpCode,
    password,
  });
};

export default {
  signIn,
  signInTotp,
  signUp,
  signOut,
  refreshAccessToken,
  updatePassword,
  enableTOTP,
  verifyTOTP,
  disableTOTP,
};
