import type { NextApiRequest, NextApiResponse } from "next";
import { ShareDocument } from "../../../../types/Appwrite.type";
import awServer from "../../../../utils/appwriteServer.util";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const shareId = req.query.shareId as string;
  let doesExists;

  try {
    await awServer.database.getDocument<ShareDocument>("shares", shareId);
    doesExists = true;
  } catch {
    doesExists = false;
  }

  res.status(200).json({ exists: doesExists });
};

export default handler;
