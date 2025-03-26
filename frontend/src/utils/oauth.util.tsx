import {
  FaDiscord,
  FaGithub,
  FaGoogle,
  FaMicrosoft,
  FaOpenid,
} from "react-icons/fa6";
import React from "react";
import api from "../services/api.service";

const getOAuthUrl = (appUrl: string, provider: string) => {
  return `${appUrl}/api/oauth/auth/${provider}`;
};

const getOAuthIcon = (provider: string) => {
  return {
    google: <FaGoogle />,
    microsoft: <FaMicrosoft />,
    github: <FaGithub />,
    discord: <FaDiscord />,
    oidc: <FaOpenid />,
  }[provider];
};

const unlinkOAuth = (provider: string) => {
  return api.post(`/oauth/unlink/${provider}`);
};

export { getOAuthUrl, getOAuthIcon, unlinkOAuth };
