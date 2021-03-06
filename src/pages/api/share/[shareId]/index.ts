import type { NextApiRequest, NextApiResponse } from "next";
import { ShareDocument } from "../../../../types/Appwrite.type";
import { AppwriteFileWithPreview } from "../../../../types/File.type";
import awServer from "../../../../utils/appwriteServer.util";
import { checkSecurity } from "../../../../utils/shares/security.util";
import * as jose from "jose";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const shareId = req.query.shareId as string;

  if (req.method == "POST") {
    const fileList: AppwriteFileWithPreview[] = [];
    const hashedPassword = req.cookies[`${shareId}-password`];

    let shareDocument;
    try {
      shareDocument = await awServer.database.getDocument<ShareDocument>(
        "shares",
        shareId
      );
    } catch {
      return res.status(404).json({ message: "not_found" });
    }

    if (!shareExists(shareDocument)) {
      return res.status(404).json({ message: "not_found" });
    }

    if (!hasUserAccess(req.cookies.aw_token, shareDocument)) {
      return res.status(403).json({ message: "forbidden" });
    }

    try {
      await checkSecurity(shareId, hashedPassword);
    } catch (e) {
      return res.status(403).json({ message: e });
    }

    addVisitorCount(shareId);

    const fileListWithoutPreview = (
      await awServer.storage.listFiles(shareId, undefined, 100)
    ).files;

    for (const file of fileListWithoutPreview) {
      const filePreview = await awServer.storage.getFilePreview(
        shareId,
        file.$id
      );
      fileList.push({ ...file, preview: filePreview });
    }

    if (hashedPassword)
      res.setHeader(
        "Set-Cookie",
        `${shareId}-password=${hashedPassword}; Path=/share/${shareId}; max-age=3600; HttpOnly`
      );
    res.status(200).json(fileList);
  } else if (req.method == "DELETE") {
    awServer.database.updateDocument("shares", shareId, {
      enabled: false,
    });
  }
};

// Util functions
const hasUserAccess = (jwt: string, shareDocument: ShareDocument) => {
  if (shareDocument.users?.length == 0) return true;
  try {
    const userId = jose.decodeJwt(jwt).userId as string;
    return shareDocument.users?.includes(userId);
  } catch {
    return false;
  }
};

const shareExists = async (shareDocument: ShareDocument) => {
  return shareDocument.enabled && shareDocument.expiresAt > Date.now();
};

const addVisitorCount = async (shareId: string) => {
  const currentDocument = await awServer.database.getDocument<ShareDocument>(
    "shares",
    shareId
  );
  currentDocument.visitorCount++;

  awServer.database.updateDocument("shares", shareId, currentDocument);
};
export default handler;
