import type { NextApiRequest, NextApiResponse } from "next";
import {
  SecurityDocument,
  ShareDocument,
} from "../../../../types/Appwrite.type";
import awServer from "../../../../utils/appwriteServer.util";
import { hashPassword } from "../../../../utils/shares/security.util";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const shareId = req.query.shareId as string;
  let hashedPassword;
  try {
    hashedPassword = await checkPassword(shareId, req.body.password);
  } catch (e) {
    return res.status(403).json({ message: e });
  }
  if (hashedPassword)
    res.setHeader(
      "Set-Cookie",
      `${shareId}-password=${hashedPassword}; Path=/api/share/${shareId}; max-age=3600; HttpOnly`
    );
  res.send(200);
};

export const checkPassword = async (shareId: string, password?: string) => {
  let hashedPassword;
  const shareDocument = await awServer.database.getDocument<ShareDocument>(
    "shares",
    shareId
  );
  await awServer.database
    .getDocument<SecurityDocument>("shareSecurity", shareDocument.securityID)
    .then((securityDocument) => {
      if (securityDocument.password) {
        hashedPassword = hashPassword(password as string, shareId);
        if (hashedPassword !== securityDocument.password) {
          throw "wrong_password";
        }
      }
    });
  return hashedPassword;
};

export default handler;
