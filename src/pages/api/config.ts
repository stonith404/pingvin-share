import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let publicEnvironmentVariables: any = {};
  Object.entries(process.env).forEach(([key, value]: any) => {
    value as string | number | boolean;
    if (key.startsWith("PUBLIC") && value) {
      key = key.replace("PUBLIC_", "");
      if (value == "false" || value == "true") {
        value = JSON.parse(value);
      } else if (!isNaN(Number(value))) {
        value = parseInt(value as string);
      }
      publicEnvironmentVariables[key] = value;
    }
  });
  res.setHeader("cache-control", "max-age=100");
  res.status(200).json(publicEnvironmentVariables);
};

export default handler;
