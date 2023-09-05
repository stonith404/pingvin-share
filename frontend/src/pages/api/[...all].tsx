import { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";
import getConfig from "next/config";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const { apiURL } = getConfig().serverRuntimeConfig;

export default (req: NextApiRequest, res: NextApiResponse) => {
  httpProxyMiddleware(req, res, {
    headers: {
      "X-Forwarded-For": req.socket?.remoteAddress ?? "",
    },
    target: apiURL,
  });
};
