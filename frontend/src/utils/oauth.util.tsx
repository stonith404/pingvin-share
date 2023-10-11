import { SiGithub, SiGoogle, SiOpenid } from "react-icons/si";
import React from "react";
import toast from "./toast.util";
import api from "../services/api.service";

const getOAuthUrl = (appUrl: string, provider: string) => {
  return `${appUrl}/api/oauth/${provider}`;
}

const getOAuthIcon = (provider: string) => {
  return {
    'google': <SiGoogle />,
    'github': <SiGithub />,
    'oidc': <SiOpenid />,
  }[provider];
}

const unlinkOAuth = (provider: string) => {
  return api.post(`/oauth/unlink/${provider}`);
}

export {
  getOAuthUrl,
  getOAuthIcon,
  unlinkOAuth,
}