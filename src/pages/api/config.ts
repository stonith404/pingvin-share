import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let publicEnvironmentVariables: any = {};
  Object.entries(process.env).forEach(([key, value]) => {
    if (key.startsWith("PUBLIC")) {
      key = key.replace("PUBLIC_", "");
      publicEnvironmentVariables[key] = value;
    }
  });
  res.setHeader("cache-control", "max-age=100");
  res.status(200).json(publicEnvironmentVariables);
};

export default handler;
