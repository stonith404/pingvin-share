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

const updatePassword = async (oldPassword: string, password: string) => {
  await api.patch("/auth/password", { oldPassword, password });
};

const enableTOTP = async (password: string) => {
  try {
    let { data } = await api.post("/auth/totp/enable", { password });
    console.log(data);

    if (!data) {
      return false;
    }

    return {
      totpAuthUrl: data.totpAuthUrl,
      totpSecret: data.totpSecret,
      qrCode: data.qrCode,
    };
  } catch (e) {
    return false;
  }
};

const verifyTOTP = async (totpCode: string, password: string) => {
  try {
    let { data } = await api.post("/auth/totp/verify", {
      code: totpCode,
      password,
    });
    if (data) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

const disableTOTP = async (totpCode: string, password: string) => {
  try {
    let { data } = await api.post("/auth/totp/disable", {
      code: totpCode,
      password,
    });
    if (data) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
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
