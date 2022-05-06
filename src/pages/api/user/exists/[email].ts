import type { NextApiRequest, NextApiResponse } from "next";
import awServer from "../../../../utils/appwriteServer.util";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const email = req.query.email as string;

  const doesExists = (await awServer.user.list(`"${email}"`)).total != 0;

  res.status(200).json({ exists: doesExists });
};

export default handler;
