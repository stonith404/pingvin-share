import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";

const { apiURL } = getConfig().serverRuntimeConfig;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const apiStatus = await axios
    .get(`${apiURL}/api/configs`)
    .then(() => "OK")
    .catch(() => "ERROR");

  res.status(apiStatus == "OK" ? 200 : 500).send(apiStatus);
};
