import {
  SiDiscord,
  SiGithub,
  SiGoogle,
  SiMicrosoft,
  SiOpenid,
} from "react-icons/si";
import React from "react";
import api from "../services/api.service";
import {
  Text
} from "@mantine/core";

const getOAuthUrl = (appUrl: string, provider: string) => {
  return `${appUrl}/api/oauth/auth/${provider}`;
};

const getOAuthIcon = (provider: string) => {
  return {
    google: <SiGoogle />,
    microsoft: <SiMicrosoft />,
    github: <SiGithub />,
    discord: <SiDiscord />,
    oidc: <Text>Sign in with Stella</Text>,
  }[provider];
};

const unlinkOAuth = (provider: string) => {
  return api.post(`/oauth/unlink/${provider}`);
};

export { getOAuthUrl, getOAuthIcon, unlinkOAuth };
